import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Loader2,
  Save,
  X,
  Check,
  AlertCircle,
  Smile,
  Sparkles,
  ShieldCheck,
  Heart,
  UserCheck,
  Zap,
  Baby,
  Activity
} from 'lucide-react';
import { 
  getDentalServices, 
  getAllDentalServices,
  addDentalService, 
  updateDentalService, 
  deleteDentalService, 
  toggleDentalServiceStatus,
  activateAllDentalServices
} from '@/lib/supabase';
import { supabase } from '@/lib/supabase';


const AdminDentalServices = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [newFeature, setNewFeature] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'smile',
    category: 'general',
    features: [] as string[],
    sort_order: 0
  });

  // Icon mapping for preview
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'smile': <Smile className="h-6 w-6 text-[#4FD1C5]" />,
      'sparkles': <Sparkles className="h-6 w-6 text-[#4FD1C5]" />,
      'shield-check': <ShieldCheck className="h-6 w-6 text-[#4FD1C5]" />,
      'heart': <Heart className="h-6 w-6 text-[#4FD1C5]" />,
      'user-check': <UserCheck className="h-6 w-6 text-[#4FD1C5]" />,
      'zap': <Zap className="h-6 w-6 text-[#4FD1C5]" />,
      'baby': <Baby className="h-6 w-6 text-[#4FD1C5]" />,
      'activity': <Activity className="h-6 w-6 text-[#4FD1C5]" />,
    };
    return iconMap[iconName] || <Smile className="h-6 w-6 text-[#4FD1C5]" />;
  };

  // Fetch dental services
  const { data: dentalServices, isLoading, error } = useQuery({
    queryKey: ['dental-services'],
    queryFn: getAllDentalServices,
    staleTime: 5 * 60 * 1000,
  });

  // Add dental service mutation
  const addMutation = useMutation({
    mutationFn: addDentalService,
    onSuccess: () => {
      console.log('✅ Service added successfully');
      toast({
        title: "✅ Service Added Successfully!",
        description: "The dental service has been added and will appear on the website immediately.",
      });
      queryClient.invalidateQueries({ queryKey: ['dental-services'] });
      queryClient.invalidateQueries({ queryKey: ['dental-services-frontend'] });
      setIsAdding(false);
      resetForm();
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('❌ Error adding service:', error);
      toast({
        title: "❌ Error Adding Service",
        description: `Failed to add service: ${error.message}`,
        variant: "destructive"
      });
      setErrorMessage(`Failed to add service: ${error.message}`);
    },
  });

  // Update dental service mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...serviceData }: { id: number; title: string; description: string; icon?: string; category?: string; features?: string[]; sort_order?: number }) => 
      updateDentalService(id, serviceData),
    onSuccess: () => {
      console.log('✅ Service updated successfully');
      toast({
        title: "✅ Service Updated Successfully!",
        description: "The dental service has been updated and changes will appear on the website immediately.",
      });
      queryClient.invalidateQueries({ queryKey: ['dental-services'] });
      queryClient.invalidateQueries({ queryKey: ['dental-services-frontend'] });
      setEditingId(null);
      resetForm();
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('❌ Error updating service:', error);
      toast({
        title: "❌ Error Updating Service",
        description: `Failed to update service: ${error.message}`,
        variant: "destructive"
      });
      setErrorMessage(`Failed to update service: ${error.message}`);
    },
  });

  // Delete dental service mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDentalService,
    onSuccess: () => {
      console.log('✅ Service deleted successfully');
      toast({
        title: "✅ Service Deleted Successfully!",
        description: "The dental service has been removed from the website.",
      });
      queryClient.invalidateQueries({ queryKey: ['dental-services'] });
      queryClient.invalidateQueries({ queryKey: ['dental-services-frontend'] });
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('❌ Error deleting service:', error);
      toast({
        title: "❌ Error Deleting Service",
        description: `Failed to delete service: ${error.message}`,
        variant: "destructive"
      });
      setErrorMessage(`Failed to delete service: ${error.message}`);
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      toggleDentalServiceStatus(id, status as 'active' | 'inactive'),
    onSuccess: () => {
      console.log('✅ Service status toggled successfully');
      toast({
        title: "✅ Service Status Updated!",
        description: "The service status has been changed and will reflect on the website immediately.",
      });
      queryClient.invalidateQueries({ queryKey: ['dental-services'] });
      queryClient.invalidateQueries({ queryKey: ['dental-services-frontend'] });
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('❌ Error toggling service status:', error);
      toast({
        title: "❌ Error Updating Service Status",
        description: `Failed to update service status: ${error.message}`,
        variant: "destructive"
      });
      setErrorMessage(`Failed to toggle service status: ${error.message}`);
    },
  });

  // Activate all services mutation
  const activateAllMutation = useMutation({
    mutationFn: activateAllDentalServices,
    onSuccess: (data) => {
      console.log('✅ All services activated successfully:', data?.length);
      toast({
        title: "✅ All Services Activated!",
        description: `Successfully activated ${data?.length || 0} dental services. They will now appear on the website.`,
      });
      queryClient.invalidateQueries({ queryKey: ['dental-services'] });
      queryClient.invalidateQueries({ queryKey: ['dental-services-frontend'] });
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('❌ Error activating all services:', error);
      toast({
        title: "❌ Error Activating Services",
        description: `Failed to activate all services: ${error.message}`,
        variant: "destructive"
      });
      setErrorMessage(`Failed to activate all services: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'smile',
      category: 'general',
      features: [],
      sort_order: 0
    });
    setNewFeature('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isAdding) {
        await addMutation.mutateAsync(formData);
      } else if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleEdit = (service: { id: number; title: string; description: string; icon?: string; category?: string; features?: string[]; sort_order?: number; status: string }) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || 'smile',
      category: service.category || 'general',
      features: service.features || [],
      sort_order: service.sort_order || 0
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      console.log('🔄 [ADMIN] Toggling service status...', { id, currentStatus });
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await toggleMutation.mutateAsync({ id, status: newStatus });
      console.log('✅ [ADMIN] Service status toggled successfully:', { id, newStatus });
    } catch (error) {
      console.error('❌ [ADMIN] Toggle status error:', error);
    }
  };

  const handleActivateAll = async () => {
    if (window.confirm('Are you sure you want to activate ALL dental services? This will make all services visible on the website.')) {
      try {
        console.log('🔄 [ADMIN] Activating all dental services...');
        await activateAllMutation.mutateAsync();
        console.log('✅ [ADMIN] All dental services activated successfully');
      } catch (error) {
        console.error('❌ [ADMIN] Activate all error:', error);
      }
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Filter services
  const filteredServices = dentalServices?.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#4FD1C5]" />
        <span className="ml-2 text-gray-600">Loading dental services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-500">Error loading services: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{errorMessage}</div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dental Services Management</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your dental services and their display on the frontend</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleActivateAll}
              disabled={activateAllMutation.isPending}
              variant="outline"
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
            >
              {activateAllMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {activateAllMutation.isPending ? 'Activating...' : 'Activate All'}
            </Button>
            <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-[#4FD1C5] hover:bg-[#4FD1C5]/90">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dentalServices?.length || 0}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Services</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dentalServices?.filter(s => s.status === 'active').length || 0}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Active Services</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {dentalServices?.filter(s => s.status === 'inactive').length || 0}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Inactive Services</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{filteredServices.length}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Filtered Results</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="border-2 border-[#4FD1C5]/20">
          <CardHeader className="bg-[#4FD1C5]/5">
            <CardTitle className="flex items-center gap-2">
              {isAdding ? 'Add New Service' : 'Edit Service'}
              {getIcon(formData.icon)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Service Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="mt-1"
                    placeholder="e.g., General Dentistry"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="cosmetic">Cosmetic</SelectItem>
                      <SelectItem value="surgical">Surgical</SelectItem>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="orthodontics">Orthodontics</SelectItem>
                      <SelectItem value="endodontics">Endodontics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="icon" className="text-sm font-medium">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smile">Smile</SelectItem>
                      <SelectItem value="sparkles">Sparkles</SelectItem>
                      <SelectItem value="shield-check">Shield Check</SelectItem>
                      <SelectItem value="heart">Heart</SelectItem>
                      <SelectItem value="user-check">User Check</SelectItem>
                      <SelectItem value="zap">Zap</SelectItem>
                      <SelectItem value="baby">Baby</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sort_order" className="text-sm font-medium">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="mt-1"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                  className="mt-1"
                  placeholder="Describe the service in detail..."
                />
              </div>

              {/* Features Management */}
              <div>
                <Label className="text-sm font-medium">Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a feature (e.g., Regular Checkups)"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddFeature} disabled={!newFeature.trim()} className="bg-[#4FD1C5] hover:bg-[#4FD1C5]/90">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="flex-1 text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending} className="bg-[#4FD1C5] hover:bg-[#4FD1C5]/90">
                  {addMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isAdding ? 'Add Service' : 'Update Service'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetForm();
                    setErrorMessage(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <div className="grid gap-4">
        {filteredServices.map((service: { id: number; title: string; description: string; icon?: string; category?: string; features?: string[]; sort_order?: number; status: string }) => (
          <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 hover:border-[#4FD1C5]/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#4FD1C5]/10 rounded-lg">
                      {getIcon(service.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={service.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {service.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {service.category}
                        </Badge>
                        <span className="text-xs text-gray-500">Sort: {service.sort_order}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{service.description}</p>
                  {service.features && service.features.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(service.id, service.status)}
                    disabled={toggleMutation.isPending}
                    className="hover:bg-yellow-50 hover:text-yellow-600"
                  >
                    {toggleMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : service.status === 'active' ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium mb-2">No dental services found</h3>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AdminDentalServices; 