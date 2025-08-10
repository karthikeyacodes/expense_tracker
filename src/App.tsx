import React, { useState } from 'react';
import { Add, AccountBalanceWallet, TrendingUp, Receipt } from '@mui/icons-material';
import { BudgetCard } from './components/BudgetCard';
import { ExpenseItem } from './components/ExpenseItem';
import { InsightsPanel } from './components/InsightsPanel';
import { Modal } from './components/Modal';

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string;
}

function App() {
  // Current month for tracking
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Budgets
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetMonth, setBudgetMonth] = useState(currentMonth);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteBudgetId, setDeleteBudgetId] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getMonthString = (dateStr: string) => {
    if (!dateStr) return currentMonth;
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !category) return;

    const expenseMonth = getMonthString(date);
    const validCategories = budgets
      .filter(budget => budget.month === expenseMonth)
      .map(budget => budget.category);

    if (!validCategories.includes(category)) return;

    const newExpense: Expense = {
      id: Date.now(),
      description,
      date,
      amount: parseFloat(amount),
      category,
    };

    setExpenses([...expenses, newExpense]);
    setDescription("");
    setAmount("");
    setDate("");
    setCategory("");
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const updateExpense = () => {
    if (!editingExpense) return;

    setExpenses(expenses.map(expense =>
      expense.id === editingExpense.id ? editingExpense : expense
    ));
    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetCategory || !budgetAmount) return;

    if (editingBudget) {
      // Update existing budget
      setBudgets(budgets.map(budget =>
        budget.id === editingBudget.id
          ? { ...budget, category: budgetCategory, amount: parseFloat(budgetAmount), month: currentMonth }
          : budget
      ));
      setEditingBudget(null);
    } else {
      // Add new budget
      const newBudget: Budget = {
        id: Date.now(),
        category: budgetCategory,
        amount: parseFloat(budgetAmount),
        month: currentMonth,
      };
      setBudgets([...budgets, newBudget]);
    }

    setBudgetCategory("");
    setBudgetAmount("");
    setBudgetMonth(currentMonth);
    setBudgetModalOpen(false);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setBudgetCategory(budget.category);
    setBudgetAmount(budget.amount.toString());
    setBudgetMonth(budget.month);
    setBudgetModalOpen(true);
  };

  const deleteBudget = (id: number) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter budgets and expenses for current month
  const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);
  const currentMonthExpenses = expenses.filter(expense => expense.date.startsWith(currentMonth));

  const categoryTotals = currentMonthExpenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {} as Record<string, number>);

  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = currentMonthBudgets.reduce((sum, budget) => sum + budget.amount, 0);

  // Get available categories for current month
  const selectedMonth = getMonthString(date);
  const availableCategories = budgets
    .filter(budget => budget.month === selectedMonth)
    .map(budget => budget.category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <AccountBalanceWallet className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-gray-600">Track your monthly budgets and expenses</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Current Month</label>
                <input
                  type="month"
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Monthly Spent</div>
                <div className="text-xl font-semibold text-gray-900">{formatCurrency(totalExpenses)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Monthly Budget</div>
                <div className="text-xl font-semibold text-gray-900">{formatCurrency(totalBudget)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Budgets Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Monthly Budgets</h2>
                </div>
                <button
                  onClick={() => {
                    setEditingBudget(null);
                    setBudgetCategory("");
                    setBudgetAmount("");
                    setBudgetMonth(currentMonth);
                    setBudgetModalOpen(true);
                  }}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Add className="w-4 h-4" />
                  <span>Add Budget</span>
                </button>
              </div>

              {currentMonthBudgets.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets for this month</h3>
                  <p className="text-gray-500 mb-4">Create your first budget to start tracking your spending</p>
                  <button
                    onClick={() => setBudgetModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create Budget
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMonthBudgets.map((budget) => (
                    <BudgetCard
                      key={budget.id}
                      category={budget.category}
                      budget={budget.amount}
                      spent={categoryTotals[budget.category] || 0}
                      month={budget.month}
                      onEdit={() => handleEditBudget(budget)}
                      onDelete={() => setDeleteBudgetId(budget.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Add Expense Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Receipt className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Add Expense</h2>
              </div>

              <form onSubmit={addExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter expense description"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled={availableCategories.length === 0}
                    >
                      <option value="">Select a category</option>
                      {availableCategories.map((budgetCategory) => (
                        <option key={budgetCategory} value={budgetCategory}>
                          {budgetCategory}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={availableCategories.length === 0}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {availableCategories.length === 0 ? 'Create budgets first' : 'Add Expense'}
                </button>
              </form>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Expenses</h2>

              {sortedExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
                  <p className="text-gray-500">Add your first expense to start tracking</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedExpenses.slice(0, 10).map((expense) => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      onEdit={handleEditExpense}
                      onDelete={deleteExpense}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Insights Sidebar */}
          <div className="lg:col-span-1">
            <InsightsPanel expenses={expenses} budgets={budgets} currentMonth={currentMonth} />
          </div>
        </div>
      </div>

      {/* Budget Modal */}
      <Modal
        isOpen={budgetModalOpen}
        onClose={() => {
          setBudgetModalOpen(false);
          setEditingBudget(null);
          setBudgetCategory("");
          setBudgetAmount("");
          setBudgetMonth(currentMonth);
        }}
        title={editingBudget ? "Edit Budget" : "Add Budget"}
      >
        <form onSubmit={addBudget} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={budgetCategory}
              onChange={(e) => setBudgetCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Food, Transportation, Entertainment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Amount (₹)
            </label>
            <input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <input
              type="month"
              value={currentMonth}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setBudgetModalOpen(false);
                setEditingBudget(null);
                setBudgetCategory("");
                setBudgetAmount("");
                setBudgetMonth(currentMonth);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {editingBudget ? "Update Budget" : "Add Budget"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Edit Expense"
      >
        {editingExpense && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={editingExpense.description}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={editingExpense.amount}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={editingExpense.date}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    date: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={editingExpense.category}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    category: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {availableCategories.map((budgetCategory) => (
                  <option key={budgetCategory} value={budgetCategory}>
                    {budgetCategory}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setExpenseModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateExpense}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Budget Confirmation Modal */}
      <Modal
        isOpen={deleteBudgetId !== null}
        onClose={() => setDeleteBudgetId(null)}
        title="Delete Budget"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this budget? This action cannot be undone.
          </p>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setDeleteBudgetId(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteBudgetId !== null) {
                  deleteBudget(deleteBudgetId);
                  setDeleteBudgetId(null);
                }
              }}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;