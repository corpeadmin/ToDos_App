import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Stats from "./pages/Stats.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch todos from backend API on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/todos`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTodos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching todos from API:", err);
      });
  }, []);

  // Add todo via backend API
  async function handleAddTodo(text) {
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          done: false,
          completed: false,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const newTodo = await res.json();
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (err) {
      console.error("Error adding todo:", err);
      alert(`Could not add todo: ${err.message}`);
    }
  }

  // Toggle todo completion via backend API
  async function handleToggle(id) {
    const todoToToggle = todos.find((t) => t.id === id);
    if (!todoToToggle) return;

    const newDoneState = !todoToToggle.done;

    try {
      const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          done: newDoneState,
          completed: newDoneState,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const updatedTodo = await res.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      console.error("Error toggling todo:", err);
      alert(`Could not update todo: ${err.message}`);
    }
  }

  // Delete todo via backend API
  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      alert(`Could not delete todo: ${err.message}`);
    }
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.done;
    }

    if (filter === "completed") {
      return todo.done;
    }

    return true;
  });

  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>My Todo App</h1>

          <nav>
            <Link to="/">Home</Link>
            <Link to="/stats">Stats</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  todos={visibleTodos}
                  filter={filter}
                  setFilter={setFilter}
                  onAdd={handleAddTodo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              }
            />

            <Route
              path="/stats"
              element={<Stats todos={todos} />}
            />

            <Route
              path="/about"
              element={<About />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;