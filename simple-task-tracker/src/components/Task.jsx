import React from 'react'
import { useState } from 'react'
import './Task.css'
import { Link } from 'react-router-dom'

const Task = (props) => {

    //const [count, setCount] = useState(0);

    // Format the due date to a readable format
    const formattedDueDate = props.dueDate
    ? new Date(props.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    : null;

    // Truncate the description if it exceeds 80 characters
    const truncateDescription = (description) => {
        const maxLength = 80;
        return description.length > maxLength
            ? `${description.substring(0, maxLength)}...`
            : description;
    };

    return (
        <div className="Task">
            <h2 className="title">{props.title}</h2>
            <p className="author"><strong>Author:</strong> {props.author}</p>
            <p className="assignee"><strong>Assignee:</strong> {props.assignee}</p>
            <p className="description"><strong>Description:</strong> {truncateDescription(props.description)}</p>
            <p className="status"><strong>Status:</strong> {props.status}</p>
            <p className="priority"><strong>Priority:</strong> {props.priority}</p>
            {formattedDueDate && <p className="due-date"><strong>Due Date:</strong> {formattedDueDate}</p>}
            <div className="task-actions">
                <Link to={`/edit/${props.id}`} className="edit-task-button">
                    Edit Task
                </Link>
            </div>
        </div>
    )
}

export default Task;