'use client';
import { FileText, MessageSquare, CheckCircle } from 'lucide-react';

const steps = [
  { num: '1', icon: FileText, title: 'פרסם מכרז', desc: 'תאר את ההשקעה שאתה מחפש — ב-60 שניות, ללא הרשמה' },
  { num: '2', icon: MessageSquare, title: 'קבל הצעות', desc: 'ספקים מוסמכים יגישו הצעות בתוך 24–48 שעות' },
  { num: '3', icon: CheckCircle, title: 'בחר ובצע', desc: 'בחר את ההצעה הטובה ביותר ותתחיל לעבוד' },
];

export function HowItWorks() {
  return (
    <section style={{ background: 'var(--gray-50)', padding: '64px 0', borderBottom: '0.5px solid var(--gray-100)' }} dir="rtl">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>
            איך זה עובד?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--gray-500)' }}>שלושה שלבים פשוטים לעסקה המנצחת שלך</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {steps.map(({ num, icon: Icon, title, desc }) => (
            <div key={num} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--white)',
                  border: '0.5px solid var(--gray-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} strokeWidth={1.5} color="var(--gray-900)" />
                </div>
                <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>{num}</span>
              </div>
              <div>
                <h3 style={{ fontWeight: 500, color: 'var(--gray-900)', fontSize: 15, marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
