import React, { useState, useEffect } from 'react';
import { 
  getTestimonials, 
  addTestimonial, 
  updateTestimonial, 
  deleteTestimonial
} from '../lib/supabase';

import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff, 
  RefreshCw, 
  User, 
  MessageSquare,
  ThumbsUp,
  Users,
  BarChart3,
  FileText,
  Heart
} from 'lucide-react';

interface Testimonial {
  id: number;
  patient_name: string;
  testimonial_text: string;
  rating: number;
  created_at: string;
  updated_at?: string;
}



const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunningApify, setIsRunningApify] = useState(false);

  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patient_name: '',
    testimonial_text: '',
    rating: 5
  });



  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
      console.log('✅ [ADMIN TESTIMONIALS] Fetched testimonials:', data.length);
    } catch (error) {
      console.error('❌ [ADMIN TESTIMONIALS] Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setFormData({
      patient_name: '',
      testimonial_text: '',
      rating: 5
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_name || !formData.testimonial_text) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const testimonialData = {
        patient_name: formData.patient_name,
        testimonial_text: formData.testimonial_text,
        rating: formData.rating
      };

      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, testimonialData);
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        await addTestimonial(testimonialData);
        toast({
          title: "Success",
          description: "Testimonial added successfully",
        });
      }

      setShowAddForm(false);
      setEditingTestimonial(null);
      resetForm();
      await fetchTestimonials();
    } catch (error: any) {
      console.error('❌ [ADMIN TESTIMONIALS] Error submitting testimonial:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save testimonial",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      patient_name: testimonial.patient_name,
      testimonial_text: testimonial.testimonial_text,
      rating: testimonial.rating
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await deleteTestimonial(id);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      await fetchTestimonials();
    } catch (error: any) {
      console.error('❌ [ADMIN TESTIMONIALS] Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete testimonial",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    // Status toggle not available in simplified table structure
    toast({
      title: "Info",
      description: "Status toggle not available in simplified table structure",
    });
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      // For simplified table, toggle between 4 and 5 stars
      const newRating = currentFeatured ? 4 : 5;
      const testimonial = testimonials.find(t => t.id === id);
      if (testimonial) {
        await updateTestimonial(id, {
          patient_name: testimonial.patient_name,
          testimonial_text: testimonial.testimonial_text,
          rating: newRating
        });
        toast({
          title: "Success",
          description: `Testimonial ${!currentFeatured ? 'featured (5 stars)' : 'unfeatured (4 stars)'}`,
        });
        await fetchTestimonials();
      }
    } catch (error: any) {
      console.error('❌ [ADMIN TESTIMONIALS] Error toggling featured:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status",
        variant: "destructive"
      });
    }
  };

  const runApifyScraper = async () => {
    if (!isRunningApify) {
      setIsRunningApify(true);
      try {
        const placeUrl = "https://maps.app.goo.gl/JnmRPJbHquL9Q6pa7"; // Your clinic URL
        
        console.log('🚀 Starting Apify Google Maps Reviews Scraper...');
        console.log('📍 Place URL:', placeUrl);

        // Prepare the Actor input
        const input = {
          "startUrls": [{ "url": placeUrl }],
          "maxReviews": 100,
          "reviewsSort": "newest",
          "language": "en",
          "reviewsOrigin": "all",
          "personalData": true
        };

        // Run the Actor using Apify API directly
        const response = await fetch(`https://api.apify.com/v2/acts/Xb8osYTtOjlsgI6k9/runs?token=${import.meta.env.VITE_APIFY_API_TOKEN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const runData = await response.json();
        console.log('✅ Apify run started:', runData.data.id);

        // Wait for the run to complete
        let runStatus = 'RUNNING';
        let attempts = 0;
        const maxAttempts = 30; // 5 minutes max

        while (runStatus === 'RUNNING' && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
          
          const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runData.data.id}?token=${import.meta.env.VITE_APIFY_API_TOKEN}`);
          const statusData = await statusResponse.json();
          runStatus = statusData.data.status;
          attempts++;
          
          console.log(`⏳ Run status: ${runStatus} (attempt ${attempts}/${maxAttempts})`);
        }

        if (runStatus === 'SUCCEEDED') {
          // Fetch results from dataset
          const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${runData.data.defaultDatasetId}/items?token=${import.meta.env.VITE_APIFY_API_TOKEN}`);
          const datasetData = await datasetResponse.json();

          console.log('📥 Fetched reviews:', datasetData.length);

          // Process and add positive reviews
          let positiveReviews = 0;
          for (const item of datasetData) {
            if (item.rating && item.rating >= 4) {
              const reviewData = {
                patient_name: item.reviewerName || item.reviewer_name || 'Google Reviewer',
                testimonial_text: item.reviewText || item.review_text || item.text || '',
                rating: item.rating
              };

              try {
                await addTestimonial(reviewData);
                positiveReviews++;
                console.log('✅ Added review:', reviewData.patient_name, 'Rating:', reviewData.rating);
              } catch (error) {
                console.error('❌ Failed to add review:', error);
              }
            }
          }

          toast({
            title: "Success!",
            description: `Imported ${positiveReviews} positive reviews from Google Maps.`,
          });

          // Refresh testimonials list
          fetchTestimonials();
        } else {
          throw new Error(`Apify run failed with status: ${runStatus}`);
        }

      } catch (error) {
        console.error('❌ Apify scraper error:', error);
        toast({
          title: "Error",
          description: "Failed to run Apify scraper. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsRunningApify(false);
      }
    }
  };



  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ThumbsUp
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-orange-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };



  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Heart className="h-8 w-8 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2" />
                    Admin Testimonials Management
                  </h2>
                  <p className="text-[#FFE5E5] text-sm font-medium">
                    Patient Reviews • Feedback Management • Trust Building
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Users className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <BarChart3 className="h-3 w-3 mr-1" />
                {testimonials.length} Reviews
              </Badge>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Patient Reviews Database Control
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Manage all patient testimonials and reviews - Full admin access enabled
              </p>
            </div>
                                                  <div className="flex space-x-2">
               <Button
                 variant="outline"
                 onClick={fetchTestimonials}
                 disabled={isLoading}
               >
                 <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                 Refresh
               </Button>
               <Button
                 onClick={runApifyScraper}
                 disabled={isRunningApify}
                 className="bg-green-600 hover:bg-green-700"
               >
                 <RefreshCw className={`h-4 w-4 mr-2 ${isRunningApify ? 'animate-spin' : ''}`} />
                 {isRunningApify ? 'Running Apify...' : 'Run Apify Scraper'}
               </Button>
               <Button
                 onClick={() => {
                   setEditingTestimonial(null);
                   resetForm();
                   setShowAddForm(true);
                 }}
                 className="bg-blue-600 hover:bg-blue-700"
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Add Testimonial
               </Button>
             </div>
          </div>
          
          
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Loading testimonials...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : testimonials.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Testimonials Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                Start building trust by adding patient testimonials and reviews.
              </p>
                             <Button
                 onClick={() => {
                   setEditingTestimonial(null);
                   resetForm();
                   setShowAddForm(true);
                 }}
                 className="bg-blue-600 hover:bg-blue-700"
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Add First Testimonial
               </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative">
            <CardContent className="p-6">
                             {/* Featured Badge */}
               {testimonial.rating === 5 && (
                 <div className="absolute top-4 right-4">
                   <Badge variant="default" className="bg-orange-500 text-white text-xs font-bold">
                     <Star className="h-3 w-3 mr-1" />
                     Featured
                   </Badge>
                 </div>
               )}

              {/* Patient Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                    {testimonial.patient_name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                    <span>• {new Date(testimonial.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                  ({testimonial.rating}/5)
                </span>
              </div>



              {/* Testimonial Text */}
              <div className="mb-4">
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed font-medium">
                  "{testimonial.testimonial_text.length > 150 
                    ? `${testimonial.testimonial_text.substring(0, 150)}...` 
                    : testimonial.testimonial_text}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(testimonial)}
                  className="flex-1 min-w-0"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleFeatured(testimonial.id, testimonial.rating === 5)}
                  className="flex-1 min-w-0"
                >
                  {testimonial.rating === 5 ? (
                    <>
                      <StarOff className="h-4 w-4 mr-1" />
                      Unfeature
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-1" />
                      Feature
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(testimonial.id)}
                  className="flex-1 min-w-0"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>

                             {/* Metadata */}
               <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-purple-600 dark:text-purple-400">
                 <div className="flex justify-between">
                   <span className="font-medium">ID: {testimonial.id}</span>
                   <span className="font-medium">Added: {new Date(testimonial.created_at).toLocaleDateString()}</span>
                 </div>
               </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Add/Edit Form Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {editingTestimonial ? (
                <>
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Testimonial
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Testimonial
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Name */}
            <div>
              <Label htmlFor="patient-name" className="text-sm font-medium">Patient Name *</Label>
              <Input
                id="patient-name"
                value={formData.patient_name}
                onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                placeholder="Enter patient name"
                className="mt-1"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <Label htmlFor="rating" className="text-sm font-medium">Rating *</Label>
              <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({...formData, rating: parseInt(value)})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Testimonial Text */}
            <div>
              <Label htmlFor="testimonial-text" className="text-sm font-medium">Testimonial Text *</Label>
              <Textarea
                id="testimonial-text"
                value={formData.testimonial_text}
                onChange={(e) => setFormData({...formData, testimonial_text: e.target.value})}
                placeholder="Enter patient testimonial..."
                rows={4}
                className="mt-1"
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingTestimonial(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Saving...' : (editingTestimonial ? 'Update Testimonial' : 'Add Testimonial')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      
    </div>
  );
};

export default AdminTestimonials; 