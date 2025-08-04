import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, MessageCircle } from 'lucide-react';
import { getTestimonials } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';

interface Testimonial {
  id: number;
  patient_name: string;
  testimonial_text: string;
  rating: number;
  created_at: string;
  updated_at?: string;
}

const TestimonialsDisplay: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();

    // Set up real-time subscription
    const channel = supabase
      .channel('testimonials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'testimonials'
        },
        (payload) => {
          console.log('🔄 [REALTIME] Testimonials table changed:', payload);
          
          // Show notification for new testimonials
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Testimonial Added!",
              description: "A new patient testimonial has been added to the reviews.",
              duration: 3000,
            });
          }
          
          // Refresh testimonials when data changes
          fetchTestimonials();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();

      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 6);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Patient Testimonials (Google Reviews)
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-300 mb-6">
          Hear what our patients say about their experience with us
        </p>
        <div className="text-sm text-gray-400 dark:text-gray-400">
          All Testimonials ({testimonials.length})
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayedTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className={`h-full bg-transparent border-gray-200 dark:border-gray-700 ${testimonial.is_featured ? 'ring-2 ring-yellow-400' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {testimonial.patient_photo_url || testimonial.google_reviewer_photo ? (
                    <img
                      src={testimonial.patient_photo_url || testimonial.google_reviewer_photo}
                      alt={testimonial.patient_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {testimonial.patient_name?.charAt(0) || 'P'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {testimonial.patient_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(testimonial.created_at)}</p>
                  </div>
                </div>
                {testimonial.rating === 5 && (
                  <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">({testimonial.rating}/5)</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
                {testimonial.testimonial_text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More/Less Button */}
      {testimonials.length > 6 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="px-6"
          >
            {showAll ? 'Show Less' : `Show All (${testimonials.length})`}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No testimonials found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            No testimonials are available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestimonialsDisplay; 