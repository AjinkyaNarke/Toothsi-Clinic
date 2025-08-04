import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useEffect } from 'react';
import Index from './pages/Index';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import FloatingBookingButton from './components/FloatingBookingButton';


const queryClient = new QueryClient();

// Component to handle cross-page anchor scrolling
const AnchorScrollHandler = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      const scrollToAnchor = sessionStorage.getItem('scrollToAnchor');
      if (scrollToAnchor) {
        sessionStorage.removeItem('scrollToAnchor');
        setTimeout(() => {
          const element = document.querySelector(scrollToAnchor);
          if (element) {
            const headerHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
              top: elementPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        // If no anchor to scroll to, scroll to top of home page
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } else {
      // For all other pages, scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="toothsi-ui-theme">
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AnchorScrollHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingBookingButton />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
