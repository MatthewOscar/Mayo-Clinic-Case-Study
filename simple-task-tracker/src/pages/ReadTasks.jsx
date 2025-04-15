import React, { useState, useEffect } from 'react';
import { useRoutes, Link } from 'react-router-dom'
import Task from '../components/Task.jsx';
import { supabase } from  '../Client.jsx';
import './ReadTasks.css'

const ReadTasks = (props) => {
    
    // The Tasks
    const [tasks, setTasks] = useState([]);
    //const [loading, setLoading] = useState(true);


    // Set the tasks once the user opens the webpage
    useEffect(() => {
        // READ all tasks from database
        const fetchTasks = async () => {
            const { data } = await supabase
                .from('tasks')
                .select()
                .order('due_date', { ascending: true }); // Sort by due_date in ascending order

            // Set the state of posts
            setTasks(data);
            //setLoading(false);
        }

        fetchTasks();
    }, [props]);

    return (
        <div className="ReadTasks">
            <div className="task-gallery">
                {tasks.map((task, index) => (
                    <div className="task-card" key={task.id}>
                        <Task
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            author={task.author}
                            assignee={task.assignee}
                            status={task.status}
                            priority={task.priority}
                            dueDate={task.due_date}
                        />
                    </div>
                ))}
            </div>
            <p></p>
            <Link to="/create" className="create-task-button">
                Create New Task
            </Link>
        </div>
    )
}

export default ReadTasks;