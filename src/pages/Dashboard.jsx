"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, ArrowRight, Calendar, ChevronDown, Download, Filter, RefreshCw, CreditCard, Wallet, PieChart, Clock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { ExpenseChart } from "../components/expense-chart"
import { transactionService } from "../services/transactionService"
import { Badge } from "../components/ui/badge"
import { PieChart as PieChartComponent } from "../components/pie-chart"
import { ComparisonChart } from "../components/comparison-chart"
import { TimePatternChart } from "../components/time-pattern-chart"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

export default function Dashboard() {
  // Core data state
  const [allTransactions, setAllTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { authAxios } = useAuth() // Use authenticated axios instance from AuthContext

  // Filter states
  const [timeFilter, setTimeFilter] = useState("1month")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all") // 'all', 'expense', 'income'

  // UI states
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage] = useState(10)
  const [timeFilterDropdownOpen, setTimeFilterDropdownOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [paymentMethodDropdownOpen, setPaymentMethodDropdownOpen] = useState(false)
  const [typeFilterDropdownOpen, setTypeFilterDropdownOpen] = useState(false)

  // Time filter options
  const timeFilterOptions = [
    { value: "3days", label: "Last 3 Days" },
    { value: "7days", label: "Last 7 Days" },
    { value: "15days", label: "Last 15 Days" },
    { value: "1month", label: "Last Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last Year" },
  ]

  // Fetch all transactions from backend API
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use authAxios to make an authenticated request to the backend API
      const response = await authAxios.get("/transactions");
      
      // Check if the response has the expected structure
      if (response.data && Array.isArray(response.data.items)) {
        setAllTransactions(response.data.items);
        console.log("Fetched transactions:", response.data.items.length);
      } else if (response.data && Array.isArray(response.data)) {
        // Handle alternative API response format
        setAllTransactions(response.data);
        console.log("Fetched transactions:", response.data.length);
      } else {
        console.error("Unexpected API response format:", response.data);
        setError("Received unexpected data format from server");
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          "Could not load transactions. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeFilterDropdownOpen && !event.target.closest('[data-dropdown="time-filter"]')) {
        setTimeFilterDropdownOpen(false);
      }
      if (categoryDropdownOpen && !event.target.closest('[data-dropdown="category"]')) {
        setCategoryDropdownOpen(false);
      }
      if (paymentMethodDropdownOpen && !event.target.closest('[data-dropdown="payment-method"]')) {
        setPaymentMethodDropdownOpen(false);
      }
      if (typeFilterDropdownOpen && !event.target.closest('[data-dropdown="type-filter"]')) {
        setTypeFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [timeFilterDropdownOpen, categoryDropdownOpen, paymentMethodDropdownOpen, typeFilterDropdownOpen]);

  // Extract unique categories and payment methods from transactions
  const { 
    categories, 
    paymentMethods 
  } = useMemo(() => {
    const categoriesSet = new Set();
    const paymentMethodsSet = new Set();

    allTransactions.forEach(transaction => {
      if (transaction.category) categoriesSet.add(transaction.category);
      if (transaction.payment_method) paymentMethodsSet.add(transaction.payment_method);
    });

    return {
      categories: Array.from(categoriesSet),
      paymentMethods: Array.from(paymentMethodsSet)
    };
  }, [allTransactions]);

  // Date filtering function 
  const getDateFilterBoundary = () => {
    const now = new Date();
    switch (timeFilter) {
      case "3days":
        return new Date(now.setDate(now.getDate() - 3));
      case "7days":
        return new Date(now.setDate(now.getDate() - 7));
      case "15days":
        return new Date(now.setDate(now.getDate() - 15));
      case "1month":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "3months":
        return new Date(now.setMonth(now.getMonth() - 3));
      case "6months":
        return new Date(now.setMonth(now.getMonth() - 6));
      case "1year":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setMonth(now.getMonth() - 1)); // default to 1 month
    }
  };

  // Apply all filters to transactions
  const filteredTransactions = useMemo(() => {
    const dateLimit = getDateFilterBoundary();
    
    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      // Date filter
      if (transactionDate < dateLimit) return false;
      
      // Category filter
      if (categoryFilter !== "all" && transaction.category !== categoryFilter) return false;
      
      // Payment method filter
      if (paymentMethodFilter !== "all" && transaction.payment_method !== paymentMethodFilter) return false;
      
      // Transaction type filter
      if (transactionTypeFilter === "expense" && transaction.amount > 0) return false;
      if (transactionTypeFilter === "income" && transaction.amount < 0) return false;
      
      return true;
    });
  }, [allTransactions, timeFilter, categoryFilter, paymentMethodFilter, transactionTypeFilter]);

  // Create a separate filtered list for category breakdown that only applies time and payment method filters
  const categoryBreakdownTransactions = useMemo(() => {
    const dateLimit = getDateFilterBoundary();
    
    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      // Only apply date filter
      if (transactionDate < dateLimit) return false;
      
      // Only apply payment method filter
      if (paymentMethodFilter !== "all" && transaction.payment_method !== paymentMethodFilter) return false;
      
      // Only include expenses for category breakdown
      if (transaction.amount >= 0) return false;
      
      return true;
    });
  }, [allTransactions, timeFilter, paymentMethodFilter]);

  // Calculate stats based on filtered transactions
  const stats = useMemo(() => {
    let totalExpense = 0;
    let totalIncome = 0;
    const categoryTotals = {};
    
    filteredTransactions.forEach(transaction => {
      if (transaction.amount < 0) {
        totalExpense += Math.abs(transaction.amount);
        
        // Track spending by category
        if (transaction.category) {
          if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
          }
          categoryTotals[transaction.category] += Math.abs(transaction.amount);
        }
      } else {
        totalIncome += transaction.amount;
      }
    });
    
    // Convert category totals to array and sort
    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return {
      totalExpense,
      totalIncome,
      netBalance: totalIncome - totalExpense,
      categoryBreakdown
    };
  }, [filteredTransactions]);

  // Calculate category stats independently based on category breakdown transactions
  const categoryStats = useMemo(() => {
    let totalExpense = 0;
    const categoryTotals = {};
    
    categoryBreakdownTransactions.forEach(transaction => {
      if (transaction.amount < 0) {
        const expenseAmount = Math.abs(transaction.amount);
        totalExpense += expenseAmount;
        
        // Track spending by category
        if (transaction.category) {
          if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
          }
          categoryTotals[transaction.category] += expenseAmount;
        }
      }
    });
    
    // Convert category totals to array and sort
    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
    
    return {
      totalExpense,
      categoryBreakdown
    };
  }, [categoryBreakdownTransactions]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get color for category
  const getCategoryColor = (category) => {
    // Simple hash function for consistent colors
    const stringToColor = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Choose from a list of nice colors
      const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
        'bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
      ];
      
      return colors[Math.abs(hash) % colors.length];
    };
    
    return stringToColor(category);
  };

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  return (
    <div className="w-full px-4 py-8">
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg flex items-center">
          <span className="mr-2">⚠️</span>
          {error}
          <button 
            className="ml-auto text-sm text-red-500 hover:text-red-700"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Header with filters */}
      <div className="flex flex-col lg:flex-row xl:flex-row items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage your spending</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {isLoading && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <RefreshCw className="h-4 w-4 animate-spin" /> Loading...
            </div>
          )}

          {/* Time Filter Dropdown */}
          <div className="relative" data-dropdown="time-filter">
            <Button 
              variant="outline" 
              onClick={() => setTimeFilterDropdownOpen(!timeFilterDropdownOpen)}
              className="flex gap-2"
            >
              <Clock className="h-4 w-4" />
              {timeFilterOptions.find(option => option.value === timeFilter)?.label || "Time Period"}
              <ChevronDown className={`h-4 w-4 transition-transform ${timeFilterDropdownOpen ? 'transform rotate-180' : ''}`} />
            </Button>
            
            {timeFilterDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 overflow-hidden border border-gray-200 dark:border-gray-700 z-50">
                {timeFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${
                      timeFilter === option.value
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                        : "text-gray-900 dark:text-gray-300"
                    } cursor-pointer select-none relative w-full py-2 pl-3 pr-9 text-left hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeFilter(option.value);
                      setTimeFilterDropdownOpen(false);
                    }}
                  >
                    {option.label}
                    {timeFilter === option.value && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative" data-dropdown="category">
            <Button 
              variant="outline" 
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex gap-2"
            >
              <PieChart className="h-4 w-4" />
              {categoryFilter === "all" ? "All Categories" : categoryFilter}
              <ChevronDown className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? 'transform rotate-180' : ''}`} />
            </Button>
            
            {categoryDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto rounded-md py-1 border border-gray-200 dark:border-gray-700 z-50">
                <button
                  type="button"
                  className={`${
                    categoryFilter === "all"
                      ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                      : "text-gray-900 dark:text-gray-300"
                  } cursor-pointer select-none relative w-full py-2 pl-3 pr-9 text-left hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryFilter("all");
                    setCategoryDropdownOpen(false);
                  }}
                >
                  All Categories
                  {categoryFilter === "all" && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
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
                      categoryFilter === category
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                        : "text-gray-900 dark:text-gray-300"
                    } cursor-pointer select-none relative w-full py-2 pl-3 pr-9 text-left hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategoryFilter(category);
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    {category}
                    {categoryFilter === category && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Filter */}
          <div className="relative" data-dropdown="payment-method">
            <Button 
              variant="outline" 
              onClick={() => setPaymentMethodDropdownOpen(!paymentMethodDropdownOpen)}
              className="flex gap-2"
            >
              <Wallet className="h-4 w-4" />
              {paymentMethodFilter === "all" ? "All Payment Methods" : paymentMethodFilter}
              <ChevronDown className={`h-4 w-4 transition-transform ${paymentMethodDropdownOpen ? 'transform rotate-180' : ''}`} />
            </Button>
            
            {paymentMethodDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto rounded-md py-1 border border-gray-200 dark:border-gray-700 z-50">
                <button
                  type="button"
                  className={`${
                    paymentMethodFilter === "all"
                      ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                      : "text-gray-900 dark:text-gray-300"
                  } cursor-pointer select-none relative w-full py-2 pl-3 pr-9 text-left hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaymentMethodFilter("all");
                    setPaymentMethodDropdownOpen(false);
                  }}
                >
                  All Payment Methods
                  {paymentMethodFilter === "all" && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
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
                      paymentMethodFilter === method
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                        : "text-gray-900 dark:text-gray-300"
                    } cursor-pointer select-none relative w-full py-2 pl-3 pr-9 text-left hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPaymentMethodFilter(method);
                      setPaymentMethodDropdownOpen(false);
                    }}
                  >
                    {method}
                    {paymentMethodFilter === method && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Transaction Type Filter */}
          <div className="relative" data-dropdown="type-filter">
            <Button 
              variant="outline" 
              onClick={() => setTypeFilterDropdownOpen(!typeFilterDropdownOpen)}
              className="flex gap-2"
            >
              <Filter className="h-4 w-4" />
              {transactionTypeFilter === "all" ? "All Transactions" : 
               transactionTypeFilter === "expense" ? "Expenses Only" : 
               "Income Only"}
              <ChevronDown className={`h-4 w-4 transition-transform ${typeFilterDropdownOpen ? 'transform rotate-180' : ''}`} />
            </Button>
            
            {typeFilterDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 border border-gray-200 dark:border-gray-700 z-50">
                {[
                  { value: "all", label: "All Transactions" },
                  { value: "expense", label: "Expenses Only" },
                  { value: "income", label: "Income Only" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`${
                      transactionTypeFilter === option.value
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                        : "text-gray-900 dark:text-gray-300"
                    } cursor-pointer select-none relative w-full py-2 pl-3 pr-9 text-left hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTransactionTypeFilter(option.value);
                      setTypeFilterDropdownOpen(false);
                    }}
                  >
                    {option.label}
                    {transactionTypeFilter === option.value && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button 
            variant="ghost"
            size="icon"
            onClick={fetchTransactions}
            disabled={isLoading}
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalExpense)}</div>
            <p className="text-xs text-muted-foreground">For selected time period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 2v5h5" />
              <path d="M21 6v6a9 9 0 1 1-18 0V4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(stats.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">For selected time period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(stats.netBalance)}
            </div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <p className="text-xs text-muted-foreground">Total transactions in period</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Expense Overview</CardTitle>
            <CardDescription>
              Showing data for {timeFilterOptions.find(option => option.value === timeFilter)?.label || timeFilter}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredTransactions.length > 0 ? (
              <ExpenseChart transactions={filteredTransactions} />
            ) : (
              <div className="flex justify-center items-center h-[300px] border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No data available for the selected time period</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Your spending by category for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : categoryStats.categoryBreakdown.length > 0 ? (
              <div className="space-y-4">
                {categoryStats.categoryBreakdown.map((category) => (
                  <div key={category.name} className="flex items-center">
                    <div 
                      className={`h-2 rounded-lg mr-2 ${getCategoryColor(category.name)}`}
                      style={{ width: `${Math.max(category.percentage, 5)}%` }} 
                    />
                    <div className="flex justify-between items-center w-full">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-gray-500">{category.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No category data available for this period
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="flex flex-col w-full gap-4 md:flex-col lg:flex-row mt-6">
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown by category or payment method</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <PieChartComponent transactions={filteredTransactions} />
            )}
          </CardContent>
        </Card>
        
        <Card className=" w-full lg:w-1/2 md:col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Spending Patterns</CardTitle>
            <CardDescription>When you spend the most</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <TimePatternChart transactions={filteredTransactions} />
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions Table */}
      <Card className="mt-6">
        <CardHeader className="flex flex-col lg:flex-row xl:flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transactions found for selected filters
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {currentTransactions.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.amount < 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {transaction.category ? transaction.category.charAt(0).toUpperCase() : 'T'}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description || "Transaction"}</p>
                            <div className="flex gap-2 text-sm text-gray-500">
                              {transaction.category && (
                                <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                              )}
                              {transaction.payment_method && (
                                <Badge variant="secondary" className="text-xs">{transaction.payment_method}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No transactions found for the selected filters.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="text-xs text-muted-foreground">
              Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1 || isLoading}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={indexOfLastTransaction >= filteredTransactions.length || isLoading}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <span className="sr-only">Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
