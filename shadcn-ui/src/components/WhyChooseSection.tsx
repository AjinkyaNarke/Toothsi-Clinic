import { 
  Award, 
  Clock, 
  Shield, 
  Users, 
  Stethoscope, 
  MessageSquare 
} from 'lucide-react';

const WhyChooseSection = () => {
  const features = [
    {
      icon: <Award className="h-10 w-10 text-[#4FD1C5]" />,
      title: 'Expert Dentists',
      description: 'Qualified and experienced dental professionals committed to your oral health.'
    },
    {
      icon: <Stethoscope className="h-10 w-10 text-[#4FD1C5]" />,
      title: 'Modern Technology',
      description: 'State-of-the-art equipment and latest techniques for optimal treatment results.'
    },
    {
      icon: <Clock className="h-10 w-10 text-[#4FD1C5]" />,
      title: 'Flexible Hours',
      description: 'Convenient scheduling options to fit your busy lifestyle and work commitments.'
    },
    {
      icon: <Shield className="h-10 w-10 text-[#4FD1C5]" />,
      title: 'Safe & Sterile',
      description: 'Strict hygiene protocols and sterilization standards for your safety and peace of mind.'
    },
    {
      icon: <Users className="h-10 w-10 text-[#4FD1C5]" />,
      title: 'Family Friendly',
      description: 'Comprehensive dental care for patients of all ages in a comfortable environment.'
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-[#4FD1C5]" />,
      title: 'Instant Support',
      description: 'WhatsApp chat, phone calls, and callback requests for immediate assistance.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose Toothsi क्लिनिक?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine expertise, technology, and personalized care to give you the best dental experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4 p-6 bg-white rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center">
                <div className="p-4 bg-[#4FD1C5]/10 rounded-full">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;