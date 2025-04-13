import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { voucherService } from "../services/voucherService";
import { profileService } from "../services/profileService";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  Gift, Search, RefreshCw, AlertCircle, Check, X, 
  CreditCard, Tag, ShoppingBag, Clock
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui/tabs";

export default function Vouchers() {
  const { currentUser } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [purchasedVouchers, setPurchasedVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasedLoading, setIsPurchasedLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [activeTab, setActiveTab] = useState("available");
  const [userPoints, setUserPoints] = useState(0);

  // Fetch available vouchers
  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voucherService.getVouchers(1, 100, true);
      setVouchers(response.data);
    } catch (err) {
      console.error('Failed to fetch vouchers:', err);
      setError("Failed to load vouchers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch purchased vouchers
  const fetchPurchasedVouchers = async () => {
    try {
      setIsPurchasedLoading(true);
      
      try {
        const response = await voucherService.getPurchasedVouchers();
        setPurchasedVouchers(response.data);
      } catch (initialError) {
        console.log("Initial attempt failed, trying fallback:", initialError);
        
        try {
          const fallbackResponse = await axios.get(
            `http://localhost:8000/api/vouchers/purchased?requesting_user_id=${currentUser?.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
              }
            }
          );
          setPurchasedVouchers(fallbackResponse.data);
        } catch (fallbackError) {
          console.log("Fallback also failed, using empty array:", fallbackError);
          setPurchasedVouchers([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch purchased vouchers:', err);
      setPurchasedVouchers([]);
    } finally {
      setIsPurchasedLoading(false);
    }
  };

  // Fetch user profile with points
  const fetchUserProfile = async () => {
    try {
      const response = await profileService.getUserProfile();
      console.log("User profile fetched:", response.data);
      
      const points = response.data.points || 0;
      setUserPoints(points);
      
      if (currentUser) {
        if (!currentUser.profile) currentUser.profile = {};
        currentUser.profile.points = points;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchVouchers();
    fetchPurchasedVouchers();
    fetchUserProfile();
  }, []);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVouchers = vouchers.filter(voucher => {
    if (!searchTerm.trim()) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (voucher.title && voucher.title.toLowerCase().includes(searchTermLower)) ||
      (voucher.description && voucher.description.toLowerCase().includes(searchTermLower))
    );
  });

  // Handle purchase button click
  const handlePurchaseClick = (voucher) => {
    if (userPoints < voucher.points_cost) {
      setError(`You need ${voucher.points_cost} points to purchase this voucher. You currently have ${userPoints} points.`);
      return;
    }
    
    setSelectedVoucher(voucher);
    setPurchaseResult(null);
    setIsPurchaseDialogOpen(true);
  };

  // Handle voucher purchase confirmation
  const handlePurchaseConfirm = async () => {
    if (!selectedVoucher) return;

    try {
      setIsPurchasing(true);
      setPurchaseResult(null);
      
      const response = await voucherService.purchaseVoucher(selectedVoucher.id);
      
      setPurchaseResult({
        success: response.data.success,
        message: response.data.message,
        voucherCode: response.data.voucher_code
      });
      
      if (response.data.success) {
        const updatedPoints = userPoints - selectedVoucher.points_cost;
        setUserPoints(updatedPoints);
        
        if (currentUser && currentUser.profile) {
          currentUser.profile.points = updatedPoints;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        setTimeout(() => {
          fetchVouchers();
          fetchPurchasedVouchers();
          setIsPurchaseDialogOpen(false);
        }, 2000);
      }
    } catch (error) {
      setPurchaseResult({
        success: false,
        message: error.response?.data?.detail || "Failed to purchase voucher"
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading && isPurchasedLoading && vouchers.length === 0 && purchasedVouchers.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="flex justify-center p-8">
          <RefreshCw size={24} className="animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rewards & Vouchers</h1>
          <p className="text-gray-500 mt-1">Use your points to purchase exciting rewards</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search vouchers..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              fetchVouchers();
              fetchPurchasedVouchers();
              fetchUserProfile();
            }}
            disabled={isLoading || isPurchasedLoading}
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isPurchasedLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto" 
            onClick={() => setError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {currentUser && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-blue-700 dark:text-blue-300 text-lg font-medium">
            Your current balance: <span className="font-bold">{userPoints} points</span>
          </p>
        </div>
      )}

      <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="available" className="flex gap-2 items-center">
            <Tag size={16} /> Available Vouchers
          </TabsTrigger>
          <TabsTrigger value="purchased" className="flex gap-2 items-center">
            <ShoppingBag size={16} /> My Purchased Vouchers
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVouchers.length > 0 ? (
              filteredVouchers.map((voucher) => (
                <Card key={voucher.id} className="overflow-hidden h-full flex flex-col">
                  {voucher.image_url && (
                    <div className="h-36 overflow-hidden">
                      <img
                        src={voucher.image_url}
                        alt={voucher.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className={!voucher.image_url ? "pt-6" : ""}>
                    <CardTitle className="flex items-center gap-2">
                      {!voucher.image_url && (
                        <Gift className="h-5 w-5 text-blue-600" />
                      )}
                      {voucher.title || voucher.code}
                    </CardTitle>
                    <CardDescription>{voucher.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Badge className="mb-2" variant="outline">
                      {voucher.points_cost} points
                    </Badge>
                    {voucher.valid_until && (
                      <p className="text-sm text-gray-500 mt-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Valid until: {formatDate(voucher.valid_until)}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handlePurchaseClick(voucher)}
                      disabled={userPoints < voucher.points_cost}
                    >
                      {userPoints < voucher.points_cost 
                        ? "Not Enough Points" 
                        : "Purchase Now"}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                <Gift className="h-16 w-16 mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">No vouchers available</h3>
                <p>
                  {searchTerm 
                    ? `No vouchers match "${searchTerm}"`
                    : "Check back later for new reward options"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="purchased" className="mt-6">
          {isPurchasedLoading ? (
            <div className="flex justify-center p-6">
              <RefreshCw size={20} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedVouchers.length > 0 ? (
                purchasedVouchers.map((voucher) => (
                  <Card key={voucher.id} className="overflow-hidden h-full flex flex-col border-green-200 dark:border-green-900">
                    <CardHeader className="bg-green-50 dark:bg-green-900/20">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center gap-2">
                          <Gift className="h-5 w-5 text-green-600" />
                          {voucher.title || voucher.code}
                        </CardTitle>
                        <Badge variant="success" className="ml-2">Purchased</Badge>
                      </div>
                      <CardDescription>{voucher.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3 flex flex-col gap-1">
                        <div className="flex items-center text-sm">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-500" /> 
                          <span className="font-medium">Voucher Code:</span> 
                          <span className="ml-2 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
                            {voucher.code}
                          </span>
                        </div>
                        {voucher.valid_until && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Valid until: {formatDate(voucher.valid_until)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-gray-500 w-full text-center">
                        Present this code at checkout
                      </p>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <ShoppingBag className="h-16 w-16 mb-4 opacity-30" />
                  <h3 className="text-xl font-medium mb-2">No purchased vouchers</h3>
                  <p className="text-center">
                    {activeTab === "purchased" ? 
                      "Purchase vouchers with your points to see them here" :
                      "Check back later for new reward options"
                    }
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    (This feature may still be in development)
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Purchase Dialog */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Voucher</DialogTitle>
            <DialogDescription>
              Confirm that you want to spend points to purchase this voucher
            </DialogDescription>
          </DialogHeader>
          
          {purchaseResult ? (
            <div className={`p-4 rounded-md text-center ${
              purchaseResult.success 
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}>
              <div className="flex justify-center mb-2">
                {purchaseResult.success ? (
                  <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
                    <Check className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="bg-red-100 dark:bg-red-800/30 p-2 rounded-full">
                    <X className="h-6 w-6" />
                  </div>
                )}
              </div>
              <p className="text-lg font-medium">{purchaseResult.success ? 'Success!' : 'Error'}</p>
              <p>{purchaseResult.message}</p>
              {purchaseResult.voucherCode && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <p className="text-sm mb-1">Your voucher code:</p>
                  <p className="font-mono font-bold">{purchaseResult.voucherCode}</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="py-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded">
                    <Gift className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedVoucher?.title || selectedVoucher?.code}</p>
                    <p className="text-sm text-gray-500">{selectedVoucher?.points_cost} points</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>Your current points:</span>
                    <span className="font-medium">{userPoints}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-red-600 dark:text-red-400">
                    <span>Points to be deducted:</span>
                    <span className="font-medium">-{selectedVoucher?.points_cost}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between font-medium">
                      <span>Remaining points:</span>
                      <span>{userPoints - (selectedVoucher?.points_cost || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPurchaseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePurchaseConfirm}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? 'Processing...' : 'Confirm Purchase'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
