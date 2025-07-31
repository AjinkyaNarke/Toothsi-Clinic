import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Chhatrapati Sambhajinagar',
      image: '👩‍💼',
      rating: 5,
      text: 'The WhatsApp chat feature made it so easy to ask questions before my visit. Dr. Patel explained everything clearly and the treatment was completely painless. Highly recommend!',
      treatment: 'Root Canal Treatment'
    },
    {
      name: 'Rajesh Kumar',
      location: 'Aurangabad',
      image: '👨‍💻',
      rating: 5,
      text: 'Modern clinic with excellent service! The callback feature saved me time, and the staff is incredibly friendly. My family now comes here for all dental needs.',
      treatment: 'Family Dental Care'
    },
    {
      name: 'Anita Desai',
      location: 'MIDC Area',
      image: '👩‍🔬',
      rating: 5,
      text: 'Amazing cosmetic dentistry work! The before and after difference is incredible. The clinic feels very clean and professional. Worth every penny.',
      treatment: 'Smile Makeover'
    },
    {
      name: 'Vikram Singh',
      location: 'Cidco',
      image: '👨‍🏭',
      rating: 5,
      text: 'Emergency dental care at its best! Called them at 10 PM and got immediate guidance. Visited the next morning and the pain relief was instant.',
      treatment: 'Emergency Care'
    },
    {
      name: 'Meera Joshi',
      location: 'Garkheda',
      image: '👩‍🎓',
      rating: 5,
      text: 'The invisible braces treatment has been life-changing! Regular WhatsApp updates about my progress kept me motivated. Professional and caring staff.',
      treatment: 'Clear Aligners'
    },
    {
      name: 'Amit Patil',
      location: 'Beed Bypass',
      image: '👨‍🎨',
      rating: 5,
      text: 'Dental implant procedure was smoother than expected. The technology they use is impressive. Follow-up care through their chat system was very convenient.',
      treatment: 'Dental Implants'
    }
  ];

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex space-x-1">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Patients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from our happy patients across Chhatrapati Sambhajinagar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-gray-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <StarRating rating={testimonial.rating} />
                    </div>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <p className="text-xs text-[#4FD1C5] font-medium mt-1">{testimonial.treatment}</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 leading-relaxed italic">
                  "{testimonial.text}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 bg-[#4FD1C5]/5 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#4FD1C5]">500+</div>
              <div className="text-sm text-gray-600">Happy Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#4FD1C5]">5★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#4FD1C5]">3+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#4FD1C5]">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;