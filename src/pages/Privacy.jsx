import LegalLayout from '../components/LegalLayout';
import { legalPages } from '../data/legalData';

const Privacy = () => {
  return <LegalLayout pageData={legalPages.privacy} />;
};

export default Privacy;
