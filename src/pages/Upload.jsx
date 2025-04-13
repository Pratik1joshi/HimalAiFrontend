"use client"

import { useState, useEffect } from "react"
import { FileText, CheckCircle, AlertCircle } from "lucide-react"
import axios from "axios"
import { useToast } from "../components/ui/use-toast"
import { useAuth } from "../contexts/AuthContext"

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
  const { toast } = useToast()
  const { currentUser } = useAuth()

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null) // 'success', 'error', or null
  const [uploadResult, setUploadResult] = useState(null) // To store transaction processing results

  // Manual transaction entry state
  const [manualTransaction, setManualTransaction] = useState({
    date: "",
    amount: "",
    description: "",
    category: "",
    account: "",
    notes: ""
  })

  // Control dropdown visibility states
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select a file smaller than 10MB",
        })
        return
      }
      setSelectedFile(file)
      setUploadStatus(null) // Reset status on new file selection
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus(null)
    setUploadResult(null)

    // Create form data to send file and user_id as required by the API
    const formData = new FormData()
    formData.append('file', selectedFile)

    // Get user ID from auth context or local storage
    const userId = currentUser?.id || JSON.parse(localStorage.getItem('user'))?.id

    if (!userId) {
      setUploadStatus('error')
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Could not verify your account. Please try logging in again.",
      })
      setIsUploading(false)
      return
    }

    // Add user_id as Form parameter, matching the FastAPI endpoint
    formData.append('user_id', userId)

    try {
      // Use the exact endpoint URL as defined in the backend
      const response = await axios.post(
        'http://localhost:8000/api/v1/files/upload', // Exact path from the backend endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          onUploadProgress: (progressEvent) => {
            // Calculate and update progress percentage
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setUploadProgress(percentCompleted)
          }
        }
      )

      // Handle successful response based on the backend format
      console.log("Upload successful:", response.data)
      setUploadStatus('success')
      setUploadResult(response.data)

      // Show success toast with transaction details
      toast({
        title: "Upload Successful",
        description: `${selectedFile.name} has been processed. ${response.data.count || 0} transactions were imported.`,
        variant: "success",
      })

      // Reset file after successful upload
      setTimeout(() => {
        setSelectedFile(null)
      }, 3000)

    } catch (error) {
      console.error("Upload failed:", error)
      setUploadStatus('error')

      // Get error message from response if available
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.message ||
        "There was a problem processing your file. Please ensure it's in the correct format."

      // Show error toast
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Update manual transaction form field
  const updateTransactionField = (field, value) => {
    setManualTransaction(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle manual transaction submission
  const handleAddTransaction = () => {
    console.log("Transaction to add:", manualTransaction)
    // Here you would send the data to your backend API

    // Reset form after submission
    setManualTransaction({
      date: "",
      amount: "",
      description: "",
      category: "",
      account: "",
      notes: ""
    })
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close category dropdown if click is outside
      if (categoryDropdownOpen &&
        !event.target.closest('[data-dropdown="category"]')) {
        setCategoryDropdownOpen(false)
      }

      // Close account dropdown if click is outside
      if (accountDropdownOpen &&
        !event.target.closest('[data-dropdown="account"]')) {
        setAccountDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [categoryDropdownOpen, accountDropdownOpen])

  // Status message display
  const renderUploadSuccess = () => {
    if (!uploadStatus === 'success' || !uploadResult) return null;
    
    return (
      <div className="text-sm text-green-600 dark:text-green-400">
        <p className="font-medium">File uploaded and processed successfully!</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Imported {uploadResult.count || 0} transactions</li>
          {uploadResult.success && (
            <li>Processing completed successfully</li>
          )}
          {uploadResult.source && (
            <li>Source identified as: {uploadResult.source}</li>
          )}
        </ul>
      </div>
    );
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
                    <Label htmlFor="file-upload">Statement File</Label>
                    <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative ${
                      uploadStatus === 'success' ? 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border-green-300' :
                        uploadStatus === 'error' ? 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border-red-300' :
                          ''
                    }`}>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".csv,.pdf,.xlsx,.xls"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center gap-2">
                        <div className="flex flex-col items-center gap-2">
                          {uploadStatus === 'success' ? (
                            <CheckCircle className="h-10 w-10 text-green-500" />
                          ) : uploadStatus === 'error' ? (
                            <AlertCircle className="h-10 w-10 text-red-500" />
                          ) : (
                            <FileText className="h-10 w-10 text-gray-400" />
                          )}

                          <div className="text-sm font-medium text-center">
                            {selectedFile
                              ? selectedFile.name
                              : "Click to upload or drag and drop"}
                          </div>
                          <div className="text-xs text-gray-500 text-center">
                            Supports CSV, PDF, and Excel files (max 10MB)
                          </div>
                        </div>
                      </Label>

                      {/* Upload progress bar */}
                      {isUploading && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Status message */}
                    {uploadStatus === 'success' && renderUploadSuccess()}
                    {uploadStatus === 'error' && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        There was a problem uploading or processing your file. Please try again.
                      </p>
                    )}
                  </div>

                  {/* File requirements info */}
                  <div className="text-xs text-gray-500 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h4 className="font-medium mb-1">Supported file formats:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>CSV files from major banks and financial institutions</li>
                      <li>Excel spreadsheets (.xlsx, .xls) with transaction data</li>
                      <li>PDF bank statements (experimental support)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null)
                    setUploadStatus(null)
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="relative"
                >
                  {isUploading ? (
                    <>
                      <span className="mr-2">Uploading</span>
                      <span>{uploadProgress}%</span>
                    </>
                  ) : "Upload Statement"}

                  {isUploading && (
                    <span className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  )}
                </Button>
              </CardFooter>
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
                    <Input
                      type="date"
                      id="transaction-date"
                      value={manualTransaction.date}
                      onChange={(e) => updateTransactionField('date', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="transaction-amount">Amount</Label>
                    <Input
                      type="number"
                      id="transaction-amount"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={manualTransaction.amount}
                      onChange={(e) => updateTransactionField('amount', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transaction-description">Description</Label>
                  <Input
                    id="transaction-description"
                    placeholder="Transaction description"
                    value={manualTransaction.description}
                    onChange={(e) => updateTransactionField('description', e.target.value)}
                  />
                </div>

                {/* Fixed Category Dropdown */}
                <div className="grid gap-2">
                  <Label htmlFor="transaction-category">Category</Label>
                  <div className="relative" data-dropdown="category">
                    <button
                      type="button"
                      id="transaction-category"
                      className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    >
                      <span className={manualTransaction.category ? "" : "text-gray-500"}>
                        {manualTransaction.category
                          ? {
                            "food": "Food & Dining",
                            "transportation": "Transportation",
                            "shopping": "Shopping",
                            "housing": "Housing",
                            "entertainment": "Entertainment",
                            "utilities": "Utilities",
                            "healthcare": "Healthcare",
                            "other": "Other"
                          }[manualTransaction.category] || "Select category"
                          : "Select category"}
                      </span>
                      <svg className={`h-5 w-5 transition-transform ${categoryDropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {categoryDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 overflow-auto border border-gray-200 dark:border-gray-700">
                        {[
                          { value: "food", label: "Food & Dining" },
                          { value: "transportation", label: "Transportation" },
                          { value: "shopping", label: "Shopping" },
                          { value: "housing", label: "Housing" },
                          { value: "entertainment", label: "Entertainment" },
                          { value: "utilities", label: "Utilities" },
                          { value: "healthcare", label: "Healthcare" },
                          { value: "other", label: "Other" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={`${
                              manualTransaction.category === option.value
                                ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                                : "text-gray-900 dark:text-gray-300"
                            } cursor-pointer select-none relative w-full py-2 pl-3 pr-9 text-left hover:bg-gray-100 dark:hover:bg-gray-700`}
                            onClick={(e) => {
                              e.stopPropagation() // Prevent event bubbling
                              updateTransactionField('category', option.value)
                              setCategoryDropdownOpen(false)
                            }}
                          >
                            {option.label}
                            {manualTransaction.category === option.value && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 010 1.414l-8 8a1 1 01-1.414 0l-4-4a1 1 01-1.414-1.414L8 12.586l7.293-7.293a1 1 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Fixed Account Dropdown */}
                <div className="grid gap-2">
                  <Label htmlFor="transaction-account">Account</Label>
                  <div className="relative" data-dropdown="account">
                    <button
                      type="button"
                      id="transaction-account"
                      className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    >
                      <span className={manualTransaction.account ? "" : "text-gray-500"}>
                        {manualTransaction.account
                          ? {
                            "checking": "Checking Account",
                            "savings": "Savings Account",
                            "credit": "Credit Card",
                            "cash": "Cash",
                            "other": "Other"
                          }[manualTransaction.account] || "Select account"
                          : "Select account"}
                      </span>
                      <svg className={`h-5 w-5 transition-transform ${accountDropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {accountDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 overflow-auto border border-gray-200 dark:border-gray-700">
                        {[
                          { value: "checking", label: "Checking Account" },
                          { value: "savings", label: "Savings Account" },
                          { value: "credit", label: "Credit Card" },
                          { value: "cash", label: "Cash" },
                          { value: "other", label: "Other" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={`${
                              manualTransaction.account === option.value
                                ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-300"
                                : "text-gray-900 dark:text-gray-300"
                            } cursor-pointer select-none relative w-full py-2 pl-3 pr-9 text-left hover:bg-gray-100 dark:hover:bg-gray-700`}
                            onClick={(e) => {
                              e.stopPropagation() // Prevent event bubbling
                              updateTransactionField('account', option.value)
                              setAccountDropdownOpen(false)
                            }}
                          >
                            {option.label}
                            {manualTransaction.account === option.value && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 010 1.414l-8 8a1 1 01-1.414 0l-4-4a1 1 01-1.414-1.414L8 12.586l7.293-7.293a1 1 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="transaction-notes">Notes (Optional)</Label>
                  <Input
                    id="transaction-notes"
                    placeholder="Additional notes"
                    value={manualTransaction.notes}
                    onChange={(e) => updateTransactionField('notes', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setManualTransaction({
                  date: "",
                  amount: "",
                  description: "",
                  category: "",
                  account: "",
                  notes: ""
                })}
              >
                Clear
              </Button>
              <Button
                onClick={handleAddTransaction}
                disabled={!manualTransaction.date || !manualTransaction.amount || !manualTransaction.description}
              >
                Add Transaction
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
