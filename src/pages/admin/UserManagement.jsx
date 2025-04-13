import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { 
  Search, 
  X, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Mail, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";

export default function UserManagement() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // Setup search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Extract the fetchUsers function so it can be called from the refresh button
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if current user has ID
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!storedUser.id) {
        setError("User ID not found. Please log in again.");
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      const response = await userService.getUsers(
        pagination.currentPage,
        10,
        debouncedSearchTerm
      );
      
      console.log('User data received:', response.data);
      
      setUsers(response.data.items);
      setPagination({
        currentPage: response.data.page,
        totalPages: response.data.pages,
        totalItems: response.data.total
      });
    } catch (err) {
      console.error('Failed to fetch users:', err);
      if (err.response?.status === 403) {
        setError("You don't have permission to view user data. Only admins can access this page.");
        
        // If the user is not an admin, redirect to dashboard
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.is_admin = false;
        localStorage.setItem('user', JSON.stringify(currentUser));
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(err.message || "Failed to load users. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && !currentUser.is_admin) {
      navigate('/dashboard');
      return;
    }
    
    fetchUsers();
    // Only dependencies that should trigger a refetch
  }, [currentUser?.is_admin, navigate, pagination.currentPage, debouncedSearchTerm]);

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleEditClick = (user) => {
    setEditUser({...user});
    setIsEditDialogOpen(true);
  };

  const handleMakeAdminClick = async (user) => {
    try {
      await userService.toggleAdminStatus(user.id, !user.is_admin);
      // Update local state for immediate feedback
      setUsers(users.map(u => 
        u.id === user.id ? {...u, is_admin: !u.is_admin} : u
      ));
    } catch (error) {
      console.error("Failed to update admin status:", error);
      if (error.response?.status === 403) {
        setError("You don't have permission to change admin status.");
      }
    }
  };

  const handleToggleActiveStatus = async (user) => {
    try {
      await userService.toggleUserStatus(user.id, !user.is_active);
      // Update local state
      setUsers(users.map(u => 
        u.id === user.id ? {...u, is_active: !u.is_active} : u
      ));
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await userService.deleteUser(selectedUser.id);
      // Refresh the users list
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(editUser.id, {
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        email: editUser.email,
        is_active: editUser.is_active,
        is_admin: editUser.is_admin
      });
      
      // Update local state
      setUsers(users.map(u => u.id === editUser.id ? editUser : u));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <RefreshCw size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden mb-6">
        <CardHeader className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold">All Users</h3>
          
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search users by name or email..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {error && (
            <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 text-center">
              <AlertCircle className="h-5 w-5 inline-block mr-2" />
              {error}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage 
                              src="" 
                              alt={`${user.first_name} ${user.last_name}`}
                              userId={user.id}
                              gender="boy"
                            />
                            <AvatarFallback>
                              {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {user.first_name} {user.last_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.is_active ? "success" : "secondary"}
                          className="flex gap-1 w-fit items-center"
                        >
                          {user.is_active ? 
                            <><CheckCircle className="h-3 w-3" /> Active</> : 
                            <><XCircle className="h-3 w-3" /> Inactive</>
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.is_admin ? 
                          <Badge variant="default" className="bg-purple-500">
                            <Shield className="h-3 w-3 mr-1" /> Admin
                          </Badge> : 
                          <Badge variant="outline">User</Badge>
                        }
                      </TableCell>
                      <TableCell>{user.profile?.points || 0} pts</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              className="flex items-center"
                              onClick={() => handleEditClick(user)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center"
                              onClick={() => handleToggleActiveStatus(user)}
                            >
                              {user.is_active ? 
                                <><XCircle className="h-4 w-4 mr-2" />Deactivate</> : 
                                <><CheckCircle className="h-4 w-4 mr-2" />Activate</>
                              }
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center"
                              onClick={() => handleMakeAdminClick(user)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              {user.is_admin ? "Remove Admin" : "Make Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Email User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="flex items-center text-red-600"
                              onClick={() => handleDeleteClick(user)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center text-gray-500">
                        <Search className="h-10 w-10 mb-2 opacity-50" />
                        <p>No users found {searchTerm ? `matching "${searchTerm}"` : ""}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
              Showing {users.length} of {pagination.totalItems} users
              {searchTerm && ` matching "${searchTerm}"`}
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPagination({...pagination, currentPage: pagination.currentPage - 1})}
                disabled={pagination.currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPagination({...pagination, currentPage: pagination.currentPage + 1})}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.first_name} {selectedUser?.last_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {selectedUser?.first_name?.charAt(0)}{selectedUser?.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser?.first_name} {selectedUser?.last_name}</p>
                <p className="text-sm text-gray-500">{selectedUser?.email}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">First Name</label>
                    <Input 
                      value={editUser.first_name}
                      onChange={(e) => setEditUser({...editUser, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Last Name</label>
                    <Input 
                      value={editUser.last_name}
                      onChange={(e) => setEditUser({...editUser, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <Input 
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="is_active"
                      checked={editUser.is_active}
                      onChange={() => setEditUser({...editUser, is_active: !editUser.is_active})}
                      className="h-4 w-4"
                    />
                    <label htmlFor="is_active" className="text-sm">Active Account</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="is_admin"
                      checked={editUser.is_admin}
                      onChange={() => setEditUser({...editUser, is_admin: !editUser.is_admin})}
                      className="h-4 w-4"
                    />
                    <label htmlFor="is_admin" className="text-sm">Admin Privileges</label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
