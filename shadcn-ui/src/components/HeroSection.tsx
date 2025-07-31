import { Button } from '@/components/ui/button';
import { Calendar, Phone } from 'lucide-react';

const HeroSection = () => {
  const scrollToCallback = () => {
    const element = document.getElementById('callback-form');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Main Headlines */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-[#4FD1C5] to-blue-600 bg-clip-text text-transparent">
                Radiant Smiles, Expert Care
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
              रेडियंट स्माइल्स, एक्सपर्ट केयर
            </h2>
          </div>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience modern, painless dentistry in a clinic that feels like home. 
            Have a question? <span className="text-[#25D366] font-semibold">Chat with us live!</span> 
            Your journey to a healthier smile starts here.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={scrollToContact}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Your Visit
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-[#4FD1C5] text-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-white px-8 py-4 text-lg transition-all duration-300"
              onClick={scrollToCallback}
            >
              <Phone className="mr-2 h-5 w-5" />
              Request a Quick Callback
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
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
    </section>
  );
};

export default HeroSection;