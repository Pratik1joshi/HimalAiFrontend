import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Use React.lazy instead of next/dynamic for code splitting
const ApexChart = lazy(() => import('react-apexcharts'));

export function ExpenseChart({ transactions }) {
  // Filter states
  const [chartCategoryFilter, setChartCategoryFilter] = useState("all");
  const [chartPaymentFilter, setChartPaymentFilter] = useState("all");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);

  // Extract unique categories and payment methods from transactions
  const { categories, paymentMethods } = React.useMemo(() => {
    const categoriesSet = new Set();
    const paymentMethodsSet = new Set();

    transactions.forEach(transaction => {
      if (transaction.category) categoriesSet.add(transaction.category);
      if (transaction.payment_method) paymentMethodsSet.add(transaction.payment_method);
    });

    return {
      categories: Array.from(categoriesSet),
      paymentMethods: Array.from(paymentMethodsSet)
    };
  }, [transactions]);

  // Apply chart-specific filters to transactions
  const filteredChartTransactions = React.useMemo(() => {
    return transactions.filter(transaction => {
      // Apply chart category filter
      if (chartCategoryFilter !== "all" && transaction.category !== chartCategoryFilter) {
        return false;
      }
      
      // Apply chart payment method filter
      if (chartPaymentFilter !== "all" && transaction.payment_method !== chartPaymentFilter) {
        return false;
      }
      
      return true;
    });
  }, [transactions, chartCategoryFilter, chartPaymentFilter]);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownOpen && !event.target.closest('[data-chart-dropdown="category"]')) {
        setCategoryDropdownOpen(false);
      }
      if (paymentDropdownOpen && !event.target.closest('[data-chart-dropdown="payment"]')) {
        setPaymentDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoryDropdownOpen, paymentDropdownOpen]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        No transaction data available
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Chart controls */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Expense Distribution</h3>

        {/* Filters */}
        <div className="flex gap-2 items-center">
          {/* Chart Category Filter */}
          <div className="relative" data-chart-dropdown="category">
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            >
              <Filter className="h-3 w-3" />
              <span className="truncate max-w-[100px]">
                {chartCategoryFilter === "all" ? "All Categories" : chartCategoryFilter}
              </span>
              <ChevronDown className={`h-3 w-3 transition-transform ${
                categoryDropdownOpen ? 'transform rotate-180' : ''
              }`} />
            </button>
            
            {categoryDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto rounded-md py-1 border border-gray-200 dark:border-gray-700"
              >
                <button
                  type="button"
                  className={`${
                    chartCategoryFilter === "all"
                      ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                      : "text-gray-900 dark:text-gray-300"
                  } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setChartCategoryFilter("all");
                    setCategoryDropdownOpen(false);
                  }}
                >
                  All Categories
                  {chartCategoryFilter === "all" && (
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

                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`${
                      chartCategoryFilter === category
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                        : "text-gray-900 dark:text-gray-300"
                    } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setChartCategoryFilter(category);
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    {category}
                    {chartCategoryFilter === category && (
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
                ))}
              </motion.div>
            )}
          </div>
          
          {/* Chart Payment Method Filter */}
          <div className="relative" data-chart-dropdown="payment">
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none"
              onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
            >
              <Filter className="h-3 w-3" />
              <span className="truncate max-w-[100px]">
                {chartPaymentFilter === "all" ? "All Payments" : chartPaymentFilter}
              </span>
              <ChevronDown className={`h-3 w-3 transition-transform ${
                paymentDropdownOpen ? 'transform rotate-180' : ''
              }`} />
            </button>
            
            {paymentDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 z-50 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto rounded-md py-1 border border-gray-200 dark:border-gray-700"
              >
                <button
                  type="button"
                  className={`${
                    chartPaymentFilter === "all"
                      ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                      : "text-gray-900 dark:text-gray-300"
                  } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setChartPaymentFilter("all");
                    setPaymentDropdownOpen(false);
                  }}
                >
                  All Payment Methods
                  {chartPaymentFilter === "all" && (
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

                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`${
                      chartPaymentFilter === method
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                        : "text-gray-900 dark:text-gray-300"
                    } cursor-pointer select-none relative w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setChartPaymentFilter(method);
                      setPaymentDropdownOpen(false);
                    }}
                  >
                    {method}
                    {chartPaymentFilter === method && (
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
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced PieChart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-[300px] transition-all duration-300"
      >
        <Suspense fallback={<div className="flex justify-center items-center h-full">Loading chart...</div>}>
          <PieChartImpl 
            transactions={filteredChartTransactions} 
            height={300}
            showControls={false}
          />
        </Suspense>
      </motion.div>
    </div>
  );
}

// Simple component implementation for the pie chart
// This is a placeholder until we create the full PieChartImpl component
function PieChartImpl({ transactions, height, showControls }) {
  // Process data for pie chart (expense distribution by category)
  const chartData = React.useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { series: [], labels: [] };
    }
    
    // Only include expenses
    const expenses = transactions.filter(t => t.amount < 0);
    
    // Group by category
    const grouped = expenses.reduce((acc, transaction) => {
      const category = transaction.category || 'Uncategorized';
      if (!acc[category]) acc[category] = 0;
      acc[category] += Math.abs(transaction.amount);
      return acc;
    }, {});
    
    // Sort by amount (highest first) and get top 10
    const sortedData = Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    const labels = sortedData.map(([category]) => category);
    const series = sortedData.map(([_, amount]) => amount);
    
    return { series, labels };
  }, [transactions]);
  
  if (chartData.series.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No expense data available
      </div>
    );
  }
  
  const options = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    labels: chartData.labels,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    plotOptions: {
      pie: {
        donut: {
          size: '55%'
        }
      }
    }
  };

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full">Loading chart...</div>}>
      <ApexChart
        options={options}
        series={chartData.series}
        type="donut"
        height={height}
      />
    </Suspense>
  );
}
