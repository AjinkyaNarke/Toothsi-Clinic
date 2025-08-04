import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Users, 
  Heart, 
  Shield, 
  Clock, 
  MapPin,
  CheckCircle,
  Star,
  Stethoscope,
  Phone
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* About Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Toothsi क्लिनिक
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Modern, painless dentistry in the heart of Chhatrapati Sambhajinagar. 
            Your journey to a healthier, brighter smile starts here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Founded with a vision to provide modern, painless dental care, Toothsi क्लिनिक 
                has been serving the community of Chhatrapati Sambhajinagar with dedication and expertise.
              </p>
              <p>
                Our state-of-the-art facility combines the latest dental technology with compassionate care, 
                ensuring every patient receives personalized treatment in a comfortable environment.
              </p>
              <p>
                We believe that everyone deserves a healthy, beautiful smile, and our team of experienced 
                professionals is committed to making dental care accessible, affordable, and anxiety-free.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us?
            </h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#4FD1C5] rounded-full mr-3"></span>
                Modern, painless treatment techniques
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#4FD1C5] rounded-full mr-3"></span>
                Experienced and qualified dental professionals
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#4FD1C5] rounded-full mr-3"></span>
                State-of-the-art dental equipment
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#4FD1C5] rounded-full mr-3"></span>
                Comfortable and hygienic environment
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#4FD1C5] rounded-full mr-3"></span>
                Affordable and transparent pricing
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#4FD1C5] rounded-full mr-3"></span>
                Emergency dental care available
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;