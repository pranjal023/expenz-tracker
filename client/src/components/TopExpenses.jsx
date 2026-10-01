function TopExpenses({ expenses }) {
  const topFive = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  if (topFive.length === 0) {
    return (
      <div className="side-panel">
        <h3 className="side-panel-title">Top 5 Expenses</h3>
        <p className="muted-text">No expenses yet.</p>
      </div>
    );
  }

  const highest = topFive[0].amount; 

  return (
    <div className="side-panel">
      <h3 className="side-panel-title">Top 5 Expenses</h3>
      <div className="top-expenses-list">
        {topFive.map((expense, index) => (
          <div className="top-expense-row" key={expense._id}>
            <span className={`top-expense-rank rank-${index + 1}`}>
              {index + 1}
            </span>
            <div className="top-expense-info">
              <div className="top-expense-header">
                <span className="top-expense-title">{expense.title}</span>
                <span className="top-expense-amount">₹{expense.amount}</span>
              </div>
              <div className="top-expense-bar-track">
                <div
                  className="top-expense-bar-fill"
                  style={{ width: `${(expense.amount / highest) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopExpenses;