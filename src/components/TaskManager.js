import React, { useState, useEffect } from 'react';
import "./TaskManager.css";

function TaskManager() {

    // Load the task from localstorage when component mounts
    const [tasks, setTasks] = useState(() => {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    });
  
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'low',
        dueDate: ''
    });
  
    // Load filter value from localstorage when component mounts
    const [filter, setFilter] = useState(() => {
        const storedFilter = localStorage.getItem('filter');
        return storedFilter ? storedFilter : 'all';
      }); // all, completed, incomplete
  
    // Reset filter to 'all' when component mounts
    useEffect(() => {
      setFilter('all');
    }, []);

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prevTask => ({
          ...prevTask,
          [name]: value
        }));
    };

    // Creating new task
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTask.title.trim() === '') {
          alert('Task title cannot be empty');
          return;
        }
        setTasks([...tasks, newTask]);
        setNewTask({
          title: '',
          description: '',
          priority: 'low',
          dueDate: ''
        });
    };

    // Updating task
    const handleUpdate = (index, updatedTask) => {
        const updatedTasks = tasks.map((task, i) => {
            if (i === index) {
                return { ...task, ...updatedTask };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const [editIndex, setEditIndex] = useState(null);

    const handleEdit = (index) => {
        setEditIndex(index);
    };

    const handleSave = (index, updatedTask) => {
        handleUpdate(index, updatedTask);
        setEditIndex(null);
    };

    // Deleting task
    const handleDelete = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };
    
    // Mask task as completed or incompleted
    const handleToggleComplete = (index) => {
        const updatedTasks = tasks.map((task, i) => {
            if (i === index) {
            return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    // Filter task
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') {
          return true;
        } else if (filter === 'completed') {
          return task.completed;
        } else if (filter === 'incomplete') {
          return !task.completed;
        }
    });
    
    // Save filter value to localstorage
    useEffect(() => {
        localStorage.setItem('filter', filter);
    }, [filter]);

    return (
        <div className='max-w-md mx-auto px--4 py-8'>
            <h1>Task Manager</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={newTask.title} onChange={handleChange} placeholder="Title" />
                <textarea name="description" value={newTask.description} onChange={handleChange} placeholder="Description"></textarea>
                <select name="priority" value={newTask.priority} onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleChange} placeholder="Due Date" />
                <button type="submit">Add Task</button>
            </form>
            <div>
                <label>
                Filter Tasks:
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                </select>
                </label>
            </div>
            <ul>
                {filteredTasks.map((task, index) => (
                    <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {editIndex === index ? (
                        <>
                            <input type="text" value={task.title} onChange={(e) => handleUpdate(index, { title: e.target.value })} />
                            <textarea value={task.description} onChange={(e) => handleUpdate(index, { description: e.target.value })}></textarea>
                            <button onClick={() => handleSave(index, task)}>Save</button>
                        </>
                    ) : (
                        <>
                            <div>
                                <strong>Title:</strong> {task.title}
                            </div>
                            <div>
                                <strong>Description:</strong> {task.description}
                            </div>
                            <div>
                                <strong>Priority:</strong> {task.priority}
                            </div>
                            <div>
                                <strong>Due Date:</strong> {task.dueDate}
                            </div>
                            <button onClick={() => handleToggleComplete(index)}>
                            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                            </button>
                            <button onClick={() => handleEdit(index)}>Edit</button>
                            <button onClick={() => handleDelete(index)}>Delete</button>
                        </>
                    )}    
                    </li>
                ))}
            </ul>
        </div>
    );
}
    
export default TaskManager;