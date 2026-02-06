import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { BookingCartProvider } from './context/BookingCartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import OurTeam from './pages/OurTeam';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import LocationSelect from './pages/LocationSelect';
import GuestBooking from './pages/GuestBooking';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
// DISABLED: Checkout removed as per Treatwell model
// import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import Cookies from './pages/Cookies';
import Disclaimer from './pages/Disclaimer';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import Career from './pages/Career';
import GiftCards from './pages/GiftCards';
import FAQ from './pages/FAQ';
import RoleWidget from './components/RoleWidget';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <BookingCartProvider>
              <Routes>
         
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                
                {/* Guest Booking - NO AUTH REQUIRED */}
                <Route path="/guest-booking" element={
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1">
                      <GuestBooking />
                    </main>
                    <Footer />
                  </div>
                } />
                
                {/* Location Selection - NO AUTH REQUIRED */}
                <Route path="/select-location" element={
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1">
                      <LocationSelect />
                    </main>
                    <Footer />
                  </div>
                } />
          
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/our-team" element={<OurTeam />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  {/* DISABLED: Checkout removed as per Treatwell model */}
                  {/* <Route path="/checkout" element={<Checkout />} /> */}
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/refund" element={<Refund />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/blogs/:slug" element={<BlogDetails />} />
                  <Route path="/career" element={<Career />} />
                  <Route path="/gift-cards" element={<GiftCards />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route 
                    path="/my-orders" 
                    element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bookings" 
                    element={
                      <ProtectedRoute>
                        <Bookings />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
              <RoleWidget />
            </div>
          } />
              </Routes>
            </BookingCartProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
