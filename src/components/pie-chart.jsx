import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Filter, ChevronDown, PieChart as PieChartIcon, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Use React.lazy instead of next/dynamic for code splitting
const ApexChart = lazy(() => import('react-apexcharts'));

export function PieChart({ transactions, height = 350, showControls = true }) {
  const [filterValue, setFilterValue] = useState('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [groupByType, setGroupByType] = useState('category'); // 'category' or 'payment'

  // Extract categories and payment methods from transactions
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

  // Filter transactions based on selected filter
  const filteredTransactions = React.useMemo(() => {
    if (filterValue === 'all') return transactions;
    if (groupByType === 'category') {
      return transactions.filter(t => t.category === filterValue);
    } else {
      return transactions.filter(t => t.payment_method === filterValue);
    }
  }, [transactions, filterValue, groupByType]);

  // Calculate pie chart data
  const chartData = React.useMemo(() => {
    // Only include expenses
    const expenses = filteredTransactions.filter(t => t.amount < 0);
    
    if (expenses.length === 0) return { series: [], labels: [], totalAmount: 0 };
    
    // Group by selected type (category or payment method)
    const grouped = expenses.reduce((acc, transaction) => {
      const key = groupByType === 'category' 
        ? (transaction.category || 'Uncategorized') 
        : (transaction.payment_method || 'Unknown');
        
      if (!acc[key]) acc[key] = 0;
      acc[key] += Math.abs(transaction.amount);
      return acc;
    }, {});
    
    // Create series and labels
    const sortedData = Object.entries(grouped)
      .sort((a, b) => b[1] - a[1]) // Sort by amount (highest first)
      .slice(0, 10); // Limit to top 10 for better visualization
    
    const labels = sortedData.map(([key]) => key);
    const series = sortedData.map(([_, amount]) => amount);
    const totalAmount = series.reduce((sum, val) => sum + val, 0);
    
    return { series, labels, totalAmount };
  }, [filteredTransactions, groupByType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownOpen && !event.target.closest('[data-dropdown="pie-filter"]')) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterDropdownOpen]);

  // Format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Reset filter when changing group by type
  useEffect(() => {
    setFilterValue('all');
  }, [groupByType]);

  // Chart options
  const chartOptions = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      fontFamily: 'system-ui, sans-serif',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedLabel = chartData.labels[config.dataPointIndex];
          if (selectedLabel) {
            setFilterValue(prevFilter => 
              prevFilter === selectedLabel ? 'all' : selectedLabel
            );
          }
        }
      }
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '55%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px'
            },
            value: {
              show: true,
              fontSize: '14px',
              formatter: function(value) {
                return formatCurrency(value);
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '14px',
              formatter: function() {
                return formatCurrency(chartData.totalAmount);
              }
            }
          }
        }
      }
    },
    labels: chartData.labels,
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function(value) {
          return formatCurrency(value);
        }
      }
    },
    legend: {
      position: 'bottom',
      offsetY: 5,
      height: 50,
      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
      formatter: function(seriesName, opts) {
        const value = opts.w.globals.series[opts.seriesIndex];
        const percent = ((value / chartData.totalAmount) * 100).toFixed(1);
        return `${seriesName} (${percent}%)`;
      },
      onItemHover: {
        highlightDataSeries: true
      },
      onItemClick: {
        toggleDataSeries: false
      }
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.9
        }
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.5
        }
      }
    },
    stroke: {
      width: 2,
      colors: ['#fff']
    },
    theme: {
      palette: 'palette10' // Use a vibrant palette
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };
  
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No transaction data available
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      {/* Group By and Filter Controls */}
      <div className="flex flex-wrap justify-between mb-4">
        {/* Group By Toggle */}
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
          <button
            onClick={() => setGroupByType('category')}
            className={`p-1.5 px-3 flex items-center gap-1 text-xs ${
              groupByType === "category" 
                ? "bg-blue-500 text-white" 
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            title="Group by Category"
          >
            <PieChartIcon size={14} />
            <span>By Category</span>
          </button>
          <button
            onClick={() => setGroupByType('payment')}
            className={`p-1.5 px-3 flex items-center gap-1 text-xs ${
              groupByType === "payment" 
                ? "bg-blue-500 text-white" 
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            title="Group by Payment Method"
          >
            <CreditCard size={14} />
            <span>By Payment</span>
          </button>
        </div>
          
        {/* Filter Dropdown */}
        {showControls && (
          <div className="relative" data-dropdown="pie-filter">
            <button
              className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            >
              <Filter className="h-3 w-3" />
              <span className="truncate max-w-[120px]">
                {filterValue === 'all' 
                  ? `All ${groupByType === 'category' ? 'Categories' : 'Payment Methods'}` 
                  : filterValue}
              </span>
              <ChevronDown className={`h-3 w-3 transition-transform ${filterDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {filterDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-50 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto rounded-md py-1 border border-gray-200 dark:border-gray-700"
                >
                  <button
                    className={`${
                      filterValue === 'all' ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300' : 'text-gray-900 dark:text-gray-300'
                    } cursor-pointer select-none w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={() => {
                      setFilterValue('all');
                      setFilterDropdownOpen(false);
                    }}
                  >
                    All {groupByType === 'category' ? 'Categories' : 'Payment Methods'}
                  </button>
                  
                  {/* Show either categories or payment methods based on groupByType */}
                  {(groupByType === 'category' ? categories : paymentMethods).map(item => (
                    <button
                      key={item}
                      className={`${
                        filterValue === item ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300' : 'text-gray-900 dark:text-gray-300'
                      } cursor-pointer select-none w-full py-1.5 pl-3 pr-9 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
                      onClick={() => {
                        setFilterValue(item);
                        setFilterDropdownOpen(false);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
        style={{ height: height }}
        key={`chart-${groupByType}`} // Key to force re-render when groupByType changes
      >
        {chartData.series.length > 0 ? (
          <Suspense fallback={<div className="flex items-center justify-center h-full">Loading chart...</div>}>
            <ApexChart 
              options={chartOptions}
              series={chartData.series}
              type="donut"
              height={height}
            />
          </Suspense>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No expense data available for {groupByType === 'category' ? 'categories' : 'payment methods'}
          </div>
        )}
      </motion.div>

      {/* Filter Active Indicator */}
      {filterValue !== 'all' && (
        <div className="mt-2 text-center text-xs text-gray-500">
          Showing only: <span className="font-medium text-blue-600 dark:text-blue-400">{filterValue}</span>
          <button 
            className="ml-2 text-xs text-gray-500 hover:text-gray-700"
            onClick={() => setFilterValue('all')}
          >
            (Clear)
          </button>
        </div>
      )}
    </div>
  );
}
