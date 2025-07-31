import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  CheckCircle 
} from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bestTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phoneNumber = '+919876543210'; // Replace with actual clinic number
  const whatsappNumber = '+919876543210'; // Replace with actual WhatsApp number
  const whatsappMessage = encodeURIComponent('Hi Toothsi क्लिनिक, I would like to know more about your dental services.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Callback Requested Successfully!",
      description: "We'll call you back within 30 minutes during business hours.",
    });

    setFormData({ name: '', phone: '', bestTime: '' });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Get in Touch Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Multiple ways to connect with us - choose what's most convenient for you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Options */}
          <div className="space-y-8">
            {/* Callback Form */}
            <Card id="callback-form" className="border-[#4FD1C5]/20">
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Request a Callback</h3>
                  <p className="text-gray-600">We'll call you back within 30 minutes!</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bestTime">Best Time to Call</Label>
                    <Select onValueChange={(value) => handleInputChange('bestTime', value)}>
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
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Call Me Back</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* WhatsApp Button */}
            <Card className="bg-[#25D366]/5 border-[#25D366]/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-[#25D366]/10 rounded-full">
                    <MessageSquare className="h-8 w-8 text-[#25D366]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Chat on WhatsApp</h3>
                <p className="text-gray-600">Get instant replies to your questions!</p>
                <Button 
                  onClick={() => window.open(whatsappUrl, '_blank')}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start WhatsApp Chat
                </Button>
              </CardContent>
            </Card>

            {/* Direct Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Direct Contact</h3>
              <div className="space-y-3">
                <a 
                  href={`tel:${phoneNumber}`}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <Phone className="h-5 w-5 text-[#4FD1C5] group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-gray-900">{phoneNumber}</div>
                    <div className="text-sm text-gray-500">Tap to call instantly</div>
                  </div>
                </a>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-[#4FD1C5]" />
                  <div>
                    <div className="font-medium text-gray-900">info@toothsiclinic.com</div>
                    <div className="text-sm text-gray-500">Email us anytime</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#4FD1C5] mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Shop No. 15, Medical Complex,<br />
                      Near City Hospital, CIDCO,<br />
                      Chhatrapati Sambhajinagar - 431003
                    </div>
                    <div className="text-sm text-gray-500">Visit us at our clinic</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-[#4FD1C5]" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Mon - Sat: 9:00 AM - 8:00 PM<br />
                      Sun: 10:00 AM - 6:00 PM
                    </div>
                    <div className="text-sm text-gray-500">Emergency: 24/7 WhatsApp support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Google Map */}
          <Card className="h-fit">
            <CardContent className="p-0">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.8314934988744!2d75.32118431494982!3d19.876165486619756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb9815a369bc63%3A0x712d538b29a2a73e!2sCIDCO%2C%20Chhatrapati%20Sambhajinagar%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1635847290000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Toothsi क्लिनिक Location"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Notice */}
        <div className="mt-12 text-center p-6 bg-[#FF6B6B]/5 rounded-lg border border-[#FF6B6B]/20">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-[#FF6B6B]" />
            <h3 className="text-lg font-semibold text-gray-900">Emergency Dental Care</h3>
          </div>
          <p className="text-gray-600">
            For dental emergencies outside business hours, send us a WhatsApp message and we'll respond within 15 minutes with guidance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;