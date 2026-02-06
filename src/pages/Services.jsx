import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { useBookingCart } from '../context/BookingCartContext';
import { ChevronRight } from 'lucide-react';

const Services = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addService } = useBookingCart();

  const categories = [
    { id: 'haircuts', nameKey: 'servicesPage.haircuts', icon: '✂️' },
    { id: 'treatments', nameKey: 'servicesPage.treatments', icon: '💆‍♂️' },
    { id: 'coloring', nameKey: 'servicesPage.coloring', icon: '🎨' },
    { id: 'highlights', nameKey: 'servicesPage.highlights', icon: '✨' }
  ];

  const handleCategoryClick = async () => {
    try {
      const response = await servicesAPI.getAll();
      const services = response.data || [];
      
      if (services.length > 0) {
        const service = services[0];
        const bookingService = {
          _id: service._id,
          name: service.name,
          description: service.description || '',
          price: service.price,
          duration: service.duration || 30,
        };
        
        addService(bookingService);
        navigate('/select-location');
      } else {
        alert('No services available');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load services');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('servicesPage.title')}</h1>
          <p className="text-xl text-gray-300">{t('servicesPage.subtitle')}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 flex items-center justify-between group border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{category.icon}</span>
                <span className="text-lg font-semibold text-gray-900">
                  {t(category.nameKey)}
                </span>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
