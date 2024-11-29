import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

function App() {
  //Expenses
  const [expenses, setExpense] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCateogry] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseEditModal, setExpenseModal] = useState(false);

  //Budgets
  const [budgets, setBudgets] = useState({});
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetEditModal, setBudgetModal] = useState(false);

  const updateExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      id: expenses.length + 1,
      description,
      date,
      amount: parseFloat(amount),
      category,
    };
    setExpense([...expenses, newExpense]);
    setDescription("");
    setAmount("");
    setDate("");
    setCateogry("");
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setExpenseModal(true);
  };

  const handleUpdate = () => {
    setExpense(
      expenses
        .map((expense) =>
          expense.id === editingExpense.id ? editingExpense : expense
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    setExpenseModal(false);
    setEditingExpense(null);
  };

  const handleDelete = (id) => {
    setExpense(expenses.filter((expense) => expense.id !== id));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const addBudget = () => {
    if (budgetCategory && budgetAmount) {
      setBudgets({
        ...budgets,
        [budgetCategory]: parseFloat(budgetAmount),
      });
      setBudgetCategory("");
      setBudgetAmount("");
      setBudgetModal(false);
    }
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const totalCategory = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const totalBudget = Object.values(budgets).reduce(
    (sum, budget) => sum + budget,
    0
  );

  return (
    <>
      <div>
        <h1>Budgets</h1>
        <button onClick={() => setBudgetModal(true)}>Add Budget</button>
      </div>
      <div>
        {Object.entries(budgets).map(([category, budget]) => {
          const spent = totalCategory[category] || 0;
          const progress = (spent / budget) * 100;
          return (
            <div key={category}>
              <div>
                <span>{category}</span>
                <span>
                  {formatCurrency(spent)} / {formatCurrency(budget)}
                </span>
              </div>
              <progress value={progress} />
              <div>
                <span>
                  Remaining: {formatCurrency(Math.max(budget - spent, 0))}
                </span>
                <span> {progress.toFixed(1)}% Used</span>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div>
          <span>Total</span>
          <span>
            {formatCurrency(totalExpenses)} / {formatCurrency(totalBudget)}
          </span>
        </div>
        <progress value={(totalExpenses / totalBudget) * 100} />
        <div>
          <span>
            Remaining:
            {formatCurrency(Math.max(totalBudget - totalExpenses, 0))}
          </span>
          <span> {((totalExpenses / totalBudget) * 100).toFixed(1)}% Used</span>
        </div>
      </div>
      <h1>Expense Tracker</h1>
      <form onSubmit={updateExpense}>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount (INR)</label>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <FormControl fullWidth>
            <label htmlFor="category" id="category-label">
              Category
            </label>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCateogry(e.target.value)}
              label="Select a category"
            >
              {Object.keys(budgets).map((budgetCategory) => (
                <MenuItem key={budgetCategory} value={budgetCategory}>
                  {budgetCategory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <button type="submit">Add Expense</button>
      </form>
      <div>
        <h2>Expenses:</h2>
        <ul>
          {sortedExpenses.map((expense) => (
            <li key={expense.id}>
              <span>
                {expense.description} - {formatCurrency(expense.amount)} -{" "}
                {expense.date} - {expense.category}
              </span>
              <div>
                <button onClick={() => handleEdit(expense)}>Edit</button>
                <button onClick={() => handleDelete(expense.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Dialog
        open={expenseEditModal}
        onOpenChange={() => setExpenseModal(false)}
      >
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          {editingExpense && (
            <>
              <div>
                <label htmlFor="edit-description">Description</label>
                <input
                  type="text"
                  id="edit-description"
                  value={editingExpense.amount}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="edit-amount">Amount</label>
                <input
                  type="number"
                  id="edit-amount"
                  value={editingExpense.amount}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="edit-date">Date</label>
                <input
                  type="date"
                  id="edit-date"
                  value={editingExpense.date}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="edit-category">Category</label>
                <Select
                  value={editingExpense.category}
                  onChange={(value) => {
                    setEditingExpense({ ...editingExpense, category: value });
                  }}
                >
                  {Object.keys(budgets).map((budgetCategory) => (
                    <MenuItem key={budgetCategory} value={budgetCategory}>
                      {budgetCategory}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </>
          )}
          <DialogActions>
            <button onClick={handleUpdate}>Save Changes</button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={budgetEditModal} onOpenChange={() => setBudgetModal(false)}>
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogContent>
          <div>
            <div>
              <label htmlFor="budget-category">Category</label>
              <input
                type="text"
                id="budget-category"
                value={budgetCategory}
                onChange={(e) => setBudgetCategory(e.target.value)}
                placeholder="e.g., Food, Groceries"
              />
            </div>
            <div>
              <label htmlFor="budget-amount">Budget Amount (INR)</label>
              <input
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="Enter budget amount"
              />
            </div>
          </div>
          <DialogActions>
            <button onClick={addBudget}>Save Changes</button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
