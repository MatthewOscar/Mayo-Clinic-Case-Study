import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../Client.jsx';
import './EditTask.css';

const EditTask = ({data}) => {
    const { id } = useParams(); // Get the task ID from the URL
    const navigate = useNavigate();

    const [task, setTask] = useState({
        title: '',
        author: '',
        assignee: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        due_date: '', // Store the date in yyyy-MM-dd format
      });

    useEffect(() => {
        const fetchTask = async () => {
            const { data, error } = await supabase
              .from('tasks')
              .select()
              .eq('id', id)
              .single();
      
              if (error) {
                console.error('Error fetching task:', error);
                alert('Failed to fetch task. Redirecting to the main page.');
                navigate('/');
              } else {
                // Convert the due_date to yyyy-MM-dd format
                setTask({
                  ...data,
                  due_date: data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : '',
                });
              }
        }

        fetchTask();
    }, [id, navigate]);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setTask((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    // Update the task in the database
    const updateTask = async (event) => {
        event.preventDefault();

        const taskToUpdate = {
            ...task,
            assignee: task.assignee || task.author, // Set the assignee to the author if no assignee is provided
            due_date: task.due_date
              ? new Date(`${task.due_date}T23:59:59-06:00`).toISOString() // Central Time (UTC-6)
              : null,
          };

        const { error } = await supabase
            .from('tasks')
            .update(taskToUpdate)
            .eq('id', id);

        if (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        } else {
            alert('Task updated successfully!');
            navigate('/'); // Redirect to the main page
        }
    };

    // Delete the task from the database
    const deleteTask = async () => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        } else {
            alert('Task deleted successfully!');
            navigate('/'); // Redirect to the main page
        }
    };

    return (
        <div className='EditTask'>
            <form onSubmit={updateTask}>
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

                <div className="button-group">
                    <button type="submit" className="edit-button">Edit Task</button>
                    <button type="button" className="delete-button" onClick={deleteTask} >Delete Task</button>
                </div>
            </form>
        </div>
    )
}

export default EditTask;