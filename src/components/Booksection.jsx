import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BookSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6">
          {t('about.readyToLookBest')}
        </h2>
        <p className="text-lg md:text-xl mb-8 md:mb-10 text-gray-300 max-w-2xl mx-auto">
          {t('about.readyToLookBestDesc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/select-location" 
            className="bg-yellow-400 text-gray-900 px-8 md:px-10 py-3 md:py-4 rounded-lg hover:bg-yellow-500 transition font-semibold text-base md:text-lg shadow-lg"
          >
            {t('home.bookAppointment')}
          </Link>
          <Link 
            to="/about" 
            className="bg-transparent border-2 border-white px-8 md:px-10 py-3 md:py-4 rounded-lg hover:bg-white hover:text-gray-900 transition font-semibold text-base md:text-lg"
          >
            {t('common.learnMore')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookSection;
