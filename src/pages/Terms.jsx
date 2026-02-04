import LegalLayout from '../components/LegalLayout';
import { legalPages } from '../data/legalData';

const Terms = () => {
  return <LegalLayout pageData={legalPages.terms} />;
};

export default Terms;
