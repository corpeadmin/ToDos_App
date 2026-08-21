import { useState } from "react";

function AddTodoForm({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (text.trim() === "") {
      return;
    }

    onAdd(text.trim());
    setText("");
  }

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
      />

      <button type="submit">
        Add
      </button>
    </form>
  );
}

export default AddTodoForm;