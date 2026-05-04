import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function CtaBanner() {
  return (
    <section style={{ background: 'var(--gray-50)', borderTop: '0.5px solid var(--gray-100)', padding: '64px 0' }} dir="rtl">
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 12 }}>
          מוכן למצוא את ההשקעה הבאה שלך?
        </h2>

        <p style={{ fontSize: 15, color: 'var(--gray-500)', marginBottom: 32, lineHeight: 1.6 }}>
          פרסם מכרז חינם וקבל הצעות מספקים מוסמכים תוך 48 שעות
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/post-tender" className="btn-primary">
            פרסם מכרז עכשיו
          </Link>
          <Link href="/providers" className="btn-secondary">
            עיין בספקים
            <ArrowLeft size={14} strokeWidth={1.5} />
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13, color: 'var(--gray-500)' }}>
          {['ללא עמלת הצלחה', 'פרסום חינמי לחלוטין', 'ספקים מאומתים'].map(item => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={13} strokeWidth={1.5} color="var(--green-600)" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
