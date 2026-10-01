import { useState } from "react";

function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !amount) return;

    onAddExpense({
      title,
      amount: Number(amount),
      category,
    });

    setTitle("");
    setAmount("");
    setCategory("Food");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Expense title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Bills">Bills</option>
        <option value="Travel">Travel</option>
        <option value="Shopping">Shopping</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;