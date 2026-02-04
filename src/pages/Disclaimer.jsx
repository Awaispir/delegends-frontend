import LegalLayout from '../components/LegalLayout';
import { legalPages } from '../data/legalData';

const Disclaimer = () => {
  return <LegalLayout pageData={legalPages.disclaimer} />;
};

export default Disclaimer;
