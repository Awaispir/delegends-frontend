import { createContext, useContext, useState, useEffect } from 'react';

/**
 * BookingCartContext
 * 
 * Manages service cart for Treatwell-style guest bookings
 * - Allows adding/removing services
 * - Calculates total price and duration
 * - Persists cart in sessionStorage
 */

const BookingCartContext = createContext();

export const useBookingCart = () => {
  const context = useContext(BookingCartContext);
  if (!context) {
    throw new Error('useBookingCart must be used within BookingCartProvider');
  }
  return context;
};

export const BookingCartProvider = ({ children }) => {
  const [cartServices, setCartServices] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    barber: null,
    date: '',
    time: '',
    location: null,
  });

  // Load cart from sessionStorage on mount
  useEffect(() => {
    const savedCart = sessionStorage.getItem('bookingCart');
    const savedDetails = sessionStorage.getItem('bookingDetails');
    
    if (savedCart) {
      try {
        setCartServices(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
    
    if (savedDetails) {
      try {
        setBookingDetails(JSON.parse(savedDetails));
      } catch (e) {
        console.error('Error loading booking details:', e);
      }
    }
  }, []);

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('bookingCart', JSON.stringify(cartServices));
  }, [cartServices]);

  // Save booking details to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
  }, [bookingDetails]);

  // Add service to cart
  const addService = (service) => {
    const exists = cartServices.find(s => s._id === service._id);
    if (exists) {
      // Service already in cart
      return false;
    }
    setCartServices([...cartServices, service]);
    return true;
  };

  // Remove service from cart
  const removeService = (serviceId) => {
    setCartServices(cartServices.filter(s => s._id !== serviceId));
  };

  // Clear cart
  const clearCart = () => {
    setCartServices([]);
    sessionStorage.removeItem('bookingCart');
  };

  // Clear all booking data
  const clearAllBookingData = () => {
    setCartServices([]);
    setBookingDetails({
      barber: null,
      date: '',
      time: '',
      location: null,
    });
    sessionStorage.removeItem('bookingCart');
    sessionStorage.removeItem('bookingDetails');
    sessionStorage.removeItem('selectedLocation');
  };

  // Calculate totals
  const getTotalPrice = () => {
    return cartServices.reduce((sum, service) => sum + (service.price || 0), 0);
  };

  const getTotalDuration = () => {
    return cartServices.reduce((sum, service) => sum + (service.duration || 0), 0);
  };

  const getServiceCount = () => {
    return cartServices.length;
  };

  // Update booking details
  const updateBookingDetails = (details) => {
    setBookingDetails(prev => ({ ...prev, ...details }));
  };

  const value = {
    cartServices,
    bookingDetails,
    addService,
    removeService,
    clearCart,
    clearAllBookingData,
    getTotalPrice,
    getTotalDuration,
    getServiceCount,
    updateBookingDetails,
  };

  return (
    <BookingCartContext.Provider value={value}>
      {children}
    </BookingCartContext.Provider>
  );
};

export default BookingCartContext;
