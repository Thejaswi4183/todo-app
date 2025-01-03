import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post("http://localhost:5000/tasks", {
          name: newTask,
        });
        setTasks([...tasks, response.data]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id) => {
    const task = tasks.find((task) => task._id === id);
    if (task) {
      try {
        const response = await axios.put(`http://localhost:5000/tasks/${id}`, {
          completed: !task.completed,
        });
        setTasks(
          tasks.map((t) => (t._id === id ? response.data : t))
        );
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add Task</button>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add some tasks!</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <div key={task._id} className="task">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task._id)}
              />
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.name}
              </span>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
