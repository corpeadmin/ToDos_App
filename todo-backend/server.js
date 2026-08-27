// server.js - Complete backend code with PostgreSQL integration

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { query, initDb } = require("./db");

// Create the server application
const app = express();

// Allowed origins for CORS (local frontend)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
].filter(Boolean);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for local dev
  },
  credentials: true
}));
app.use(express.json());      // Parse JSON request bodies

// Helper to format a database row to standard todo object
const formatTodo = (row) => ({
  id: row.id,
  text: row.text,
  completed: row.completed,
  done: row.completed,
  created_at: row.created_at
});

// GET endpoint - Retrieve all todos
app.get("/api/todos", async (req, res) => {
  try {
    const result = await query("SELECT id, text, completed, created_at FROM todos ORDER BY id ASC");
    res.json(result.rows.map(formatTodo));
  } catch (err) {
    console.error("Error fetching todos from database:", err);
    res.status(500).json({ error: "Failed to fetch todos from database" });
  }
});

// GET endpoint - Retrieve single todo by ID
app.get("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("SELECT id, text, completed, created_at FROM todos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(formatTodo(result.rows[0]));
  } catch (err) {
    console.error("Error fetching todo:", err);
    res.status(500).json({ error: "Failed to fetch todo from database" });
  }
});

// POST endpoint - Add a new todo
app.post("/api/todos", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Text field is required" });
  }

  const completed = req.body.completed !== undefined
    ? Boolean(req.body.completed)
    : (req.body.done !== undefined ? Boolean(req.body.done) : false);

  try {
    const result = await query(
      "INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING id, text, completed, created_at",
      [text.trim(), completed]
    );
    res.status(201).json(formatTodo(result.rows[0]));
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ error: "Failed to create todo in database" });
  }
});

// PUT endpoint - Update a todo (text and/or completed status)
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const completed = req.body.completed !== undefined ? req.body.completed : req.body.done;

  try {
    const existing = await query("SELECT id, text, completed FROM todos WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updatedText = text !== undefined ? String(text).trim() : existing.rows[0].text;
    const updatedCompleted = completed !== undefined ? Boolean(completed) : existing.rows[0].completed;

    const result = await query(
      "UPDATE todos SET text = $1, completed = $2 WHERE id = $3 RETURNING id, text, completed, created_at",
      [updatedText, updatedCompleted, id]
    );
    res.json(formatTodo(result.rows[0]));
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Failed to update todo in database" });
  }
});

// PATCH endpoint - Partially update a todo
app.patch("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const completed = req.body.completed !== undefined ? req.body.completed : req.body.done;

  try {
    const existing = await query("SELECT id, text, completed FROM todos WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updatedText = text !== undefined ? String(text).trim() : existing.rows[0].text;
    const updatedCompleted = completed !== undefined ? Boolean(completed) : existing.rows[0].completed;

    const result = await query(
      "UPDATE todos SET text = $1, completed = $2 WHERE id = $3 RETURNING id, text, completed, created_at",
      [updatedText, updatedCompleted, id]
    );
    res.json(formatTodo(result.rows[0]));
  } catch (err) {
    console.error("Error patching todo:", err);
    res.status(500).json({ error: "Failed to update todo in database" });
  }
});

// DELETE endpoint - Remove a todo by ID
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("DELETE FROM todos WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully", id: parseInt(id, 10) });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Failed to delete todo from database" });
  }
});

// Start the server after initializing database schema
const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Fatal error: Database connection failed during startup", err);
    process.exit(1);
  });