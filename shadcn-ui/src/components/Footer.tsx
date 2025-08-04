import { useQuery } from '@tanstack/react-query';
import { getContactInformation } from '@/lib/supabase';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Globe,
  Loader2
} from 'lucide-react';

const Footer = () => {
  const { data: contactInfo, isLoading, error } = useQuery({
    queryKey: ['contact-information'],
    queryFn: getContactInformation,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#4FD1C5]" />
            <span className="ml-2">Loading contact information...</span>
          </div>
        </div>
      </footer>
    );
  }

  if (error || !contactInfo) {
    // Fallback to default contact information
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Clinic Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#4FD1C5]">Toothsi क्लिनिक</h3>
              <p className="text-gray-300">
                Modern, painless dentistry in the heart of Chhatrapati Sambhajinagar. 
                Your journey to a healthier, brighter smile starts here.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Home</a></li>
                <li><a href="#services" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Services</a></li>
                <li><a href="#team" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Our Doctors</a></li>
                <li><a href="#gallery" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Gallery</a></li>
                <li><a href="#testimonials" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Testimonials</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Our Services</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">General Dentistry</li>
                <li className="text-gray-300">Cosmetic Dentistry</li>
                <li className="text-gray-300">Orthodontics</li>
                <li className="text-gray-300">Root Canal Treatment</li>
                <li className="text-gray-300">Dental Implants</li>
                <li className="text-gray-300">Emergency Care</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-[#4FD1C5]" />
                  <span className="text-gray-300">+919876543210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-[#4FD1C5]" />
                  <span className="text-gray-300">info@toothsiclinic.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-[#4FD1C5]" />
                  <span className="text-gray-300">Shop No. 15, Medical Complex, Near City Hospital, CIDCO, Chhatrapati Sambhajinagar - 431003</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-[#4FD1C5]" />
                  <span className="text-gray-300">Mon-Sat: 9AM-7PM, Sun: 10AM-2PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-gray-300">© 2024 Toothsi क्लिनिक. All rights reserved.</p>
                <p className="text-sm text-gray-400">Licensed Dental Clinic • Registration No: DL/123/2021</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">Made with ❤️ for healthier smiles</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Clinic Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#4FD1C5]">{contactInfo.clinic_name}</h3>
            <p className="text-gray-300">
              Modern, painless dentistry in the heart of Chhatrapati Sambhajinagar. 
              Your journey to a healthier, brighter smile starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Home</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Services</a></li>
              <li><a href="#team" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Our Doctors</a></li>
              <li><a href="#gallery" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Gallery</a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">General Dentistry</li>
              <li className="text-gray-300">Cosmetic Dentistry</li>
              <li className="text-gray-300">Orthodontics</li>
              <li className="text-gray-300">Root Canal Treatment</li>
              <li className="text-gray-300">Dental Implants</li>
              <li className="text-gray-300">Emergency Care</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#4FD1C5]" />
                <span className="text-gray-300">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#4FD1C5]" />
                <span className="text-gray-300">{contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#4FD1C5]" />
                <span className="text-gray-300">{contactInfo.address}, {contactInfo.city} - {contactInfo.pincode}</span>
              </div>
              {contactInfo.working_hours && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-[#4FD1C5]" />
                  <span className="text-gray-300">{contactInfo.working_hours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-300">© 2024 {contactInfo.clinic_name}. All rights reserved.</p>
              {contactInfo.license_info && (
                <p className="text-sm text-gray-400">{contactInfo.license_info}</p>
              )}
            </div>
            <div className="flex space-x-4">
              {contactInfo.facebook && (
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {contactInfo.instagram && (
                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {contactInfo.twitter && (
                <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {contactInfo.website && (
                <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#4FD1C5] transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">Made with ❤️ for healthier smiles</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;