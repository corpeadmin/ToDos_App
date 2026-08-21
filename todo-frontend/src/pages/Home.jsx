import AddTodoForm from "../components/AddTodoForm";
import TodoList from "../components/TodoList";

function Home({
  todos,
  filter,
  setFilter,
  onAdd,
  onToggle,
  onDelete,
}) {
  return (
    <section>
      <h2>Home</h2>

      <AddTodoForm onAdd={onAdd} />

      <div className="filters">
        <button
          type="button"
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          type="button"
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>

        <button
          type="button"
          className={
            filter === "completed" ? "active" : ""
          }
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <TodoList
        todos={todos}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </section>
  );
}

export default Home;