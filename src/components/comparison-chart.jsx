import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function ComparisonChart({ transactions }) {
  const [periodType, setPeriodType] = useState("day"); // "day", "week", "month"
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownOpen && !event.target.closest('[data-chart-dropdown="comparison-filter"]')) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterDropdownOpen]);

  // Process data for chart
  const chartData = React.useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { periods: [], maxValue: 0 };
    }

    // Group transactions by period
    const groupedData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      let periodKey;
      
      if (periodType === "day") {
        // Group by day (YYYY-MM-DD)
        periodKey = date.toISOString().split('T')[0];
      } else if (periodType === "week") {
        // Group by week (YYYY-WW)
        const weekNumber = getWeekNumber(date);
        periodKey = `${date.getFullYear()}-W${weekNumber}`;
      } else {
        // Group by month (YYYY-MM)
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!acc[periodKey]) {
        acc[periodKey] = {
          period: periodKey,
          income: 0,
          expense: 0,
          date: date // keep the date for sorting
        };
      }
      
      // Add amount to the right category
      if (transaction.amount >= 0) {
        acc[periodKey].income += transaction.amount;
      } else {
        acc[periodKey].expense += Math.abs(transaction.amount);
      }
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    const periods = Object.values(groupedData)
      .sort((a, b) => a.date - b.date)
      .slice(-12); // Limit to most recent 12 periods
    
    // Find maximum value for scaling
    const maxValue = Math.max(
      ...periods.map(p => Math.max(p.income, p.expense))
    );
    
    return { periods, maxValue };
  }, [transactions, periodType]);

  // Format date labels based on period type
  const formatPeriodLabel = (periodKey) => {
    if (periodType === "day") {
      return new Date(periodKey).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric' 
      });
    } else if (periodType === "week") {
      // Format week label: e.g., "W23"
      const week = periodKey.split('-W')[1];
      return `W${week}`;
    } else {
      // Format month label: e.g., "Jun 2023"
      const [year, month] = periodKey.split('-');
      return new Date(year, parseInt(month) - 1, 1).toLocaleDateString('en-US', { 
        month: 'short', year: 'numeric'
      });
    }
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

  return (
    <div className="w-full relative">
      {/* Filter control */}
      <div className="flex justify-end mb-4">
        <div className="relative" data-chart-dropdown="comparison-filter">
          <button
            type="button"
            className="flex items-center gap-2 px-2 py-1 text-xs border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
          >
            <span>Period: {
              periodType === "day" ? "Daily" : 
              periodType === "week" ? "Weekly" : "Monthly"
            }</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${
              filterDropdownOpen ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {filterDropdownOpen && (
            <div className="absolute right-0 z-50 mt-1 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className={`${
                  periodType === "day"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                    : "text-gray-900 dark:text-gray-300"
                } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                onClick={() => {
                  setPeriodType("day");
                  setFilterDropdownOpen(false);
                }}
              >
                Daily
              </button>
              <button
                type="button"
                className={`${
                  periodType === "week"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                    : "text-gray-900 dark:text-gray-300"
                } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                onClick={() => {
                  setPeriodType("week");
                  setFilterDropdownOpen(false);
                }}
              >
                Weekly
              </button>
              <button
                type="button"
                className={`${
                  periodType === "month"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                    : "text-gray-900 dark:text-gray-300"
                } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                onClick={() => {
                  setPeriodType("month");
                  setFilterDropdownOpen(false);
                }}
              >
                Monthly
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {transactions.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <div className="w-full h-[250px]">
          {/* Y-axis labels */}
          <div className="relative h-[200px] w-full">
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 pb-6 pt-2">
              <div>{formatCurrency(chartData.maxValue)}</div>
              <div>{formatCurrency(chartData.maxValue * 0.75)}</div>
              <div>{formatCurrency(chartData.maxValue * 0.5)}</div>
              <div>{formatCurrency(chartData.maxValue * 0.25)}</div>
              <div>$0</div>
            </div>

            {/* Chart area */}
            <div className="ml-12 h-full flex items-end">
              <div className="flex-1 h-full flex items-end pb-6 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-6">
                  <div className="border-b border-gray-200 dark:border-gray-700 h-1/4"></div>
                  <div className="border-b border-gray-200 dark:border-gray-700 h-1/4"></div>
                  <div className="border-b border-gray-200 dark:border-gray-700 h-1/4"></div>
                  <div className="border-b border-gray-200 dark:border-gray-700 h-1/4"></div>
                </div>

                {/* Bars */}
                <div className="flex-1 flex items-end space-x-1">
                  {chartData.periods.map((period, index) => (
                    <div key={period.period} className="flex-1 flex flex-col items-center group relative">
                      <div className="w-full flex justify-center space-x-1">
                        {/* Income bar */}
                        <div 
                          className="w-2/5 bg-green-500 rounded-t-sm relative group"
                          style={{ 
                            height: `${chartData.maxValue ? (period.income / chartData.maxValue) * 100 : 0}%`,
                            minHeight: period.income > 0 ? '4px' : '0'
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-1 whitespace-nowrap">
                            Income: {formatCurrency(period.income)}
                          </div>
                        </div>

                        {/* Expense bar */}
                        <div 
                          className="w-2/5 bg-red-500 rounded-t-sm relative group"
                          style={{ 
                            height: `${chartData.maxValue ? (period.expense / chartData.maxValue) * 100 : 0}%`,
                            minHeight: period.expense > 0 ? '4px' : '0'
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-1 whitespace-nowrap">
                            Expenses: {formatCurrency(period.expense)}
                          </div>
                        </div>
                      </div>

                      {/* X-axis labels */}
                      <div className="absolute bottom-0 transform translate-y-full pt-1 text-xs text-gray-500 whitespace-nowrap">
                        {formatPeriodLabel(period.period)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 mr-1"></div>
              <span>Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 mr-1"></div>
              <span>Expenses</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get ISO week number
function getWeekNumber(d) {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
