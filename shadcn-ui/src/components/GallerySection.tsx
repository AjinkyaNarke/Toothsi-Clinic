import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getGalleryImages } from '@/lib/supabase';
import { 
  Camera, 
  Settings, 
  Zap, 
  Loader2,
  MapPin,
  Monitor,
  RefreshCw
} from 'lucide-react';

const GallerySection = () => {
  const { data: galleryImages, isLoading, error, refetch } = useQuery({
    queryKey: ['gallery-images-frontend'],
    queryFn: getGalleryImages,
    staleTime: 0, // Force refresh every time
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Add cache-busting parameter to image URLs
  const getImageUrlWithCacheBust = (imageUrl: string) => {
    if (!imageUrl) return '';
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}t=${Date.now()}`;
  };

  if (isLoading) {
    return (
      <section id="gallery" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Modern Clinic Gallery
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Take a virtual tour of our state-of-the-art dental clinic and see our modern facilities
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#4FD1C5]" />
            <span className="ml-2 text-gray-600">Loading gallery...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || !galleryImages || galleryImages.length === 0) {
    return (
      <section id="gallery" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Modern Clinic Gallery
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Take a virtual tour of our state-of-the-art dental clinic and see our modern facilities
            </p>
          </div>
          <div className="text-center py-12">
            <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              {error ? 'Unable to load gallery images from database.' : 'No gallery images found in database.'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Gallery will display all data from database, with or without images.
            </p>
            <Button onClick={() => refetch()} className="bg-[#4FD1C5] hover:bg-[#38B2AC]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Database Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const categories = [
    { value: 'modern-area', label: 'Modern Area', icon: Settings },
    { value: 'state-of-art-equipment', label: 'State-of-the-art Equipment', icon: Zap },
    { value: 'treatment-room', label: 'Treatment Room', icon: Monitor },
    { value: 'consultation-area', label: 'Consultation Area', icon: MapPin },
    { value: 'waiting-area', label: 'Waiting Area', icon: Settings },
    { value: 'dental-equipment', label: 'Dental Equipment', icon: Zap },
    { value: 'clinic-interior', label: 'Clinic Interior', icon: Settings },
    { value: 'team-photos', label: 'Team Photos', icon: Camera },
    { value: 'before-after', label: 'Before & After', icon: Camera }
  ];

  return (
    <section id="gallery" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Our Modern Clinic Gallery
            </h2>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              size="sm"
              className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Take a virtual tour of our state-of-the-art dental clinic and see our modern facilities, 
            advanced equipment, and comfortable treatment areas designed for your comfort and care.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Found {galleryImages.length} images from database
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => {
            const category = categories.find(c => c.value === image.category);
            const CategoryIcon = category?.icon || Camera;

            return (
              <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden">
                  {image.image_url && image.image_url.includes('supabase.co') ? (
                    <img
                      src={getImageUrlWithCacheBust(image.image_url)}
                      alt={image.title || 'Gallery Image'}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('❌ [GALLERY] Image failed to load:', {
                          imageUrl: image.image_url,
                          imageId: image.id,
                          imageTitle: image.title
                        });
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop';
                      }}
                      onLoad={() => {
                        console.log('✅ [GALLERY] Image loaded successfully:', {
                          imageUrl: image.image_url,
                          imageId: image.id,
                          imageTitle: image.title
                        });
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Image not available</p>
                        <p className="text-xs text-gray-400">Data only</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#4FD1C5] text-white border-0">
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {category?.label || image.category}
                    </Badge>
                  </div>
                  
                  {/* External URL Badge */}
                  {image.image_url && !image.image_url.includes('supabase.co') && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        External
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-[#4FD1C5] transition-colors">
                      {image.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {image.description}
                    </p>

                    {/* Modern Area */}
                    {image.area && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Settings className="h-3 w-3 mr-2 text-[#4FD1C5]" />
                        <span className="font-medium">Modern Area:</span>
                        <span className="ml-1">{image.area}</span>
                      </div>
                    )}

                    {/* State-of-the-art Equipment */}
                    {image.equipment && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Zap className="h-3 w-3 mr-2 text-[#4FD1C5]" />
                        <span className="font-medium">Equipment:</span>
                        <span className="ml-1">{image.equipment}</span>
                      </div>
                    )}

                    {/* Category */}
                    <div className="flex items-center text-xs text-gray-400">
                      <span>Category: {image.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Experience our modern dental care facilities in person
          </p>
          <Button 
            className="bg-[#4FD1C5] hover:bg-[#38B2AC] text-white"
            onClick={() => {
              // Scroll to contact section
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Book Your Appointment
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;