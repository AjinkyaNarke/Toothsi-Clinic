import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Upload,
  ImageIcon,
  Users,
  Building,
  Stethoscope,
  Settings,
  FileText,
  HardDrive,
  Eye,
  Download,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { 
  supabase,
  uploadGalleryImage,
  uploadTeamMemberImage,
  uploadClinicBrandingImage,
  uploadTreatmentImage,
  uploadEquipmentImage
} from '@/lib/supabase';
import { STORAGE_BUCKETS, getStorageStats } from '@/lib/storage-config';

interface StorageStats {
  [key: string]: {
    bucketName: string;
    fileCount: number;
    description: string;
  };
}

const AdminStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>('');
  const [uploadMetadata, setUploadMetadata] = useState({
    title: '',
    description: '',
    category: '',
    brandingType: '',
    treatmentType: '',
    equipmentType: '',
    memberName: ''
  });

  // Fetch storage statistics
  const { data: storageStats, isLoading: isStatsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['storage-stats'],
    queryFn: () => getStorageStats(supabase),
    staleTime: 5 * 60 * 1000,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('📁 [ADMIN] File selected for upload:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadType) {
      toast({
        title: "❌ Error",
        description: "Please select a file and upload type",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      let imageUrl = '';

      switch (uploadType) {
        case 'gallery':
          imageUrl = await uploadGalleryImage(selectedFile, {
            title: uploadMetadata.title,
            description: uploadMetadata.description,
            category: uploadMetadata.category
          });
          break;

        case 'team-member':
          imageUrl = await uploadTeamMemberImage(selectedFile, uploadMetadata.memberName);
          break;

        case 'clinic-branding':
          imageUrl = await uploadClinicBrandingImage(selectedFile, uploadMetadata.brandingType);
          break;

        case 'treatment':
          imageUrl = await uploadTreatmentImage(selectedFile, uploadMetadata.treatmentType);
          break;

        case 'equipment':
          imageUrl = await uploadEquipmentImage(selectedFile, uploadMetadata.equipmentType);
          break;

        default:
          throw new Error('Invalid upload type');
      }

      toast({
        title: "✅ Upload Successful!",
        description: `Image uploaded successfully to ${uploadType} bucket`,
      });

      // Reset form
      setSelectedFile(null);
      setUploadType('');
      setUploadMetadata({
        title: '',
        description: '',
        category: '',
        brandingType: '',
        treatmentType: '',
        equipmentType: '',
        memberName: ''
      });

      // Refresh stats
      refetchStats();

    } catch (error) {
      console.error('❌ [ADMIN] Upload error:', error);
      toast({
        title: "❌ Upload Failed",
        description: `Failed to upload image: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getBucketIcon = (bucketName: string) => {
    switch (bucketName) {
      case 'gallery-images':
        return <ImageIcon className="h-5 w-5" />;
      case 'teammembers':
        return <Users className="h-5 w-5" />;
      case 'clinic-branding':
        return <Building className="h-5 w-5" />;
      case 'treatment-images':
        return <Stethoscope className="h-5 w-5" />;
      case 'equipment-images':
        return <Settings className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getBucketColor = (bucketName: string) => {
    switch (bucketName) {
      case 'gallery-images':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'teammembers':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'clinic-branding':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'treatment-images':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'equipment-images':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#4FD1C5]" />
        <span className="ml-2 text-gray-600">Loading storage statistics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Storage Management</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage images and files across all storage buckets</p>
          </div>
          <Button onClick={() => refetchStats()} variant="outline">
            <HardDrive className="h-4 w-4 mr-2" />
            Refresh Stats
          </Button>
        </div>

        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storageStats && Object.entries(storageStats).map(([key, stats]) => (
            <Card key={key} className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getBucketIcon(stats.bucketName)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {stats.bucketName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {stats.description}
                      </p>
                    </div>
                  </div>
                  <Badge className={getBucketColor(stats.bucketName)}>
                    {stats.fileCount} files
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload New Image</h3>
        
        <div className="space-y-4">
          {/* File Selection */}
          <div>
            <Label htmlFor="file-upload">Select Image File</Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-1"
            />
            {selectedFile && (
              <div className="mt-2 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>

          {/* Upload Type Selection */}
          <div>
            <Label htmlFor="upload-type">Upload Type</Label>
            <Select value={uploadType} onValueChange={setUploadType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select upload type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gallery">Gallery Image</SelectItem>
                <SelectItem value="team-member">Team Member Photo</SelectItem>
                <SelectItem value="clinic-branding">Clinic Branding</SelectItem>
                <SelectItem value="treatment">Treatment Image</SelectItem>
                <SelectItem value="equipment">Equipment Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Metadata Fields based on upload type */}
          {uploadType === 'gallery' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={uploadMetadata.title}
                  onChange={(e) => setUploadMetadata(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Image title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={uploadMetadata.description}
                  onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Image description"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={uploadMetadata.category}
                  onChange={(e) => setUploadMetadata(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Image category"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {uploadType === 'team-member' && (
            <div>
              <Label htmlFor="member-name">Team Member Name</Label>
              <Input
                id="member-name"
                value={uploadMetadata.memberName}
                onChange={(e) => setUploadMetadata(prev => ({ ...prev, memberName: e.target.value }))}
                placeholder="Enter team member name"
                className="mt-1"
              />
            </div>
          )}

          {uploadType === 'clinic-branding' && (
            <div>
              <Label htmlFor="branding-type">Branding Type</Label>
              <Input
                id="branding-type"
                value={uploadMetadata.brandingType}
                onChange={(e) => setUploadMetadata(prev => ({ ...prev, brandingType: e.target.value }))}
                placeholder="e.g., logo, banner, promotional"
                className="mt-1"
              />
            </div>
          )}

          {uploadType === 'treatment' && (
            <div>
              <Label htmlFor="treatment-type">Treatment Type</Label>
              <Input
                id="treatment-type"
                value={uploadMetadata.treatmentType}
                onChange={(e) => setUploadMetadata(prev => ({ ...prev, treatmentType: e.target.value }))}
                placeholder="e.g., root-canal, implant, whitening"
                className="mt-1"
              />
            </div>
          )}

          {uploadType === 'equipment' && (
            <div>
              <Label htmlFor="equipment-type">Equipment Type</Label>
              <Input
                id="equipment-type"
                value={uploadMetadata.equipmentType}
                onChange={(e) => setUploadMetadata(prev => ({ ...prev, equipmentType: e.target.value }))}
                placeholder="e.g., x-ray, scanner, chair"
                className="mt-1"
              />
            </div>
          )}

          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !uploadType || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Storage Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Storage Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Storage Buckets</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your project uses organized storage buckets for different types of images. 
                Each bucket has specific permissions and is optimized for its content type.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(STORAGE_BUCKETS).map(([key, bucket]) => (
              <div key={key} className="border rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  {getBucketIcon(bucket.name)}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {bucket.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {bucket.description}
                </p>
                <p className="text-xs text-gray-500">
                  URL: {bucket.url}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStorage; 