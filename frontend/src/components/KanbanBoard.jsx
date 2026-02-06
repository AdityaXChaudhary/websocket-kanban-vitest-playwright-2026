import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
const KanbanBoard = ({ 
  tasks = [], 
  newTaskText, 
  setNewTaskText, 
  createTask, 
  updateTask, 
  moveTask, 
  deleteTask, 
  handleFileUpload 
}) => {
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
          <div style={{ marginTop: '10px' }}>
            {status !== 'todo' && <button onClick={() => moveTask(task.id, 'todo')}>To Do</button>}
            {status !== 'progress' && <button onClick={() => moveTask(task.id, 'progress')}>In Progress</button>}
            {status !== 'done' && <button onClick={() => moveTask(task.id, 'done')}>Done</button>}
            <button onClick={() => deleteTask(task.id)} style={{ color: 'red' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ padding: '20px' }}>
     <h1>Real-time Kanban</h1> {/* Match this exactly for the test */}
      
    <div style={{ marginBottom: '20px' }}>
       <input 
          value={newTaskText} 
          onChange={(e) => setNewTaskText(e.target.value)} 
        placeholder="New task title..." 
        />
        <button onClick={createTask}>Add Task</button> {/* Match name: /add task/i */}
      </div>
      <div style={{ height: 200, marginBottom: '20px' }}>
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
};

export default KanbanBoard;