import { Button } from '@/components/ui/button';
import { Calendar, Phone } from 'lucide-react';
import BookingModal from './BookingModal';
import { useState } from 'react';

const HeroSection = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const scrollToCallback = () => {
    const element = document.getElementById('callback-form');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-8">
          {/* Main Headlines */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              <span className="bg-gradient-to-r from-[#4FD1C5] to-blue-600 bg-clip-text text-transparent">
                Radiant Smiles, Expert Care
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
              रेडियंट स्माइल्स, एक्सपर्ट केयर
            </h2>
          </div>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience modern, painless dentistry in a clinic that feels like home. 
            Have a question? <span className="text-[#25D366] font-semibold">Chat with us live!</span> 
            Your journey to a healthier smile starts here.
          </p>

          {/* CTAs - Enhanced with better visibility */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 relative z-10">
            <Button 
              size="lg" 
              className="booking-button bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-[#FF6B6B]/30"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <Calendar className="mr-2 h-5 w-5" />
              📅 Book Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-[#4FD1C5] text-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-white px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-[#4FD1C5]/30"
              onClick={scrollToCallback}
            >
              <Phone className="mr-2 h-5 w-5" />
              Request a Quick Callback
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Licensed Practitioners</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Modern Equipment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Instant Support</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </section>
  );
};

export default HeroSection;