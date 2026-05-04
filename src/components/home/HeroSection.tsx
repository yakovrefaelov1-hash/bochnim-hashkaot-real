'use client';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section style={{ background: 'var(--white)', padding: '80px 0 64px', borderBottom: '0.5px solid var(--gray-100)' }} dir="rtl">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--gray-50)',
            border: '0.5px solid var(--gray-100)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 14px',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--gray-500)',
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-600)', display: 'inline-block' }} />
            פלטפורמה מספר 1 לחיפוש עסקאות נדלן בישראל
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 500, lineHeight: 1.2, marginBottom: 20, color: 'var(--gray-900)' }}>
            מצא את העסקה הבאה שלך בלחיצת כפתור
          </h1>

          <p style={{ fontSize: 15, color: 'var(--gray-500)', marginBottom: 32, lineHeight: 1.6, maxWidth: 560 }}>
            פרסם מכרז ב-60 שניות. קבל הצעות מיזמים, יועצים ומלווי משקיעים מנוסים.
            ראה עסקאות אמיתיות עם תשואות מוכחות — ואז תחליט.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/post-tender" className="btn-primary">
              פרסם מכרז חינם
            </Link>
            <Link href="/past-deals" className="btn-secondary">
              ראה עסקאות מוצלחות
              <ArrowLeft size={14} strokeWidth={1.5} />
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--gray-500)', flexWrap: 'wrap' }}>
            {['ללא עמלת הצלחה', 'פרסום חינמי', 'ספקים מאומתים'].map(item => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={13} strokeWidth={1.5} color="var(--green-600)" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
