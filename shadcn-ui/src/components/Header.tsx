import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import BookingModal from './BookingModal';

interface NavigationItem {
  name: string;
  href: string;
  anchor?: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', anchor: '#home' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Team', href: '/team' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Contact', href: '/contact', anchor: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigationClick = (href: string, anchor?: string) => {
    if (href === '/') {
      // For home page, scroll to anchor if provided
      if (anchor) {
        // Store the anchor in sessionStorage to scroll after navigation
        sessionStorage.setItem('scrollToAnchor', anchor);
      }
    }
    // Close mobile menu for all navigation
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-bold text-[#4FD1C5] dark:text-[#4FD1C5]">
              Toothsi क्लिनिक
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-[#4FD1C5] dark:hover:text-[#4FD1C5] font-medium transition-colors"
                onClick={() => handleNavigationClick(item.href, item.anchor)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              className="booking-button bg-[#FF6B6B] hover:bg-[#FF5252] text-white dark:bg-[#FF6B6B] dark:hover:bg-[#FF5252] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-[#FF6B6B]/30"
              onClick={() => setIsBookingModalOpen(true)}
            >
              📅 Book Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="dark:text-gray-300"
              ref={buttonRef}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4" ref={menuRef}>
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-[#4FD1C5] dark:hover:text-[#4FD1C5] font-medium transition-colors"
                  onClick={() => handleNavigationClick(item.href, item.anchor)}
                >
                  {item.name}
                </Link>
              ))}
              <Button 
                className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white w-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsBookingModalOpen(true)}
              >
                📅 Book Now
              </Button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </header>
  );
};

export default Header;