import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { User, LogOut, Calendar, ShoppingCart, Package, Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center gap-8">
          <Link to="/" className="flex items-center shrink-0">
            <img 
              src="/logo.png" 
              alt="DeLegends Barber Shop" 
              className="h-14 md:h-16 w-auto object-contain hover:opacity-90 transition"
            />
          </Link>
          
          {/* Desktop Navigation - All items on the right */}
          <div className="hidden lg:flex items-center gap-6 ml-auto">
            <Link to="/services" className="hover:text-yellow-400 transition font-medium text-base">{t('nav.services')}</Link>
            <Link to="/products" className="hover:text-yellow-400 transition font-medium text-base">{t('nav.products')}</Link>
            <Link to="/gift-cards" className="hover:text-yellow-400 transition font-medium text-base">{t('nav.giftCards')}</Link>
            <Link to="/about" className="hover:text-yellow-400 transition font-medium text-base">{t('nav.about')}</Link>
            <Link to="/our-team" className="hover:text-yellow-400 transition font-medium text-base">{t('nav.ourTeam')}</Link>
          
            {/* Book Appointment Button */}
            <Link 
              to="/select-location" 
              className="bg-green-500 text-white px-5 py-2.5 rounded-lg hover:bg-green-600 transition font-semibold shadow-md"
            >
              {t('common.bookAppointment')}
            </Link>

            {/* Cart is available for guests and logged-in users */}
            <Link 
              to="/cart" 
              className="relative hover:text-yellow-400 transition p-2"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
            
            {isAuthenticated() ? (
              <>
                {/* Language Selector */}
                <LanguageSelector />
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:text-yellow-400 transition"
                  >
                    <div className="w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm">{t('nav.welcome')}, {user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 text-gray-800 overflow-hidden">
                      <div className="p-4 border-b bg-gray-50">
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/my-orders"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{t('nav.myOrders')}</span>
                      </Link>
                      
                      <Link
                        to="/bookings"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Calendar className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium">{t('nav.myBookings')}</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Language Selector */}
                <LanguageSelector />
                
                <Link 
                  to="/auth/login" 
                  className="hover:text-yellow-400 transition"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/auth/register" 
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-500 transition font-semibold"
                >
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button & Cart */}
          <div className="flex lg:hidden items-center gap-4">
            <Link 
              to="/cart" 
              className="relative hover:text-yellow-400 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:text-yellow-400 transition"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-gray-800 border-t border-gray-700">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link 
                to="/services" 
                className="block py-2 hover:text-yellow-400 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('nav.services')}
              </Link>
              
              <Link 
                to="/products" 
                className="block py-2 hover:text-yellow-400 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('nav.products')}
              </Link>
              
              <Link 
                to="/gift-cards" 
                className="block py-2 hover:text-yellow-400 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('nav.giftCards')}
              </Link>

              <Link 
                to="/cart" 
                className="block py-2 hover:text-yellow-400 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('nav.cart') || 'Cart'}
              </Link>
              
              <Link 
                to="/about" 
                className="block py-2 hover:text-yellow-400 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('nav.about')}
              </Link>
              
              <Link 
                to="/our-team" 
                className="block py-2 hover:text-yellow-400 transition"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('nav.ourTeam')}
              </Link>
              
              {/* Language Selector for Mobile */}
              <div className="py-2">
                <LanguageSelector />
              </div>
              
              {/* Guest Booking Button - ALWAYS VISIBLE */}
              <Link 
                to="/select-location" 
                className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-semibold text-center"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('common.bookAppointment')}
              </Link>
              
              {isAuthenticated() ? (
                <>
                  <Link 
                    to="/select-location" 
                    className="block bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-500 transition font-semibold text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('nav.bookNow')}
                  </Link>
                  
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <p className="text-sm text-gray-400 mb-2">{t('nav.welcome')}, {user?.name}</p>
                    <Link 
                      to="/my-orders" 
                      className="block py-2 hover:text-yellow-400 transition"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t('nav.myOrders')}
                    </Link>
                    <Link 
                      to="/bookings" 
                      className="block py-2 hover:text-yellow-400 transition"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {t('nav.myBookings')}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left py-2 text-red-400 hover:text-red-300 transition"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/auth/login" 
                    className="block py-2 hover:text-yellow-400 transition"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/auth/register" 
                    className="block bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-500 transition font-semibold text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t('nav.signUp')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Promotional Banner - Below Navbar */}
      <div className="bg-[#d4af37] text-gray-900 py-2 md:py-3 text-center text-xs md:text-sm font-medium shadow-md px-4">
        <span className="font-bold">{t('banner.news')}</span> {t('banner.tagline')}
      </div>
    </>
  );
};

export default Header;
