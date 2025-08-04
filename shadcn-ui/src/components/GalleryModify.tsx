import { useState, useEffect } from 'react';
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
  Save, 
  Loader2, 
  RefreshCw,
  Upload,
  X,
  Settings,
  Zap,
  Monitor,
  Camera,
  FileImage,
  Search,
  Image,
  Check,
  UploadCloud,
  AlertCircle,
  Database,
  Shield,
  Users,
  BarChart3,
  FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  category: string;
  area?: string;
  equipment?: string;
  image_url: string;
  status: 'active' | 'inactive';
  sort_order?: number;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
  updated_at?: string;
}

const GalleryModify = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [hasData, setHasData] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // File states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // Form states
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    area: '',
    equipment: '',
    sort_order: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    area: '',
    equipment: '',
    sort_order: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const categories = [
    { value: 'modern-area', label: 'Modern Area', icon: Settings },
    { value: 'state-of-art-equipment', label: 'State-of-the-art Equipment', icon: Zap },
    { value: 'treatment-rooms', label: 'Treatment Rooms', icon: Monitor },
    { value: 'reception-area', label: 'Reception Area', icon: Camera },
    { value: 'waiting-area', label: 'Waiting Area', icon: FileImage },
    { value: 'consultation-room', label: 'Consultation Room', icon: Image }
  ];

  // Upload image to Supabase Storage
  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    try {
      console.log('🔄 [GALLERY MODIFY] Uploading image to Supabase Storage...');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gallery-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ [GALLERY MODIFY] Storage upload error:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      console.log('✅ [GALLERY MODIFY] Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ [GALLERY MODIFY] Upload failed:', error);
      throw error;
    }
  };

  // Add new gallery image
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      console.log('🔄 [GALLERY MODIFY] Adding new gallery image...');

      // Upload image to storage
      const imageUrl = await uploadImageToStorage(selectedFile);
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Insert record into database
      const { data, error } = await supabase
        .from('gallery_images')
        .insert({
          title: uploadForm.title,
          description: uploadForm.description,
          category: uploadForm.category,
          area: uploadForm.area,
          equipment: uploadForm.equipment,
          image_url: imageUrl,
          sort_order: uploadForm.sort_order,
          status: uploadForm.status,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          mime_type: selectedFile.type
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [GALLERY MODIFY] Database insert error:', error);
        throw error;
      }

      console.log('✅ [GALLERY MODIFY] Gallery image added successfully:', data);
      
      toast({
        title: "Success",
        description: "Gallery image uploaded successfully",
      });

      // Reset form and refresh data
      setUploadForm({
        title: '',
        description: '',
        category: '',
        area: '',
        equipment: '',
        sort_order: 0,
        status: 'active'
      });
      setSelectedFile(null);
      setImagePreview(null);
      setShowUploadForm(false);
      
      await fetchGalleryImages();
    } catch (error) {
      console.error('❌ [GALLERY MODIFY] Upload failed:', error);
      toast({
        title: "Error",
        description: "Failed to upload gallery image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Update gallery data
  const handleUpdate = async () => {
    if (!editingImage) return;

    try {
      setIsUpdating(true);
      console.log('🔄 [GALLERY MODIFY] Updating gallery data...');

      let imageUrl = editingImage.image_url;
      let fileUpdateData = {};

      // If new file is selected, upload it
      if (editSelectedFile) {
        imageUrl = await uploadImageToStorage(editSelectedFile);
        if (!imageUrl) {
          throw new Error('Failed to upload new image');
        }
        fileUpdateData = {
          file_name: editSelectedFile.name,
          file_size: editSelectedFile.size,
          mime_type: editSelectedFile.type
        };
      }

      // Update all data fields in database
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        area: editForm.area || null,
        equipment: editForm.equipment || null,
        sort_order: editForm.sort_order,
        status: editForm.status,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
        ...fileUpdateData
      };
      
      console.log('🔄 [GALLERY MODIFY] Current editForm state:', editForm);
      console.log('🔄 [GALLERY MODIFY] Original image data:', editingImage);

      console.log('🔄 [GALLERY MODIFY] Updating database with:', updateData);
      console.log('🔄 [GALLERY MODIFY] Editing image ID:', editingImage.id);

      const { data, error } = await supabase
        .from('gallery_images')
        .update(updateData)
        .eq('id', editingImage.id)
        .select();

      if (error) {
        console.error('❌ [GALLERY MODIFY] Database update error:', error);
        console.error('❌ [GALLERY MODIFY] Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ [GALLERY MODIFY] Gallery data updated successfully:', data);
      if (data && data.length > 0) {
        console.log('✅ [GALLERY MODIFY] Updated record details:', {
          id: data[0].id,
          title: data[0].title,
          updated_at: data[0].updated_at,
          status: data[0].status
        });
      }
      
      // Show success popup and change button state
      setUpdateSuccess(true);
      toast({
        title: "✅ Success!",
        description: "Data updated successfully in Supabase database",
        duration: 5000,
      });
      
      // Show additional success notification
      setTimeout(() => {
        toast({
          title: "🎉 Database Updated!",
          description: "Your changes have been saved to Supabase and are now live on both admin and frontend.",
          duration: 8000,
        });
      }, 1000);

      // Reset form and refresh data
      setEditingImage(null);
      setEditForm({
        title: '',
        description: '',
        category: '',
        area: '',
        equipment: '',
        sort_order: 0,
        status: 'active'
      });
      setEditSelectedFile(null);
      setEditImagePreview(null);
      
      await fetchGalleryImages();

      // Reset button state after 30 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 30000);
    } catch (error) {
      console.error('❌ [GALLERY MODIFY] Update failed:', error);
      toast({
        title: "Error",
        description: "Failed to update gallery data in database",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete gallery image
  const handleDelete = async (imageId: number, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      console.log('🔄 [GALLERY MODIFY] Deleting gallery image...');

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        console.error('❌ [GALLERY MODIFY] Database delete error:', dbError);
        throw dbError;
      }

      // Try to delete from storage (optional)
      try {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('gallery-images')
            .remove([`gallery-images/${fileName}`]);
        }
      } catch (storageError) {
        console.warn('⚠️ [GALLERY MODIFY] Storage delete failed (non-critical):', storageError);
      }

      console.log('✅ [GALLERY MODIFY] Gallery image deleted successfully');
      
      toast({
        title: "Success",
        description: "Gallery image deleted successfully",
      });

      await fetchGalleryImages();
    } catch (error) {
      console.error('❌ [GALLERY MODIFY] Delete failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete gallery image",
        variant: "destructive"
      });
    }
  };

  // Toggle image status
  const handleToggleStatus = async (imageId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('gallery_images')
        .update({ status: newStatus })
        .eq('id', imageId);

      if (error) {
        console.error('❌ [GALLERY MODIFY] Status update error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Image status updated to ${newStatus}`,
      });

      await fetchGalleryImages();
    } catch (error) {
      console.error('❌ [GALLERY MODIFY] Status toggle failed:', error);
      toast({
        title: "Error",
        description: "Failed to update image status",
        variant: "destructive"
      });
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit
  const handleEdit = (image: GalleryImage) => {
    console.log('🔄 [GALLERY MODIFY] Edit clicked for image:', image);
    setEditingImage(image);
    const formData = {
      title: image.title,
      description: image.description,
      category: image.category,
      area: image.area || '',
      equipment: image.equipment || '',
      sort_order: image.sort_order || 0,
      status: image.status || 'active'
    };
    setEditForm(formData);
    setEditImagePreview(image.image_url);
    console.log('✅ [GALLERY MODIFY] Edit form data set:', formData);
    console.log('✅ [GALLERY MODIFY] Edit modal should now be open');
  };

  const fetchGalleryImages = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 [GALLERY MODIFY] Fetching gallery images from Supabase...');
      
      // Test Supabase connection
      const { data: testData, error: testError } = await supabase
        .from('gallery_images')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ [GALLERY MODIFY] Supabase connection test failed:', testError);
      } else {
        console.log('✅ [GALLERY MODIFY] Supabase connection test successful');
      }
      
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('❌ [GALLERY MODIFY] Error fetching gallery images:', error);
        toast({
          title: "Error",
          description: "Failed to load gallery images from database",
          variant: "destructive"
        });
        setHasData(false);
        return;
      }

      // Show all images from database, but mark Supabase storage images
      const allImages = data || [];
      const supabaseImages = allImages.filter(image => 
        image.image_url && image.image_url.includes('supabase.co')
      );
      const externalImages = allImages.filter(image => 
        !image.image_url || !image.image_url.includes('supabase.co')
      );

      console.log('✅ [GALLERY MODIFY] Gallery images fetched successfully:', {
        total: allImages.length,
        supabaseStorage: supabaseImages.length,
        externalUrls: externalImages.length
      });
      
      setGalleryImages(allImages);
      setHasData(allImages.length > 0);
      
      if (allImages.length > 0) {
        toast({
          title: "Success",
          description: `Loaded ${allImages.length} gallery images from database`,
        });
      } else {
        toast({
          title: "No Data",
          description: "No gallery images found in database",
        });
      }
    } catch (error) {
      console.error('❌ [GALLERY MODIFY] Unexpected error:', error);
      toast({
        title: "Error",
        description: "Failed to connect to database",
        variant: "destructive"
      });
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImages = galleryImages.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    // Check Supabase configuration
    console.log('🔧 [GALLERY MODIFY] Supabase client initialized');
    
    fetchGalleryImages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#4FD1C5]" />
          <p className="text-gray-600 dark:text-gray-300">Loading gallery data from database...</p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-6">
                 <div className="flex justify-between items-center">
           <div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
               <Database className="h-6 w-6 mr-2 text-[#4FD1C5]" />
               Gallery Modify
             </h2>
             <p className="text-gray-600 dark:text-gray-300">
               Manage clinic gallery images from Supabase database
             </p>
           </div>
           <Button 
             onClick={() => setShowUploadForm(true)}
             className="bg-[#4FD1C5] hover:bg-[#38B2AC]"
           >
             <Plus className="h-4 w-4 mr-2" />
             Add Image
           </Button>
         </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Gallery Data Found
              </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-6">
              No gallery images found in the Supabase database. Both frontend and admin will only display gallery content when data exists in the database.
            </p>
              <Button 
                onClick={fetchGalleryImages}
                className="bg-[#4FD1C5] hover:bg-[#38B2AC]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Database Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header Section */}
      <Card className="bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <Database className="h-6 w-6 mr-2" />
                    Admin Gallery Management
                  </h2>
                  <p className="text-[#4FD1C5] text-sm font-medium">
                    Full CRUD Operations • Database Control • Storage Management
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Users className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <BarChart3 className="h-3 w-3 mr-1" />
                {galleryImages.length} Images
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Controls Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-[#4FD1C5]" />
                Gallery Database Control
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Manage all gallery images from Supabase database - Full admin access enabled
              </p>
            </div>
             <div className="flex space-x-2">
               <Button 
                 variant="outline"
                 onClick={fetchGalleryImages}
                 disabled={isLoading}
               >
                 <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                 Refresh
               </Button>
               <Button 
                 onClick={() => setShowUploadForm(true)}
                 className="bg-[#4FD1C5] hover:bg-[#38B2AC]"
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Add Image
               </Button>
             </div>
           </div>
         </CardContent>
       </Card>

       <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

             {/* Gallery Grid with Enhanced Visualization */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredImages.map((image) => {
           const category = categories.find(c => c.value === image.category);
           const CategoryIcon = category?.icon || Camera;

           return (
             <Card key={image.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-2 hover:border-[#4FD1C5]">
               {/* Image Section */}
               <div 
                 className="relative overflow-hidden cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                 onClick={() => {
                   console.log('🔄 [GALLERY MODIFY] Image clicked:', image.title);
                   handleEdit(image);
                 }}
                 title="Click to edit this gallery item"
               >
                 {image.image_url && image.image_url.includes('supabase.co') ? (
                   <img
                     src={image.image_url}
                     alt={image.title}
                     className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                     onError={(e) => {
                       console.warn('⚠️ [GALLERY MODIFY] Image failed to load:', image.image_url);
                       e.currentTarget.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop';
                     }}
                   />
                 ) : (
                   <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                     <div className="text-center">
                       <Camera className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                       <p className="text-sm text-gray-500 font-medium">Image not in storage bucket</p>
                       <p className="text-xs text-gray-400">Data only</p>
                     </div>
                   </div>
                 )}
                 
                 {/* Status Badge */}
                 <div className="absolute top-3 left-3">
                   <Badge 
                     variant={image.status === 'active' ? 'default' : 'secondary'}
                     className={`${image.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                   >
                     {image.status === 'active' ? 'Active' : 'Inactive'}
                   </Badge>
                 </div>
                 
                 {/* External URL Badge */}
                 {image.image_url && !image.image_url.includes('supabase.co') && (
                   <div className="absolute top-3 right-3">
                     <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300">
                       External URL
                     </Badge>
                   </div>
                 )}

                 {/* Action Buttons */}
                 <div className="absolute top-3 right-3 flex gap-2">
                   <Button
                     size="sm"
                     variant="secondary"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleToggleStatus(image.id, image.status);
                     }}
                     className="h-8 w-8 p-0 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 shadow-md"
                     title={image.status === 'active' ? 'Deactivate' : 'Activate'}
                   >
                     {image.status === 'active' ? (
                       <Eye className="h-4 w-4 text-green-600" />
                     ) : (
                       <EyeOff className="h-4 w-4 text-gray-400" />
                     )}
                   </Button>
                 </div>
                 
                                                    {/* Edit Overlay */}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <div className="text-white text-center">
                     <Edit className="h-12 w-12 mx-auto mb-3" />
                     <p className="text-sm font-medium">Click to edit</p>
                     <p className="text-xs opacity-75">Update all data fields</p>
                   </div>
                 </div>
                 
                 {/* Edit Button - Always Visible */}
                 <div className="absolute bottom-3 right-3">
                   <Button
                     size="sm"
                     variant="secondary"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleEdit(image);
                     }}
                     className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 shadow-md"
                     title="Edit gallery item"
                   >
                     <Edit className="h-4 w-4" />
                   </Button>
                 </div>
               </div>

               {/* Content Section */}
               <CardContent className="p-4">
                 <div className="space-y-3">
                   {/* Title and Delete */}
                   <div className="flex items-center justify-between">
                     <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-[#4FD1C5] transition-colors line-clamp-1">
                       {image.title}
                     </h3>
                     <Button
                       size="sm"
                       variant="ghost"
                       onClick={(e) => {
                         e.stopPropagation();
                         handleDelete(image.id, image.image_url);
                       }}
                       className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                       title="Delete image"
                     >
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                   
                   {/* Description */}
                   <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 min-h-[2.5rem]">
                     {image.description}
                   </p>

                   {/* Category Badge */}
                   <div className="flex items-center">
                     <Badge className="bg-[#4FD1C5] text-white border-0 shadow-sm">
                       <CategoryIcon className="h-3 w-3 mr-1" />
                       {category?.label || image.category}
                     </Badge>
                   </div>

                   {/* Area and Equipment */}
                   {image.area && (
                     <div className="flex items-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                       <Settings className="h-3 w-3 mr-2 text-[#4FD1C5] flex-shrink-0" />
                       <span className="font-medium">Area:</span>
                       <span className="ml-1">{image.area}</span>
                     </div>
                   )}

                   {image.equipment && (
                     <div className="flex items-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                       <Zap className="h-3 w-3 mr-2 text-[#4FD1C5] flex-shrink-0" />
                       <span className="font-medium">Equipment:</span>
                       <span className="ml-1">{image.equipment}</span>
                     </div>
                   )}

                   {/* Metadata */}
                   <div className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                     <div className="flex justify-between">
                       <span>ID: {image.id}</span>
                       <span>Added: {new Date(image.created_at).toLocaleDateString()}</span>
                     </div>
                     {image.file_name && (
                       <div className="mt-1 text-gray-500">
                         File: {image.file_name}
                       </div>
                     )}
                   </div>
                 </div>
               </CardContent>
             </Card>
           );
         })}
       </div>

       {/* Enhanced Upload Form */}
       {showUploadForm && (
         <Card className="max-w-4xl mx-auto">
           <CardHeader className="bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC] text-white">
             <CardTitle className="flex items-center justify-between">
               <div className="flex items-center">
                 <Plus className="h-5 w-5 mr-2" />
                 <span>Add New Gallery Image</span>
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => setShowUploadForm(false)}
                 className="text-white hover:bg-white/20"
               >
                 <X className="h-4 w-4" />
               </Button>
             </CardTitle>
           </CardHeader>
           <CardContent className="p-6">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Left Column - Form */}
               <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                     <Input
                       id="title"
                       value={uploadForm.title}
                       onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                       placeholder="Enter image title"
                       className="mt-1"
                     />
                   </div>
                   <div>
                     <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                     <Select value={uploadForm.category} onValueChange={(value) => setUploadForm({...uploadForm, category: value})}>
                       <SelectTrigger className="mt-1">
                         <SelectValue placeholder="Select category" />
                       </SelectTrigger>
                       <SelectContent>
                         {categories.map((category) => (
                           <SelectItem key={category.value} value={category.value}>
                             {category.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

                 <div>
                   <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                   <Textarea
                     id="description"
                     value={uploadForm.description}
                     onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                     placeholder="Enter image description"
                     rows={4}
                     className="mt-1"
                   />
                 </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="area" className="text-sm font-medium">Area</Label>
                      <Input
                        id="area"
                        value={uploadForm.area}
                        onChange={(e) => setUploadForm({...uploadForm, area: e.target.value})}
                        placeholder="e.g., Main Floor, Second Floor"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="equipment" className="text-sm font-medium">Equipment</Label>
                      <Input
                        id="equipment"
                        value={uploadForm.equipment}
                        onChange={(e) => setUploadForm({...uploadForm, equipment: e.target.value})}
                        placeholder="e.g., Digital X-ray, LED lighting"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sort-order" className="text-sm font-medium">Sort Order</Label>
                      <Input
                        id="sort-order"
                        type="number"
                        value={uploadForm.sort_order}
                        onChange={(e) => setUploadForm({...uploadForm, sort_order: parseInt(e.target.value) || 0})}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                      <Select value={uploadForm.status || 'active'} onValueChange={(value) => setUploadForm({...uploadForm, status: value as 'active' | 'inactive'})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                 <div>
                   <Label htmlFor="image" className="text-sm font-medium">Image File *</Label>
                   <div className="mt-1">
                     <Input
                       id="image"
                       type="file"
                       accept="image/*"
                       onChange={handleFileChange}
                     />
                   </div>
                   {imagePreview && (
                     <div className="mt-2">
                       <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded border-2 border-gray-200" />
                     </div>
                   )}
                 </div>
               </div>

               {/* Right Column - Preview */}
               <div className="space-y-4">
                 <div>
                   <Label className="text-sm font-medium">Upload Preview</Label>
                   <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                     {imagePreview ? (
                       <img
                         src={imagePreview}
                         alt="Upload Preview"
                         className="w-full h-48 object-cover rounded"
                       />
                     ) : (
                       <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
                         <div className="text-center">
                           <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                           <p className="text-sm text-gray-500">Select an image to preview</p>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                 <div>
                   <Label className="text-sm font-medium">Form Summary</Label>
                   <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                     <div className="flex justify-between">
                       <span className="text-sm text-gray-600">Title:</span>
                       <span className="text-sm font-medium">{uploadForm.title || 'Not set'}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-sm text-gray-600">Category:</span>
                       <span className="text-sm font-medium">{uploadForm.category || 'Not set'}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-sm text-gray-600">Area:</span>
                       <span className="text-sm">{uploadForm.area || 'Not set'}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-sm text-gray-600">Equipment:</span>
                       <span className="text-sm">{uploadForm.equipment || 'Not set'}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-sm text-gray-600">Image:</span>
                       <span className="text-sm">{selectedFile ? selectedFile.name : 'Not selected'}</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Action Buttons */}
             <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
               <Button 
                 variant="outline" 
                 onClick={() => setShowUploadForm(false)}
                 disabled={isUploading}
               >
                 Cancel
               </Button>
               <Button 
                 onClick={handleUpload}
                 disabled={isUploading || !selectedFile || !uploadForm.title || !uploadForm.category}
                 className="bg-[#4FD1C5] hover:bg-[#38B2AC]"
               >
                 {isUploading ? (
                   <>
                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                     Uploading to Database...
                   </>
                 ) : (
                   <>
                     <Upload className="h-4 w-4 mr-2" />
                     Upload Image
                   </>
                 )}
               </Button>
             </div>
           </CardContent>
         </Card>
       )}

               {/* Enhanced Edit Modal */}
        {editingImage && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setEditingImage(null)} />
                         {/* Modal */}
             <Card className="max-w-4xl mx-auto fixed inset-4 z-50 overflow-y-auto bg-white dark:bg-gray-800 shadow-2xl">
            <CardHeader className={`${updateSuccess ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-[#4FD1C5] to-[#38B2AC]'} text-white transition-all duration-500`}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  {updateSuccess ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <Edit className="h-5 w-5 mr-2" />
                  )}
                  <span>
                    {updateSuccess ? '✅ Data Updated Successfully!' : `Edit Gallery Data: ${editingImage.title}`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingImage(null)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {updateSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">Data Successfully Updated!</h4>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Your changes have been saved to Supabase database and are now live on both admin and frontend.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-6">
               {/* Full Width Form - All Elements Vertical */}
               <div className="space-y-6">
                 <div className="space-y-4">
                   <div>
                     <Label htmlFor="edit-title" className="text-sm font-medium">Title *</Label>
                     <Input
                       id="edit-title"
                       value={editForm.title}
                       onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                       placeholder="Enter image title"
                       className="mt-1"
                     />
                   </div>
                   <div>
                     <Label htmlFor="edit-category" className="text-sm font-medium">Category *</Label>
                     <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                       <SelectTrigger className="mt-1">
                         <SelectValue placeholder="Select category" />
                       </SelectTrigger>
                       <SelectContent>
                         {categories.map((category) => (
                           <SelectItem key={category.value} value={category.value}>
                             {category.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

                 <div>
                   <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
                   <Textarea
                     id="edit-description"
                     value={editForm.description}
                     onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                     placeholder="Enter image description"
                     rows={4}
                     className="mt-1"
                   />
                 </div>

                 <div className="space-y-4">
                   <div>
                     <Label htmlFor="edit-area" className="text-sm font-medium">Area</Label>
                     <Input
                       id="edit-area"
                       value={editForm.area}
                       onChange={(e) => setEditForm({...editForm, area: e.target.value})}
                       placeholder="e.g., Main Floor, Second Floor"
                       className="mt-1"
                     />
                   </div>
                   <div>
                     <Label htmlFor="edit-equipment" className="text-sm font-medium">Equipment</Label>
                     <Input
                       id="edit-equipment"
                       value={editForm.equipment}
                       onChange={(e) => setEditForm({...editForm, equipment: e.target.value})}
                       placeholder="e.g., Digital X-ray, LED lighting"
                       className="mt-1"
                     />
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div>
                     <Label htmlFor="edit-sort-order" className="text-sm font-medium">Sort Order</Label>
                     <Input
                       id="edit-sort-order"
                       type="number"
                       value={editForm.sort_order}
                       onChange={(e) => setEditForm({...editForm, sort_order: parseInt(e.target.value) || 0})}
                       placeholder="0"
                       className="mt-1"
                     />
                   </div>
                   <div>
                     <Label htmlFor="edit-status" className="text-sm font-medium">Status</Label>
                     <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value as 'active' | 'inactive'})}>
                       <SelectTrigger className="mt-1">
                         <SelectValue placeholder="Select status" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="active">Active</SelectItem>
                         <SelectItem value="inactive">Inactive</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

                                   <div>
                    <Label htmlFor="edit-image" className="text-sm font-medium">Replace Image (Optional)</Label>
                    <div className="mt-1">
                      <Input
                        id="edit-image"
                        type="file"
                        accept="image/*"
                        onChange={handleEditFileChange}
                      />
                    </div>
                    {editImagePreview && (
                      <div className="mt-2">
                        <img src={editImagePreview} alt="Preview" className="w-40 h-40 object-cover rounded border-2 border-gray-200" />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to keep current image
                    </p>
                  </div>
               </div>

               {/* Image Preview Section */}
               <div className="space-y-4">
                 <div>
                   <Label className="text-sm font-medium">Current Image Preview</Label>
                   <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                     {editingImage.image_url && editingImage.image_url.includes('supabase.co') ? (
                       <img
                         src={editingImage.image_url}
                         alt={editingImage.title}
                         className="w-full h-48 object-cover rounded"
                       />
                     ) : (
                       <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
                         <div className="text-center">
                           <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                           <p className="text-sm text-gray-500">External URL</p>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                 <div>
                   <Label className="text-sm font-medium">Image Details</Label>
                   <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                     <div className="flex justify-between">
                       <span className="text-sm text-gray-600">ID:</span>
                       <span className="text-sm font-medium">{editingImage.id}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-sm text-gray-600">Status:</span>
                       <Badge variant={editingImage.status === 'active' ? 'default' : 'secondary'}>
                         {editingImage.status}
                       </Badge>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-sm text-gray-600">Created:</span>
                       <span className="text-sm">{new Date(editingImage.created_at).toLocaleDateString()}</span>
                     </div>
                     {editingImage.file_name && (
                       <div className="flex justify-between">
                         <span className="text-sm text-gray-600">File:</span>
                         <span className="text-sm">{editingImage.file_name}</span>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             </div>

             {/* Action Buttons */}
             <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
               <Button 
                 variant="outline" 
                 onClick={() => setEditingImage(null)}
                 disabled={isUpdating}
               >
                 Cancel
               </Button>
                               <Button 
                  onClick={handleUpdate}
                  disabled={isUpdating || !editForm.title || !editForm.category}
                  className={`${updateSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-[#4FD1C5] hover:bg-[#38B2AC]'}`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating Database...
                    </>
                  ) : updateSuccess ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Done
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Data
                    </>
                  )}
                </Button>
             </div>
           </CardContent>
         </Card>
           </>
         )}
       </div>
     );
   };

export default GalleryModify; 