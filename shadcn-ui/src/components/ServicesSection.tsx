import { Card, CardContent } from '@/components/ui/card';
import { 
  Smile, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  UserCheck, 
  Zap,
  Baby,
  Activity,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDentalServices } from '@/lib/supabase';

const ServicesSection = () => {
  // Fetch dental services from Supabase
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['dental-services-frontend'],
    queryFn: getDentalServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Icon mapping
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'smile': <Smile className="h-8 w-8 text-[#4FD1C5]" />,
      'sparkles': <Sparkles className="h-8 w-8 text-[#4FD1C5]" />,
      'shield-check': <ShieldCheck className="h-8 w-8 text-[#4FD1C5]" />,
      'heart': <Heart className="h-8 w-8 text-[#4FD1C5]" />,
      'user-check': <UserCheck className="h-8 w-8 text-[#4FD1C5]" />,
      'zap': <Zap className="h-8 w-8 text-[#4FD1C5]" />,
      'baby': <Baby className="h-8 w-8 text-[#4FD1C5]" />,
      'activity': <Activity className="h-8 w-8 text-[#4FD1C5]" />,
    };
    return iconMap[iconName] || <Smile className="h-8 w-8 text-[#4FD1C5]" />;
  };

  // Loading state
  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our Dental Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive dental care with modern technology and personalized attention
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#4FD1C5]" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading services...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="services" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our Dental Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive dental care with modern technology and personalized attention
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Unable to load services at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  // If no services, show empty state
  if (!services || services.length === 0) {
    return (
      <section id="services" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Our Dental Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive dental care with modern technology and personalized attention
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No services available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Our Dental Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive dental care with modern technology and personalized attention
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 hover:border-[#4FD1C5]/30 bg-white dark:bg-gray-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#4FD1C5]/10 dark:bg-[#4FD1C5]/20 rounded-lg group-hover:bg-[#4FD1C5]/20 dark:group-hover:bg-[#4FD1C5]/30 transition-colors">
                    {getIcon(service.icon)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#4FD1C5] transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features && service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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