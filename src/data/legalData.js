// Legal pages content data - uses translation keys

export const legalPages = {
  privacy: {
    id: 'privacy',
    titleKey: 'legal.privacy.title',
    subtitleKey: 'legal.privacy.subtitle',
    sectionsKey: 'legal.privacy.sections',
    lastUpdatedKey: 'legal.privacy.lastUpdated'
  },

  terms: {
    id: 'terms',
    titleKey: 'legal.terms.title',
    subtitleKey: 'legal.terms.subtitle',
    sectionsKey: 'legal.terms.sections',
    lastUpdatedKey: 'legal.terms.lastUpdated'
  },

  refund: {
    id: 'refund',
    titleKey: 'legal.refund.title',
    subtitleKey: 'legal.refund.subtitle',
    sectionsKey: 'legal.refund.sections',
    lastUpdatedKey: 'legal.refund.lastUpdated'
  },

  cookies: {
    id: 'cookies',
    titleKey: 'legal.cookies.title',
    subtitleKey: 'legal.cookies.subtitle',
    sectionsKey: 'legal.cookies.sections',
    lastUpdatedKey: 'legal.cookies.lastUpdated'
  },

  disclaimer: {
    id: 'disclaimer',
    titleKey: 'legal.disclaimer.title',
    subtitleKey: 'legal.disclaimer.subtitle',
    sectionsKey: 'legal.disclaimer.sections',
    lastUpdatedKey: 'legal.disclaimer.lastUpdated'
  }
};

// Navigation items for legal pages
export const legalNavItems = [
  { id: 'privacy', label: 'Privacy Policy', path: '/privacy' },
  { id: 'terms', label: 'Terms & Conditions', path: '/terms' },
  { id: 'refund', label: 'Refund Policy', path: '/refund' },
  { id: 'cookies', label: 'Cookies', path: '/cookies' },
  { id: 'disclaimer', label: 'Disclaimer', path: '/disclaimer' }
];
