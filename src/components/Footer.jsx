import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-[#1a1d2e] text-white py-10 px-16">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 items-stretch">
          {/* Company Section */}
          <div className="flex flex-col h-full">
            <h3 className="text-base font-semibold mb-5">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/blogs" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.blogs')}</Link></li>
              <li><Link to="/auth/register" className="text-gray-400 hover:text-white text-sm transition-colors">{t('auth.createAccount')}</Link></li>
              <li><Link to="/our-team" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.ourTeam')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.services')}</Link></li>
              <li><Link to="/career" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.career')}</Link></li>
            </ul>
          </div>

          
          <div className="flex flex-col h-full">
            <h3 className="text-base font-semibold mb-5">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/refund" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.refundPolicy')}</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.termsConditions')}</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.cookies')}</Link></li>
              <li><Link to="/disclaimer" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.disclaimer')}</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.faqs')}</Link></li>
              <li><Link to="/gift-cards" className="text-gray-400 hover:text-white text-sm transition-colors">{t('nav.giftCards')}</Link></li>
              {/* <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Franchise</a></li> */}
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="flex flex-col h-full">
            <h3 className="text-base font-semibold mb-5">{t('footer.contactUs')}</h3>
            <div className="space-y-3">
              <div className="flex items-start text-gray-400 text-sm">
                <svg className="w-4 h-4 mt-0.5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span>Pilies g. 38 Vilnius, LT-01123</span>
              </div>
              <div className="flex items-start text-gray-400 text-sm">
                <svg className="w-4 h-4 mt-0.5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span>Ukmergės g. 369 Vilnius, LT-06331</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <svg className="w-4 h-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <span>contact@delegendsbarbershop.lt</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <span>+370 663 75 648</span>
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="flex flex-col justify-center items-center md:items-end h-full">
            <img 
               src="/logo.png" 
              alt="DE Legends Barbershop" 
              className="h-16 object-contain"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
