import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import About from "./pages/About";
import Stats from "./pages/Stats";

const startingTodos = [
  {
    id: 1,
    text: "Learn JSX",
    done: false,
  },
  {
    id: 2,
    text: "Understand props",
    done: false,
  },
  {
    id: 3,
    text: "Build a todo list",
    done: true,
  },
];

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");

    return saved ? JSON.parse(saved) : startingTodos;
  });

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleAddTodo(text) {
    const newTodo = {
      id: Date.now(),
      text,
      done: false,
    };

    setTodos([...todos, newTodo]);
  }

  function handleToggle(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              done: !todo.done,
            }
          : todo
      )
    );
  }

  function handleDelete(id) {
    setTodos(
      todos.filter((todo) => todo.id !== id)
    );
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