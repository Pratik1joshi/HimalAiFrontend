"use client"

import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col">
      <section className="w-full py-8 md:py-8 lg:py-8 xl:py-8">
        <div className="px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none">
                  Take Control of Your Finances
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload your financial statements, track expenses, and get personalized insights to make better
                  financial decisions.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link to={user ? "/dashboard" : "/login"}>
                  <Button variant="outline" size="lg">
                    {user ? "View Dashboard" : "Login"}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Finance Dashboard"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                src="http://www.w3.org/placeholder.svg?height=550&width=800"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Everything you need to manage your personal finances in one place.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Easy Statement Upload</h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Upload bank and wallet statements with automatic transaction categorization.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Expense Tracking</h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                View and filter expenses by category, date, and account to understand your spending habits.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 2v20M2 5h20M2 19h20" />
                  <path d="m5 12 5-3 5 6 5-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Smart Analytics</h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Get insights with interactive charts and personalized financial advice.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full border-t bg-background">
        <div className="flex flex-col gap-2 sm:flex-row py-6 px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 FinTrack. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" to="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
