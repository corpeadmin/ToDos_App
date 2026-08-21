function ToDoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <span
        className={todo.done ? "completed" : ""}
        onClick={() => onToggle(todo.id)}
      >
        {todo.text}
      </span>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </button>
    </li>
  );
}

export default ToDoItem;