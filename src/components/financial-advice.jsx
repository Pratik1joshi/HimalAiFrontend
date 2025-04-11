import { AlertCircle, ArrowRight, DollarSign, LineChart, TrendingDown, TrendingUp } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

export function FinancialAdvice() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Spending Alert</AlertTitle>
        <AlertDescription>
          Your restaurant spending is 35% higher than last month. Consider setting a budget for dining out.
        </AlertDescription>
      </Alert>
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Positive Trend</AlertTitle>
        <AlertDescription>
          Your transportation costs have decreased by 15% over the last 3 months. Keep up the good work!
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Budget Recommendation</CardTitle>
          <CardDescription>Based on your income and spending patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            Consider using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            <span>Create Budget</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Savings Opportunity</CardTitle>
          <CardDescription>Potential monthly savings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <div className="text-2xl font-bold">$325</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            You could save approximately $325/month by reducing spending in the highlighted categories.
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            <span>View Details</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Financial Health Score</CardTitle>
          <CardDescription>Based on your spending, saving, and debt patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">Your Score</div>
              <div className="flex items-center">
                <div className="text-2xl font-bold">72</div>
                <div className="ml-2 text-sm text-gray-500">/ 100</div>
              </div>
              <div className="text-xs text-gray-500">Good</div>
            </div>
            <div className="h-20 w-20 rounded-full border-8 border-primary/30 border-t-primary" />
          </div>
          <div className="mt-4 grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Strengths</div>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    Regular income
                  </li>
                  <li className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    Low debt-to-income ratio
                  </li>
                </ul>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Areas to Improve</div>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    Increase emergency savings
                  </li>
                  <li className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    Reduce discretionary spending
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            <LineChart className="mr-2 h-4 w-4" />
            <span>View Detailed Analysis</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
