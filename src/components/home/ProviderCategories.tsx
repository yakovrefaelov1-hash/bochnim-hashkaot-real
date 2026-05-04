'use client';

import { Building2, TrendingUp, Scale, ClipboardList, HardHat, Handshake } from 'lucide-react';

const cats = [
  { name: 'נדל"ן', icon: Building2, href: '/providers?category=real_estate_developer' },
  { name: 'יועצי השקעות', icon: TrendingUp, href: '/providers?category=investment_advisor' },
  { name: 'עורכי דין', icon: Scale, href: '/providers?category=lawyer' },
  { name: 'שמאים', icon: ClipboardList, href: '/providers?category=appraiser' },
  { name: 'קבלנים', icon: HardHat, href: '/providers?category=contractor' },
  { name: 'מלווי משקיעים', icon: Handshake, href: '/providers?category=investor_companion' },
];

export function ProviderCategories() {
  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">
            קטגוריות ספקים
          </h2>
          <p className="text-slate-500 text-lg">מצא את המומחה המתאים לסוג ההשקעה שלך</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map(({ name, icon: Icon, href }) => (
            <a
              key={name}
              href={href}
              className="group flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 hover:border-primary/30 bg-white hover:bg-primary-50/50 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}
              >
                <Icon className="w-5 h-5" style={{ color: '#1B4F72' }} strokeWidth={1.5} />
              </div>
              <div className="font-semibold text-[#0F172A] text-sm">{name}</div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/providers"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all duration-200 text-sm"
          >
            עיין בכל הספקים
            <span>←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
