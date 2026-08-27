import AddToDoForm from "../components/AddToDoForm.jsx";
import ToDoList from "../components/ToDoList.jsx";

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

      <AddToDoForm onAdd={onAdd} />

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

      <ToDoList
        todos={todos}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </section>
  );
}

export default Home;