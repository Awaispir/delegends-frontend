import LegalLayout from '../components/LegalLayout';
import { legalPages } from '../data/legalData';

const Cookies = () => {
  return <LegalLayout pageData={legalPages.cookies} />;
};

export default Cookies;
