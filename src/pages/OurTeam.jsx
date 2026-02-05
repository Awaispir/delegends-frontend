import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { barbersAPI } from '../utils/api';
import TeamCard from '../components/TeamCard';
import BarberProfileModal from '../components/BarberProfileModal';

const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

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
          <h1 className="text-5xl font-bold mb-4">{t('team.title')}</h1>
          <p className="text-xl text-gray-300">
            {t('team.subtitle')}
          </p>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6 text-yellow-600">
            {t('team.professionalBarbers')}
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4"></div>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('team.teamDesc')}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {teamMembers.map((member) => (
                <TeamCard key={member._id} member={member} onViewProfile={handleViewProfile} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-yellow-400">{t('team.readyToBook')}</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            {t('team.readyToBookDesc')}
          </p>
          <a
            href="/select-location"
            className="inline-block bg-yellow-400 text-gray-900 px-10 py-4 rounded-lg hover:bg-yellow-500 transition font-semibold text-lg shadow-lg"
          >
            {t('common.bookAppointment')}
          </a>
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

export default OurTeam;
