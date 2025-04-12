"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Calendar, ChevronDown, Download, Home, PieChart, Upload, LogOut } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { MonthlyExpenseChart } from "../components/monthly-expense-chart"
import { CategoryComparisonChart } from "../components/category-comparison-chart"
import { SpendingTrendsChart } from "../components/spending-trends-chart"
import { FinancialAdvice } from "../components/financial-advice"

export default function Analytics() {
  const [dateRange, setDateRange] = useState("Last 6 Months")
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen w-[full] flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col lg:flex-row xl:flex-row items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Financial Analytics</h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Insights from your spending patterns</p>
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
              <DropdownMenuItem onClick={() => setDateRange("Last 3 Months")}>Last 3 Months</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("Last 6 Months")}>Last 6 Months</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("This Year")}>This Year</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("Last Year")}>Last Year</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("All Time")}>All Time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md text-sm"
            >
              Spending Trends
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md text-sm"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md text-sm"
            >
              Insights
            </TabsTrigger>
          </TabsList>
          <TabsContent value="trends" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Expense Trends</CardTitle>
                  <CardDescription>Your spending patterns over {dateRange.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <MonthlyExpenseChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Spending Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of your spending trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <div className="text-sm font-medium text-gray-500">Average Monthly Spending</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <div className="text-3xl font-bold">$2,345</div>
                        <div className="text-sm text-green-500">↓ 5.2%</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Compared to previous period</div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm font-medium text-gray-500">Highest Spending Month</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <div className="text-3xl font-bold">December</div>
                        <div className="text-sm text-red-500">$3,120</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">33% higher than average</div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm font-medium text-gray-500">Lowest Spending Month</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <div className="text-3xl font-bold">February</div>
                        <div className="text-sm text-green-500">$1,845</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">21% lower than average</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="categories" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Category Comparison</CardTitle>
                  <CardDescription>How your spending is distributed across categories</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <CategoryComparisonChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                  <CardDescription>Your highest spending categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary" />
                        <div className="font-medium">Housing</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$1,250</div>
                        <div className="text-xs text-gray-500">30% of total</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500" />
                        <div className="font-medium">Food & Dining</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$682</div>
                        <div className="text-xs text-gray-500">24% of total</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                        <div className="font-medium">Shopping</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$512</div>
                        <div className="text-xs text-gray-500">18% of total</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-yellow-500" />
                        <div className="font-medium">Transportation</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$345</div>
                        <div className="text-xs text-gray-500">12% of total</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-purple-500" />
                        <div className="font-medium">Entertainment</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$228</div>
                        <div className="text-xs text-gray-500">8% of total</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Category Growth</CardTitle>
                  <CardDescription>Changes in spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">Shopping</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-red-500">+12.5%</div>
                        <div className="text-xs text-gray-500">vs last period</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">Food & Dining</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-red-500">+8.2%</div>
                        <div className="text-xs text-gray-500">vs last period</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">Transportation</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-green-500">-5.3%</div>
                        <div className="text-xs text-gray-500">vs last period</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">Entertainment</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-red-500">+15.7%</div>
                        <div className="text-xs text-gray-500">vs last period</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">Housing</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-500">+0.0%</div>
                        <div className="text-xs text-gray-500">vs last period</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="insights" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Spending Trends Over Time</CardTitle>
                  <CardDescription>How your spending has evolved over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <SpendingTrendsChart />
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Financial Insights</CardTitle>
                  <CardDescription>Personalized advice based on your spending patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <FinancialAdvice />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Savings Opportunities</CardTitle>
                  <CardDescription>Areas where you could potentially save money</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="font-medium">Food & Dining</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Your restaurant spending is 35% higher than similar users. Consider cooking at home more often
                        to save approximately $120/month.
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="font-medium">Subscription Services</div>
                      <div className="text-sm text-gray-500 mt-1">
                        You're spending $65/month on unused or rarely used subscriptions. Review your subscriptions to
                        identify potential savings.
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="font-medium">Transportation</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Using public transportation twice a week instead of rideshares could save you approximately
                        $85/month.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Budget Recommendations</CardTitle>
                  <CardDescription>Suggested budget allocations based on your income</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Housing</div>
                      <div className="text-sm">
                        <span className="font-medium">30%</span>
                        <span className="text-gray-500"> of income</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 w-[30%] rounded-full bg-yellow-500" />
                    </div>
                    <div className="text-xs text-gray-500">Your current spending: 25.5% (within recommended range)</div>

                    <div className="flex items-center justify-between">
                      <div className="font-medium">Food</div>
                      <div className="text-sm">
                        <span className="font-medium">15%</span>
                        <span className="text-gray-500"> of income</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 w-[15%] rounded-full bg-red-500" />
                    </div>
                    <div className="text-xs text-gray-500">Your current spending: 18% (over budget)</div>

                    <div className="flex items-center justify-between">
                      <div className="font-medium">Savings</div>
                      <div className="text-sm">
                        <span className="font-medium">20%</span>
                        <span className="text-gray-500"> of income</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 w-[20%] rounded-full bg-red-500" />
                    </div>
                    <div className="text-xs text-gray-500">Your current saving: 12% (below target)</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
