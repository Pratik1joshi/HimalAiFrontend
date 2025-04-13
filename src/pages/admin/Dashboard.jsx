import React, { useState, useEffect } from 'react';
import { Users, Gift, BarChart2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_vouchers: 0,
    redeemed_vouchers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if current user is admin
    if (currentUser && !currentUser.is_admin) {
      navigate('/dashboard');
    }
    
    // Fetch admin stats
    const fetchStats = async () => {
      try {
        // In a real app, fetch from API
        // For now using mock data
        setTimeout(() => {
          setStats({
            total_users: 120,
            active_users: 87,
            total_vouchers: 15,
            redeemed_vouchers: 42
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        setError('Failed to load admin statistics');
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/users')}
          >
            <Users className="mr-2 h-4 w-4" /> Manage Users
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/vouchers')}
          >
            <Gift className="mr-2 h-4 w-4" /> Manage Vouchers
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-3xl font-bold mt-1">{stats.total_users}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {stats.active_users} active users ({Math.round((stats.active_users / stats.total_users) * 100)}%)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Available Vouchers</p>
                <h3 className="text-3xl font-bold mt-1">{stats.total_vouchers}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Ready for redemption
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Redeemed Vouchers</p>
                <h3 className="text-3xl font-bold mt-1">{stats.redeemed_vouchers}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Gift className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Claimed by users
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">System Status</p>
                <h3 className="text-xl font-bold mt-1 text-green-600">Operational</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              All services running normally
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent User Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      U{i}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">User{i}@example.com</p>
                      <p className="text-xs text-gray-500">Login • {i}h ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4">
              View All User Activity
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Voucher Redemptions</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Gift className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">$5 Amazon Gift Card</p>
                      <p className="text-xs text-gray-500">Redeemed by User{i} • {i * 3}h ago</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">500 pts</div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4">
              View All Redemptions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
