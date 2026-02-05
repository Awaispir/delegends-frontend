import { useState, useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { barbersAPI } from '../utils/api';
import TeamCard from '../components/TeamCard';
import BarberProfileModal from '../components/BarberProfileModal';

const About = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await barbersAPI.getAll();
      setTeamMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching barbers:', error);
      setLoading(false);
    }
  };

  const handleViewProfile = (member) => {
    setSelectedBarber(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBarber(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl text-gray-300">{t('about.subtitle')}</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-6 text-yellow-600">{t('about.ourStory')}</h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
          
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              {t('about.storyPara1')}
            </p>
            <p>
              {t('about.storyPara2')}
            </p>
            <p>
              {t('about.storyPara3')}
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6 text-yellow-600">{t('about.whyChooseUs')}</h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl mb-4">✂️</div>
              <h3 className="text-xl font-bold mb-3">{t('about.expertBarbers')}</h3>
              <p className="text-gray-600">{t('about.expertBarbersDesc')}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-3">{t('about.premiumServices')}</h3>
              <p className="text-gray-600">{t('about.premiumServicesDesc')}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3">{t('about.customerSatisfaction')}</h3>
              <p className="text-gray-600">{t('about.customerSatisfactionDesc')}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl mb-4">🕐</div>
              <h3 className="text-xl font-bold mb-3">{t('about.convenientBooking')}</h3>
              <p className="text-gray-600">{t('about.convenientBookingDesc')}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-3">{t('about.professionalEnvironment')}</h3>
              <p className="text-gray-600">{t('about.professionalEnvironmentDesc')}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-3">{t('about.premiumProducts')}</h3>
              <p className="text-gray-600">{t('about.premiumProductsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6 text-yellow-600">{t('about.meetOurTeam')}</h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4"></div>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('about.professionalBarbers')}
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('about.noTeamMembers')}</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {teamMembers.slice(0, 3).map((member) => (
                  <TeamCard key={member._id} member={member} onViewProfile={handleViewProfile} />
                ))}
              </div>
              
              {/* Load More Button */}
              {teamMembers.length > 3 && (
                <div className="text-center mt-12">
                  <button 
                    onClick={() => navigate('/our-team')}
                    className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-lg hover:bg-yellow-500 transition font-semibold text-lg shadow-lg"
                  >
                    {t('common.loadMore')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Contact Info
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-yellow-400">Visit Us Today</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xl">📍 123 Main Street, New York, NY 10001</p>
            <p className="text-xl">📞 (555) 123-4567</p>
            <p className="text-xl">📧 info@delegends.com</p>
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Opening Hours</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                <div>
                  <p className="font-semibold">Monday - Friday:</p>
                  <p>9:00 AM - 8:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Saturday:</p>
                  <p>8:00 AM - 9:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Sunday:</p>
                  <p>10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
       {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">{t('about.readyToLookBest')}</h2>
          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">{t('about.readyToLookBestDesc')}</p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/bookings" 
              className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-lg hover:bg-yellow-500 transition font-semibold text-lg shadow-lg"
            >
              {t('nav.bookNow')}
            </Link>
            <Link 
              to="/about" 
              className="bg-transparent border-2 border-white px-10 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition font-semibold text-lg"
            >
              {t('common.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Barber Profile Modal */}
      <BarberProfileModal 
        member={selectedBarber}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default About;
