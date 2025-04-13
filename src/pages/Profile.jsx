"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { 
  User, 
  Award, 
  Gift, 
  Clock, 
  Upload as UploadIcon, 
  FileText, 
  CreditCard, 
  Coffee, 
  ShoppingBag, 
  Gift as GiftIcon 
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

export default function Profile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in a real app, this would come from your API
  const profileData = {
    firstName: currentUser?.first_name || "User",
    lastName: currentUser?.last_name || "",
    email: currentUser?.email || "user@example.com",
    joinedDate: "January 2023",
    totalPoints: 750,
    pointsHistory: [
      { id: 1, date: "2023-04-10", points: 100, description: "Uploaded bank statement", type: "earned" },
      { id: 2, date: "2023-04-15", points: 50, description: "Uploaded credit card statement", type: "earned" },
      { id: 3, date: "2023-04-28", points: -200, description: "Redeemed $5 Amazon gift card", type: "redeemed" },
      { id: 4, date: "2023-05-05", points: 100, description: "Uploaded bank statement", type: "earned" },
      { id: 5, date: "2023-05-20", points: 200, description: "Uploaded 3 months of statements", type: "earned" },
      { id: 6, date: "2023-06-01", points: 500, description: "Early adopter bonus", type: "earned" },
    ],
    uploadStats: {
      totalUploads: 14,
      thisMonth: 2,
      categorizedTransactions: 356,
      documentTypes: [
        { type: "Bank Statement", count: 8 },
        { type: "Credit Card", count: 5 },
        { type: "Digital Wallet", count: 1 }
      ]
    },
    rewards: [
      { id: 1, name: "$5 Amazon Gift Card", points: 500, image: "/rewards/amazon.png" },
      { id: 2, name: "$5 Starbucks Gift Card", points: 500, image: "/rewards/starbucks.png" },
      { id: 3, name: "$10 Target Gift Card", points: 900, image: "/rewards/target.png" },
      { id: 4, name: "1-Month Premium Upgrade", points: 1200, image: "/rewards/premium.png" },
    ]
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="w-full px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={currentUser?.profilePicture} />
          <AvatarFallback className="bg-blue-600 text-white text-xl">
            {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{profileData.firstName} {profileData.lastName}</h1>
            <Badge variant="outline" className="w-fit">Member since {profileData.joinedDate}</Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400">{profileData.email}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
          <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold">{profileData.totalPoints}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">points</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="points" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md text-sm"
          >
            Points & Rewards
          </TabsTrigger>
          <TabsTrigger 
            value="uploads" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md text-sm"
          >
            Upload History
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-gray-500">First Name</span>
                  <span className="text-sm font-medium col-span-2">{profileData.firstName}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-gray-500">Last Name</span>
                  <span className="text-sm font-medium col-span-2">{profileData.lastName}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium col-span-2">{profileData.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="text-sm font-medium col-span-2">{profileData.joinedDate}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">Edit Profile</Button>
              </CardFooter>
            </Card>
            
            {/* Points Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Points Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold">{profileData.totalPoints}</div>
                  <div className="text-sm text-gray-500">Total Available Points</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold">{
                      profileData.pointsHistory
                        .filter(p => p.type === "earned")
                        .reduce((sum, p) => sum + p.points, 0)
                    }</div>
                    <div className="text-xs text-gray-500">Earned</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold">{
                      Math.abs(profileData.pointsHistory
                        .filter(p => p.type === "redeemed")
                        .reduce((sum, p) => sum + p.points, 0))
                    }</div>
                    <div className="text-xs text-gray-500">Redeemed</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="default" size="sm" className="w-full" onClick={() => setActiveTab("points")}>
                  View Rewards
                </Button>
              </CardFooter>
            </Card>
            
            {/* Upload Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadIcon className="h-5 w-5" />
                  Upload Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-gray-500">Total Uploads</span>
                  <span className="text-sm font-medium col-span-2">{profileData.uploadStats.totalUploads} statements</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-gray-500">This Month</span>
                  <span className="text-sm font-medium col-span-2">{profileData.uploadStats.thisMonth} statements</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-sm text-gray-500">Transactions</span>
                  <span className="text-sm font-medium col-span-2">{profileData.uploadStats.categorizedTransactions} categorized</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <span className="text-xs text-gray-500 block mb-2">Document Types</span>
                  <div className="flex flex-wrap gap-2">
                    {profileData.uploadStats.documentTypes.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="flex gap-1">
                        <span>{doc.type}</span>
                        <span className="text-xs">({doc.count})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("uploads")}>
                  View Upload History
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and point transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profileData.pointsHistory.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      activity.type === "earned" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {activity.type === "earned" ? 
                        <UploadIcon className="h-4 w-4" /> : 
                        <Gift className="h-4 w-4" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <time className="text-sm text-gray-500">{formatDate(activity.date)}</time>
                    </div>
                    <div className={`flex items-center font-semibold ${
                      activity.type === "earned" ? "text-green-600" : "text-blue-600"
                    }`}>
                      {activity.type === "earned" ? "+" : ""}{activity.points} points
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Points & Rewards Tab */}
        <TabsContent value="points" className="mt-6">
          <div className="grid gap-6">
            {/* Points Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Points Summary</CardTitle>
                <CardDescription>Your current points balance and history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl flex flex-col items-center">
                    <Award className="h-6 w-6 text-blue-600 mb-2" />
                    <div className="text-3xl font-bold">{profileData.totalPoints}</div>
                    <div className="text-sm text-gray-600">Available Points</div>
                  </div>
                  
                  <div className="flex-1 grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-between mb-2">
                          <div className="text-sm text-gray-500">Total Earned</div>
                          <UploadIcon className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          +{profileData.pointsHistory
                            .filter(p => p.type === "earned")
                            .reduce((sum, p) => sum + p.points, 0)}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-between mb-2">
                          <div className="text-sm text-gray-500">Total Redeemed</div>
                          <Gift className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          -{Math.abs(profileData.pointsHistory
                            .filter(p => p.type === "redeemed")
                            .reduce((sum, p) => sum + p.points, 0))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p>Upload new financial statements to earn more points!</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                        <li>Bank statement: <span className="font-medium">+100 points</span></li>
                        <li>Credit card statement: <span className="font-medium">+50 points</span></li>
                        <li>Multiple months in one upload: <span className="font-medium">+50 bonus points</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Available Rewards */}
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>Redeem your points for these rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {profileData.rewards.map(reward => (
                    <Card key={reward.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        {reward.id === 1 && <ShoppingBag className="h-10 w-10 text-[#FF9900]" />}
                        {reward.id === 2 && <Coffee className="h-10 w-10 text-[#00704A]" />}
                        {reward.id === 3 && <ShoppingBag className="h-10 w-10 text-[#CC0000]" />}
                        {reward.id === 4 && <Award className="h-10 w-10 text-[#7E57C2]" />}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{reward.name}</h3>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">{reward.points} points</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          variant={profileData.totalPoints >= reward.points ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          disabled={profileData.totalPoints < reward.points}
                        >
                          {profileData.totalPoints >= reward.points ? "Redeem" : "Not Enough Points"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Points History */}
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
                <CardDescription>All your point transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Transaction</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {profileData.pointsHistory.map(transaction => (
                        <tr key={transaction.id} className="border-b dark:border-gray-700">
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(transaction.date)}</td>
                          <td className="px-4 py-3">{transaction.description}</td>
                          <td className="px-4 py-3">
                            <Badge variant={transaction.type === "earned" ? "success" : "default"}>
                              {transaction.type === "earned" ? "Earned" : "Redeemed"}
                            </Badge>
                          </td>
                          <td className={`px-4 py-3 font-medium text-right ${
                            transaction.type === "earned" 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-blue-600 dark:text-blue-400"
                          }`}>
                            {transaction.type === "earned" ? "+" : ""}{transaction.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Upload History Tab */}
        <TabsContent value="uploads" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>All your uploaded financial statements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* This would be populated from your API with actual uploads */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
                  <FileText className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Upload History</h3>
                  <p className="text-gray-500 mb-4">
                    Your upload history will appear here. Upload a new statement to get started!
                  </p>
                  <Button>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Statement
                  </Button>
                </div>
                
                {/* Sample upload - this would be dynamically generated */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Credit Card Statement - April 2023</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Uploaded on May 2, 2023</span>
                        </div>
                        <div>78 transactions</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Award className="h-3 w-3" /> 
                      +50 points
                    </Badge>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Bank Statement - March 2023</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Uploaded on April 10, 2023</span>
                        </div>
                        <div>42 transactions</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Award className="h-3 w-3" /> 
                      +100 points
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
