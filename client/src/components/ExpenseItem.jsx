import { useState } from "react";

function ExpenseItem({ id, title, amount, category, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editAmount, setEditAmount] = useState(amount);
  const [editCategory, setEditCategory] = useState(category);

  function handleSave() {
    onUpdate(id, {
      title: editTitle,
      amount: Number(editAmount),
      category: editCategory,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setEditTitle(title);
    setEditAmount(amount);
    setEditCategory(category);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="expense-item expense-item-editing">
        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
        <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Bills">Bills</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="expense-item">
      <p>{title}</p>
      <p>₹{amount}</p>
      <div className="expense-item-actions">
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button onClick={() => onDelete(id)}>Delete</button>
      </div>
    </div>
  );
}

export default ExpenseItem;