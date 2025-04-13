import React, { useMemo, useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

export function PieChart({ transactions }) {
  const [chartViewType, setChartViewType] = useState("expense");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  
  // Generate chart data based on transaction type
  const { data, total } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { data: [], total: 0 };
    }
    
    const categoryTotals = {};
    let sum = 0;
    
    transactions.forEach(transaction => {
      // For expense view, only include expenses
      if (chartViewType === "expense" && transaction.amount >= 0) return;
      // For income view, only include income
      if (chartViewType === "income" && transaction.amount < 0) return;
      
      const amount = Math.abs(transaction.amount);
      const category = transaction.category || "Uncategorized";
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      
      categoryTotals[category] += amount;
      sum += amount;
    });
    
    const sortedData = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: sum > 0 ? (amount / sum) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return { data: sortedData, total: sum };
  }, [transactions, chartViewType]);
  
  // Generate colors for categories
  const getCategoryColor = (index) => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6',
      '#F97316', '#06B6D4', '#84CC16', '#9333EA'
    ];
    
    return colors[index % colors.length];
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // No data state
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[280px] text-gray-500">
        No {chartViewType === "expense" ? "expense" : "income"} data available
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {/* Chart filters */}
      <div className="flex justify-end mb-4">
        <div className="relative" data-chart-dropdown="pie-view">
          <button
            type="button"
            className="flex items-center gap-2 px-2 py-1 text-xs border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
          >
            <Filter className="h-3 w-3" />
            <span>
              {chartViewType === "expense" ? "Expense Breakdown" : "Income Sources"}
            </span>
            <ChevronDown className={`h-3 w-3 transition-transform ${
              filterDropdownOpen ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {filterDropdownOpen && (
            <div className="absolute right-0 z-50 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className={`${
                  chartViewType === "expense"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                    : "text-gray-900 dark:text-gray-300"
                } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                onClick={(e) => {
                  e.stopPropagation();
                  setChartViewType("expense");
                  setFilterDropdownOpen(false);
                }}
              >
                Expense Breakdown
                {chartViewType === "expense" && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
              <button
                type="button"
                className={`${
                  chartViewType === "income"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                    : "text-gray-900 dark:text-gray-300"
                } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                onClick={(e) => {
                  e.stopPropagation();
                  setChartViewType("income");
                  setFilterDropdownOpen(false);
                }}
              >
                Income Sources
                {chartViewType === "income" && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Pie chart and legend */}
      <div className="flex flex-col md:flex-row">
        {/* Pie chart */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {data.length > 0 && data.map((item, index) => {
                // Calculate pie slice
                let cumulativePercentage = 0;
                for (let i = 0; i < index; i++) {
                  cumulativePercentage += data[i].percentage;
                }
                
                const startAngle = (cumulativePercentage / 100) * 360;
                const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360;
                
                // Calculate the SVG arc path
                const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                
                // Determine if the arc should take the long path (> 180°)
                const largeArcFlag = item.percentage > 50 ? 1 : 0;
                
                // Create path for arc
                const path = [
                  `M 50 50`, // Move to center
                  `L ${startX} ${startY}`, // Draw line to start point
                  `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Draw arc
                  `Z` // Close path
                ].join(' ');
                
                return (
                  <path
                    key={item.category}
                    d={path}
                    fill={getCategoryColor(index)}
                    stroke="#fff"
                    strokeWidth="0.5"
                    className="hover:opacity-90 cursor-pointer transition-opacity"
                  >
                    <title>{`${item.category}: ${formatCurrency(item.amount)} (${item.percentage.toFixed(1)}%)`}</title>
                  </path>
                );
              })}
              
              {/* Inner circle for donut effect */}
              <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-800" />
              
              {/* Total amount in middle */}
              <text 
                x="50" 
                y="48" 
                textAnchor="middle" 
                fontSize="8" 
                fontWeight="bold"
                fill="currentColor"
                className="dark:fill-white"
              >
                {formatCurrency(total)}
              </text>
              <text 
                x="50" 
                y="56" 
                textAnchor="middle" 
                fontSize="5" 
                fill="grey"
              >
                {chartViewType === "expense" ? "TOTAL EXPENSES" : "TOTAL INCOME"}
              </text>
            </svg>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex-1 max-h-64 overflow-y-auto pr-2">
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={item.category} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-2 rounded-sm" 
                  style={{ backgroundColor: getCategoryColor(index) }}
                />
                <div className="flex-1 flex justify-between text-sm">
                  <span className="truncate max-w-[100px]" title={item.category}>{item.category}</span>
                  <span className="font-medium">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
