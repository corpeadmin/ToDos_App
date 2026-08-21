import ToDoItem from "./ToDoItem.jsx";

function ToDoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty-state">No todos here. Add one above!</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <ToDoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default ToDoList;