import React, { useState, useEffect } from "react";
import { Users, Gift, Upload, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalVouchers: 0,
    totalStatements: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch actual stats from your API
    // For now, we'll simulate with static data
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Simulated API responses
        setStats({
          totalUsers: 248,
          activeUsers: 183,
          totalVouchers: 12,
          totalStatements: 756
        });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Reports</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : `${stats.activeUsers} active users`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Vouchers</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalVouchers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : "Manage reward options"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Statements</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalStatements}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : "Across all users"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Total registered users</span>
              <span className="font-medium">{stats.totalUsers}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Active users</span>
              <span className="font-medium">{stats.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Inactive accounts</span>
              <span className="font-medium">{stats.totalUsers - stats.activeUsers}</span>
            </div>
            <div className="pt-2">
              <Link to="/admin/users">
                <Button className="w-full">Manage Users</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voucher Management</CardTitle>
            <CardDescription>Create and manage reward vouchers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Total vouchers</span>
              <span className="font-medium">{stats.totalVouchers}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Most redeemed</span>
              <span className="font-medium">Amazon Gift Card</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Least redeemed</span>
              <span className="font-medium">Premium Subscription</span>
            </div>
            <div className="pt-2">
              <Link to="/admin/vouchers">
                <Button className="w-full">Manage Vouchers</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
