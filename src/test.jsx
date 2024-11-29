"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [budgets, setBudgets] = useState({});
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: uuidv4(),
      description,
      amount: parseFloat(amount),
      date,
      category,
    };
    setExpenses([newExpense, ...expenses]);
    setDescription("");
    setAmount("");
    setDate("");
    setCategory("");
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    setExpenses(
      expenses
        .map((expense) =>
          expense.id === editingExpense.id ? editingExpense : expense
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    setIsEditModalOpen(false);
    setEditingExpense(null);
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleAddBudget = () => {
    if (newBudgetCategory && newBudgetAmount) {
      setBudgets({
        ...budgets,
        [newBudgetCategory]: parseFloat(newBudgetAmount),
      });
      setNewBudgetCategory("");
      setNewBudgetAmount("");
      setIsBudgetModalOpen(false);
    }
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const categoryTotals = expenses.reduce((totals, expense) => {
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Budgets</h2>
          <Button onClick={() => setIsBudgetModalOpen(true)}>Add Budget</Button>
        </div>
        <div className="space-y-4">
          {Object.entries(budgets).map(([category, budget]) => {
            const spent = categoryTotals[category] || 0;
            const progress = (spent / budget) * 100;
            return (
              <div key={category} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{category}</span>
                  <span>
                    {formatCurrency(spent)} / {formatCurrency(budget)}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-2">
                  <span>
                    Remaining: {formatCurrency(Math.max(budget - spent, 0))}
                  </span>
                  <span>{progress.toFixed(1)}% used</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total</span>
            <span>
              {formatCurrency(totalExpenses)} / {formatCurrency(totalBudget)}
            </span>
          </div>
          <Progress
            value={(totalExpenses / totalBudget) * 100}
            className="h-2"
          />
          <div className="flex justify-between mt-2">
            <span>
              Remaining:{" "}
              {formatCurrency(Math.max(totalBudget - totalExpenses, 0))}
            </span>
            <span>
              {((totalExpenses / totalBudget) * 100).toFixed(1)}% used
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount (INR)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(budgets).map((budgetCategory) => (
                <SelectItem key={budgetCategory} value={budgetCategory}>
                  {budgetCategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Add Expense</Button>
      </form>
      <div>
        <h2 className="text-xl font-semibold mb-2">Expenses:</h2>
        <ul className="space-y-2">
          {sortedExpenses.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between bg-gray-100 p-2 rounded"
            >
              <span>
                {expense.description} - {formatCurrency(expense.amount)} -{" "}
                {expense.date} - {expense.category}
              </span>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(expense)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingExpense.description}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Amount (INR)</Label>
                <Input
                  id="edit-amount"
                  type="number"
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
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
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
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingExpense.category}
                  onValueChange={(value) =>
                    setEditingExpense({ ...editingExpense, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(budgets).map((budgetCategory) => (
                      <SelectItem key={budgetCategory} value={budgetCategory}>
                        {budgetCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBudgetModalOpen} onOpenChange={setIsBudgetModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget-category">Category</Label>
              <Input
                id="budget-category"
                type="text"
                value={newBudgetCategory}
                onChange={(e) => setNewBudgetCategory(e.target.value)}
                placeholder="e.g., Groceries, Entertainment"
              />
            </div>
            <div>
              <Label htmlFor="budget-amount">Budget Amount (INR)</Label>
              <Input
                id="budget-amount"
                type="number"
                value={newBudgetAmount}
                onChange={(e) => setNewBudgetAmount(e.target.value)}
                placeholder="Enter budget amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddBudget}>Add Budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
