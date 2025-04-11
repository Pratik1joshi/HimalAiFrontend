"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Home,
  PieChart,
  Upload,
  LogOut,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { ExpenseChart } from "../components/expense-chart"
import { TransactionList } from "../components/transaction-list"

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("This Month")
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link className="lg:hidden" to="/">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Link>
        <div className="w-full flex justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link className="flex items-center gap-2" to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link className="flex items-center gap-2 text-primary" to="/dashboard">
              <PieChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link className="flex items-center gap-2" to="/upload">
              <Upload className="h-4 w-4" />
              Upload
            </Link>
            <Link className="flex items-center gap-2" to="/analytics">
              <PieChart className="h-4 w-4" />
              Analytics
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
            <p className="text-gray-500 dark:text-gray-400">Track and manage your spending</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto flex gap-2">
                <Calendar className="h-4 w-4" />
                {dateRange}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDateRange("Today")}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("This Week")}>This Week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("This Month")}>This Month</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("Last 3 Months")}>Last 3 Months</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("This Year")}>This Year</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("Custom Range")}>Custom Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
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
              <div className="text-2xl font-bold">$2,850.32</div>
              <p className="text-xs text-muted-foreground">+4.3% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Food & Dining</CardTitle>
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
              <div className="text-2xl font-bold">$682.50</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transportation</CardTitle>
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
              <div className="text-2xl font-bold">$345.25</div>
              <p className="text-xs text-muted-foreground">-1.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shopping</CardTitle>
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
              <div className="text-2xl font-bold">$512.75</div>
              <p className="text-xs text-muted-foreground">+7.2% from last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Expense Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ExpenseChart />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Your spending by category for {dateRange.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-primary rounded-lg mr-2" />
                  <div className="flex justify-between items-center w-full">
                    <div className="font-medium">Food & Dining</div>
                    <div className="text-gray-500">24%</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-2 bg-blue-500 rounded-lg mr-2" />
                  <div className="flex justify-between items-center w-full">
                    <div className="font-medium">Transportation</div>
                    <div className="text-gray-500">12%</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-14 h-2 bg-green-500 rounded-lg mr-2" />
                  <div className="flex justify-between items-center w-full">
                    <div className="font-medium">Shopping</div>
                    <div className="text-gray-500">18%</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-2 bg-yellow-500 rounded-lg mr-2" />
                  <div className="flex justify-between items-center w-full">
                    <div className="font-medium">Housing</div>
                    <div className="text-gray-500">30%</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-2 bg-purple-500 rounded-lg mr-2" />
                  <div className="flex justify-between items-center w-full">
                    <div className="font-medium">Entertainment</div>
                    <div className="text-gray-500">8%</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-2 bg-red-500 rounded-lg mr-2" />
                  <div className="flex justify-between items-center w-full">
                    <div className="font-medium">Other</div>
                    <div className="text-gray-500">8%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>You have 25 transactions this month.</CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionList />
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="text-xs text-muted-foreground">Showing 10 of 25 transactions</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button variant="outline" size="sm">
                <span className="sr-only">Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
