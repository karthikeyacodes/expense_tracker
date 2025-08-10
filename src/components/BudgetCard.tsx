import React from 'react';
import { Savings, Warning, Edit, Delete } from '@mui/icons-material';

interface BudgetCardProps {
  category: string;
  budget: number;
  spent: number;
  month: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ category, budget, spent, month, onEdit, onDelete }) => {
  const progress = (spent / budget) * 100;
  const remaining = Math.max(budget - spent, 0);
  const isOverBudget = spent > budget;
  const isNearLimit = progress > 80 && !isOverBudget;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isOverBudget ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-blue-100'}`}>
            <Savings className={`w-5 h-5 ${isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{category}</h3>
            <p className="text-sm text-gray-500">{formatMonth(month)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isOverBudget && <Warning className="w-5 h-5 text-red-500" />}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {
            onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Delete className="w-4 h-4" />
              </button>
            )
          }
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Spent</span>
          <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
            {formatCurrency(spent)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Budget</span>
          <span className="font-semibold text-gray-900">{formatCurrency(budget)}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className={`${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {isOverBudget ? 'Over budget' : `Remaining: ${formatCurrency(remaining)}`}
          </span>
          <span className="text-gray-500">{progress.toFixed(1)}% used</span>
        </div>
      </div>
    </div>
  );
};