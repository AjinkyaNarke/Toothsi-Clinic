import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  X,
  ExternalLink,
  Info,
  AlertCircle
} from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [isCalLoaded, setIsCalLoaded] = useState(false);
  const [calError, setCalError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset states when modal opens
      setIsCalLoaded(false);
      setCalError(null);
      setUseIframe(false);
      
      // Initialize Cal.com API
      (async function () {
        try {
          console.log('Initializing Cal.com integration...');
          const cal = await getCalApi({"namespace":"tooth-booking"});
          
          cal("preload", {
            calLink: "ajinkya-narke-izxivm/tooth"
          });
          
          cal("ui", {
            "styles": {"branding":{"brandColor":"#4FD1C5"}},
            "hideEventTypeDetails": false,
            "layout": "month_view"
          });
          
          // Clear any pre-filled data to ensure empty fields
          cal("prefill", {
            "name": "",
            "email": "",
            "guests": []
          });
          
          console.log('Cal.com integration initialized successfully');
          setIsCalLoaded(true);
          
          // Scroll to calendar section after a short delay
          setTimeout(() => {
            const calendarSection = document.querySelector('.cal-embed-container');
            if (calendarSection) {
              calendarSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
            }
          }, 1000);
          
        } catch (error) {
          console.error('Cal.com initialization error:', error);
          setCalError('Failed to initialize calendar');
          // Don't automatically switch to iframe, let user choose
          setTimeout(() => {
            setIsCalLoaded(true); // Show the embed anyway
          }, 2000);
        }
      })();
    }
  }, [isOpen]);

  const handleCalError = () => {
    setCalError('Calendar failed to load');
    setUseIframe(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-6">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-[#4FD1C5]" />
                  Book Your Appointment
                </DialogTitle>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Schedule your dental appointment with our experienced team
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Clinic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#4FD1C5]" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Aurangabad, Maharashtra</p>
                <button 
                  onClick={() => window.open('https://maps.app.goo.gl/Rt3aaxyPJeEPKx649', '_blank')}
                  className="text-xs text-[#4FD1C5] hover:underline mt-1"
                >
                  Get Directions →
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#4FD1C5]" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Hours</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Mon-Sat: 9AM-7PM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#4FD1C5]" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Contact</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">+91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* Cal.com Integration Status */}
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">
                {useIframe ? 'Cal.com (Iframe Mode)' : 'Cal.com Integration Active'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {useIframe ? 'Fallback' : 'Live'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const calendarSection = document.querySelector('.cal-embed-container');
                  if (calendarSection) {
                    calendarSection.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'center' 
                    });
                  }
                }}
                className="text-xs"
              >
                📅 Go to Calendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseIframe(!useIframe)}
                className="text-xs"
              >
                {useIframe ? 'Switch to Embed' : 'Switch to Iframe'}
              </Button>
            </div>
          </div>

          {/* Calendar Container */}
          <div className="border-2 border-[#4FD1C5]/20 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-[#4FD1C5]/10 to-[#4FD1C5]/5 dark:from-gray-800 dark:to-gray-700 p-4 border-b border-[#4FD1C5]/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#4FD1C5]" />
                    Select Your Appointment Time
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Choose a convenient time slot for your dental consultation
                  </p>
                </div>
                <Badge className="bg-[#4FD1C5] text-white">
                  Interactive Calendar
                </Badge>
              </div>
            </div>
            <div className="h-[700px] w-full relative bg-white cal-embed-container cal-embed-wrapper overflow-auto">
              {calError && !useIframe ? (
                <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
                  <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Calendar Loading Error</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{calError}</p>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
                        onClick={() => setUseIframe(true)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Try Iframe Mode
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://cal.com/ajinkya-narke-izxivm/tooth?prefill[name]=&prefill[email]=', '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                </div>
              ) : useIframe ? (
                <div className="w-full h-full overflow-auto">
                  <iframe
                    src="https://cal.com/ajinkya-narke-izxivm/tooth?embed=true&theme=light&prefill[name]=&prefill[email]="
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Book Appointment"
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      minHeight: '700px'
                    }}
                    allow="camera; microphone; geolocation; display-capture"
                    loading="lazy"
                  />
                </div>
              ) : isCalLoaded ? (
                <div className="w-full h-full overflow-auto">
                  <Cal 
                    namespace="tooth-booking"
                    calLink="ajinkya-narke-izxivm/tooth"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "700px",
                      border: "none",
                      overflow: "auto"
                    }}
                    config={{
                      layout: "month_view",
                      theme: "light"
                    }}
                  />
                </div>
              ) : (
                <div className="cal-loading">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FD1C5] mx-auto"></div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">Loading Calendar...</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we connect to Cal.com</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Booking Button */}
          <div className="text-center">
            <Button 
              size="lg"
              className="bg-[#4FD1C5] hover:bg-[#4FD1C5]/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.open('https://cal.com/ajinkya-narke-izxivm/tooth?prefill[name]=&prefill[email]=', '_blank')}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Open Full Calendar
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Opens in a new tab for the best booking experience
            </p>
          </div>

          {/* Alternative Booking Options */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Alternative Booking Methods</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              You can also book your appointment through these methods:
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => window.open('tel:+919876543210')}
              >
                <Phone className="h-4 w-4" />
                Call Us
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => window.open('mailto:info@toothsiclinic.com')}
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Need help? Contact us at{' '}
              <a href="mailto:info@toothsiclinic.com" className="text-[#4FD1C5] hover:underline">
                info@toothsiclinic.com
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal; 