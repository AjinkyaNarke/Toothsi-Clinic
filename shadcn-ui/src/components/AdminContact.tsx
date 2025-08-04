import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Save,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  AlertTriangle,
  Building,
  FileText
} from 'lucide-react';
import { 
  getContactInformation, 
  updateContactInformation 
} from '@/lib/supabase';

interface ContactInformation {
  id: number;
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
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const AdminContact = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [contactInfo, setContactInfo] = useState<ContactInformation | null>(null);
  const [formData, setFormData] = useState({
    clinic_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    whatsapp: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    working_hours: '',
    emergency_contact: '',
    registration_number: '',
    license_info: ''
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setIsFetching(true);
      const data = await getContactInformation();
      setContactInfo(data);
      setFormData({
        clinic_name: data.clinic_name || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        whatsapp: data.whatsapp || '',
        website: data.website || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        twitter: data.twitter || '',
        working_hours: data.working_hours || '',
        emergency_contact: data.emergency_contact || '',
        registration_number: data.registration_number || '',
        license_info: data.license_info || ''
      });
    } catch (error) {
      console.error('Error fetching contact information:', error);
      toast({
        title: "Error",
        description: "Failed to load contact information",
        variant: "destructive"
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Update Supabase database
      console.log('🔄 Updating contact information in Supabase...');
      await updateContactInformation(formData);
      console.log('✅ Supabase update successful');

      // Step 2: Refresh local admin data
      await fetchContactInfo();

      // Step 3: Invalidate React Query cache to force frontend updates
      console.log('🔄 Invalidating frontend cache...');
      await queryClient.invalidateQueries({ queryKey: ['contact-information'] });
      await queryClient.invalidateQueries({ queryKey: ['contact-information-frontend'] });
      console.log('✅ Frontend cache invalidated');

      // Step 4: Show success message
      toast({
        title: "Contact Information Updated! ✅",
        description: "Clinic contact details have been updated successfully. Changes will appear on the website immediately.",
      });

      console.log('🎉 Complete workflow: Admin → Supabase → Frontend ✅');
    } catch (error) {
      console.error('Error updating contact information:', error);
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#4FD1C5]" />
        <span className="ml-2 text-gray-600">Loading contact information...</span>
      </div>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Building className="h-6 w-6 mr-2 text-[#4FD1C5]" />
          Contact Information Management
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-300">
          Update clinic contact details, address, and social media links
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Building className="h-4 w-4 mr-2 text-[#4FD1C5]" />
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinic_name">Clinic Name</Label>
                <Input
                  id="clinic_name"
                  value={formData.clinic_name}
                  onChange={(e) => handleInputChange('clinic_name', e.target.value)}
                  placeholder="Toothsi क्लिनिक"
                  required
                />
              </div>
              <div>
                <Label htmlFor="registration_number">Registration Number</Label>
                <Input
                  id="registration_number"
                  value={formData.registration_number}
                  onChange={(e) => handleInputChange('registration_number', e.target.value)}
                  placeholder="DL/123/2021"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Phone className="h-4 w-4 mr-2 text-[#4FD1C5]" />
              Contact Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+919876543210"
                  required
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="+919876543210"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="info@toothsiclinic.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                  placeholder="+919876543211"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-[#4FD1C5]" />
              Address
            </h3>
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Shop No. 15, Medical Complex, Near City Hospital, CIDCO"
                rows={3}
                required
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Chhatrapati Sambhajinagar"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Maharashtra"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="431003"
                  required
                />
              </div>
            </div>
          </div>

          {/* Social Media & Website */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Globe className="h-4 w-4 mr-2 text-[#4FD1C5]" />
              Social Media & Website
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://toothsiclinic.com"
                />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/toothsiclinic"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/toothsiclinic"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/toothsiclinic"
                />
              </div>
            </div>
          </div>

          {/* Working Hours & License */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Clock className="h-4 w-4 mr-2 text-[#4FD1C5]" />
              Working Hours & License
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="working_hours">Working Hours</Label>
                <Textarea
                  id="working_hours"
                  value={formData.working_hours}
                  onChange={(e) => handleInputChange('working_hours', e.target.value)}
                  placeholder="Monday - Saturday: 9:00 AM - 7:00 PM&#10;Sunday: 10:00 AM - 2:00 PM"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="license_info">License Information</Label>
                <Textarea
                  id="license_info"
                  value={formData.license_info}
                  onChange={(e) => handleInputChange('license_info', e.target.value)}
                  placeholder="Licensed Dental Clinic • Registration No: DL/123/2021"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="bg-[#4FD1C5] hover:bg-[#38B2AC]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Contact Information
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Current Information Display */}
        {contactInfo && (
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-[#4FD1C5]" />
              Current Contact Information
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Clinic:</strong> {contactInfo.clinic_name}</p>
                <p><strong>Phone:</strong> {contactInfo.phone}</p>
                <p><strong>Email:</strong> {contactInfo.email}</p>
                <p><strong>Address:</strong> {contactInfo.address}</p>
                <p><strong>City:</strong> {contactInfo.city}, {contactInfo.state} - {contactInfo.pincode}</p>
              </div>
              <div>
                <p><strong>WhatsApp:</strong> {contactInfo.whatsapp || 'Not set'}</p>
                <p><strong>Website:</strong> {contactInfo.website || 'Not set'}</p>
                <p><strong>Emergency:</strong> {contactInfo.emergency_contact || 'Not set'}</p>
                <p><strong>Registration:</strong> {contactInfo.registration_number || 'Not set'}</p>
                <p><strong>Last Updated:</strong> {new Date(contactInfo.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminContact; 