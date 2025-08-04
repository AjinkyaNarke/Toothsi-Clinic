// Storage Configuration for Toothsi Clinic Landing Page
// This file contains all storage bucket configurations and URL patterns

export const STORAGE_BUCKETS = {
  // Gallery Images - for clinic gallery photos
  GALLERY_IMAGES: {
    name: 'gallery-images',
    url: 'https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/gallery-images',
    description: 'Clinic gallery images and dental work photos'
  },
  
  // Gallery Categories - for organized storage
  GALLERY_CATEGORIES: {
    name: 'gallery-categories',
    url: 'https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/gallery-categories',
    description: 'Organized gallery images by category'
  },
  
  // Gallery Thumbnails - for optimized images
  GALLERY_THUMBNAILS: {
    name: 'gallery-thumbnails',
    url: 'https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/gallery-thumbnails',
    description: 'Optimized thumbnail images for gallery'
  },
  
  // Team Member Images - for doctor and staff photos
  TEAM_MEMBERS: {
    name: 'teammembers',
    url: 'https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/teammembers',
    description: 'Team member profile photos'
  },
  
  // Profile Images - dedicated bucket for profile photos
  PROFILE_IMAGES: {
    name: 'profile-images',
    url: 'https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/profile-images',
    description: 'User profile images and avatars'
  },
  
  // Clinic Logo and Branding
  CLINIC_BRANDING: {
    name: 'clinic-branding',
    url: 'https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/clinic-branding',
    description: 'Clinic logo, branding materials, and promotional images'
  },
  
  // Treatment Images - for before/after photos
  TREATMENT_IMAGES: {
    name: 'treatment-images',
    url: 'https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/treatment-images',
    description: 'Before/after treatment photos and case studies'
  },
  
  // Equipment Images - for clinic equipment photos
  EQUIPMENT_IMAGES: {
    name: 'equipment-images',
    url: 'https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/equipment-images',
    description: 'Clinic equipment and technology photos'
  }
};

// Storage bucket creation commands for Supabase
export const STORAGE_SETUP_COMMANDS = `
-- Create storage buckets in Supabase SQL Editor:

-- 1. Gallery Images Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true);

-- 2. Gallery Categories Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-categories', 'gallery-categories', true);

-- 3. Gallery Thumbnails Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-thumbnails', 'gallery-thumbnails', true);

-- 4. Team Members Bucket  
INSERT INTO storage.buckets (id, name, public) 
VALUES ('teammembers', 'teammembers', true);

-- 3. Profile Images Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true);

-- 4. Clinic Branding Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('clinic-branding', 'clinic-branding', true);

-- 4. Treatment Images Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('treatment-images', 'treatment-images', true);

-- 5. Equipment Images Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('equipment-images', 'equipment-images', true);

-- Set up RLS policies for public access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('gallery-images', 'gallery-categories', 'gallery-thumbnails', 'teammembers', 'profile-images', 'clinic-branding', 'treatment-images', 'equipment-images'));

CREATE POLICY "Authenticated Users Can Upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Can Update" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Users Can Delete" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
`;

// Helper functions for storage operations
export const getStorageUrl = (bucketName: string, filePath: string): string => {
  return `https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/${bucketName}/${filePath}`;
};

export const getBucketUrl = (bucketName: string): string => {
  return `https://brvbzcthotftvlvkmoxm.supabase.co/storage/v1/object/public/${bucketName}`;
};

// File upload helpers
export const generateFileName = (originalName: string, prefix?: string): string => {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return prefix ? `${prefix}/${timestamp}-${cleanName}` : `${timestamp}-${cleanName}`;
};

// Storage bucket validation
export const validateBucketName = (bucketName: string): boolean => {
  const validBuckets = Object.values(STORAGE_BUCKETS).map(bucket => bucket.name);
  return validBuckets.includes(bucketName);
};

// Storage statistics helper
export const getStorageStats = async (supabase: any) => {
  const stats = {};
  
  for (const [key, bucket] of Object.entries(STORAGE_BUCKETS)) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket.name)
        .list();
      
      if (!error) {
        stats[key] = {
          bucketName: bucket.name,
          fileCount: data?.length || 0,
          description: bucket.description
        };
      }
    } catch (error) {
      console.error(`Error getting stats for bucket ${bucket.name}:`, error);
    }
  }
  
  return stats;
}; 