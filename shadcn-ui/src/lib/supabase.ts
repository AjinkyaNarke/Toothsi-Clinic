import { createClient } from '@supabase/supabase-js';
import { STORAGE_BUCKETS, generateFileName, getStorageUrl } from './storage-config';

const supabaseUrl = 'https://brvbzcthotftvlvkmoxm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.warn('Missing Supabase anon key. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || '');



// Gallery functions
export const getGalleryImages = async () => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gallery images:', error);
    throw error;
  }

  // Return all images from database, let frontend handle display
  const allImages = data || [];
  const supabaseImages = allImages.filter(image => 
    image.image_url && image.image_url.includes('supabase.co')
  );
  
  console.log('✅ [GALLERY] Images from database:', {
    total: allImages.length,
    supabaseStorage: supabaseImages.length,
    externalUrls: allImages.length - supabaseImages.length
  });
  
  return allImages;
};

export const getGalleryImageById = async (id: number) => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching gallery image:', error);
    throw error;
  }

  return data;
};

export const uploadGalleryImage = async (imageFile: File, metadata: {
  title: string;
  description: string;
  category: string;
  area?: string;
  equipment?: string;
}) => {
  console.log('🖼️  [SUPABASE] Starting gallery image upload...', {
    fileName: imageFile.name,
    title: metadata.title,
    category: metadata.category
  });

  // Generate unique filename
  const fileName = generateFileName(imageFile.name, 'gallery');
  
  // Upload file to storage using configured bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.GALLERY_IMAGES.name)
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error('❌ [SUPABASE] Error uploading image to storage:', uploadError);
    throw uploadError;
  }

  console.log('✅ [SUPABASE] Image uploaded to storage successfully:', fileName);

  // Get public URL using helper function
  const publicUrl = getStorageUrl(STORAGE_BUCKETS.GALLERY_IMAGES.name, fileName);

  // Save metadata to database
  const { data, error } = await supabase
    .from('gallery_images')
    .insert({
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      area: metadata.area,
      equipment: metadata.equipment,
      image_url: publicUrl,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error saving image metadata to database:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Gallery image added to database successfully:', {
    id: data.id,
    title: data.title,
    category: data.category,
    storageUrl: publicUrl
  });

  return data;
};

export const updateGalleryImage = async (id: number, metadata: {
  title: string;
  description: string;
  category: string;
  area?: string;
  equipment?: string;
}) => {
  console.log('🖼️ [SUPABASE] Updating gallery image metadata:', { id, metadata });
  
  const { data, error } = await supabase
    .from('gallery_images')
    .update({
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      area: metadata.area,
      equipment: metadata.equipment,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error updating gallery image metadata:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Gallery image metadata updated successfully:', data);
  return data;
};

export const updateGalleryImageWithNewImage = async (id: number, newImageFile: File, metadata: {
  title: string;
  description: string;
  category: string;
  area?: string;
  equipment?: string;
}) => {
  console.log('🖼️ [SUPABASE] Updating gallery image with new image:', { 
    id, 
    fileName: newImageFile.name,
    fileSize: newImageFile.size,
    fileType: newImageFile.type,
    bucketName: STORAGE_BUCKETS.GALLERY_IMAGES.name
  });
  
  // Generate unique filename with gallery prefix
  const fileName = generateFileName(newImageFile.name, 'gallery');
  console.log('📝 [SUPABASE] Generated filename:', fileName);
  
  // Upload new image to storage
  console.log('📤 [SUPABASE] Uploading to storage bucket:', STORAGE_BUCKETS.GALLERY_IMAGES.name);
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.GALLERY_IMAGES.name)
    .upload(fileName, newImageFile);

  if (uploadError) {
    console.error('❌ [SUPABASE] Error uploading new gallery image to storage:', uploadError);
    throw uploadError;
  }

  console.log('✅ [SUPABASE] New gallery image uploaded to storage successfully:', {
    fileName,
    uploadData,
    bucket: STORAGE_BUCKETS.GALLERY_IMAGES.name
  });

  // Get public URL for new image
  const publicUrl = getStorageUrl(STORAGE_BUCKETS.GALLERY_IMAGES.name, fileName);
  console.log('🔗 [SUPABASE] Generated public URL:', publicUrl);

  // Update database with new image URL and metadata
  console.log('💾 [SUPABASE] Updating database record:', {
    id,
    newImageUrl: publicUrl,
    metadata
  });
  
  const { data, error } = await supabase
    .from('gallery_images')
    .update({
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      area: metadata.area,
      equipment: metadata.equipment,
      image_url: publicUrl,
      file_name: newImageFile.name,
      file_size: newImageFile.size,
      mime_type: newImageFile.type,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error updating gallery image with new image:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Gallery image updated with new image successfully:', {
    id: data.id,
    title: data.title,
    newImageUrl: data.image_url,
    updatedAt: data.updated_at,
    fileSize: data.file_size,
    fileName: data.file_name
  });

  // Verify the update was successful by fetching the record again
  console.log('🔍 [SUPABASE] Verifying database update...');
  const { data: verifyData, error: verifyError } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('id', id)
    .single();

  if (verifyError) {
    console.error('❌ [SUPABASE] Verification failed after update:', verifyError);
    throw new Error('Failed to verify database update');
  }

  console.log('✅ [SUPABASE] Update verification successful:', {
    id: verifyData.id,
    title: verifyData.title,
    imageUrl: verifyData.image_url,
    updatedAt: verifyData.updated_at,
    fileSize: verifyData.file_size,
    fileName: verifyData.file_name
  });

  return data;
};

export const deleteGalleryImage = async (id: number) => {
  // First get the image to delete from storage
  const { data: imageData, error: fetchError } = await supabase
    .from('gallery_images')
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching image for deletion:', fetchError);
    throw fetchError;
  }

  // Extract filename from URL
  const urlParts = imageData.image_url.split('/');
  const fileName = urlParts[urlParts.length - 1];

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('gallery-images')
    .remove([fileName]);

  if (storageError) {
    console.error('Error deleting image from storage:', storageError);
    // Continue with database deletion even if storage deletion fails
  }

  // Delete from database
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }

  return { success: true };
};

export const toggleGalleryImageStatus = async (id: number, status: 'active' | 'inactive') => {
  const { data, error } = await supabase
    .from('gallery_images')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling gallery image status:', error);
    throw error;
  }

  return data;
};

// Team management functions
export const getTeamMembers = async () => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }

  return data;
};

export const addTeamMember = async (memberData: {
  name: string;
  position: string;
  specialization: string;
  experience: string;
  education: string;
  phone: string;
  email: string;
  description: string;
  image_url?: string;
  achievements?: string[];
  sort_order?: number;
}) => {
  console.log('👥 [SUPABASE] Adding new team member to database...', {
    name: memberData.name,
    position: memberData.position,
    specialization: memberData.specialization,
    hasImage: !!memberData.image_url
  });

  const insertData = {
    ...memberData,
    status: 'active',
    achievements: memberData.achievements || ['New Team Member'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log('📝 [SUPABASE] Inserting team member data:', {
    name: insertData.name,
    position: insertData.position,
    imageUrl: insertData.image_url,
    achievements: insertData.achievements?.length || 0
  });

  const { data, error } = await supabase
    .from('team_members')
    .insert(insertData)
    .select();

  if (error) {
    console.error('❌ [SUPABASE] Error adding team member to database:', error);
    throw error;
  }

  const insertedMember = data && data.length > 0 ? data[0] : null;
  if (insertedMember) {
    console.log('✅ [SUPABASE] Team member added to database successfully:', {
      id: insertedMember.id,
      name: insertedMember.name,
      position: insertedMember.position,
      specialization: insertedMember.specialization,
      imageUrl: insertedMember.image_url,
      createdAt: insertedMember.created_at
    });
  } else {
    console.warn('⚠️ [SUPABASE] No team member returned after insert');
  }

  return insertedMember;
};

export const uploadTeamMemberImage = async (imageFile: File, memberName: string) => {
  console.log('🖼️ [SUPABASE] Starting team member image upload...', {
    fileName: imageFile.name,
    memberName
  });

  // Generate unique filename with team member prefix
  const fileName = generateFileName(imageFile.name, 'teammembers');
  
  // Upload file to storage using configured bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.TEAM_MEMBERS.name)
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error('❌ [SUPABASE] Error uploading team member image to storage:', uploadError);
    throw uploadError;
  }

  console.log('✅ [SUPABASE] Team member image uploaded to storage successfully:', fileName);

  // Get public URL using helper function
  const publicUrl = getStorageUrl(STORAGE_BUCKETS.TEAM_MEMBERS.name, fileName);

  console.log('✅ [SUPABASE] Team member image URL generated:', publicUrl);

  return publicUrl;
};

export const uploadProfileImage = async (imageFile: File, userId: string) => {
  console.log('👤 [SUPABASE] Starting profile image upload...', {
    fileName: imageFile.name,
    userId
  });

  // Generate unique filename with profile prefix
  const fileName = generateFileName(imageFile.name, 'profiles');
  
  // Upload file to storage using profile-images bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.PROFILE_IMAGES.name)
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error('❌ [SUPABASE] Error uploading profile image to storage:', uploadError);
    throw uploadError;
  }

  console.log('✅ [SUPABASE] Profile image uploaded to storage successfully:', fileName);

  // Get public URL using helper function
  const publicUrl = getStorageUrl(STORAGE_BUCKETS.PROFILE_IMAGES.name, fileName);

  console.log('✅ [SUPABASE] Profile image URL generated:', publicUrl);

  return publicUrl;
};

export const uploadClinicBrandingImage = async (imageFile: File, brandingType: string) => {
  console.log('🏥 [SUPABASE] Starting clinic branding image upload...', {
    fileName: imageFile.name,
    brandingType
  });

  // Generate unique filename with branding prefix
  const fileName = generateFileName(imageFile.name, `branding/${brandingType}`);
  
  // Upload file to storage using configured bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.CLINIC_BRANDING.name)
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error('❌ [SUPABASE] Error uploading clinic branding image to storage:', uploadError);
    throw uploadError;
  }

  console.log('✅ [SUPABASE] Clinic branding image uploaded to storage successfully:', fileName);

  // Get public URL using helper function
  const publicUrl = getStorageUrl(STORAGE_BUCKETS.CLINIC_BRANDING.name, fileName);

  console.log('✅ [SUPABASE] Clinic branding image URL generated:', publicUrl);

  return publicUrl;
};

export const uploadTreatmentImage = async (imageFile: File, treatmentType: string, patientId?: string) => {
  console.log('🦷 [SUPABASE] Starting treatment image upload...', {
    fileName: imageFile.name,
    treatmentType,
    patientId
  });

  // Generate unique filename with treatment prefix
  const fileName = generateFileName(imageFile.name, `treatments/${treatmentType}`);
  
  // Upload file to storage using configured bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.TREATMENT_IMAGES.name)
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error('❌ [SUPABASE] Error uploading treatment image to storage:', uploadError);
    throw uploadError;
  }

  console.log('✅ [SUPABASE] Treatment image uploaded to storage successfully:', fileName);

  // Get public URL using helper function
  const publicUrl = getStorageUrl(STORAGE_BUCKETS.TREATMENT_IMAGES.name, fileName);

  console.log('✅ [SUPABASE] Treatment image URL generated:', publicUrl);

  return publicUrl;
};

export const uploadEquipmentImage = async (imageFile: File, equipmentType: string) => {
  console.log('🔧 [SUPABASE] Starting equipment image upload...', {
    fileName: imageFile.name,
    equipmentType
  });

  // Generate unique filename with equipment prefix
  const fileName = generateFileName(imageFile.name, `equipment/${equipmentType}`);
  
  // Upload file to storage using configured bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.EQUIPMENT_IMAGES.name)
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error('❌ [SUPABASE] Error uploading equipment image to storage:', uploadError);
    throw uploadError;
  }

  console.log('✅ [SUPABASE] Equipment image uploaded to storage successfully:', fileName);

  // Get public URL using helper function
  const publicUrl = getStorageUrl(STORAGE_BUCKETS.EQUIPMENT_IMAGES.name, fileName);

  console.log('✅ [SUPABASE] Equipment image URL generated:', publicUrl);

  return publicUrl;
};

export const updateTeamMember = async (id: number, memberData: {
  name: string;
  position: string;
  specialization: string;
  experience: string;
  education: string;
  phone: string;
  email: string;
  description: string;
  image_url?: string;
  achievements?: string[];
  sort_order?: number;
}) => {
  console.log('👥 [SUPABASE] Updating team member in database...', {
    id,
    name: memberData.name,
    position: memberData.position
  });

  const { data, error } = await supabase
    .from('team_members')
    .update({
      ...memberData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('❌ [SUPABASE] Error updating team member in database:', error);
    throw error;
  }

  const updatedMember = data && data.length > 0 ? data[0] : null;
  if (updatedMember) {
    console.log('✅ [SUPABASE] Team member updated in database successfully:', {
      id: updatedMember.id,
      name: updatedMember.name,
      position: updatedMember.position
    });
  }

  return updatedMember;
};

export const updateTeamMemberWithImage = async (id: number, memberData: {
  name: string;
  position: string;
  specialization: string;
  experience: string;
  education: string;
  phone: string;
  email: string;
  description: string;
  image_url?: string;
  achievements?: string[];
  sort_order?: number;
}, newImageFile?: File) => {
  console.log('👥 [SUPABASE] Updating team member with image...', {
    id,
    name: memberData.name,
    position: memberData.position,
    hasNewImage: !!newImageFile
  });

  let finalImageUrl = memberData.image_url;

  // If a new image is provided, upload it to storage
  if (newImageFile) {
    console.log('🖼️ [SUPABASE] Uploading new team member profile image...', {
      fileName: newImageFile.name,
      memberName: memberData.name,
      fileSize: `${(newImageFile.size / 1024 / 1024).toFixed(2)} MB`
    });

    try {
      // Upload new image to profile-images storage
      const newImageUrl = await uploadProfileImage(newImageFile, memberData.name);
      finalImageUrl = newImageUrl;
      
      console.log('✅ [SUPABASE] New team member profile image uploaded successfully:', newImageUrl);
    } catch (error) {
      console.error('❌ [SUPABASE] Error uploading new team member profile image:', error);
      throw error;
    }
  }

  // Prepare update data
  const updateData = {
    ...memberData,
    image_url: finalImageUrl,
    updated_at: new Date().toISOString()
  };

  console.log('📝 [SUPABASE] Updating team member data in database:', {
    id,
    name: updateData.name,
    position: updateData.position,
    imageUrl: updateData.image_url,
    achievements: updateData.achievements?.length || 0
  });

  // Update team member with new image URL
  const { data, error } = await supabase
    .from('team_members')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('❌ [SUPABASE] Error updating team member in database:', error);
    throw error;
  }

  const updatedMember = data && data.length > 0 ? data[0] : null;
  if (updatedMember) {
    console.log('✅ [SUPABASE] Team member updated successfully in database:', {
      id: updatedMember.id,
      name: updatedMember.name,
      position: updatedMember.position,
      specialization: updatedMember.specialization,
      imageUrl: updatedMember.image_url,
      updatedAt: updatedMember.updated_at
    });
  } else {
    console.warn('⚠️ [SUPABASE] No team member found after update, ID:', id);
  }

  return updatedMember;
};

export const deleteTeamMember = async (id: number) => {
  console.log('🗑️ [SUPABASE] Deleting team member from database...', { id });

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ [SUPABASE] Error deleting team member from database:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Team member deleted from database successfully:', { id });
  return true;
};

export const toggleTeamMemberStatus = async (id: number, status: 'active' | 'inactive') => {
  console.log('👥 [SUPABASE] Toggling team member status in database...', { id, status });

  const { data, error } = await supabase
    .from('team_members')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) {
    console.error('❌ [SUPABASE] Error updating team member status in database:', error);
    throw error;
  }

  const updatedMember = data && data.length > 0 ? data[0] : null;
  if (updatedMember) {
    console.log('✅ [SUPABASE] Team member status updated in database successfully:', {
      id: updatedMember.id,
      name: updatedMember.name,
      status: updatedMember.status
    });
  }

  return updatedMember;
};

// Contact form functions
export const submitCallbackRequest = async (formData: {
  name: string;
  phone: string;
  preferred_time: string;
  message?: string;
}) => {
  console.log('Submitting to Supabase:', formData);
  
  const { data, error } = await supabase
    .from('callback_requests')
    .insert({
      name: formData.name,
      phone: formData.phone,
      preferred_time: formData.preferred_time,
      message: formData.message || null,
      status: 'pending',
      priority: 'normal'
    })
    .select();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Database error: ${error.message}`);
  }

  console.log('Supabase response:', data);
  return data && data.length > 0 ? data[0] : null;
};

export const getCallbackRequests = async () => {
  const { data, error } = await supabase
    .from('callback_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching callback requests:', error);
    throw error;
  }

  return data;
};

// Contact Information Functions
export const getContactInformation = async () => {
  const { data, error } = await supabase
    .from('contact_information')
    .select('*')
    .eq('status', 'active')
    .single();

  if (error) {
    console.error('Error fetching contact information:', error);
    throw error;
  }

  return data;
};

export const updateContactInformation = async (contactData: {
  clinic_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  whatsapp?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  working_hours?: string;
  emergency_contact?: string;
  registration_number?: string;
  license_info?: string;
}) => {
  console.log('📞 [SUPABASE] Updating clinic contact information in database...', {
    clinic_name: contactData.clinic_name,
    phone: contactData.phone,
    email: contactData.email,
    city: contactData.city
  });
  
  // First, check if we have an active record
  const { data: existingData, error: checkError } = await supabase
    .from('contact_information')
    .select('*')
    .eq('status', 'active')
    .limit(1);

  if (checkError) {
    console.error('❌ [SUPABASE] Error checking existing contact information:', checkError);
    throw checkError;
  }

  if (!existingData || existingData.length === 0) {
    console.log('⚠️ [SUPABASE] No active contact record found, creating new one...');
    // Create a new active record
    const { data: newData, error: insertError } = await supabase
      .from('contact_information')
      .insert({
        ...contactData,
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ [SUPABASE] Error creating new contact information:', insertError);
      throw insertError;
    }

    console.log('✅ [SUPABASE] New contact information record created successfully:', {
      clinic_name: newData.clinic_name,
      phone: newData.phone
    });
    return newData;
  }

  // Update existing record
  const { data, error } = await supabase
    .from('contact_information')
    .update(contactData)
    .eq('status', 'active')
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error updating contact information:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Contact information updated successfully:', {
    clinic_name: data.clinic_name,
    phone: data.phone,
    email: data.email
  });
  return data;
};

export const getAllContactInformation = async () => {
  const { data, error } = await supabase
    .from('contact_information')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all contact information:', error);
    throw error;
  }

  return data;
};

// Dental Services functions
export const getDentalServices = async () => {
  const { data, error } = await supabase
    .from('dental_services')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dental services:', error);
    throw error;
  }

  return data;
};

export const getDentalServiceById = async (id: number) => {
  const { data, error } = await supabase
    .from('dental_services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching dental service:', error);
    throw error;
  }

  return data;
};

export const addDentalService = async (serviceData: {
  title: string;
  description: string;
  icon?: string;
  category?: string;
  features?: string[];
  sort_order?: number;
}) => {
  console.log('🦷 [SUPABASE] Adding new dental service to database...', {
    title: serviceData.title,
    category: serviceData.category,
    icon: serviceData.icon
  });

  const { data, error } = await supabase
    .from('dental_services')
    .insert({
      ...serviceData,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error adding dental service to database:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Dental service added to database successfully:', {
    id: data.id,
    title: data.title,
    category: data.category
  });

  return data;
};

export const updateDentalService = async (id: number, serviceData: {
  title: string;
  description: string;
  icon?: string;
  category?: string;
  features?: string[];
  sort_order?: number;
}) => {
  console.log('🦷 [SUPABASE] Updating dental service in database...', {
    id,
    title: serviceData.title,
    category: serviceData.category
  });

  const { data, error } = await supabase
    .from('dental_services')
    .update({
      ...serviceData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error updating dental service in database:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Dental service updated in database successfully:', {
    id: data.id,
    title: data.title,
    category: data.category
  });

  return data;
};

export const deleteDentalService = async (id: number) => {
  console.log('🗑️ [SUPABASE] Deleting dental service from database...', { id });

  const { error } = await supabase
    .from('dental_services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ [SUPABASE] Error deleting dental service from database:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Dental service deleted from database successfully:', { id });
  return { success: true };
};

export const toggleDentalServiceStatus = async (id: number, status: 'active' | 'inactive') => {
  console.log('🦷 [SUPABASE] Toggling dental service status...', { id, status });

  const { data, error } = await supabase
    .from('dental_services')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error toggling dental service status:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Dental service status updated successfully:', {
    id: data.id,
    title: data.title,
    status: data.status,
    updatedAt: data.updated_at
  });

  return data;
};

export const getAllDentalServices = async () => {
  const { data, error } = await supabase
    .from('dental_services')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all dental services:', error);
    throw error;
  }

  return data;
};

export const activateAllDentalServices = async () => {
  console.log('🦷 [SUPABASE] Activating all dental services...');

  const { data, error } = await supabase
    .from('dental_services')
    .update({
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .neq('id', 0) // Update all records
    .select();

  if (error) {
    console.error('❌ [SUPABASE] Error activating all dental services:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] All dental services activated successfully:', {
    count: data?.length || 0,
    services: data?.map(s => ({ id: s.id, title: s.title, status: s.status }))
  });

  return data;
}; 

// Appointments Management Functions
export const getAppointments = async () => {
  console.log('📅 [SUPABASE] Fetching appointments from database...');
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_datetime', { ascending: false });

  if (error) {
    console.error('❌ [SUPABASE] Error fetching appointments:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Successfully fetched appointments. Count:', data?.length || 0);
  return data;
};

export const getAppointmentsByDate = async (date: string) => {
  console.log(`📅 [SUPABASE] Fetching appointments for date: ${date}`);
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('appointment_date', date)
    .order('appointment_time', { ascending: true });

  if (error) {
    console.error('❌ [SUPABASE] Error fetching appointments by date:', error);
    throw error;
  }

  console.log(`✅ [SUPABASE] Successfully fetched appointments for ${date}. Count:`, data?.length || 0);
  return data;
};

export const updateAppointmentStatus = async (id: number, status: string) => {
  console.log(`📅 [SUPABASE] Updating appointment ${id} status to: ${status}`);
  
  const { data, error } = await supabase
    .from('appointments')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('❌ [SUPABASE] Error updating appointment status:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Successfully updated appointment status:', data);
  return data;
};

export const deleteAppointment = async (id: number) => {
  console.log(`🗑️ [SUPABASE] Deleting appointment ${id}`);
  
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ [SUPABASE] Error deleting appointment:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Successfully deleted appointment');
};

export const addAppointment = async (appointmentData: {
  cal_event_id?: string;
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
  appointment_date: string;
  appointment_time: string;
  appointment_datetime: string;
  service_type?: string;
  duration_minutes?: number;
  status?: string;
  notes?: string;
}) => {
  console.log('📅 [SUPABASE] Adding new appointment:', {
    patientName: appointmentData.patient_name,
    patientEmail: appointmentData.patient_email,
    appointmentDate: appointmentData.appointment_date,
    serviceType: appointmentData.service_type
  });
  
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select();

  if (error) {
    console.error('❌ [SUPABASE] Error adding appointment:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Successfully added appointment:', data);
  return data;
};

// Enhanced Gallery Functions
export const getGalleryImagesByCategory = async (category: string) => {
  console.log(`🖼️ [SUPABASE] Fetching gallery images for category: ${category}`);
  
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('category', category)
    .eq('status', 'active')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ [SUPABASE] Error fetching gallery images by category:', error);
    throw error;
  }

  console.log(`✅ [SUPABASE] Successfully fetched ${data?.length || 0} images for category: ${category}`);
  return data;
};

export const updateGalleryImageSortOrder = async (id: number, sortOrder: number) => {
  console.log(`🖼️ [SUPABASE] Updating gallery image sort order: ${id} -> ${sortOrder}`);
  
  const { data, error } = await supabase
    .from('gallery_images')
    .update({ 
      sort_order: sortOrder,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('❌ [SUPABASE] Error updating gallery image sort order:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Gallery image sort order updated successfully:', data);
  return data;
};

export const bulkUpdateGalleryImages = async (updates: Array<{ id: number; sort_order: number }>) => {
  console.log('🖼️ [SUPABASE] Bulk updating gallery images:', updates.length);
  
  const { data, error } = await supabase
    .from('gallery_images')
    .upsert(updates.map(update => ({
      id: update.id,
      sort_order: update.sort_order,
      updated_at: new Date().toISOString()
    })))
    .select();

  if (error) {
    console.error('❌ [SUPABASE] Error bulk updating gallery images:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Gallery images bulk updated successfully:', data?.length);
  return data;
};

export const getGalleryCategories = async () => {
  console.log('🖼️ [SUPABASE] Fetching gallery categories...');
  
  const { data, error } = await supabase
    .from('gallery_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('❌ [SUPABASE] Error fetching gallery categories:', error);
    throw error;
  }

  console.log(`✅ [SUPABASE] Successfully fetched ${data?.length || 0} gallery categories`);
  return data;
};

export const uploadGalleryImageWithThumbnail = async (imageFile: File, metadata: {
  title: string;
  description: string;
  category: string;
  area?: string;
  equipment?: string;
}) => {
  console.log('🖼️ [SUPABASE] Starting gallery image upload with thumbnail...', {
    fileName: imageFile.name,
    title: metadata.title,
    category: metadata.category
  });

  // Generate unique filename with gallery prefix
  const fileName = generateFileName(imageFile.name, 'gallery');
  
  // Upload original image to gallery-images bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.GALLERY_IMAGES.name)
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error('❌ [SUPABASE] Error uploading gallery image to storage:', uploadError);
    throw uploadError;
  }

  console.log('✅ [SUPABASE] Gallery image uploaded to storage successfully:', fileName);

  // Get public URL for original image
  const publicUrl = getStorageUrl(STORAGE_BUCKETS.GALLERY_IMAGES.name, fileName);

  // Create thumbnail filename
  const thumbnailFileName = `thumbnails/${fileName}`;
  
  // For now, we'll use the same image as thumbnail (in production, you'd resize it)
  const { data: thumbnailUploadData, error: thumbnailUploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.GALLERY_THUMBNAILS.name)
    .upload(thumbnailFileName, imageFile);

  if (thumbnailUploadError) {
    console.warn('⚠️ [SUPABASE] Error uploading thumbnail, continuing with original:', thumbnailUploadError);
  } else {
    console.log('✅ [SUPABASE] Gallery thumbnail uploaded successfully:', thumbnailFileName);
  }

  // Add metadata to database with both URLs
  const { data: dbData, error: dbError } = await supabase
    .from('gallery_images')
    .insert([{
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      area: metadata.area,
      equipment: metadata.equipment,
      image_url: publicUrl,
      file_name: imageFile.name,
      file_size: imageFile.size,
      mime_type: imageFile.type,
      status: 'active',
      sort_order: 0,
      created_at: new Date().toISOString()
    }])
    .select();

  if (dbError) {
    console.error('❌ [SUPABASE] Error adding gallery image to database:', dbError);
    throw dbError;
  }

  const insertedImage = dbData && dbData.length > 0 ? dbData[0] : null;
  if (insertedImage) {
    console.log('✅ [SUPABASE] Gallery image added to database successfully:', {
      id: insertedImage.id,
      title: insertedImage.title,
      category: insertedImage.category,
      imageUrl: insertedImage.image_url,
      createdAt: insertedImage.created_at
    });
  } else {
    console.warn('⚠️ [SUPABASE] No gallery image returned after insert');
  }

  return insertedImage;
};

// Testimonials functions
export const getTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }

  return data || [];
};

export const getFeaturedTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('rating', 5)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured testimonials:', error);
    throw error;
  }

  return data || [];
};

export const getTestimonialById = async (id: number) => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching testimonial:', error);
    throw error;
  }

  return data;
};

export const addTestimonial = async (testimonialData: {
  patient_name: string;
  testimonial_text: string;
  rating: number;
}) => {
  console.log('📝 [SUPABASE] Adding new testimonial...', {
    patient_name: testimonialData.patient_name,
    rating: testimonialData.rating
  });

  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonialData)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error adding testimonial:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Testimonial added successfully:', {
    id: data.id,
    patient_name: data.patient_name,
    rating: data.rating
  });

  return data;
};

export const updateTestimonial = async (id: number, testimonialData: {
  patient_name: string;
  testimonial_text: string;
  rating: number;
}) => {
  console.log('🔄 [SUPABASE] Updating testimonial...', {
    id,
    patient_name: testimonialData.patient_name,
    rating: testimonialData.rating
  });

  const { data, error } = await supabase
    .from('testimonials')
    .update({
      ...testimonialData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error updating testimonial:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Testimonial updated successfully:', {
    id: data.id,
    patient_name: data.patient_name,
    rating: data.rating
  });

  return data;
};

export const deleteTestimonial = async (id: number) => {
  console.log('🗑️ [SUPABASE] Deleting testimonial...', { id });

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ [SUPABASE] Error deleting testimonial:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Testimonial deleted successfully:', { id });
};

export const toggleTestimonialStatus = async (id: number, status: 'active' | 'inactive') => {
  console.log('🔄 [SUPABASE] Toggling testimonial status...', { id, status });

  const { data, error } = await supabase
    .from('testimonials')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error toggling testimonial status:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Testimonial status updated successfully:', {
    id: data.id,
    status: data.status
  });

  return data;
};

export const toggleFeaturedStatus = async (id: number, is_featured: boolean) => {
  console.log('⭐ [SUPABASE] Toggling featured status...', { id, is_featured });

  const { data, error } = await supabase
    .from('testimonials')
    .update({ is_featured })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error toggling featured status:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Featured status updated successfully:', {
    id: data.id,
    is_featured: data.is_featured
  });

  return data;
};

export const getAllTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all testimonials:', error);
    throw error;
  }

  return data || [];
};

// Enhanced testimonials functions for Google Reviews integration
export const getTestimonialsBySource = async (sourceType: 'manual' | 'google_review' | 'apify_scraper') => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('source_type', sourceType)
    .eq('status', 'active')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials by source:', error);
    throw error;
  }

  return data || [];
};

export const getGoogleReviews = async () => {
  return getTestimonialsBySource('google_review');
};

export const getManualTestimonials = async () => {
  return getTestimonialsBySource('manual');
};

export const importGoogleReviewsFromApify = async (reviewsData: any[], scraperRunId: string) => {
  console.log('🔄 [SUPABASE] Importing Google reviews from Apify...', {
    reviewsCount: reviewsData.length,
    runId: scraperRunId
  });

  const { data, error } = await supabase.rpc('import_google_reviews_from_apify', {
    reviews_data: reviewsData,
    scraper_run_id: scraperRunId
  });

  if (error) {
    console.error('❌ [SUPABASE] Error importing Google reviews:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Google reviews imported successfully:', data);
  return data;
};

export const getApifyScraperRuns = async () => {
  const { data, error } = await supabase
    .from('apify_scraper_runs')
    .select('*')
    .order('started_at', { ascending: false });

  if (error) {
    console.error('Error fetching Apify scraper runs:', error);
    throw error;
  }

  return data || [];
};

export const updateTestimonialSourceType = async (id: number, sourceType: 'manual' | 'google_review' | 'apify_scraper') => {
  console.log('🔄 [SUPABASE] Updating testimonial source type...', { id, sourceType });

  const { data, error } = await supabase
    .from('testimonials')
    .update({ source_type: sourceType })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error updating testimonial source type:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Testimonial source type updated successfully:', {
    id: data.id,
    source_type: data.source_type
  });

  return data;
};

export const syncGoogleReview = async (id: number) => {
  console.log('🔄 [SUPABASE] Syncing Google review...', { id });

  const { data, error } = await supabase
    .from('testimonials')
    .update({ 
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Error syncing Google review:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Google review synced successfully:', { id });
  return data;
}; 