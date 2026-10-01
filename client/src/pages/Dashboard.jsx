import { useState, useEffect } from "react";
import ExpenseItem from "../components/ExpenseItem";
import ExpenseForm from "../components/ExpenseForm";
import CategoryChart from "../components/CategoryChart";
import TopExpenses from "../components/TopExpenses";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const PAGE_SIZE = 5;

function Dashboard() {
  const { user } = useAuth();


  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

  
  const [allExpenses, setAllExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- Data fetching ----------//
  async function fetchExpenses() {
    setLoading(true);
    try {
      const res = await api.get(
        `/expenses?page=${currentPage}&limit=${PAGE_SIZE}&category=${selectedCategory}`
      );
      setExpenses(res.data.expenses);
      setTotalPages(res.data.totalPages);
      setError("");
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  // Refetch the list whenever the page or filter changes
  useEffect(() => {
    fetchExpenses();
  }, [currentPage, selectedCategory]);

  // Refetch the full dataset whenever the list changes (add/edit/delete)
  useEffect(() => {
    async function fetchAllExpenses() {
      try {
        const res = await api.get("/expenses?limit=1000");
        setAllExpenses(res.data.expenses);
      } catch (err) {
        // non-critical: chart and side panel just won't update
      }
    }
    fetchAllExpenses();
  }, [expenses]);

  // ---------- Handlers ----------
  async function handleAddExpense(newExpenseData) {
    try {
      await api.post("/expenses", newExpenseData);
      if (currentPage === 1) {
        fetchExpenses(); 
      } else {
        setCurrentPage(1); 
      }
    } catch (err) {
      setError("Failed to add expense");
    }
  }

  async function handleDeleteExpense(id) {
    try {
      await api.delete(`/expenses/${id}`);
      
      if (expenses.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchExpenses();
      }
    } catch (err) {
      setError("Failed to delete expense");
    }
  }

  async function handleUpdateExpense(id, updatedData) {
    try {
      await api.put(`/expenses/${id}`, updatedData);
      fetchExpenses(); 
    } catch (err) {
      setError("Failed to update expense");
    }
  }

  async function handleDownloadReport() {
    try {
      const res = await api.get("/report/download", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download report. Premium membership required.");
    }
  }

  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); 
  }

  
  const totalBalance = allExpenses.reduce((sum, e) => sum + e.amount, 0);

  // ---------- Render ----------
  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      {error && <p className="error-text">{error}</p>}

      <p className="balance">Total Balance: ₹{totalBalance}</p>

      {user?.isPremium && (
        <button onClick={handleDownloadReport}>Download PDF Report</button>
      )}

      <div className="dashboard-layout">
        <div className="main-column">
          <CategoryChart expenses={allExpenses} />

          <ExpenseForm onAddExpense={handleAddExpense} />

          <label>
            Filter by category:{" "}
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="All">All</option>
              <option value="Food">Food</option>
              <option value="Bills">Bills</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </label>

          {loading && <p className="muted-text">Loading expenses...</p>}

          {!loading && expenses.length === 0 && (
            <p className="muted-text">No expenses found.</p>
          )}

          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              id={expense._id}
              title={expense.title}
              amount={expense.amount}
              category={expense.category}
              onDelete={handleDeleteExpense}
              onUpdate={handleUpdateExpense}
            />
          ))}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="side-column">
          <TopExpenses expenses={allExpenses} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;