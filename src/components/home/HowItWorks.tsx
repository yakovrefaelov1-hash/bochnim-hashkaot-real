'use client';

import { FileText, MessageSquare, CheckCircle } from 'lucide-react';

const steps = [
  {
    num: '1',
    icon: FileText,
    title: 'פרסם מכרז',
    desc: 'תאר את ההשקעה שאתה מחפש — ב-60 שניות, ללא הרשמה',
  },
  {
    num: '2',
    icon: MessageSquare,
    title: 'קבל הצעות',
    desc: 'ספקים מוסמכים יגישו הצעות בתוך 24–48 שעות',
  },
  {
    num: '3',
    icon: CheckCircle,
    title: 'בחר ובצע',
    desc: 'בחר את ההצעה הטובה ביותר ותתחיל לעבוד',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white" dir="rtl">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">
            איך זה עובד?
          </h2>
          <p className="text-slate-500 text-lg">שלושה שלבים פשוטים לעסקה המנצחת שלך</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-11 right-[22%] left-[22%] h-px bg-gradient-to-l from-slate-200 via-primary/20 to-slate-200" />

          {steps.map(({ num, icon: Icon, title, desc }) => (
            <div
              key={num}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-md transition-transform duration-300 group-hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #1B4F72, #2E86AB)' }}
              >
                <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
              </div>
              <span className="absolute top-4 left-4 text-xs font-bold text-slate-300">{num}</span>
              <h3 className="font-bold text-[#0F172A] text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
