'use client';

import Link from 'next/link';
import { PastDeal } from '@/types';
import { PastDealCard } from '@/components/provider/PastDealCard';
import { INVESTMENT_TYPE_LABELS, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants';

// ============================================================
// STATS BAR
// ============================================================
interface StatsBarProps {
  stats?: {
    total_deals: number;
    avg_return: number;
    total_invested: number;
    max_return: number;
  };
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: 'עסקאות מוכחות', value: stats?.total_deals ?? 0, suffix: '+', prefix: '' },
    { label: 'תשואה ממוצעת', value: stats?.avg_return ?? 0, suffix: '%', prefix: '' },
    { label: 'הון מנוהל', value: stats ? Math.round(stats.total_invested / 1000000) : 0, suffix: 'M ₪', prefix: '' },
    { label: 'תשואה מקסימלית', value: stats?.max_return ?? 0, suffix: '%', prefix: '' },
  ];

  return (
    <div className="bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-slate-100">
          {items.map((item) => (
            <div key={item.label} className="px-6 py-5 text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-700 number-pop">
                {item.prefix}{item.value.toLocaleString('he-IL')}{item.suffix}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FOMO SECTION
// ============================================================
interface FomoSectionProps {
  deals: PastDeal[];
  total: number;
}

export function FomoSection({ deals, total }: FomoSectionProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="badge bg-amber-100 text-amber-700 mb-3">
              🔥 FOMO מוצדק
            </div>
            <h2 className="section-title">עסקאות שהמשקיעים שלנו סגרו</h2>
            <p className="text-slate-500 mt-2 max-w-xl">
              תשואות אמיתיות, עסקאות מוכחות. ראה מה מתאפשר כשמוצאים את הספק הנכון.
            </p>
          </div>
          <Link href="/past-deals" className="btn-outline hidden md:block">
            כל העסקאות ({total})
          </Link>
        </div>

        {deals.length === 0 ? (
          <div className="text-center py-12 text-slate-400">טוען עסקאות...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, i) => (
              <PastDealCard key={deal.id} deal={deal} animationDelay={i * 0.1} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link href="/past-deals" className="btn-outline">
            כל העסקאות ({total})
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HOW IT WORKS
// ============================================================
const steps = [
  {
    icon: '📋',
    step: '01',
    title: 'פרסם מכרז חינמית',
    desc: 'מלא 4 שדות פשוטים — תחום השקעה, מיקום, הון עצמי ומטרת ההשקעה. ללא הרשמה.',
    forWho: 'משקיע',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    icon: '📬',
    step: '02',
    title: 'קבל הצעות מספקים',
    desc: 'יזמים, יועצים וקבלנים מקבלים התראה ומגישים הצעות מותאמות לצרכים שלך.',
    forWho: 'ספק',
    color: 'bg-amber-50 border-amber-200',
  },
  {
    icon: '🤝',
    step: '03',
    title: 'בחר ותתחיל לעבוד',
    desc: 'השווה הצעות, בדוק עסקאות עבר, ובחר את הספק הכי מתאים. אין עמלת הצלחה.',
    forWho: 'שניהם',
    color: 'bg-green-50 border-green-200',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">איך זה עובד?</h2>
          <p className="text-slate-500 mt-3">שלושה שלבים פשוטים מהרשמה לעסקה</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className={`card p-6 border-2 ${step.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl">
                  {step.icon}
                </div>
                <span className="text-4xl font-black text-slate-100">{step.step}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              <div className="mt-4">
                <span className="badge bg-white text-slate-600 border border-slate-200 text-xs">
                  {step.forWho}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PROVIDER CATEGORIES
// ============================================================
const categories = [
  { key: 'entrepreneur', icon: '🏗️', count: '12+' },
  { key: 'real_estate_developer', icon: '🏢', count: '8+' },
  { key: 'investment_advisor', icon: '📊', count: '15+' },
  { key: 'investor_companion', icon: '🤝', count: '6+' },
  { key: 'lawyer', icon: '⚖️', count: '10+' },
  { key: 'appraiser', icon: '📐', count: '7+' },
  { key: 'contractor', icon: '🔨', count: '9+' },
] as const;

export function ProviderCategories() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-title">הספקים שלנו</h2>
          <p className="text-slate-500 mt-3">כל המומחים שצריך לעסקה מוצלחת</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/providers?category=${cat.key}`}
              className="card-hover p-5 text-center group"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-slate-800 text-sm group-hover:text-primary transition-colors">
                {CATEGORY_LABELS[cat.key]}
              </div>
              <div className="text-xs text-slate-400 mt-1">{cat.count} ספקים</div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/providers" className="btn-primary inline-block">
            כל הספקים
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CTA BANNER
// ============================================================
export function CtaBanner() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="gradient-card rounded-3xl p-8 md:p-12 text-white text-center shadow-xl">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            מוכן למצוא את העסקה הבאה שלך?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            פרסם מכרז חינמי עכשיו וקבל הצעות מספקים מנוסים תוך 24 שעות.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post-tender" className="btn-gold text-lg px-8 py-4 rounded-2xl">
              פרסם מכרז חינמית →
            </Link>
            <Link href="/auth/register?role=provider" className="glass text-white text-lg px-8 py-4 rounded-2xl">
              הצטרף כספק
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
