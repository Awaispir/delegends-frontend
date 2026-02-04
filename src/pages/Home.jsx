import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Hero from '../assets/Hero.png';
import Hero1 from '../assets/Hero1.png';
import Hero2 from '../assets/Hero2.png';
import BrandsMarquee from '../components/BrandsMarquee';
import BookSection from '../components/Booksection';
import { reviewsAPI } from '../utils/api';
import { Star } from 'lucide-react';



const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviews, setReviews] = useState([]);
  const { t } = useLanguage();
  const heroImages = [Hero, Hero1, Hero2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getApproved();
      const reviewData = response.data || [];
      setReviews(Array.isArray(reviewData) ? reviewData.slice(0, 6) : []); // Show up to 6 reviews
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]); // Set empty array on error
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };
  
  const services = [
    {
      id: 1,
      name: t('services.groomsmaidName'),
      price: "€59.99",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop",
      description: t('services.groomsmaidDesc')
    },
    {
      id: 2,
      name: t('services.groomClassicName'),
      price: "€74.99",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop",
      description: t('services.groomClassicDesc')
    },
    {
      id: 3,
      name: t('services.groomPlusName'),
      price: "€134.99",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
      description: t('services.groomPlusDesc')
    }
  ];
  const categories = [
    {
      id: 1,
      title: t('services.haircutsStyling'),
      description: t('services.haircutsStylingDesc'),
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: t('services.beardGrooming'),
      description: t('services.beardGroomingDesc'),
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: t('services.shavingServices'),
      description: t('services.shavingServicesDesc'),
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: t('services.spaTreatments'),
      description: t('services.spaTreatmentsDesc'),
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop"
    }
  ];
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${heroImages[currentSlide]})`,
          height: 'calc(100vh - 100px)' // Adjusted for mobile navbar
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white drop-shadow-2xl">{t('home.heroTitle')}</h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 text-gray-200">
            {t('home.heroSubtitle')}
          </p>
          <p className="text-sm md:text-base lg:text-lg mb-6 md:mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            {t('homeExtra.heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link 
              to="/select-location" 
              className="bg-yellow-400 text-gray-900 px-6 md:px-10 py-3 md:py-4 rounded-lg hover:bg-yellow-500 transition font-semibold text-base md:text-lg shadow-lg w-full sm:w-auto"
            >
              {t('homeExtra.bookAppointment')}
            </Link>
            <Link 
              to="/services" 
              className="bg-transparent border-2 border-white px-6 md:px-10 py-3 md:py-4 rounded-lg hover:bg-white hover:text-gray-900 transition font-semibold text-base md:text-lg text-white w-full sm:w-auto"
            >
              {t('homeExtra.viewServices')}
            </Link>
          </div>
        </div>
        
        {/* Previous Button */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-4 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-4 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-yellow-400 w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Services Preview */}
       <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          {t('home.featuredServices')}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t('home.featuredServicesDesc')}
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {service.name}
                </h3>
                <p className="text-yellow-600 font-bold text-xl text-center mb-4">
                  {service.price}
                </p>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* About Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">{t('homeExtra.whyChooseDelegends')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <div className="text-6xl mb-4">✂️</div>
              <h3 className="text-2xl font-semibold mb-3">{t('homeExtra.expertBarbers')}</h3>
              <p className="text-gray-600">
                {t('homeExtra.expertBarbersDesc')}
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold mb-3">{t('homeExtra.premiumService')}</h3>
              <p className="text-gray-600">
                {t('homeExtra.premiumServiceDesc')}
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold mb-3">{t('homeExtra.easyBooking')}</h3>
              <p className="text-gray-600">
                {t('homeExtra.easyBookingDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Categories */}
     <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          {t('home.serviceCategories')}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t('home.serviceCategoriesDesc')}
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Section */}
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              {/* Content Section */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-yellow-400">{t('homeExtra.testimonials')}</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">{t('homeExtra.testimonialsDesc')}</p>
          
          {!reviews || reviews.length === 0 ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Fallback static reviews */}
              <div className="bg-gray-800 p-8 rounded-lg">
                <div className="text-yellow-400 mb-4 text-2xl">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-300 mb-4 italic">"Best barber experience I've ever had! The attention to detail and professional service is outstanding. Highly recommended!"</p>
                <p className="text-yellow-400 font-semibold">- Ahmed K.</p>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg">
                <div className="text-yellow-400 mb-4 text-2xl">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-300 mb-4 italic">"The VIP service is absolutely worth it. I felt like royalty! The team is skilled and the atmosphere is perfect."</p>
                <p className="text-yellow-400 font-semibold">- Hassan M.</p>
              </div>

              <div className="bg-gray-800 p-8 rounded-lg">
                <div className="text-yellow-400 mb-4 text-2xl">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-300 mb-4 italic">"Great service, friendly staff, and always consistent quality. Been coming here for years and never disappointed."</p>
                <p className="text-yellow-400 font-semibold">- Bilal R.</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {reviews.map((review) => (
                <div key={review._id} className="bg-gray-800 p-8 rounded-lg transform transition-transform hover:scale-105">
                  <div className="mb-4">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{review.comment}"</p>
                  <div className="flex items-center gap-2">
                    <p className="text-yellow-400 font-semibold">- {review.customerName}</p>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">{review.serviceName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-yellow-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">15+</div>
              <p className="text-gray-800 font-semibold">{t('homeExtra.yearsExperience')}</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">10K+</div>
              <p className="text-gray-800 font-semibold">{t('homeExtra.happyClients')}</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">6</div>
              <p className="text-gray-800 font-semibold">{t('homeExtra.expertBarberCount')}</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">50+</div>
              <p className="text-gray-800 font-semibold">{t('homeExtra.premiumServices')}</p>
            </div>
          </div>
        </div>
      </section>

    <BrandsMarquee />

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Look Your Best?</h2>
          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">Book your appointment today at DeLegends Barber Shop and experience the difference that expert grooming makes</p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/bookings" 
              className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-lg hover:bg-yellow-500 transition font-semibold text-lg shadow-lg"
            >
              Book Now
            </Link>
            <Link 
              to="/about" 
              className="bg-transparent border-2 border-white px-10 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition font-semibold text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section> */}
      <BookSection />
    </div>
  );
};

export default Home;
