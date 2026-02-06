import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'https://barber-backend-main.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Salons API
export const salonsAPI = {
  getAll: () => api.get('/salons'),
  getOne: (id) => api.get(`/salons/${id}`),
  create: (salonData) => api.post('/salons', salonData),
  update: (id, salonData) => api.put(`/salons/${id}`, salonData),
  delete: (id) => api.delete(`/salons/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getAllBookings: () => api.get('/bookings/all'),
  create: (bookingData) => api.post('/bookings', bookingData),
  createPaymentSession: (bookingId) => api.post('/bookings/create-payment-session', { bookingId }),
  updatePaymentStatus: (id, paymentData) => api.patch(`/bookings/${id}/payment`, paymentData),
  updateStatus: (id, status) => api.patch(`/bookings/${id}`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats/dashboard'),
};

// Barbers API
export const barbersAPI = {
  getAll: () => api.get('/barbers'),
  getAllBarbers: () => api.get('/barbers/all'),
  create: (barberData) => api.post('/barbers', barberData),
  update: (id, barberData) => api.put(`/barbers/${id}`, barberData),
  delete: (id) => api.delete(`/barbers/${id}`),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getAllServices: () => api.get('/services/all'),
  create: (serviceData) => api.post('/services', serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getOne: (id) => api.get(`/products/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getApproved: () => api.get('/reviews/approved'),
  create: (reviewData) => api.post('/reviews', reviewData),
  getMyReviews: () => api.get('/reviews/my-reviews'),
};

// Gift Cards API
export const giftCardsAPI = {
  purchase: (giftCardData) => api.post('/gift-cards/purchase', giftCardData),
  validate: (code) => api.get(`/gift-cards/validate/${code}`),
  redeem: (redeemData) => api.post('/gift-cards/redeem', redeemData),
};

export default api;
