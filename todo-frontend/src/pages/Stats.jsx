function Stats({ todos }) {
  const completed = todos.filter(
    (todo) => todo.done
  ).length;

  const remaining = todos.length - completed;

  return (
    <section>
      <h2>Stats</h2>

      <p>Total todos: {todos.length}</p>

      <p>Completed: {completed}</p>

      <p>Remaining: {remaining}</p>
    </section>
  );
}

export default Stats;