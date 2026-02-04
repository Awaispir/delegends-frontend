import { Link, useLocation } from 'react-router-dom';
import { legalNavItems } from '../data/legalData';

const LegalNavbar = () => {
  const location = useLocation();

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-6 py-3 md:py-4">
          {legalNavItems.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <Link
                to={item.path}
                className={`text-sm md:text-base transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-yellow-600 font-semibold'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                {item.label}
              </Link>
              {index < legalNavItems.length - 1 && (
                <span className="ml-2 md:ml-6 text-gray-400">|</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default LegalNavbar;
