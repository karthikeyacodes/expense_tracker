import React from 'react';
import { Edit, Delete, CalendarToday, LocalOffer } from '@mui/icons-material';

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-medium text-gray-900">{expense.description}</h4>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(expense.amount)}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <CalendarToday className="w-4 h-4" />
              <span>{formatDate(expense.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LocalOffer className="w-4 h-4" />
              <span>{expense.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};