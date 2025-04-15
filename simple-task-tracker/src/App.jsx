import React, { useState } from 'react'
import './App.css'
import logo from '../public/logo.svg';
import { useRoutes, Link } from 'react-router-dom'
import Task from './components/Task.jsx';
import Create from './pages/CreateTask.jsx';
import Edit from './pages/EditTask.jsx';
import Read from './pages/ReadTasks.jsx';

const App = () => {

  // Set up routes
  let elements = useRoutes([
    {
      path: "/",
      element: <Read />
    },
    {
      path: "/create",
      element: <Create />
    },
    {
      path: "/edit/:id",
      element: <Edit />
    }
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Mayo Clinic Task Tracker</h1>
      </header>
      <main>
        {elements}
      </main>
    </div>
  )
}

export default App
