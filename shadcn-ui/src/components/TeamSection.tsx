import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award } from 'lucide-react';

const TeamSection = () => {
  const team = [
    {
      name: 'Dr. Amit Patel',
      title: 'Chief Dental Officer',
      specialization: 'General & Cosmetic Dentistry',
      image: '👨‍⚕️',
      experience: '12+ Years',
      education: 'BDS, MDS (Conservative Dentistry)',
      specialties: ['Root Canal', 'Cosmetic Dentistry', 'Smile Design'],
      languages: ['English', 'Hindi', 'Marathi']
    },
    {
      name: 'Dr. Priya Sharma',
      title: 'Orthodontist',
      specialization: 'Braces & Aligners Specialist',
      image: '👩‍⚕️',
      experience: '8+ Years',
      education: 'BDS, MDS (Orthodontics)',
      specialties: ['Clear Aligners', 'Metal Braces', 'Jaw Correction'],
      languages: ['English', 'Hindi', 'Marathi']
    },
    {
      name: 'Dr. Rajesh Desai',
      title: 'Oral Surgeon',
      specialization: 'Implants & Oral Surgery',
      image: '👨‍⚕️',
      experience: '15+ Years',
      education: 'BDS, MDS (Oral & Maxillofacial Surgery)',
      specialties: ['Dental Implants', 'Wisdom Teeth', 'Jaw Surgery'],
      languages: ['English', 'Hindi', 'Marathi']
    }
  ];

  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meet Our Expert Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experienced dental professionals committed to providing the highest quality care
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((doctor, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white border-gray-200 overflow-hidden">
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative">
                  <div className="text-6xl mb-4">{doctor.image}</div>
                  <Badge className="absolute top-0 right-0 bg-[#4FD1C5] text-white">
                    {doctor.experience}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-[#4FD1C5] font-semibold">{doctor.title}</p>
                  <p className="text-gray-600">{doctor.specialization}</p>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-[#4FD1C5]" />
                    <span className="text-sm text-gray-600">{doctor.education}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-[#4FD1C5]" />
                      <span className="text-sm font-medium text-gray-700">Specialties:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doctor.specialties.map((specialty, specialtyIndex) => (
                        <Badge key={specialtyIndex} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Languages:</span> {doctor.languages.join(', ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;