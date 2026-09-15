// Non-translated / numeric facts used by several sections (Hero stats,
// footer hours, WhatsApp number). Keep this as the single source of truth
// so numbers don't drift between components.
export const restaurantInfo = {
  name: { en: 'Zaytoun', ar: 'زيتون' },
  tagline: { en: 'Fine Palestinian Dining', ar: 'مطعم فلسطيني راقٍ' },
  rating: 4.9,
  yearsOfExperience: 15,
  signatureDishCount: 40,
  whatsappNumber: '970595170235', // international format, no + or leading 0
  phoneDisplay: '+970 59 517 0235',
  email: 'fh115881@gmail.com',
  address: { en: 'Rafidia Street, Nablus, Palestine', ar: 'شارع رفيديا، نابلس، فلسطين' },
  mapsQuery: 'Zaytoun Restaurant, Rafidia Street, Nablus, Palestine',
  currencySymbol: { en: '₪', ar: '₪' },
  deliveryFee: 15,
  taxRate: 0.0, // set >0 if VAT should be itemized separately from menu prices
  maxGuestsPerBooking: 12,
  openingHours: [
    { day: { en: 'Saturday – Wednesday', ar: 'السبت – الأربعاء' }, hours: '12:00 PM – 11:00 PM' },
    { day: { en: 'Thursday – Friday', ar: 'الخميس – الجمعة' }, hours: '12:00 PM – 12:00 AM' },
  ],
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
  },
};

