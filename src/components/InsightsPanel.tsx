import React from 'react';
import { TrendingUp, TrendingDown, AttachMoney, CalendarToday, PieChart, BarChart } from '@mui/icons-material';

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface Budget {
  category: string;
  amount: number;
  month: string;
}

interface InsightsPanelProps {
  expenses: Expense[];
  budgets: Budget[];
  currentMonth: string;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ expenses, budgets, currentMonth }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(expense => 
    expense.date.startsWith(currentMonth)
  );

  // Calculate insights
  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = budgets
    .filter(budget => budget.month === currentMonth)
    .reduce((sum, budget) => sum + budget.amount, 0);
  
  const categoryTotals = currentMonthExpenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];
  
  // Previous month comparison
  const previousMonth = new Date(currentMonth + '-01');
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const prevMonthStr = previousMonth.toISOString().slice(0, 7);
  
  const previousMonthExpenses = expenses
    .filter(expense => expense.date.startsWith(prevMonthStr))
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyChange = previousMonthExpenses > 0 
    ? ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 
    : 0;

  // Average daily spending for current month
  const [yearStr, monthStr] = currentMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();
  const avgDailySpending = totalExpenses / daysInMonth;

  // Budget utilization
  const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const insights = [
    {
      title: "Monthly Spent",
      value: formatCurrency(totalExpenses),
      icon: AttachMoney,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      subtitle: `${budgetUtilization.toFixed(1)}% of budget used`,
      trend: budgetUtilization > 100 ? 'over' : budgetUtilization > 80 ? 'warning' : 'good'
    },
    {
      title: "Monthly Change",
      value: `${monthlyChange >= 0 ? '+' : ''}${monthlyChange.toFixed(1)}%`,
      icon: monthlyChange >= 0 ? TrendingUp : TrendingDown,
      color: monthlyChange >= 0 ? "bg-red-500" : "bg-green-500",
      bgColor: monthlyChange >= 0 ? "bg-red-50" : "bg-green-50",
      subtitle: "vs previous month",
      trend: monthlyChange >= 0 ? 'up' : 'down'
    },
    {
      title: "Top Category",
      value: topCategory ? topCategory[0] : "None",
      icon: PieChart,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      subtitle: topCategory ? formatCurrency(topCategory[1]) : "No expenses",
      trend: 'neutral'
    },
    {
      title: "Daily Average",
      value: formatCurrency(avgDailySpending),
      icon: CalendarToday,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      subtitle: "this month",
      trend: 'neutral'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Monthly Insights</h2>
        </div>
        <p className="text-sm text-gray-600">
          Showing data for {new Date(currentMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${insight.bgColor}`}>
                  <Icon className={`w-6 h-6 text-white ${insight.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{insight.value}</div>
                  <div className="text-sm font-medium text-gray-600">{insight.title}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{insight.subtitle}</div>
              
              {/* Trend indicator */}
              {insight.trend === 'over' && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full inline-block">
                  Over Budget
                </div>
              )}
              {insight.trend === 'warning' && (
                <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full inline-block">
                  Near Limit
                </div>
              )}
              {insight.trend === 'good' && (
                <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
                  On Track
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        {Object.keys(categoryTotals).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses this month</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(categoryTotals)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, amount]) => {
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</div>
                        <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};