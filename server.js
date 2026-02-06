const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); // Critical for allowing the frontend to talk to the backend

const server = http.createServer(app);

// Initialize Socket.io with permission for your Vite frontend port
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for the 'task-moved' event
  socket.on("task-moved", (data) => {
    console.log("Broadcasting move:", data);
    
    // Broadcast sends the message to all clients EXCEPT the sender
    socket.broadcast.emit("update-board", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});