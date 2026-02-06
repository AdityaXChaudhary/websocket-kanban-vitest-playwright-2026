const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("task-moved", (data) => {
    console.log("Broadcasting move:", data);
    socket.broadcast.emit("update-board", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
const PORT = 5000;
app.get("/", (req, res) => {
  res.send("Backend Server is Running!");
});
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});