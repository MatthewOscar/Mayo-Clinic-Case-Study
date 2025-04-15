import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Task from '../components/Task.jsx';
import { supabase } from '../Client.jsx';
import './ReadTasks.css';

const ReadTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order

  // Fetch tasks from the database
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select()
        .order('due_date', { ascending: sortOrder === 'asc' }); // Sort by due_date based on sortOrder

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data);
      }
    };

    fetchTasks();
  }, [sortOrder]); // Refetch tasks when sortOrder changes

  // Filter tasks based on the search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ReadTasks">
      <div className="controls">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {/* Sort Order Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="sort-button"
        >
          Sort by Due Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>

      <div className="task-gallery">
        {filteredTasks.map((task) => (
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

      <Link to="/create" className="create-task-button">
        Create New Task
      </Link>
    </div>
  );
};

export default ReadTasks;