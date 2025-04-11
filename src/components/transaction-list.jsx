"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Search } from "lucide-react"

import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

const transactions = [
  {
    id: "1",
    date: "2023-06-20",
    description: "Grocery Store",
    category: "Food & Dining",
    amount: -120.56,
    account: "Credit Card",
  },
  {
    id: "2",
    date: "2023-06-19",
    description: "Gas Station",
    category: "Transportation",
    amount: -45.23,
    account: "Credit Card",
  },
  {
    id: "3",
    date: "2023-06-18",
    description: "Restaurant",
    category: "Food & Dining",
    amount: -85.43,
    account: "Credit Card",
  },
  {
    id: "4",
    date: "2023-06-15",
    description: "Online Shopping",
    category: "Shopping",
    amount: -156.78,
    account: "Credit Card",
  },
  {
    id: "5",
    date: "2023-06-15",
    description: "Utility Bill",
    category: "Housing",
    amount: -98.45,
    account: "Checking Account",
  },
  {
    id: "6",
    date: "2023-06-14",
    description: "Movie Tickets",
    category: "Entertainment",
    amount: -32.5,
    account: "Credit Card",
  },
  {
    id: "7",
    date: "2023-06-10",
    description: "Paycheck",
    category: "Income",
    amount: 2500.0,
    account: "Checking Account",
  },
  {
    id: "8",
    date: "2023-06-08",
    description: "Coffee Shop",
    category: "Food & Dining",
    amount: -4.75,
    account: "Credit Card",
  },
  {
    id: "9",
    date: "2023-06-05",
    description: "Pharmacy",
    category: "Healthcare",
    amount: -28.99,
    account: "Credit Card",
  },
  {
    id: "10",
    date: "2023-06-01",
    description: "Rent Payment",
    category: "Housing",
    amount: -1200.0,
    account: "Checking Account",
  },
]

export function TransactionList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search transactions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Account</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end ${transaction.amount > 0 ? "text-green-600" : ""}`}>
                    {transaction.amount > 0 ? (
                      <ArrowUp className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="mr-1 h-4 w-4" />
                    )}
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>{transaction.account}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
