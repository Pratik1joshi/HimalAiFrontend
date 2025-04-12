"use client"

import { useState } from "react"
import { FileText } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Upload Statements</h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Import your financial data</p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger 
            value="upload" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md text-sm"
          >
            Upload Statement
          </TabsTrigger>
          <TabsTrigger 
            value="manual" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md text-sm"
          >
            Manual Entry
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Financial Statement</CardTitle>
                <CardDescription>
                  Upload your bank or wallet statement to automatically import transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="account-type">Account Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Account Types</SelectLabel>
                          <SelectItem value="bank">Bank Account</SelectItem>
                          <SelectItem value="credit">Credit Card</SelectItem>
                          <SelectItem value="wallet">Digital Wallet</SelectItem>
                          <SelectItem value="investment">Investment Account</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="institution">Financial Institution</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select institution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Popular Banks</SelectLabel>
                          <SelectItem value="chase">Chase</SelectItem>
                          <SelectItem value="bofa">Bank of America</SelectItem>
                          <SelectItem value="wells">Wells Fargo</SelectItem>
                          <SelectItem value="citi">Citibank</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="file-upload">Statement File</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".csv,.pdf,.xlsx,.xls"
                        onChange={handleFileChange}
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-10 w-10 text-gray-400" />
                          <div className="text-sm font-medium">
                            {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                          </div>
                          <div className="text-xs text-gray-500">Supports CSV, PDF, and Excel files (max 10MB)</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                  {isUploading ? `Uploading ${uploadProgress}%` : "Upload Statement"}
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Supported Formats</CardTitle>
                <CardDescription>
                  We support various statement formats from major financial institutions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium">Bank Statements</h3>
                    <ul className="mt-2 text-sm text-gray-500 space-y-1">
                      <li>• CSV exports from online banking</li>
                      <li>• PDF bank statements (most major banks)</li>
                      <li>• Excel/spreadsheet downloads</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium">Credit Card Statements</h3>
                    <ul className="mt-2 text-sm text-gray-500 space-y-1">
                      <li>• Monthly statement PDFs</li>
                      <li>• Transaction history exports</li>
                      <li>• Activity downloads (CSV/Excel)</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium">Digital Wallets</h3>
                    <ul className="mt-2 text-sm text-gray-500 space-y-1">
                      <li>• PayPal transaction history</li>
                      <li>• Venmo statement exports</li>
                      <li>• Cash App activity reports</li>
                    </ul>
                  </div>
                  <div className="text-sm text-gray-500 mt-4">
                    Don't see your format? Contact us for support or use the manual entry option.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="manual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Transaction Entry</CardTitle>
              <CardDescription>Add transactions manually to your expense tracker.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="transaction-date">Date</Label>
                    <Input type="date" id="transaction-date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="transaction-amount">Amount</Label>
                    <Input type="number" id="transaction-amount" placeholder="0.00" step="0.01" min="0" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction-description">Description</Label>
                  <Input id="transaction-description" placeholder="Transaction description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction-category">Category</Label>
                  <Select>
                    <SelectTrigger id="transaction-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="housing">Housing</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction-account">Account</Label>
                  <Select>
                    <SelectTrigger id="transaction-account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Accounts</SelectLabel>
                        <SelectItem value="checking">Checking Account</SelectItem>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction-notes">Notes (Optional)</Label>
                  <Input id="transaction-notes" placeholder="Additional notes" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Add Transaction</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
