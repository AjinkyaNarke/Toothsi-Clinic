import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import BookingModal from './BookingModal';

const FloatingBookingButton = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <Button
        className="floating-booking-btn fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
        onClick={() => setIsBookingModalOpen(true)}
        aria-label="Book Appointment"
      >
        <Calendar className="h-6 w-6" />
      </Button>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default FloatingBookingButton;