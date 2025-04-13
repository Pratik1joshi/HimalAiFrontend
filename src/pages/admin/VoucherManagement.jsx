import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
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
  ArrowLeft,
  ArrowRight,
  Gift,
  Plus,
  ImageIcon,
  Check,
  Ban,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Switch } from "../../components/ui/switch";
import { voucherService } from "../../services/voucherService";

export default function VoucherManagement() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    code: "",                      // Required: unique voucher code
    title: "",                     // For display purposes only
    description: "",               
    amount: "",                    // Required: voucher value amount
    type: "FIXED",                 // FIXED or PERCENTAGE
    is_active: true,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: "",
    usage_limit: 1,
    min_purchase_amount: 0,
    image_url: "",                 // For UI display only
    points_cost: 100           // Required: points needed to redeem
  });

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voucherService.getVouchers();
      console.log('Voucher data received:', response.data);
      setVouchers(response.data);
    } catch (err) {
      console.error('Failed to fetch vouchers:', err);
      setError("Failed to load vouchers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && !currentUser.is_admin) {
      navigate('/dashboard');
      return;
    }
    
    fetchVouchers();
  }, [currentUser, navigate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVouchers = vouchers.filter(voucher => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      voucher.title.toLowerCase().includes(searchTermLower) ||
      (voucher.description && voucher.description.toLowerCase().includes(searchTermLower))
    );
  });

  const handleDeleteClick = (voucher) => {
    setSelectedVoucher(voucher);
    setIsDeleteDialogOpen(true);
  };

  const handleAddNewClick = () => {
    setFormData({
      id: null,
      code: "",
      title: "",
      description: "",
      amount: "",
      type: "FIXED",
      is_active: true,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: "",
      usage_limit: 1,
      min_purchase_amount: 0,
      image_url: "",
      points_cost: 100
    });
    setEditMode(false);
    setIsAddEditDialogOpen(true);
  };

  const handleEditClick = (voucher) => {
    setFormData({
      id: voucher.id,
      code: voucher.code,
      title: voucher.title,
      description: voucher.description || "",
      amount: voucher.amount.toString(),
      type: voucher.type,
      is_active: voucher.is_active,
      valid_from: voucher.valid_from ? new Date(voucher.valid_from).toISOString().split('T')[0] : "",
      valid_until: voucher.valid_until ? new Date(voucher.valid_until).toISOString().split('T')[0] : "",
      usage_limit: voucher.usage_limit.toString(),
      min_purchase_amount: voucher.min_purchase_amount.toString(),
      image_url: voucher.image_url || "",
      points_cost: voucher.points_cost || 100
    });
    setEditMode(true);
    setIsAddEditDialogOpen(true);
  };

  const handleToggleAvailability = async (voucher) => {
    try {
      await voucherService.updateVoucher(voucher.id, {
        is_active: !voucher.is_active
      });
      setVouchers(vouchers.map(v => 
        v.id === voucher.id ? {...v, is_active: !v.is_active} : v
      ));
    } catch (error) {
      console.error("Failed to update voucher status:", error);
      setError("Failed to update voucher. Please try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVoucher) return;

    try {
      await voucherService.deleteVoucher(selectedVoucher.id);
      setVouchers(vouchers.filter(v => v.id !== selectedVoucher.id));
      setIsDeleteDialogOpen(false);
      setSelectedVoucher(null);
    } catch (error) {
      console.error("Failed to delete voucher:", error);
      setError("Failed to delete voucher. Please try again.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.code) {
        setError("Voucher code is required");
        return;
      }
      
      if (!formData.amount || isNaN(parseFloat(formData.amount))) {
        setError("Valid voucher amount is required");
        return;
      }
      
      // Add points_cost field to the voucher data
      const voucherData = {
        code: formData.code,
        title: formData.title,
        description: formData.description || formData.title,
        amount: parseFloat(formData.amount),
        type: formData.type,
        is_active: formData.is_active,
        usage_limit: parseInt(formData.usage_limit) || 1,
        min_purchase_amount: parseFloat(formData.min_purchase_amount) || 0,
        image_url: formData.image_url,
        points_cost: parseInt(formData.points_cost) || 100
      };
      
      // Add dates if provided
      if (formData.valid_from) {
        voucherData.valid_from = new Date(formData.valid_from).toISOString();
      }
      
      if (formData.valid_until) {
        voucherData.valid_until = new Date(formData.valid_until).toISOString();
      }
      
      let response;
      if (editMode) {
        // Update existing voucher
        response = await voucherService.updateVoucher(formData.id, voucherData);
        setVouchers(vouchers.map(v => 
          v.id === formData.id ? { ...v, ...response.data } : v
        ));
      } else {
        // Add new voucher
        response = await voucherService.createVoucher(voucherData);
        setVouchers([...vouchers, response.data]);
      }
      
      setIsAddEditDialogOpen(false);
      
    } catch (error) {
      console.error("Failed to save voucher:", error);
      const errorDetail = error.response?.data?.detail;
      setError(errorDetail ? `Error: ${errorDetail}` : "Failed to save voucher. Please try again.");
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

  if (isLoading && vouchers.length === 0) {
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
          <h1 className="text-2xl font-bold">Voucher Management</h1>
          <p className="text-gray-500">Manage reward vouchers for user redemption</p>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchVouchers}
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
          <Button 
            size="sm"
            onClick={handleAddNewClick}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Voucher
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <Card className="overflow-hidden mb-6">
        <CardHeader className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold">All Vouchers</h3>
          
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search vouchers..."
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.length > 0 ? (
                  filteredVouchers.map(voucher => (
                    <TableRow key={voucher.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            {voucher.image_url ? (
                              <img src={voucher.image_url} alt={voucher.title} className="h-8 w-8 object-contain" />
                            ) : (
                              <Gift className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <span className="font-medium">
                            {voucher.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{voucher.description}</TableCell>
                      <TableCell>{voucher.points_cost} {voucher.type === "PERCENTAGE" ? "%" : "p"}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={voucher.is_active ? "success" : "secondary"}
                          className="flex gap-1 w-fit items-center"
                        >
                          {voucher.is_active ? 
                            <><Check className="h-3 w-3" /> Active</> : 
                            <><Ban className="h-3 w-3" /> Inactive</>
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(voucher.created_at)}</TableCell>
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
                              onClick={() => handleEditClick(voucher)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Voucher
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center"
                              onClick={() => handleToggleAvailability(voucher)}
                            >
                              {voucher.is_active ? 
                                <><Ban className="h-4 w-4 mr-2" />Make Inactive</> : 
                                <><Check className="h-4 w-4 mr-2" />Make Active</>
                              }
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="flex items-center text-red-600"
                              onClick={() => handleDeleteClick(voucher)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Voucher
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center text-gray-500">
                        <Gift className="h-10 w-10 mb-2 opacity-50" />
                        <p>No vouchers found {searchTerm ? `matching "${searchTerm}"` : ""}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mt-4"
                          onClick={handleAddNewClick}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add New Voucher
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Voucher</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedVoucher?.title}"? This action cannot be undone and will remove this voucher from the system.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <Gift className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{selectedVoucher?.title}</p>
                <p className="text-sm text-gray-500">{selectedVoucher?.amount} {selectedVoucher?.type === "PERCENTAGE" ? "%" : "USD"}</p>
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
              Delete Voucher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Voucher" : "Add New Voucher"}</DialogTitle>
            <DialogDescription>
              {editMode 
                ? "Update voucher details and settings." 
                : "Create a new voucher that users can redeem."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Voucher Code*</label>
                  <Input 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g. SUMMER2023"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be unique</p>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Display Title</label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. $5 Amazon Gift Card"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this voucher is for..."
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Amount*</label>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="e.g. 10.00"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Type</label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="FIXED">Fixed Amount</option>
                    <option value="PERCENTAGE">Percentage</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Valid From</label>
                  <Input 
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Valid Until</label>
                  <Input 
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Points Required*</label>
                  <Input 
                    type="number"
                    min="1"
                    value={formData.points_cost}
                    onChange={(e) => setFormData({...formData, points_cost: e.target.value})}
                    placeholder="e.g. 100"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Min Purchase</label>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.min_purchase_amount}
                    onChange={(e) => setFormData({...formData, min_purchase_amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Image URL (optional)</label>
                <Input 
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label htmlFor="is_active" className="text-sm font-medium">Active</label>
                <Switch 
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editMode ? "Save Changes" : "Add Voucher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
