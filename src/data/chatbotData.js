import { restaurantInfo } from './restaurantInfo';
import { menuItems } from './menuData';

// Lightweight, fully client-side FAQ engine: matches keywords (in either
// language) against a fixed set of intents built from data already in the
// app (hours, bestsellers, menu categories) rather than hardcoded copy that
// could drift from the actual menu. No network call — swap `getBotResponse`
// for a real API call later without touching the widget itself.

const bestsellerNames = (language) =>
  menuItems
    .filter((dish) => dish.tags.includes('bestseller'))
    .map((dish) => dish.name[language])
    .join(', ');

function buildIntents() {
  return [
    {
      id: 'hours',
      keywords: ['hour', 'open', 'close', 'time', 'ساعات', 'دوام', 'مفتوح', 'مغلق'],
      answer: (lang) =>
        restaurantInfo.openingHours
          .map((slot) => `${slot.day[lang]}: ${slot.hours}`)
          .join('\n'),
    },
    {
      id: 'bestsellers',
      keywords: ['best seller', 'bestseller', 'popular', 'recommend', 'مشهور', 'الأكثر طلب', 'ينصح'],
      answer: (lang) =>
        lang === 'ar'
          ? `أطباقنا الأكثر طلبًا: ${bestsellerNames('ar')}.`
          : `Our most-loved dishes: ${bestsellerNames('en')}.`,
    },
    {
      id: 'booking',
      keywords: ['book', 'reserve', 'table', 'reservation', 'حجز', 'طاولة'],
      answer: (lang) =>
        lang === 'ar'
          ? 'يمكنك حجز طاولة من قسم "الحجوزات" في الأعلى — اختر التاريخ والوقت وعدد الضيوف، وسنؤكد الحجز عبر واتساب.'
          : 'You can book a table from the Reservations section above — pick a date, time and party size, and we\'ll confirm over WhatsApp.',
    },
    {
      id: 'delivery',
      keywords: ['deliver', 'delivery', 'order online', 'توصيل', 'دليفري', 'طلب اونلاين'],
      answer: (lang) =>
        lang === 'ar'
          ? `نعم، نوصل الطلبات! تصفح "القائمة" وأضف أطباقك، وسنُنهي طلبك عبر واتساب. رسوم التوصيل ${restaurantInfo.deliveryFee} ${restaurantInfo.currencySymbol.ar}.`
          : `Yes, we deliver! Browse the Menu, add your dishes, and checkout finishes over WhatsApp. Delivery fee is ${restaurantInfo.deliveryFee} ${restaurantInfo.currencySymbol.en}.`,
    },
    {
      id: 'location',
      keywords: ['where', 'location', 'address', 'find you', 'وين', 'أين', 'عنوان', 'موقع'],
      answer: (lang) => restaurantInfo.address[lang],
    },
    {
      id: 'contact',
      keywords: ['phone', 'call', 'contact', 'whatsapp', 'هاتف', 'اتصال', 'تواصل', 'واتساب'],
      answer: (lang) =>
        lang === 'ar'
          ? `يمكنك التواصل معنا على ${restaurantInfo.phoneDisplay} أو عبر واتساب من زر التواصل في الأسفل.`
          : `Reach us at ${restaurantInfo.phoneDisplay}, or via the WhatsApp button in the Contact section below.`,
    },
    {
      id: 'vegan',
      keywords: ['vegan', 'vegetarian', 'plant', 'نباتي'],
      answer: (lang) =>
        lang === 'ar'
          ? 'لدينا عدة خيارات نباتية في القائمة، مثل الحمص المسبحة والمحمرة والشكشوكة — ابحث عن وسم "نباتي".'
          : 'We have several vegan options on the menu, like Hummus Musabaha, Muhammara and the Shakshuka — look for the "Vegan" tag.',
    },
    {
      id: 'payment',
      keywords: ['pay', 'payment', 'cash', 'card', 'دفع', 'كاش', 'بطاقة'],
      answer: (lang) =>
        lang === 'ar'
          ? 'نقبل الدفع نقدًا عند الاستلام أو بالبطاقة عند الاستلام.'
          : 'We accept cash on delivery or card on delivery.',
    },
  ];
}

const INTENTS = buildIntents();

export const quickChips = [
  { id: 'hours', label: { en: 'Opening Hours?', ar: 'ساعات الدوام؟' } },
  { id: 'bestsellers', label: { en: 'Best Sellers', ar: 'الأكثر طلبًا' } },
  { id: 'booking', label: { en: 'How to Book?', ar: 'كيف أحجز؟' } },
  { id: 'delivery', label: { en: 'Delivery Areas?', ar: 'مناطق التوصيل؟' } },
];

export function getBotResponse(rawInput, language) {
  const input = rawInput.toLowerCase().trim();
  const matched = INTENTS.find((intent) => intent.keywords.some((kw) => input.includes(kw)));
  if (matched) return matched.answer(language);

  return language === 'ar'
    ? 'لست متأكدًا من ذلك، لكن يسعدنا مساعدتك مباشرة عبر واتساب — اضغط على "تواصل معنا" في الأسفل.'
    : "I'm not sure about that one, but our team can help directly over WhatsApp — use the Contact button below.";
}

export function getChipResponse(chipId, language) {
  const intent = INTENTS.find((i) => i.id === chipId);
  return intent ? intent.answer(language) : '';
}
