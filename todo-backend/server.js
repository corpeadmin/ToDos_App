// server.js - Complete backend code

// Import required packages
const express = require("express");
const cors = require("cors");

// Create the server application
const app = express();

// Middleware
app.use(cors());              // Allow cross-origin requests from React app
app.use(express.json());      // Parse JSON request bodies

// In-memory data storage
let todos = [
  { id: 1, text: "Learn Express", completed: false },
  { id: 2, text: "Build a REST API", completed: false }
];

// GET endpoint - Retrieve all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// POST endpoint - Add a new todo
app.post("/api/todos", (req, res) => {
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  res.json(newTodo);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});