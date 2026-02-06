import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI, barbersAPI, reviewsAPI } from '../utils/api';
import { useBookingCart } from '../context/BookingCartContext';
import { 
  ShoppingCart, 
  Trash2, 
  Clock, 
  DollarSign, 
  Plus,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  CreditCard,
  Star
} from 'lucide-react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Load Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/**
 * GuestBooking Component
 * 
 * Treatwell-style guest booking flow:
 * 1. Select services (add to cart)
 * 2. Choose date/time/barber
 * 3. Enter customer info (name, email, phone)
 * 4. Accept cancellation policy
 * 5. Provide card details (Stripe SetupIntent - mandatory security deposit)
 * 6. Complete booking
 */
const GuestBooking = () => {
  const navigate = useNavigate();
  const {
    cartServices,
    addService,
    removeService,
    clearAllBookingData,
    getTotalPrice,
    getTotalDuration,
    getServiceCount,
    // bookingDetails, // Unused for now
    updateBookingDetails,
  } = useBookingCart();

  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Special Services');
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [applyingCode, setApplyingCode] = useState(false);
  
  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  // Booking details
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [notes, setNotes] = useState('');
  
  // Time slots and availability
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Payment options
  const [canPayAtVenue, setCanPayAtVenue] = useState(false);
  const [paymentType, setPaymentType] = useState('card'); // 'card' or 'pay_at_venue'
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  
  // Payment and submission states
  const [policyAccepted, setPolicyAccepted] = useState(false);
  // const [submitting, setSubmitting] = useState(false); // Unused
  // const [error, setError] = useState(''); // Unused

  useEffect(() => {
    // Check if location was selected
    const storedLocation = sessionStorage.getItem('selectedLocation');
    if (storedLocation) {
      const location = JSON.parse(storedLocation);
      setSelectedLocation(location);
      updateBookingDetails({ location });
    } else {
      // No location selected - redirect to location selection
      navigate('/select-location');
      return;
    }

    fetchServices();
    fetchBarbers();
    fetchReviews();
  }, [navigate, updateBookingDetails]);

  const fetchServices = async () => {
    try {
      console.log('🔄 Fetching services from API...');
      const response = await servicesAPI.getAll();
      console.log('✅ Services loaded:', response.data);
      setServices(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarbers = async () => {
    try {
      const response = await barbersAPI.getAll();
      setBarbers(response.data || []);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getApproved();
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  // Fetch available time slots when date or barber changes
  const fetchAvailableSlots = useCallback(async () => {
    if (!bookingDate) {
      setAvailableSlots([]);
      return;
    }
    
    setLoadingSlots(true);
    try {
      const params = {
        date: bookingDate,
        location: selectedLocation?.id,
      };
      
      if (selectedBarber) {
        params.barber = selectedBarber;
      }
      
      const response = await axios.get(`${API_URL}/availability/check`, { params });
      setAvailableSlots(response.data.slots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [bookingDate, selectedBarber, selectedLocation]);
  
  // Check payment eligibility when customer info changes
  const checkPaymentEligibility = useCallback(async () => {
    if (!customerInfo.email || !customerInfo.phone) {
      return;
    }
    
    setCheckingEligibility(true);
    try {
      const response = await axios.post(`${API_URL}/guest-bookings/check-payment-eligibility`, {
        email: customerInfo.email,
        phone: customerInfo.phone,
      });
      
      setCanPayAtVenue(response.data.canPayAtVenue);
      
      // If customer has no-shows, force card payment
      if (!response.data.canPayAtVenue) {
        setPaymentType('card');
      }
    } catch (error) {
      console.error('Error checking payment eligibility:', error);
      setCanPayAtVenue(false);
    } finally {
      setCheckingEligibility(false);
    }
  }, [customerInfo.email, customerInfo.phone]);
  
  // Trigger slot fetch when date or barber changes
  useEffect(() => {
    if (bookingDate) {
      fetchAvailableSlots();
    }
  }, [bookingDate, selectedBarber, selectedLocation, fetchAvailableSlots]);
  
  // Check eligibility when moving to payment step
  useEffect(() => {
    if (currentStep === 3 && customerInfo.email && customerInfo.phone) {
      checkPaymentEligibility();
    }
  }, [currentStep, customerInfo.email, customerInfo.phone, checkPaymentEligibility]);

  const handleAddService = (service) => {
    const added = addService(service);
    if (!added) {
      alert('Service already in cart');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && getServiceCount() === 0) {
      alert('Please select at least one service');
      return;
    }
    
    if (currentStep === 2) {
      if (!bookingDate || !bookingTime) {
        alert('Please select date and time');
        return;
      }
    }
    
    if (currentStep === 3) {
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        alert('Please fill in all customer information');
        return;
      }
      if (!policyAccepted) {
        alert('Please accept the cancellation policy');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleRemoveService = (serviceId) => {
    removeService(serviceId);
  };

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim()) return;
    
    setApplyingCode(true);
    try {
      const response = await axios.get(`${API_URL}/gift-cards/validate/${giftCardCode}`);
      const data = response.data;
      
      if (data.valid && data.balance > 0) {
        const discountAmount = Math.min(data.balance, getTotalPrice());
        setAppliedDiscount(discountAmount);
        alert(`Gift card applied! Balance: £${data.balance}`);
      } else {
        alert(data.message || 'Invalid gift card');
      }
    } catch (error) {
      console.error('Gift card validation error:', error);
      alert('Failed to validate gift card');
    } finally {
      setApplyingCode(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setApplyingCode(true);
    try {
      // Placeholder for coupon validation
      // const response = await axios.get(`${API_URL}/coupons/validate/${couponCode}`);
      alert('Coupon validation coming soon');
    } catch (error) {
      console.error('Coupon validation error:', error);
      alert('Failed to validate coupon');
    } finally {
      setApplyingCode(false);
    }
  };

  const changeLocation = () => {
    sessionStorage.removeItem('selectedLocation');
    navigate('/select-location');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">No account required - quick and easy booking</p>
          
          {selectedLocation && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <MapPin className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold">{selectedLocation.name}</span>
              <button
                onClick={changeLocation}
                className="text-sm text-yellow-600 hover:text-yellow-700 underline ml-2"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Select Services' },
              { num: 2, label: 'Date & Time' },
              { num: 3, label: 'Your Info' },
              { num: 4, label: 'Payment' },
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step.num 
                      ? 'bg-yellow-400 text-gray-900' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.num}
                  </div>
                  <span className="text-sm mt-2 text-gray-600 text-center">{step.label}</span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step.num ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="max-w-7xl mx-auto px-4 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Services */}
                <div className="lg:col-span-2">
                  {/* Popular services section */}
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular services</h2>
                    
                    {services.length === 0 ? (
                      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-8 text-center">
                        <p className="text-gray-700 mb-2">No services available in the database yet.</p>
                        <p className="text-sm text-gray-600">Please add services through the admin panel first.</p>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {services.slice(0, 5).map((service) => (
                          <div 
                            key={service._id} 
                            className="py-6 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex items-start justify-between gap-6">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-gray-900 mb-2">{service.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span>{service.duration} mins</span>
                                  {service.description && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <button 
                                        onClick={() => setSelectedServiceDetails(service)}
                                        className="text-yellow-600 hover:text-yellow-700 hover:underline font-medium"
                                      >
                                        Show Details
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 flex-shrink-0">
                                <div className="text-right">
                                  <div className="text-base font-bold text-gray-900">from £{service.price}</div>
                                </div>
                                
                                <button
                                  onClick={() => handleAddService(service)}
                                  disabled={cartServices.some(s => s._id === service._id)}
                                  className={`px-7 py-2.5 rounded-md font-semibold text-sm transition ${
                                    cartServices.some(s => s._id === service._id)
                                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                      : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                                  }`}
                                >
                                  {cartServices.some(s => s._id === service._id) ? 'Selected' : 'Select'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Browse services section */}
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse services</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Categories Sidebar */}
                      <div className="lg:col-span-1 space-y-2">
                        {['Special Services', 'Body Massage', 'Beard Services', 'Hairdressing'].map((category) => {
                          const categoryCount = services.filter(s => s.category === category).length;
                          const isActive = selectedCategory === category;
                          return (
                            <button
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              className={`w-full text-left px-4 py-3 rounded-md transition ${
                                isActive 
                                  ? 'bg-gray-200 text-gray-900 font-semibold' 
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <span>{category}</span>
                              <span className="text-gray-500 ml-2">({categoryCount})</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Services List */}
                      <div className="lg:col-span-3">
                        <div className="space-y-0">
                          {services
                            .filter(s => s.category === selectedCategory)
                            .map((service) => (
                              <div 
                                key={service._id} 
                                className="py-6 border-b border-gray-200 last:border-b-0"
                              >
                                <div className="flex items-start justify-between gap-6">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900 mb-2">{service.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span>{service.duration} mins</span>
                                      {service.description && (
                                        <>
                                          <span className="mx-1">•</span>
                                          <button 
                                            onClick={() => setSelectedServiceDetails(service)}
                                            className="text-yellow-600 hover:text-yellow-700 hover:underline font-medium"
                                          >
                                            Show Details
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 flex-shrink-0">
                                    <div className="text-right">
                                      <div className="text-base font-bold text-gray-900">from £{service.price}</div>
                                    </div>
                                    
                                    <button
                                      onClick={() => handleAddService(service)}
                                      disabled={cartServices.some(s => s._id === service._id)}
                                      className={`px-7 py-2.5 rounded-md font-semibold text-sm transition ${
                                        cartServices.some(s => s._id === service._id)
                                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                          : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                                      }`}
                                    >
                                      {cartServices.some(s => s._id === service._id) ? 'Selected' : 'Select'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Cart Sidebar */}
                {getServiceCount() > 0 && (
                  <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white border-2 border-gray-200 rounded-lg p-6 shadow-lg">
                      <p className="text-base text-gray-700 font-semibold mb-4">Our visit</p>
                      <p className="text-sm text-gray-600 mb-4">{getServiceCount()} service{getServiceCount() > 1 ? 's' : ''}</p>
                      
                      <div className="space-y-3 mb-6">
                        {cartServices.map((service) => (
                          <div key={service._id} className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <span className="text-sm text-gray-900 block">{service.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900 font-semibold">£{service.price}</span>
                              <button
                                onClick={() => handleRemoveService(service._id)}
                                className="text-red-500 hover:text-red-700 transition"
                                title="Remove service"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-lg font-semibold text-gray-900">£{getTotalPrice()}</span>
                        </div>
                        {appliedDiscount > 0 && (
                          <div className="flex items-center justify-between mb-2 text-green-600">
                            <span className="text-sm">Discount</span>
                            <span className="text-sm font-semibold">-£{appliedDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="text-sm font-semibold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-gray-900">£{(getTotalPrice() - appliedDiscount).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Gift Card / Coupon Input */}
                      <div className="mb-6">
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">Gift Card Code</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={giftCardCode}
                                onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                                placeholder="Enter gift card code"
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              />
                              <button
                                onClick={handleApplyGiftCard}
                                disabled={applyingCode}
                                className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                              >
                                {applyingCode ? 'Checking...' : 'Apply'}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">Coupon Code</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              />
                              <button
                                onClick={handleApplyCoupon}
                                disabled={applyingCode}
                                className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                              >
                                {applyingCode ? 'Checking...' : 'Apply'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleNextStep}
                        className="w-full bg-yellow-400 text-gray-900 px-6 py-3 rounded-md hover:bg-yellow-500 transition font-semibold text-base shadow-md"
                      >
                        Choose Time
                      </button>
                      
                      <p className="text-xs text-gray-500 mt-4 text-center">You can add more or continue</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Venue Reviews Section */}
              <div className="max-w-7xl mx-auto px-4 mt-12 pb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Venue reviews</h2>
                
                {reviews.length > 0 ? (
                  <>
                    {/* Review Summary */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <div className="flex items-start gap-6">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-gray-900 mb-2">
                            {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">{reviews.length} reviews</p>
                        </div>
                        
                        <div className="flex-1">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-700 w-24">Ambience</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-700 w-24">Staff</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-700 w-24">Cleanliness</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verified Reviews Badge */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Verified reviews</p>
                        <p className="text-xs text-gray-600">Written by our customers, so you know what to expect at each and every venue.</p>
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-6">
                      {reviews.slice(0, 3).map((review) => (
                        <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          
                          <p className="text-gray-900 mb-4">{review.comment}</p>
                          
                          <div className="text-sm text-gray-600 mb-3">
                            {review.barberName && (
                              <p className="mb-1">
                                <span className="font-medium">Styled by {review.barberName}</span>
                                <span className="mx-2">•</span>
                                <span>{review.serviceName}</span>
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.customerName || 'Anonymous'}</span>
                              <span>•</span>
                              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                              {review.isVerified && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1 text-teal-600">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-medium">Verified</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {review.venueReply && (
                            <div className="mt-4 pl-4 border-l-2 border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Venue reply</p>
                              <p className="text-sm text-gray-600">{review.venueReply}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">No reviews yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Service Details Modal */}
          {selectedServiceDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedServiceDetails.name}</h2>
                    <button
                      onClick={() => setSelectedServiceDetails(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Service Info */}
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5" />
                        <span>{selectedServiceDetails.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-900 font-bold">
                        <span>from £{selectedServiceDetails.price}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedServiceDetails.description}</p>
                    </div>

                    {/* Service Reviews */}
                    {reviews.filter(r => r.serviceName === selectedServiceDetails.name).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Reviews for this service</h3>
                        <div className="space-y-4">
                          {reviews
                            .filter(r => r.serviceName === selectedServiceDetails.name)
                            .slice(0, 3)
                            .map((review) => (
                              <div key={review._id} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                                <p className="text-xs text-gray-500">
                                  {review.customerName || 'Anonymous'} • {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setSelectedServiceDetails(null)}
                        className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition font-semibold"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          handleAddService(selectedServiceDetails);
                          setSelectedServiceDetails(null);
                        }}
                        disabled={cartServices.some(s => s._id === selectedServiceDetails._id)}
                        className={`flex-1 py-3 rounded-md font-semibold transition ${
                          cartServices.some(s => s._id === selectedServiceDetails._id)
                            ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                            : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                        }`}
                      >
                        {cartServices.some(s => s._id === selectedServiceDetails._id) ? 'Already Selected' : 'Select Service'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Barber (Optional)</label>
                  <select
                    value={selectedBarber}
                    onChange={(e) => setSelectedBarber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="">Any available barber</option>
                    {barbers.map((barber) => (
                      <option key={barber._id} value={barber._id}>{barber.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => {
                      setBookingDate(e.target.value);
                      setBookingTime(''); // Reset time when date changes
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                {bookingDate && (
                  <div>
                    <label className="block text-sm font-medium mb-3">Select Time *</label>
                    
                    {loadingSlots ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
                        <p className="mt-2 text-gray-600 text-sm">Loading available times...</p>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-center py-8 text-gray-500">No available slots for this date</p>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setBookingTime(slot.time)}
                            className={`
                              px-3 py-2 rounded text-sm font-medium transition
                              ${bookingTime === slot.time
                                ? 'bg-yellow-400 text-gray-900 ring-2 ring-yellow-500'
                                : slot.available
                                  ? 'bg-white border border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                              }
                            `}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {bookingTime && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Selected:</strong> {bookingTime} ({getTotalDuration()} minutes)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!bookingTime}
                    className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Customer Info */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Your Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder=""
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                {/* Cancellation Policy */}
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Cancellation Policy</h3>
                      <p className="text-sm text-gray-700 mb-4">
                        Free cancellation until 24 hours before your appointment time. 
                        If you cancel less than 24 hours before your appointment or do not show up, 
                        you will be charged the full amount (€{getTotalPrice()}).
                      </p>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={policyAccepted}
                          onChange={(e) => setPolicyAccepted(e.target.checked)}
                          className="mt-1 w-5 h-5 text-yellow-600 rounded focus:ring-yellow-400"
                        />
                        <span className="text-sm text-gray-900">
                          I understand and accept the cancellation policy
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Payment Method Selection */}
                {canPayAtVenue && (
                  <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer p-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 transition">
                        <input
                          type="radio"
                          name="paymentType"
                          value="card"
                          checked={paymentType === 'card'}
                          onChange={(e) => setPaymentType(e.target.value)}
                          className="mt-1 w-5 h-5 text-blue-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">Pay with Card</div>
                          <p className="text-sm text-gray-600">Secure payment with credit/debit card</p>
                        </div>
                      </label>
                      
                      <label className="flex items-start gap-3 cursor-pointer p-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 transition">
                        <input
                          type="radio"
                          name="paymentType"
                          value="pay_at_venue"
                          checked={paymentType === 'pay_at_venue'}
                          onChange={(e) => setPaymentType(e.target.value)}
                          className="mt-1 w-5 h-5 text-blue-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">Pay at Venue</div>
                          <p className="text-sm text-gray-600">Pay when you arrive for your appointment</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
                
                {!canPayAtVenue && checkingEligibility && (
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Checking payment options...</p>
                  </div>
                )}
                
                {!canPayAtVenue && !checkingEligibility && customerInfo.email && customerInfo.phone && (
                  <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
                    <p className="text-sm text-orange-800">
                      <strong>Note:</strong> Card details are required due to previous booking history.
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!policyAccepted}
                    className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment (Card Setup or Pay at Venue) */}
          {currentStep === 4 && (
            <>
              {paymentType === 'pay_at_venue' ? (
                <PayAtVenueStep
                  customerInfo={customerInfo}
                  cartServices={cartServices}
                  bookingDate={bookingDate}
                  bookingTime={bookingTime}
                  selectedBarber={selectedBarber}
                  selectedLocation={selectedLocation}
                  notes={notes}
                  totalPrice={getTotalPrice()}
                  totalDuration={getTotalDuration()}
                  onBack={handlePrevStep}
                  clearAllBookingData={clearAllBookingData}
                />
              ) : (
                <Elements stripe={stripePromise}>
                  <PaymentStep
                    customerInfo={customerInfo}
                    cartServices={cartServices}
                    bookingDate={bookingDate}
                    bookingTime={bookingTime}
                    selectedBarber={selectedBarber}
                    selectedLocation={selectedLocation}
                    notes={notes}
                    totalPrice={getTotalPrice()}
                    totalDuration={getTotalDuration()}
                    onBack={handlePrevStep}
                    clearAllBookingData={clearAllBookingData}
                  />
                </Elements>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Pay at Venue Step (no card required)
const PayAtVenueStep = ({
  customerInfo,
  cartServices,
  bookingDate,
  bookingTime,
  selectedBarber,
  selectedLocation,
  notes,
  totalPrice,
  totalDuration,
  onBack,
  clearAllBookingData,
}) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Validate data before sending
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        throw new Error('Please fill in all customer information');
      }
      
      if (!bookingDate || !bookingTime) {
        throw new Error('Please select date and time');
      }
      
      if (!cartServices || cartServices.length === 0) {
        throw new Error('Please select at least one service');
      }
      
      if (!selectedLocation) {
        throw new Error('Please select a location');
      }

      // Create booking without card setup
      const bookingData = {
        customerInfo,
        services: cartServices.map((s) => ({
          serviceId: s._id,
          serviceName: s.name,
          price: s.price,
          duration: s.duration,
        })),
        barber: selectedBarber || null,
        date: bookingDate,
        time: bookingTime,
        location: selectedLocation,
        notes,
        cancellationPolicyAccepted: true,
        paymentType: 'pay_at_venue',
      };
      
      console.log('Sending booking data:', bookingData);

      const response = await axios.post(`${API_URL}/guest-bookings/create`, bookingData);

      // Clear cart and navigate to success
      clearAllBookingData();
      navigate('/order-success', {
        state: {
          booking: response.data.booking,
          paymentType: 'pay_at_venue',
        },
      });
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error details:', error.response?.data);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to create booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-semibold">{bookingDate} at {bookingTime}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold">{totalDuration} minutes</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-semibold">{selectedLocation?.name}</span>
          </div>
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-yellow-600">€{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pay at Venue Notice */}
      <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6 mb-6">
        <div className="flex gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Pay at Venue</h3>
            <p className="text-sm text-blue-800">
              You'll pay €{totalPrice} when you arrive for your appointment.
              Please arrive 5 minutes early.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Separate component for payment step (needs Stripe Elements)
const PaymentStep = ({
  customerInfo,
  cartServices,
  bookingDate,
  bookingTime,
  selectedBarber,
  selectedLocation,
  notes,
  totalPrice,
  // totalDuration, // Not used in component - available if needed
  onBack,
  clearAllBookingData,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!stripe || !elements) {
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Create SetupIntent
      const setupResponse = await axios.post(`${API_URL}/guest-bookings/create-setup-intent`, {
        customerInfo,
      });

      const { clientSecret } = setupResponse.data; // setupIntentId available if needed later

      // Step 2: Confirm card setup with Stripe
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setSubmitting(false);
        return;
      }

      // Step 3: Create booking with card on file
      const bookingResponse = await axios.post(`${API_URL}/guest-bookings/create`, {
        customerInfo,
        services: cartServices.map(s => ({
          serviceId: s._id,
          serviceName: s.name,
          price: s.price,
          duration: s.duration,
        })),
        barber: selectedBarber || undefined,
        date: bookingDate,
        time: bookingTime,
        location: selectedLocation,
        notes,
        cancellationPolicyAccepted: true,
        setupIntentId: setupIntent.id,
        paymentType: 'card', // Card payment
      });

      // Success!
      clearAllBookingData();
      alert(`✅ Booking confirmed! ${bookingResponse.data.message}`);
      navigate('/');

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <CreditCard className="w-7 h-7" />
        Payment Information
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          <strong>Card Required:</strong> Your card will be saved as a security deposit. 
          You will NOT be charged now unless you have a previous no-show history. 
          Charges only apply for late cancellations (&lt;24h) or no-shows.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Card Details *</label>
          {!stripe || !elements ? (
            <div className="border border-red-300 bg-red-50 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                ⚠️ Stripe is not loaded. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file and restart the dev server.
              </p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
          <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Services:</span>
              <span className="font-semibold">{cartServices.length} service(s)</span>
            </div>
            {cartServices.map((service, idx) => (
              <div key={idx} className="flex justify-between pl-4 text-gray-600">
                <span>• {service.name}</span>
                <span>€{service.price}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-semibold">
                {new Date(bookingDate).toLocaleDateString()} at {bookingTime}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t">
              <span>Total:</span>
              <span className="text-yellow-600">€{totalPrice}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!stripe || submitting}
            className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestBooking;
