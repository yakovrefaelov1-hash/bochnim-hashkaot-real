import { InvestmentType, ProviderCategory } from '@/types';

export const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  real_estate_local: 'נדל"ן בארץ',
  real_estate_secondhand: 'נדל"ן יד שנייה',
  real_estate_presale: 'נדל"ן בפריסייל',
  land: 'מגרשים להשקעה',
  real_estate_abroad: 'נדל"ן בחו"ל',
};

export const INVESTMENT_TYPE_ICONS: Record<InvestmentType, string> = {
  real_estate_local: '🏠',
  real_estate_secondhand: '🔑',
  real_estate_presale: '🏗️',
  land: '🌍',
  real_estate_abroad: '✈️',
};

export const INVESTMENT_TYPE_DESCRIPTIONS: Record<InvestmentType, string> = {
  real_estate_local: 'דירות, בתים ומשרדים בישראל',
  real_estate_secondhand: 'נכסים קיימים למכירה',
  real_estate_presale: 'רכישה לפני בנייה במחיר מיוחד',
  land: 'קרקעות ומגרשים לפיתוח',
  real_estate_abroad: 'נכסים בגרמניה, פורטוגל ועוד',
};

export const CATEGORY_LABELS: Record<ProviderCategory, string> = {
  entrepreneur: 'יזם השקעות',
  real_estate_developer: 'יזם נדל"ן',
  investment_advisor: 'יועץ השקעות',
  investor_companion: 'מלווה משקיעים',
  lawyer: 'עורך דין',
  appraiser: 'שמאי מקרקעין',
  contractor: 'קבלן',
};

export const CATEGORY_ICONS: Record<ProviderCategory, string> = {
  entrepreneur: '💼',
  real_estate_developer: '🏢',
  investment_advisor: '📊',
  investor_companion: '🤝',
  lawyer: '⚖️',
  appraiser: '📐',
  contractor: '🔨',
};

export const TENDER_STATUS_LABELS: Record<string, string> = {
  active: 'פעיל',
  closed: 'סגור',
  cancelled: 'בוטל',
};

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  pending: 'ממתין',
  accepted: 'התקבל',
  rejected: 'נדחה',
  withdrawn: 'בוטל',
};

export const QUOTE_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-slate-100 text-slate-600',
};

export const ISRAELI_CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה',
  'אשדוד', 'נתניה', 'באר שבע', 'בני ברק', 'רמת גן',
  'אשקלון', 'רחובות', 'בת ים', 'הרצליה', 'חולון',
  'כפר סבא', 'מודיעין', 'נס ציונה', 'לוד', 'רמלה',
  'עכו', 'נהריה', 'קריית אתא', 'חדרה', 'רעננה',
  'גבעתיים', 'קריית גת', 'טבריה', 'צפת', 'דימונה',
  'אילת', 'יהוד', 'קרית מוצקין', 'עפולה', 'בית שמש',
  'קרית ים', 'רהט', 'רמת השרון', 'גבעת שמואל', 'הוד השרון',
];

export const WORLD_COUNTRIES = [
  'גרמניה', 'פורטוגל', 'ספרד', 'ארה"ב', 'קנדה',
  'יוון', 'קפריסין', 'רומניה', 'פולין', 'צ\'כיה',
  'הונגריה', 'בולגריה', 'ורשה', 'דובאי', 'איחוד האמירויות',
  'תאילנד', 'אוסטרליה', 'אנגליה', 'צרפת', 'איטליה',
];

export const PRICE_PLANS = [
  {
    type: 'single' as const,
    price: 250,
    label: 'הצעה בודדת',
    desc: 'גישה למכרז אחד ספציפי',
    features: ['הגשת הצעה אחת', 'גישה לפרטי המשקיע', 'ללא התחייבות'],
    cta: 'שלם 250 ₪',
    highlight: false,
  },
  {
    type: 'monthly' as const,
    price: 1000,
    label: 'מנוי חודשי',
    desc: 'הצעות ללא הגבלה לחודש שלם',
    features: ['הצעות ללא הגבלה', 'גישה לכל המכרזים', 'עדיפות בהתראות', 'ניתוח ביצועים'],
    cta: 'הצטרף — 1,000 ₪/חודש',
    highlight: true,
  },
];
