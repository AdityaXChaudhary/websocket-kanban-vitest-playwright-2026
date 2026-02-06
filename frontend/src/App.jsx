import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const socket = io("http://localhost:5000");
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  useEffect(() => {
    socket.on("sync:tasks", (syncedTasks) => setTasks(syncedTasks));
    return () => socket.off("sync:tasks");
  }, []);

  // action
  const createTask = () => {
    if (!newTaskText) return;
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      status: "todo",
      priority: "Medium",
      category: "Feature",
      attachment: null
    };
    socket.emit("task:create", newTask);
    setNewTaskText("");
  };

  const updateTask = (task, updates) => {
    socket.emit("task:update", { ...task, ...updates });
  };

  const moveTask = (id, newStatus) => {
    socket.emit("task:move", { id, newStatus });
  };

  const deleteTask = (id) => {
    socket.emit("task:delete", id);
  };

  const handleFileUpload = (task, e) => {
    const file = e.target.files[0];
    if (file) {
      updateTask(task, { attachment: file.name });
    }
  };

  const chartData = [
    { name: 'To Do', count: tasks.filter(t => t.status === 'todo').length, color: '#8884d8' },
    { name: 'In Progress', count: tasks.filter(t => t.status === 'progress').length, color: '#82ca9d' },
    { name: 'Done', count: tasks.filter(t => t.status === 'done').length, color: '#ffc658' },
  ];

  const renderColumn = (status, title) => (
    <div style={{ flex: 1, padding: '10px', backgroundColor: '#f4f4f4', margin: '5px', borderRadius: '8px' }}>
      <h3>{title}</h3>
      {tasks.filter(t => t.status === status).map(task => (
        <div key={task.id} style={{ background: 'white', padding: '10px', margin: '10px 0', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <input 
            value={task.text} 
            onChange={(e) => updateTask(task, { text: e.target.value })}
            style={{ border: 'none', fontWeight: 'bold', width: '100%' }}
          />
          
          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            <label>Priority: </label>
            <select value={task.priority} onChange={(e) => updateTask(task, { priority: e.target.value })}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            
            <label style={{ marginLeft: '10px' }}>Type: </label>
            <select value={task.category} onChange={(e) => updateTask(task, { category: e.target.value })}>
              <option>Feature</option><option>Bug</option><option>Enhancement</option>
            </select>
          </div>

          <div style={{ marginTop: '10px' }}>
             <input type="file" onChange={(e) => handleFileUpload(task, e)} style={{ fontSize: '10px' }} />
             {task.attachment && <p style={{ fontSize: '10px', color: 'blue' }}>📎 {task.attachment}</p>}
          </div>

          <div style={{ marginTop: '10px' }}>
            {status !== 'todo' && <button onClick={() => moveTask(task.id, 'todo')}>To Do</button>}
            {status !== 'progress' && <button onClick={() => moveTask(task.id, 'progress')}>In Progress</button>}
            {status !== 'done' && <button onClick={() => moveTask(task.id, 'done')}>Done</button>}
            <button onClick={() => deleteTask(task.id)} style={{ color: 'red', marginLeft: '5px' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Real-time Kanban</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          value={newTaskText} 
          onChange={(e) => setNewTaskText(e.target.value)} 
          placeholder="New task title..." 
        />
        <button onClick={createTask}>Add Task</button>
      </div>

      <div style={{ height: 200, marginBottom: '20px' }}>
        <h4>Task Progress</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex' }}>
        {renderColumn('todo', 'To Do')}
        {renderColumn('progress', 'In Progress')}
        {renderColumn('done', 'Done')}
      </div>
    </div>
  );
}

export default App;