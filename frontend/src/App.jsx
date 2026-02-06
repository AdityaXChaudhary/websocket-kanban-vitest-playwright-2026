import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

//connect to backend
const socket = io("http://localhost:5000");

function App() {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Define Project Scope', status: 'todo' },
    { id: '2', text: 'Set up WebSockets', status: 'todo' },
    { id: '3', text: 'Write Playwright Tests', status: 'done' },
  ]);

  useEffect(() => {
    socket.on("update-board", (moveData) => {
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task.id === moveData.taskId ? { ...task, status: moveData.newStatus } : task
        )
      );
    });

    return () => socket.off("update-board");
  }, []);

  const moveTask = (taskId, currentStatus) => {
    const newStatus = currentStatus === 'todo' ? 'done' : 'todo';
    
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    socket.emit("task-moved", { taskId, newStatus });
  };
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Kanban Board (Real-Time)</h1>
      <div style={{ display: 'flex', gap: '30px' }}>
        
        {['todo', 'done'].map((column) => (
          <div key={column} style={{
            background: '#ebecf0',
            padding: '20px',
            borderRadius: '10px',
            width: '280px',
            minHeight: '500px'
          }}>
            <h2 style={{ textTransform: 'capitalize', color: '#172b4d' }}>{column}</h2>
            
            {tasks.filter(t => t.status === column).map(task => (
              <div key={task.id} style={{
                background: 'white',
                padding: '15px',
                margin: '15px 0',
                borderRadius: '5px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <span style={{ fontSize: '16px' }}>{task.text}</span>
                <button 
                  onClick={() => moveTask(task.id, column)}
                  style={{ cursor: 'pointer', padding: '5px', borderRadius: '4px' }}
                >
                  Move to {column === 'todo' ? 'Done' : 'To Do'}
                </button>
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;