import React, { useState } from 'react';
import './CreateTask.css';
import { supabase } from '../Client.jsx';
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
    const getDefaultDueDate = () => {
        const now = new Date();
        now.setDate(now.getDate() + 7); // Add 7 days
        return now.toISOString().split('T')[0]; // Format as yyyy-MM-dd
    };

    const [task, setTask] = useState({
        title: '',
        author: '',
        assignee: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        due_date: getDefaultDueDate(), // Default a week from now
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const {name, value} = event.target;
        setTask( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        });
    }

    const createTask = async (event) => {
        event.preventDefault();

        // Check if all fields are filled in
        if (!task.title || !task.author || !task.description) {
            alert('Please fill in all required fields: Title, Author, and Description.');
            return;
        }

        // Set the assignee to the author if no assignee is provided
        const taskToInsert = {
            ...task,
            assignee: task.assignee || task.author,
            due_date: task.due_date
                ? new Date(`${task.due_date}T23:59:59-06:00`).toISOString() // Central Time (UTC-6)
                : null,
        };

        // Insert task into the database
        const { error } = await supabase.from('tasks').insert([taskToInsert]);

        if (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        } else {
            alert('Task created successfully!');
            navigate('/'); // Redirect to the homepage
        }
    }

    return (
        <div className='CreateTask'>
            <form onSubmit={createTask}>
                <label> Title (Required):</label>
                <input type="text" name="title" value={task.title} onChange={handleChange} required />

                <label> Author (Required):</label>
                <input type="text" name="author" value={task.author} onChange={handleChange} required />

                <label> Assignee:</label>
                <input type="text" name="assignee" value={task.assignee} onChange={handleChange} />

                <label> Description (Required):</label>
                <textarea name="description" value={task.description} onChange={handleChange} required />

                <label>Status:</label>
                <select name="status" value={task.status} onChange={handleChange}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>

                <label>Priority:</label>
                <select name="priority" value={task.priority} onChange={handleChange}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <label>Due Date:</label>
                <input type="date" name="due_date" value={task.due_date} onChange={handleChange} />

                <button type="submit">Create Task</button>
            </form>
        </div>
    )
}

export default CreateTask;