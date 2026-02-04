import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if this is a booking success (from Pay at Venue)
    if (location.state?.booking) {
      setBooking(location.state.booking);
      setLoading(false);
      return;
    }

    // Otherwise, handle product order success
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      navigate('/');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/session/${sessionId}`);
        setOrder(response.data);
        // Clear the cart after successful order
        clearCart();
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, navigate, clearCart, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {booking ? 'Booking Confirmed!' : 'Order Successful!'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {booking 
              ? 'Thank you! Your booking has been confirmed.' 
              : 'Thank you for your purchase. Your order has been confirmed.'}
          </p>

          {/* Booking Success Details */}
          {booking && (
            <>
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                    <p className="text-lg font-bold text-gray-900">{booking.customerInfo?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                    <p className="text-lg font-bold text-gray-900">{booking.date} at {booking.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-lg font-medium text-gray-900">{booking.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-green-600">€{booking.totalPrice?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Services</h2>
                <div className="space-y-3">
                  {booking.services?.map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800">{service.serviceName}</h3>
                        <p className="text-sm text-gray-600">{service.duration} minutes</p>
                      </div>
                      <p className="font-bold text-gray-900">€{service.price?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {location.state?.paymentType === 'pay_at_venue' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-700 font-semibold">
                    💳 Payment Method: Pay at Venue
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Please bring cash or card to pay at the salon.
                  </p>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-700">
                  A confirmation email has been sent to <strong>{booking.customerInfo?.email}</strong>
                </p>
              </div>
            </>
          )}

          {/* Product Order Success Details */}
          {order && (
            <>
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Number</p>
                    <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">€{order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    <p className="text-lg font-semibold text-green-600 capitalize">{order.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-lg font-medium text-gray-900">{order.customerInfo.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Items</h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-contain rounded-md bg-white"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                        }}
                      />
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-700">
                  A confirmation email has been sent to <strong>{order.customerInfo.email}</strong>
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="bg-[#d4af37] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#c49d2e] transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
