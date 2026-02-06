const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

// Full metadata for tasks
let tasks = [
  { id: "1", text: "Define Project Scope", status: "todo", priority: "High", category: "Feature", attachment: null },
];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  // Send initial tasks to new client
  socket.emit("sync:tasks", tasks);

  // Create Task
  socket.on("task:create", (newTask) => {
    tasks.push(newTask);
    io.emit("sync:tasks", tasks); // Broadcast update
  });

  // Update Task (text, priority, category, attachment)
  socket.on("task:update", (updatedTask) => {
    tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    io.emit("sync:tasks", tasks);
  });

  // Move Task
  socket.on("task:move", ({ id, newStatus }) => {
    tasks = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    io.emit("sync:tasks", tasks);
  });

  // Delete Task
  socket.on("task:delete", (id) => {
    tasks = tasks.filter(t => t.id !== id);
    io.emit("sync:tasks", tasks);
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

server.listen(5000, () => console.log("Server running on port 5000"));