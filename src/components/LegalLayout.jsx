import LegalNavbar from './LegalNavbar';
import BrandsMarquee from './BrandsMarquee';
import BookSection from './Booksection';
import { useLanguage } from '../context/LanguageContext';

const LegalLayout = ({ pageData }) => {
  const { t } = useLanguage();
  
  if (!pageData) {
    return <div>Loading...</div>;
  }

  const title = t(pageData.titleKey);
  const subtitle = t(pageData.subtitleKey);
  const sections = t(pageData.sectionsKey) || [];
  const lastUpdated = t(pageData.lastUpdatedKey);

  return (
    <div className="min-h-screen bg-white">
      {/* Legal Navigation */}
      <LegalNavbar />

      {/* Main Content Area */}
      <div className="py-12 md:py-16">
        <div className="max-w-[900px] mx-auto px-6 md:px-8">
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#D4A574]">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-base md:text-lg text-center mb-12 text-[#1e3a5f]">
              {subtitle}
            </p>
          )}

          {/* Content Sections */}
          {Array.isArray(sections) && sections.map((section, index) => (
            <div key={index} className={index > 0 ? 'mt-10' : 'mt-8'}>
              <h2 className="text-xl md:text-2xl font-bold uppercase text-[#1e3a5f] mb-4 text-center">
                {section.heading}
              </h2>
              <p className="text-[#1e3a5f] leading-[1.8] text-base text-center whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}

          {/* Last Updated */}
          <div className="mt-12 pt-4">
            <p className="text-sm text-[#6b7280]">
              {t('common.lastUpdated')}: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Brands Marquee */}
      <BrandsMarquee />

      {/* Book Section CTA */}
      <BookSection />
    </div>
  );
};

export default LegalLayout;
