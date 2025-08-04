import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { submitCallbackRequest, getContactInformation } from '@/lib/supabase';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    bestTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch contact information from Supabase
  const { data: contactInfo, isLoading: contactLoading } = useQuery({
    queryKey: ['contact-information-frontend'],
    queryFn: getContactInformation,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const phoneNumber = contactInfo?.phone || '+919876543210';
  const whatsappNumber = contactInfo?.whatsapp || contactInfo?.phone || '+919876543210';
  const whatsappMessage = encodeURIComponent('Hi Toothsi क्लिनिक, I would like to know more about your dental services.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    console.log('Validating form data:', formData);

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      console.log('Name validation failed');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      console.log('Phone validation failed - empty');
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
      console.log('Phone validation failed - invalid format:', formData.phone);
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      console.log('Email validation failed');
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      toast({
        title: "Validation Error",
        description: "Please check the form and try again.",
        variant: "destructive"
      });
      return;
    }

    console.log('Form validation passed, submitting...');
    setIsSubmitting(true);

    try {
      const requestData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        preferred_time: formData.bestTime || 'anytime',
        message: formData.message.trim() || undefined
      };
      
      console.log('Submitting callback request:', requestData);

      const result = await submitCallbackRequest(requestData);

      console.log('Callback request submitted successfully:', result);

      toast({
        title: "Callback Requested Successfully! 🎉",
        description: "We'll call you back within 30 minutes during business hours.",
      });

      // Reset form
      setFormData({ name: '', phone: '', email: '', message: '', bestTime: '' });
      setErrors({});
      
    } catch (error) {
      console.error('Error submitting callback request:', error);
      
      let errorMessage = "Unable to submit your request. Please try again or contact us directly.";
      
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };



  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column - Contact Form & Info */}
          <div className="space-y-8">
            
            {/* Contact Form */}
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Request a Callback
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fill out the form below and we'll call you back within 30 minutes
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your dental concerns..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bestTime" className="text-gray-700 dark:text-gray-300">Best Time to Call</Label>
                    <Select value={formData.bestTime} onValueChange={(value) => handleInputChange('bestTime', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                        <SelectItem value="evening">Evening (4 PM - 8 PM)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full bg-[#4FD1C5] hover:bg-[#3FC5B5] text-white h-12 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Request Callback
                        </>
                      )}
                    </Button>
                    

                  </div>
                </form>
              </CardContent>
            </Card>

            {/* WhatsApp Quick Contact */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quick WhatsApp Chat</h3>
                <p className="text-gray-600 dark:text-gray-300">Get instant replies to your questions!</p>
                <Button 
                  onClick={() => window.open(whatsappUrl, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Start WhatsApp Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info & Map */}
          <div className="space-y-8">
            
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <a 
                  href={`tel:${phoneNumber}`}
                  className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg">
                      {contactLoading ? 'Loading...' : phoneNumber}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tap to call instantly</div>
                  </div>
                </a>
                
                <div className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg">
                      {contactLoading ? 'Loading...' : (contactInfo?.email || 'info@toothsiclinic.com')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Email us anytime</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Our Location</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {contactLoading ? 'Loading...' : (
                        <>
                          {contactInfo?.address || 'Dr. Prasad\'s Lotus Dental Clinic,'}<br />
                          {contactInfo?.city || 'Mangalwar Peth, Aurangabad'} - {contactInfo?.pincode || '431001'}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Clinic Hours</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {contactLoading ? 'Loading...' : (
                        contactInfo?.working_hours || 'Mon - Sat: 9:00 AM - 8:00 PM\nSun: 10:00 AM - 6:00 PM'
                      )}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">Emergency: 24/7 WhatsApp support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#4FD1C5]" />
                    Our Location
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Visit us at Dr. Prasad's Lotus Dental Clinic in Aurangabad, Maharashtra
                  </p>
                  <div className="mt-2 p-2 bg-[#4FD1C5]/10 rounded-lg">
                    <p className="text-xs text-[#4FD1C5] font-medium">
                      💡 Click on the map or "Get Directions" button for exact location
                    </p>
                  </div>
                </div>
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden relative group">
                  <iframe
                    src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Dr.%20Prasad's%20Lotus%20Dental%20Clinic%20Mangalwar%20Peth%20Aurangabad%20Maharashtra&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Dr. Prasad's Lotus Dental Clinic - Aurangabad, Maharashtra"
                  />
                  <div 
                    className="absolute inset-0 bg-transparent cursor-pointer group-hover:bg-black/5 transition-colors flex items-center justify-center"
                    onClick={() => window.open('https://maps.app.goo.gl/Rt3aaxyPJeEPKx649', '_blank')}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg shadow-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Click to open in Google Maps
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Dr. Prasad's Lotus Dental Clinic</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Mangalwar Peth, Aurangabad, Maharashtra</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://maps.app.goo.gl/Rt3aaxyPJeEPKx649', '_blank')}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Get Directions
                      </Button>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => window.open('https://maps.app.goo.gl/Rt3aaxyPJeEPKx649', '_blank')}
                        className="w-full bg-[#4FD1C5] hover:bg-[#4FD1C5]/90 text-white"
                        size="sm"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Open Exact Location in Google Maps
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Click above for precise directions to our clinic
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Emergency Dental Care</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            For dental emergencies outside business hours, send us a WhatsApp message and we'll respond within 15 minutes with guidance and immediate care instructions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;