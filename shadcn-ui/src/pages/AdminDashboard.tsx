import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  Image, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Upload,
  Images,
  UserCheck,
  FileText,
  HardDrive,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GalleryModify from '@/components/GalleryModify';
import AdminTeam from '@/components/AdminTeam';
import AdminContact from '@/components/AdminContact';
import AdminDentalServices from '@/components/AdminDentalServices';
import AdminStorage from '@/components/AdminStorage';
import AdminAppointments from '@/components/AdminAppointments';
import AdminTestimonials from '@/components/AdminTestimonials';
import AdminCallbacks from '@/components/AdminCallbacks';



const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuthenticated');
    const username = localStorage.getItem('adminUsername');
    
    if (auth === 'true' && username) {
      setIsAuthenticated(true);
      setAdminUsername(username);
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUsername');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/admin/login');
  };

  const dashboardStats = [
    { title: 'Gallery Images', count: 12, icon: Image, color: 'bg-blue-500' },
    { title: 'Team Members', count: 3, icon: Users, color: 'bg-green-500' },
    { title: 'Dental Services', count: 10, icon: FileText, color: 'bg-teal-500' },
    { title: 'Contact Messages', count: 8, icon: MessageSquare, color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { action: 'New gallery image uploaded', time: '2 hours ago', type: 'upload' },
    { action: 'Contact message received', time: '4 hours ago', type: 'message' },
    { action: 'Team member updated', time: '1 day ago', type: 'edit' },
    { action: 'Website settings changed', time: '2 days ago', type: 'settings' },
  ];

  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.count}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LayoutDashboard className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              className="h-20 flex-col space-y-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800"
              variant="outline"
              onClick={() => setActiveTab('gallery')}
            >
              <Upload className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Upload Gallery Image</span>
            </Button>
            
            <Button 
              className="h-20 flex-col space-y-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800"
              variant="outline"
              onClick={() => setActiveTab('team')}
            >
              <UserCheck className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Manage Team</span>
            </Button>
            
            <Button 
              className="h-20 flex-col space-y-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800"
              variant="outline"
              onClick={() => setActiveTab('contact')}
            >
              <MessageSquare className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">View Messages</span>
            </Button>
            
            <Button 
              className="h-20 flex-col space-y-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 border-orange-200 dark:border-orange-800"
              variant="outline"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Website Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#4FD1C5] rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {activity.action}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

        const renderGalleryContent = () => (
        <GalleryModify />
      );

  const renderTeamContent = () => (
    <AdminTeam />
  );

  const renderContactContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h2>
          <p className="text-gray-600 dark:text-gray-300">View and manage contact form submissions</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600 dark:text-gray-300 text-center py-8">
            Contact messages section coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsContent = () => (
    <AdminContact />
  );

  const renderDentalServicesContent = () => (
    <AdminDentalServices />
  );

  const renderStorageContent = () => (
    <AdminStorage />
  );

  const renderAppointmentsContent = () => (
    <AdminAppointments />
  );

  const renderTestimonialsContent = () => (
    <div className="space-y-6">
      <AdminTestimonials />
    </div>
  );

  const renderCallbacksContent = () => (
    <div className="space-y-6">
      <AdminCallbacks />
    </div>
  );



  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'gallery':
        return renderGalleryContent();
      case 'team':
        return renderTeamContent();
      case 'contact':
        return renderContactContent();
      case 'settings':
        return renderSettingsContent();
      case 'dental-services':
        return renderDentalServicesContent();
      case 'storage':
        return renderStorageContent();
      case 'appointments':
        return renderAppointmentsContent();
      case 'testimonials':
        return renderTestimonialsContent();
      case 'callbacks':
        return renderCallbacksContent();

      default:
        return renderDashboardContent();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-[#4FD1C5]">
                Toothsi क्लिनिक Admin
              </h1>
              <Badge variant="secondary">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                Welcome, {adminUsername}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button 
                    variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant={activeTab === 'gallery' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('gallery')}
                  >
                    <Images className="h-4 w-4 mr-2" />
                    Gallery Modify
                  </Button>
                  <Button 
                    variant={activeTab === 'team' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('team')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Team Management
                  </Button>
                  <Button 
                    variant={activeTab === 'contact' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('contact')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Messages
                  </Button>
                  <Button 
                    variant={activeTab === 'settings' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Website Settings
                  </Button>
                  <Button 
                    variant={activeTab === 'dental-services' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('dental-services')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Dental Services
                  </Button>
                  <Button 
                    variant={activeTab === 'storage' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('storage')}
                  >
                    <HardDrive className="h-4 w-4 mr-2" />
                    Storage Management
                  </Button>
                  <Button 
                    variant={activeTab === 'appointments' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('appointments')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Appointments
                  </Button>
                  <Button 
                    variant={activeTab === 'testimonials' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('testimonials')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Testimonials
                  </Button>
                  <Button 
                    variant={activeTab === 'callbacks' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('callbacks')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Callback Requests
                  </Button>

                </nav>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 