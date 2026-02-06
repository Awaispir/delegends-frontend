import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookingsAPI, barbersAPI, servicesAPI, reviewsAPI } from '../utils/api';
import { MapPin, ExternalLink, CreditCard, DollarSign, User, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Bookings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({});
  const [submittingReview, setSubmittingReview] = useState(null);
  const [formData, setFormData] = useState({
    service: '',
    serviceName: '',
    barber: '',
    date: '',
    time: '',
    price: 0,
    notes: '',
    location: null,
  });

  useEffect(() => {
    // Check if location was selected
    const storedLocation = sessionStorage.getItem('selectedLocation');
    if (storedLocation) {
      const location = JSON.parse(storedLocation);
      setSelectedLocation(location);
      setFormData(prev => ({ ...prev, location }));
      // Redirect to guest booking page with Treatwell-style interface
      navigate('/guest-booking');
      return;
    }
    
    fetchBookings();
    fetchBarbers();
    fetchServices();

    // Handle payment callback
    const paymentStatus = searchParams.get('payment');
    const bookingId = searchParams.get('booking_id');
    
    if (paymentStatus === 'success' && bookingId) {
      handlePaymentSuccess(bookingId);
    } else if (paymentStatus === 'cancelled') {
      alert('Payment was cancelled. You can pay later from your bookings.');
    }
  }, [searchParams]);

  const handlePaymentSuccess = async (bookingId) => {
    try {
      await bookingsAPI.updatePaymentStatus(bookingId, { 
        paymentStatus: 'paid', 
        isPaid: true 
      });
      await fetchBookings();
      alert('✅ Payment successful! Your appointment is confirmed.');
      // Clean up URL
      navigate('/bookings', { replace: true });
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      const bookingData = response.data || [];
      const validBookings = Array.isArray(bookingData) ? bookingData : [];
      
      // Sort bookings by creation date (newest first)
      const sortedBookings = validBookings.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarbers = async () => {
    try {
      const response = await barbersAPI.getAll();
      const barberData = response.data || [];
      setBarbers(Array.isArray(barberData) ? barberData : []);
    } catch (error) {
      console.error('Error fetching barbers:', error);
      setBarbers([]);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      const serviceData = response.data || [];
      setServices(Array.isArray(serviceData) ? serviceData : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location) {
      alert('Please select a location first');
      setShowForm(false);
      navigate('/select-location');
      return;
    }
    
    // Check for double booking
    const selectedBarber = formData.barber;
    const selectedDate = formData.date;
    const selectedTime = formData.time;
    
    const existingBooking = bookings.find((b) => {
      return (
        b.barber?._id === selectedBarber &&
        new Date(b.date).toDateString() === new Date(selectedDate).toDateString() &&
        b.time === selectedTime &&
        b.status !== 'cancelled'
      );
    });
    
    if (existingBooking) {
      alert(`Sorry! This barber is already booked at ${selectedTime} on ${new Date(selectedDate).toLocaleDateString()}. Please choose a different time.`);
      return;
    }
    
    try {
      console.log('Sending booking data:', formData);
      const response = await bookingsAPI.create(formData);
      const createdBooking = response.data;
      console.log('Booking created:', createdBooking);
      
      setShowForm(false);
      setFormData({
        service: '',
        serviceName: '',
        barber: '',
        date: '',
        time: '',
        price: 0,
        notes: '',
        location: selectedLocation,
      });
      fetchBookings();
      alert('✅ Appointment booked successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to create booking');
    }
  };

  const handlePayNow = async (bookingId) => {
    try {
      setPaymentLoading(true);
      const response = await bookingsAPI.createPaymentSession(bookingId);
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating payment session:', error);
      alert('Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  const handleServiceChange = (serviceId) => {
    const selectedService = services.find(s => s._id === serviceId);
    if (selectedService) {
      setFormData({
        ...formData,
        service: serviceId,
        serviceName: selectedService.name,
        price: selectedService.price,
      });
    }
  };

  // DISABLED: Cancel booking feature removed as per Treatwell model
  // const handleDelete = async () => {
  //   alert('❌ Cancellation is not available. Please contact the salon directly.');
  //   return;
  // };

  // DISABLED: Location change handled directly in UI  
  // const changeLocation = () => {
  //   sessionStorage.removeItem('selectedLocation');
  //   navigate('/select-location');
  // };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleReviewSubmit = async (bookingId) => {
    const review = reviewForm[bookingId];
    if (!review || !review.rating || !review.comment) {
      alert('Please provide both a rating and a comment');
      return;
    }

    try {
      setSubmittingReview(bookingId);
      await reviewsAPI.create({
        bookingId,
        rating: review.rating,
        comment: review.comment,
      });
      alert('✅ Thank you for your review! It will be visible after admin approval.');
      // Clear form and refresh bookings
      setReviewForm(prev => {
        const newForm = { ...prev };
        delete newForm[bookingId];
        return newForm;
      });
      fetchBookings();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(null);
    }
  };

  const setRating = (bookingId, rating) => {
    setReviewForm(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], rating }
    }));
  };

  const setComment = (bookingId, comment) => {
    setReviewForm(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], comment }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Bookings</h1>
          <button
            onClick={() => {
              // Always go to location select first for new bookings
              navigate('/select-location');
            }}
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold"
          >
            New Booking
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Booking</h2>
              {selectedLocation && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold">{selectedLocation.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem('selectedLocation');
                      navigate('/select-location');
                    }}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium underline"
                  >
                    Change Location
                  </button>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Service *</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={formData.service}
                    onChange={(e) => handleServiceChange(e.target.value)}
                  >
                    <option value="">Choose a service...</option>
                    {Array.isArray(services) && services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name} - ${service.price} ({service.duration} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Barber *</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={formData.barber}
                    onChange={(e) => setFormData({ ...formData, barber: e.target.value })}
                  >
                    <option value="">Choose a barber...</option>
                    {Array.isArray(barbers) && barbers.map((barber) => (
                      <option key={barber._id} value={barber._id}>
                        {barber.name}{barber.specialties?.length > 0 ? ` - ${barber.specialties.join(', ')}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time *</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (€)</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    value={formData.price}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special requests..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold"
              >
                {t('bookings.bookAppointmentButton')}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your bookings...</p>
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 text-lg">No bookings yet. Create your first booking!</p>
            </div>
          ) : (
            Array.isArray(bookings) && bookings.map((booking) => (
              <div key={booking.id || booking._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">
                        {booking.salon?.name || 'DeLegends Barber Shop'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.isPaid ? (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          ✓ Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                          Unpaid
                        </span>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <p><strong>Location:</strong> {booking.location?.name || 'N/A'}</p>
                      <p><strong>Service:</strong> {booking.serviceName || booking.service?.name || 'N/A'}</p>
                      <div className="flex items-center gap-2">
                        <strong>Barber:</strong>
                        {booking.barber?.profileImage ? (
                          <img 
                            src={booking.barber.profileImage} 
                            alt={booking.barber.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-400" />
                        )}
                        <span>{booking.barber?.name || 'Not assigned'}</span>
                      </div>
                      <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {booking.time}</p>
                      <p><strong>Price:</strong> ${booking.price}</p>
                      {booking.notes && <p className="col-span-2"><strong>Notes:</strong> {booking.notes}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!booking.isPaid && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handlePayNow(booking._id || booking.id)}
                        disabled={paymentLoading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay Now
                      </button>
                    )}
                    {/* DISABLED: Cancel button removed as per Treatwell model */}
                    {/* <button
                      onClick={() => handleDelete(booking.id || booking._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Cancel
                    </button> */}
                  </div>
                </div>

                {/* Review Section - Show only for completed bookings without reviews */}
                {booking.status === 'completed' && !booking.hasReview && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Leave a Review
                    </h4>
                    <div className="space-y-4">
                      {/* Star Rating */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating *</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(booking._id || booking.id, star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= (reviewForm[booking._id || booking.id]?.rating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Review *</label>
                        <textarea
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                          placeholder="Share your experience with us..."
                          value={reviewForm[booking._id || booking.id]?.comment || ''}
                          onChange={(e) => setComment(booking._id || booking.id, e.target.value)}
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={() => handleReviewSubmit(booking._id || booking.id)}
                        disabled={submittingReview === (booking._id || booking.id)}
                        className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold disabled:opacity-50"
                      >
                        {submittingReview === (booking._id || booking.id) ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Review Submitted Message */}
                {booking.status === 'completed' && booking.hasReview && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <Star className="w-6 h-6 text-green-600 fill-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">Review Submitted!</p>
                        <p className="text-sm text-green-700">Thank you for your feedback. Your review is pending admin approval.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
