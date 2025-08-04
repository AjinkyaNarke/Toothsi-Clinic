import { useState, useEffect } from 'react';
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
  X,
  Check,
  Loader2,
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  MapPin,
  Star,
  Search,
  Filter,
  AlertCircle,
  Save,
  Upload,
  ImageIcon,
  Camera
} from 'lucide-react';
import { 
  getTeamMembers, 
  addTeamMember, 
  updateTeamMember, 
  updateTeamMemberWithImage,
  deleteTeamMember, 
  toggleTeamMemberStatus,
  uploadTeamMemberImage,
  uploadProfileImage
} from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  specialization: string;
  experience: string;
  education: string;
  phone: string;
  email: string;
  image_url: string | null;
  image_data: Uint8Array | null;
  status: 'active' | 'inactive';
  join_date: string;
  achievements: string[];
  description: string;
  sort_order?: number;
  created_at: string;
}

const AdminTeam = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newAchievement, setNewAchievement] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    specialization: '',
    experience: '',
    education: '',
    phone: '',
    email: '',
    description: '',
    image_url: null as string | null,
    image_data: null as Uint8Array | null,
    achievements: [] as string[],
    sort_order: 0
  });

  // Position and specialization options
  const positions = [
    'Dentist',
    'Orthodontist',
    'Endodontist',
    'Periodontist',
    'Oral Surgeon',
    'Dental Hygienist',
    'Dental Assistant',
    'Receptionist',
    'Office Manager'
  ];

  const specializations = [
    'General Dentistry',
    'Orthodontics',
    'Endodontics',
    'Periodontics',
    'Oral Surgery',
    'Pediatric Dentistry',
    'Cosmetic Dentistry',
    'Implant Dentistry',
    'Preventive Dentistry'
  ];

  // Fetch team members using React Query
  const { data: teamMembers, isLoading: isFetching, error } = useQuery({
    queryKey: ['team-members'],
    queryFn: getTeamMembers,
    staleTime: 5 * 60 * 1000,
  });

  // Add team member mutation
  const addMutation = useMutation({
    mutationFn: addTeamMember,
    onSuccess: (newMember) => {
      console.log('✅ [ADMIN] Team member added successfully:', {
        id: newMember?.id,
        name: newMember?.name,
        position: newMember?.position,
        imageUrl: newMember?.image_url
      });

      // Invalidate and refetch all team member queries
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-frontend'] });
      
      // Force refetch to ensure latest data
      queryClient.refetchQueries({ queryKey: ['team-members'] });
      queryClient.refetchQueries({ queryKey: ['team-members-frontend'] });

      setShowForm(false);
      resetForm();
      setErrorMessage(null);
      
      toast({
        title: "✅ Team Member Added Successfully!",
        description: `"${newMember?.name}" has been added to Supabase and will appear on the website immediately.`,
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('❌ [ADMIN] Error adding team member:', error);
      setErrorMessage(`Failed to add team member: ${error.message}`);
      toast({
        title: "❌ Add Failed",
        description: `Failed to add team member: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  // Update team member mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, newImageFile, ...data }: { id: number; newImageFile?: File; name: string; position: string; specialization: string; experience: string; education: string; phone: string; email: string; description: string; image_url?: string; achievements?: string[] }) => 
      updateTeamMemberWithImage(id, data, newImageFile),
    onSuccess: (updatedMember) => {
      console.log('✅ [ADMIN] Team member update successful:', {
        id: updatedMember?.id,
        name: updatedMember?.name,
        position: updatedMember?.position,
        imageUrl: updatedMember?.image_url
      });

      // Invalidate and refetch all team member queries
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-frontend'] });
      
      // Force refetch to ensure latest data
      queryClient.refetchQueries({ queryKey: ['team-members'] });
      queryClient.refetchQueries({ queryKey: ['team-members-frontend'] });

      setShowForm(false);
      setEditingMember(null);
      resetForm();
      setErrorMessage(null);
      
      toast({
        title: "✅ Team Member Updated Successfully!",
        description: `"${updatedMember?.name}" has been updated in Supabase and will appear on the website immediately.`,
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('❌ [ADMIN] Error updating team member:', error);
      setErrorMessage(`Failed to update team member: ${error.message}`);
      toast({
        title: "❌ Update Failed",
        description: `Failed to update team member: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  // Delete team member mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-frontend'] });
      setErrorMessage(null);
      toast({
        title: "✅ Success!",
        description: "Team member deleted successfully from Supabase",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('❌ Error deleting team member:', error);
      setErrorMessage(`Failed to delete team member: ${error.message}`);
      toast({
        title: "❌ Error",
        description: `Failed to delete team member: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      toggleTeamMemberStatus(id, status as 'active' | 'inactive'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members-frontend'] });
      setErrorMessage(null);
      toast({
        title: "✅ Success!",
        description: "Team member status updated successfully in Supabase",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('❌ Error toggling team member status:', error);
      setErrorMessage(`Failed to toggle team member status: ${error.message}`);
      toast({
        title: "❌ Error",
        description: `Failed to toggle team member status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      specialization: '',
      experience: '',
      education: '',
      phone: '',
      email: '',
      description: '',
      image_url: null,
      image_data: null,
      achievements: [],
      sort_order: 0
    });
    setNewAchievement('');
    setSelectedImage(null);
    setImagePreview(null);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🔄 [ADMIN] Submitting team member form...', {
        isEditing: !!editingMember,
        memberName: formData.name,
        hasNewImage: !!selectedImage,
        formData: formData
      });
      
      if (editingMember) {
        // For updates, pass the new image file directly to the mutation
        console.log('🔄 [ADMIN] Updating team member with image...', {
          memberId: editingMember.id,
          memberName: formData.name,
          hasNewImage: !!selectedImage,
          currentImageUrl: formData.image_url
        });
        
        const updateData = {
          id: editingMember.id, 
          newImageFile: selectedImage || undefined,
          name: formData.name,
          position: formData.position,
          specialization: formData.specialization,
          experience: formData.experience,
          education: formData.education,
          phone: formData.phone,
          email: formData.email,
          description: formData.description,
          image_url: formData.image_url,
          achievements: formData.achievements,
          sort_order: formData.sort_order
        };
        
        console.log('📝 [ADMIN] Update data being sent:', updateData);
        
        await updateMutation.mutateAsync(updateData);
      } else {
        // For new members, handle image upload separately
        const finalFormData = { ...formData };
        
        if (selectedImage) {
          console.log('🖼️ [ADMIN] Uploading new team member profile image...', {
            fileName: selectedImage.name,
            memberName: formData.name
          });
          
          // Use profile image upload for team members
          const imageUrl = await uploadProfileImage(selectedImage, formData.name);
          finalFormData.image_url = imageUrl;
          
          console.log('✅ [ADMIN] New team member profile image uploaded successfully:', imageUrl);
        }
        
        console.log('📝 [ADMIN] Add data being sent:', finalFormData);
        await addMutation.mutateAsync(finalFormData);
      }
    } catch (error) {
      console.error('❌ [ADMIN] Form submission error:', error);
      setErrorMessage(`Failed to save team member: ${error.message}`);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      specialization: member.specialization,
      experience: member.experience,
      education: member.education,
      phone: member.phone,
      email: member.email,
      description: member.description,
      image_url: member.image_url,
      image_data: member.image_data,
      achievements: member.achievements || [],
      sort_order: member.sort_order || 0
    });
    setImagePreview(member.image_url || null);
    setSelectedImage(null);
    setShowForm(true);
  };

  const handleDelete = async (memberId: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteMutation.mutateAsync(memberId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleStatusToggle = async (memberId: number, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await toggleMutation.mutateAsync({ id: memberId, status: newStatus });
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Image upload functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setErrorMessage(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImageToBinary = async (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(reader.result));
        } else {
          reject(new Error('Failed to convert image to binary'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleImageUpload = async (): Promise<Uint8Array> => {
    if (!selectedImage) {
      throw new Error('No image selected');
    }

    setUploading(true);
    try {
      const binaryImage = await convertImageToBinary(selectedImage);
      setUploading(false);
      return binaryImage;
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  // Filter team members
  const filteredMembers = teamMembers?.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#4FD1C5]" />
        <span className="ml-2 text-gray-600">Loading team members...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-500">Error loading team members: {error.message}</span>
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage doctors and team members for your clinic</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={async () => {
                console.log('🧪 [TEST] Testing CRUD operations...');
                try {
                  // Test 1: Get all team members
                  const members = await getTeamMembers();
                  console.log('✅ [TEST] Get members successful:', members?.length);
                  
                  // Test 2: Try to update first member if exists
                  if (members && members.length > 0) {
                    const firstMember = members[0];
                    console.log('🧪 [TEST] Testing update for member:', firstMember.name);
                    
                    const updateResult = await updateTeamMember(firstMember.id, {
                      name: firstMember.name,
                      position: firstMember.position,
                      specialization: firstMember.specialization,
                      experience: firstMember.experience,
                      education: firstMember.education,
                      phone: firstMember.phone,
                      email: firstMember.email,
                      description: firstMember.description,
                      image_url: firstMember.image_url,
                      achievements: firstMember.achievements || []
                    });
                    console.log('✅ [TEST] Update successful:', updateResult);
                  }
                } catch (error) {
                  console.error('❌ [TEST] CRUD test failed:', error);
                }
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              Test CRUD
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-[#4FD1C5] hover:bg-[#4FD1C5]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{teamMembers?.length || 0}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Members</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {teamMembers?.filter(m => m.status === 'active').length || 0}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Active Members</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {teamMembers?.filter(m => m.status === 'inactive').length || 0}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Inactive Members</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{filteredMembers.length}</div>
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
                placeholder="Search by name, position, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
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
      {showForm && (
        <Card className="border-2 border-[#4FD1C5]/20">
          <CardHeader className="bg-[#4FD1C5]/5">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowForm(false);
                setEditingMember(null);
                resetForm();
                setErrorMessage(null);
              }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Dr. Full Name"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="position" className="text-sm font-medium">Position</Label>
                  <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialization" className="text-sm font-medium">Specialization</Label>
                  <Select value={formData.specialization} onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience" className="text-sm font-medium">Experience</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="e.g., 10+ years"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="education" className="text-sm font-medium">Education</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    placeholder="e.g., BDS, MDS - Dental Surgery"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+919876543210"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="doctor@toothsiclinic.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sort_order" className="text-sm font-medium">Display Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first. Use 0, 1, 2, 3... to control display order.
                </p>
              </div>

              {/* Profile Image Upload */}
              <div>
                <Label className="text-sm font-medium">Doctor Photo</Label>
                <div className="mt-2 space-y-4">
                  {/* Image Preview */}
                  {(imagePreview || formData.image_url) && (
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={imagePreview || formData.image_url}
                          alt="Profile preview"
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedImage ? 'New image selected' : 'Current profile photo'}
                        </p>
                        {selectedImage && (
                          <p className="text-xs text-gray-500">
                            {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)}MB)
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      {selectedImage ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                    
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image_url: '' }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {/* Upload info */}
                  <div className="text-xs text-gray-500">
                    <p>• Supported formats: JPG, PNG, GIF</p>
                    <p>• Maximum size: 5MB</p>
                    <p>• Recommended: Square image (400x400px) for better face visibility</p>
                    <p>• Face should be centered in the upper portion of the image</p>
                    <p>• Storage: profile-images bucket</p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description about the team member..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Achievements Management */}
              <div>
                <Label className="text-sm font-medium">Achievements</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add an achievement (e.g., Best Dentist Award 2023)"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAchievement();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddAchievement} disabled={!newAchievement.trim()} className="bg-[#4FD1C5] hover:bg-[#4FD1C5]/90">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.achievements.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="flex-1 text-sm">{achievement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAchievement(index)}
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
                  {editingMember ? 'Update Member' : 'Add Member'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMember(null);
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

      {/* Team Members List */}
      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 hover:border-[#4FD1C5]/30">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200 dark:border-gray-700">
                  <img
                    src={member.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-sm text-[#4FD1C5] font-medium">
                        {member.position}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {member.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(member)} className="hover:bg-blue-50 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleStatusToggle(member.id, member.status)} className="hover:bg-yellow-50 hover:text-yellow-600">
                          {member.status === 'active' ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(member.id)} className="hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-[#4FD1C5]" />
                        <span className="font-medium">Specialization:</span>
                        <span className="text-gray-600 dark:text-gray-300">{member.specialization}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-[#4FD1C5]" />
                        <span className="font-medium">Experience:</span>
                        <span className="text-gray-600 dark:text-gray-300">{member.experience}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-[#4FD1C5]" />
                        <span className="font-medium">Education:</span>
                        <span className="text-gray-600 dark:text-gray-300">{member.education}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-[#4FD1C5]" />
                        <span className="font-medium">Phone:</span>
                        <span className="text-gray-600 dark:text-gray-300">{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-[#4FD1C5]" />
                        <span className="font-medium">Email:</span>
                        <span className="text-gray-600 dark:text-gray-300">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-[#4FD1C5]" />
                        <span className="font-medium">Joined:</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {new Date(member.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {member.description && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  )}
                  
                  {member.achievements && member.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {member.achievements.map((achievement, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-900/20">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-medium mb-2">No team members found</h3>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AdminTeam; 