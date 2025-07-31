import { Phone, Mail, MapPin, MessageSquare, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const phoneNumber = '+919876543210';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hi Toothsi क्लिनिक, I have a question!')}`;

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Our Doctors', href: '#team' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    'General Dentistry',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Root Canal Treatment',
    'Dental Implants',
    'Emergency Care'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#4FD1C5]">
              Toothsi क्लिनिक
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Modern, painless dentistry in the heart of Chhatrapati Sambhajinagar. 
              Your journey to a healthier, brighter smile starts here.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => window.open(whatsappUrl, '_blank')}
                size="sm"
                className="bg-[#25D366] hover:bg-[#20BA5A]"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                onClick={() => window.location.href = `tel:${phoneNumber}`}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-[#4FD1C5] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center space-x-2 text-gray-300 hover:text-[#4FD1C5] transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>info@toothsiclinic.com</span>
              </div>
              <div className="flex items-start space-x-2 text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className="text-sm">
                  Shop No. 15, Medical Complex,<br />
                  Near City Hospital, CIDCO,<br />
                  Chhatrapati Sambhajinagar - 431003
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                © 2024 Toothsi क्लिनिक. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Licensed Dental Clinic • Registration No: DL/123/2021
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-[#FF6B6B]" />
              <span>for healthier smiles</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;