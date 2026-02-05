import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { servicesData } from '../data/servicesData';
import { servicesAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { useBookingCart } from '../context/BookingCartContext';

const Services = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addService } = useBookingCart();

  // Handle service click - fetch real service from DB and use its MongoDB ID
  const handleServiceClick = async (service) => {
    try {
      // Fetch all services from database
      const response = await servicesAPI.getAll();
      const dbServices = response.data || [];
      
      // Extract price from hardcoded service
      const priceString = service.price || '0';
      const priceNumber = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
      
      // Find a matching service from DB (by price range)
      let matchedService = dbServices.find(s => 
        Math.abs(s.price - priceNumber) < 10 // Within €10 range
      );
      
      // If no match, use first available service
      if (!matchedService && dbServices.length > 0) {
        matchedService = dbServices[0];
      }
      
      if (matchedService) {
        // Use real MongoDB ID from database
        const bookingService = {
          _id: matchedService._id,  // Real MongoDB ObjectId
          name: service.nameKey ? t(service.nameKey) : service.name,
          description: service.descriptionKey ? t(service.descriptionKey) : '',
          price: priceNumber,
          duration: service.duration || 30,
        };
        
        addService(bookingService);
        navigate('/select-location');
      } else {
        alert('No services available in database. Please add services first.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load service. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('servicesPage.title')}</h1>
          <p className="text-xl text-gray-300">{t('servicesPage.subtitle')}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Special Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {servicesData.specialServices.emoji} {t('servicesPage.specialService')}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('servicesPage.specialServiceDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {servicesData.specialServices.services.map((service) => (
              <div key={service.id} onClick={() => handleServiceClick(service)} className="cursor-pointer h-full">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </section>

        {/* Body Massage and Other Treatments Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {servicesData.bodyMassage.emoji} {t('servicesPage.bodyMassage')}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('servicesPage.bodyMassageDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {servicesData.bodyMassage.services.map((service) => (
              <div key={service.id} onClick={() => handleServiceClick(service)} className="cursor-pointer h-full">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </section>

        {/* Beard, Wax, Shaving Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {servicesData.beardServices.emoji} {t('servicesPage.beardServices')}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('servicesPage.beardServicesDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {servicesData.beardServices.services.map((service) => (
              <div key={service.id} onClick={() => handleServiceClick(service)} className="cursor-pointer h-full">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </section>

        {/* Hairdressing and Hair Coloring Services Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {servicesData.hairdressing.emoji} {t('servicesPage.hairdressing')}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('servicesPage.hairdressingDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {servicesData.hairdressing.services.map((service) => (
              <div key={service.id} onClick={() => handleServiceClick(service)} className="cursor-pointer h-full">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
