import { Card, CardContent } from '@/components/ui/card';
import { 
  Smile, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  UserCheck, 
  Zap 
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Smile className="h-8 w-8 text-[#4FD1C5]" />,
      title: 'General Dentistry',
      description: 'Comprehensive oral health care including cleanings, fillings, and preventive treatments.',
      features: ['Regular Checkups', 'Cavity Fillings', 'Oral Hygiene']
    },
    {
      icon: <Sparkles className="h-8 w-8 text-[#4FD1C5]" />,
      title: 'Cosmetic Dentistry',
      description: 'Transform your smile with our advanced cosmetic treatments and procedures.',
      features: ['Teeth Whitening', 'Veneers', 'Smile Makeover']
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-[#4FD1C5]" />,
      title: 'Orthodontics',
      description: 'Straighten your teeth with traditional braces or modern clear aligners.',
      features: ['Metal Braces', 'Clear Aligners', 'Retainers']
    },
    {
      icon: <Heart className="h-8 w-8 text-[#4FD1C5]" />,
      title: 'Root Canal Treatment',
      description: 'Pain-free root canal procedures using the latest techniques and technology.',
      features: ['Pain Management', 'Advanced Technology', 'Quick Recovery']
    },
    {
      icon: <UserCheck className="h-8 w-8 text-[#4FD1C5]" />,
      title: 'Dental Implants',
      description: 'Replace missing teeth with natural-looking, permanent dental implants.',
      features: ['Permanent Solution', 'Natural Look', 'Bone Preservation']
    },
    {
      icon: <Zap className="h-8 w-8 text-[#4FD1C5]" />,
      title: 'Emergency Care',
      description: 'Immediate dental care for urgent situations and dental emergencies.',
      features: ['24/7 Support', 'Pain Relief', 'Quick Treatment']
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Dental Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive dental care with modern technology and personalized attention
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-[#4FD1C5]/30">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#4FD1C5]/10 rounded-lg group-hover:bg-[#4FD1C5]/20 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#4FD1C5] transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-[#4FD1C5] rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;