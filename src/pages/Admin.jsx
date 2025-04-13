"use client"

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import UserManagement from "../components/admin/UserManagement";
import VoucherManagement from "../components/admin/VoucherManagement";
import { Users, Gift, BarChart3, AlertTriangle } from "lucide-react";

export default function AdminPanel() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_vouchers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if current user is admin
    if (currentUser && !currentUser.is_admin) {
      navigate("/dashboard");
    }
    
    // Fetch admin stats
    const fetchStats = async () => {
      try {
        // In a real app, fetch stats from an API
        // For now, using mock data
        setTimeout(() => {
          setStats({
            total_users: 120,
            active_users: 87,
            total_vouchers: 15
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        setError("Failed to load admin statistics");
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-600" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-gray-500">
              {stats.active_users} active users ({Math.round((stats.active_users / stats.total_users) * 100)}%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Gift className="mr-2 h-4 w-4 text-purple-600" />
              Active Vouchers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_vouchers}</div>
            <p className="text-xs text-gray-500">Available for redemption</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-green-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-gray-500">All services running normally</p>
          </CardContent>
        </Card>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Management Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger 
            value="users"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md"
          >
            User Management
          </TabsTrigger>
          
          <TabsTrigger 
            value="vouchers"
            className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border border-transparent hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors rounded-t-md"
          >
            Voucher Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="vouchers">
          <VoucherManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
