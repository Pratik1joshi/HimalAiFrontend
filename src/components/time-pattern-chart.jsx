import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function TimePatternChart({ transactions }) {
  const [viewType, setViewType] = useState("dayOfWeek"); // "dayOfWeek" or "hourOfDay"
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  
  // Only include expenses for this chart
  const expenseTransactions = React.useMemo(() => {
    return transactions.filter(t => t.amount < 0);
  }, [transactions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownOpen && !event.target.closest('[data-chart-dropdown="pattern-filter"]')) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterDropdownOpen]);

  // Process data for chart
  const chartData = React.useMemo(() => {
    if (!expenseTransactions || expenseTransactions.length === 0) {
      return { labels: [], values: [], maxValue: 0 };
    }

    let labels = [];
    let groupedData = {};

    if (viewType === "dayOfWeek") {
      // Day of week analysis
      labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      // Initialize the data structure
      groupedData = labels.reduce((acc, day, index) => {
        acc[index] = { label: day, value: 0 };
        return acc;
      }, {});
      
      // Aggregate data
      expenseTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        groupedData[dayIndex].value += Math.abs(transaction.amount);
      });
    } else {
      // Hour of day analysis
      labels = Array.from({ length: 24 }, (_, i) => i);
      
      // Initialize the data structure
      groupedData = labels.reduce((acc, hour) => {
        acc[hour] = { 
          label: `${hour}:00${hour < 12 ? 'am' : 'pm'}`.replace('0:00am', '12:00am').replace('12:00pm', '12:00pm'),
          value: 0 
        };
        return acc;
      }, {});
      
      // Aggregate data
      expenseTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const hour = date.getHours();
        groupedData[hour].value += Math.abs(transaction.amount);
      });
    }
    
    // Convert to array
    const values = Object.values(groupedData);
    
    // Find maximum value for scaling
    const maxValue = Math.max(...values.map(item => item.value));
    
    return { labels, values, maxValue };
  }, [expenseTransactions, viewType]);

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
        <div className="relative" data-chart-dropdown="pattern-filter">
          <button
            type="button"
            className="flex items-center gap-2 px-2 py-1 text-xs border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
          >
            <span>View By: {viewType === "dayOfWeek" ? "Day of Week" : "Hour of Day"}</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${
              filterDropdownOpen ? 'transform rotate-180' : ''
            }`} />
          </button>
          
          {filterDropdownOpen && (
            <div className="absolute right-0 z-50 mt-1 w-36 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className={`${
                  viewType === "dayOfWeek"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                    : "text-gray-900 dark:text-gray-300"
                } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                onClick={() => {
                  setViewType("dayOfWeek");
                  setFilterDropdownOpen(false);
                }}
              >
                Day of Week
              </button>
              <button
                type="button"
                className={`${
                  viewType === "hourOfDay"
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                    : "text-gray-900 dark:text-gray-300"
                } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                onClick={() => {
                  setViewType("hourOfDay");
                  setFilterDropdownOpen(false);
                }}
              >
                Hour of Day
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {expenseTransactions.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          No data available
        </div>
      ) : (
        <div className="w-full h-[220px]">
          <div className="h-full flex flex-col relative">
            {/* Heat map visualization */}
            <div className="flex-1 flex">
              {chartData.values.map((item, index) => {
                const intensity = chartData.maxValue > 0 
                  ? item.value / chartData.maxValue 
                  : 0;
                
                // Determine color intensity based on spending
                const getHeatColor = (value) => {
                  if (value <= 0) return 'bg-gray-100 dark:bg-gray-800';
                  
                  // Scale from light blue to dark blue as intensity increases
                  if (value < 0.25) return 'bg-blue-100 dark:bg-blue-900/20';
                  if (value < 0.5) return 'bg-blue-300 dark:bg-blue-800';
                  if (value < 0.75) return 'bg-blue-500 dark:bg-blue-700';
                  return 'bg-blue-700 dark:bg-blue-600';
                };
                
                return (
                  <div key={index} className="flex-1 flex flex-col h-full">
                    <div 
                      className={`flex-1 ${getHeatColor(intensity)} relative group cursor-pointer m-0.5 rounded`}
                      title={`${item.label}: ${formatCurrency(item.value)}`}
                    >
                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-1 whitespace-nowrap z-10">
                        {item.label}: {formatCurrency(item.value)}
                      </div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-1 truncate">
                      {viewType === "dayOfWeek" 
                        ? item.label.substr(0, 3) // First 3 chars of day name
                        : item.label.replace(':00', '') // Remove ":00" from hour labels
                      }
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex justify-center items-center">
              <div className="flex items-center text-xs">
                <div className="mr-1 text-gray-500">Less</div>
                <div className="flex">
                  <div className="w-5 h-3 bg-blue-100 dark:bg-blue-900/20"></div>
                  <div className="w-5 h-3 bg-blue-300 dark:bg-blue-800"></div>
                  <div className="w-5 h-3 bg-blue-500 dark:bg-blue-700"></div>
                  <div className="w-5 h-3 bg-blue-700 dark:bg-blue-600"></div>
                </div>
                <div className="ml-1 text-gray-500">More</div>
              </div>
            </div>

            <div className="text-xs text-center text-gray-500 mt-2">
              {viewType === "dayOfWeek" 
                ? "Spending patterns by day of the week"
                : "Spending patterns by hour of the day"
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
