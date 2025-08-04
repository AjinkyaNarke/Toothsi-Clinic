import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTeamMembers } from '@/lib/supabase';
import { 
  Phone, 
  Mail, 
  Award, 
  Calendar, 
  User, 
  Star,
  Loader2
} from 'lucide-react';

const TeamSection = () => {
  const { data: teamMembers, isLoading, error } = useQuery({
    queryKey: ['team-members-frontend'],
    queryFn: getTeamMembers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Set fallback image when image fails to load
    e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face';
  };

  if (isLoading) {
    return (
      <section id="team" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our experienced dental professionals are committed to providing you with the highest quality care
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#4FD1C5]" />
            <span className="ml-2 text-gray-600">Loading team members...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="team" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our experienced dental professionals are committed to providing you with the highest quality care
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              Unable to load team members at the moment. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const activeMembers = teamMembers?.filter(member => member.status === 'active') || [];

  return (
    <section id="team" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our experienced dental professionals are committed to providing you with the highest quality care
          </p>
        </div>

        {activeMembers.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              No team members available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative w-full h-64">
                  <img
                    src={member.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-[#4FD1C5] font-medium">{member.position}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Award className="h-4 w-4 text-[#4FD1C5]" />
                      <span className="font-medium">Specialization:</span>
                      <span className="text-gray-600 dark:text-gray-300">{member.specialization}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-[#4FD1C5]" />
                      <span className="font-medium">Experience:</span>
                      <span className="text-gray-600 dark:text-gray-300">{member.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-[#4FD1C5]" />
                      <span className="font-medium">Education:</span>
                      <span className="text-gray-600 dark:text-gray-300">{member.education}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-[#4FD1C5]" />
                      <span className="font-medium">Phone:</span>
                      <span className="text-gray-600 dark:text-gray-300">{member.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-[#4FD1C5]" />
                      <span className="font-medium">Email:</span>
                      <span className="text-gray-600 dark:text-gray-300">{member.email}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {member.description}
                    </p>
                  </div>
                  
                  {member.achievements && member.achievements.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {member.achievements.map((achievement, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;