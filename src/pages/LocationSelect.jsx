import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LocationSelect = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const locations = [
    {
      id: 'location-1',
      name: 'De Legends Barbershop – OLDTOWN',
      address: 'Pilies g. 38 Vilnius, LT-01123',
      mapUrl: 'https://maps.app.goo.gl/8z77Btrk2Lv6977S7',
      description: 'Full range of premium barbering services.',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&h=300&fit=crop',
    },
    {
      id: 'location-2',
      name: 'De Legends Barbershop – BIG VILNIUS',
      address: 'Ukmergės g. 369 Vilnius, LT-06331',
      mapUrl: 'https://maps.app.goo.gl/qHjJVtjcx5JP3LQa9',
      description: 'Full range of premium barbering services.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=300&fit=crop',
    },
  ];

  const handleLocationSelect = (location) => {
    // Store selected location in sessionStorage
    sessionStorage.setItem('selectedLocation', JSON.stringify(location));
    // Navigate to guest booking page
    navigate('/guest-booking');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Choose Your Location</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the branch that's most convenient for you to book your appointment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              {/* Location Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-1">{location.name}</h2>
                </div>
              </div>

              {/* Location Details */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 min-h-12">{location.description}</p>

                <div className="flex items-start gap-3 mb-4 text-gray-700">
                  <MapPin className="w-5 h-5 mt-1 shrink-0 text-yellow-600" />
                  <p className="text-sm">{location.address}</p>
                </div>

                 
                <div className="space-y-3">
                  <button
                    onClick={() => handleLocationSelect(location)}
                    className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg hover:bg-yellow-500 transition font-semibold text-lg flex items-center justify-center gap-2 group"
                  >
                    <Navigation className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    {t('bookings.bookAppointmentHere')}
                  </button>

                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-100 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('bookings.viewOnGoogleMaps')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 transition font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelect;
