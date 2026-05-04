'use client';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

const columns = [
  {
    title: 'למשקיעים',
    links: [
      { href: '/post-tender', label: 'פרסם מכרז' },
      { href: '/past-deals', label: 'עסקאות מוצלחות' },
      { href: '/providers', label: 'חפש ספקים' },
    ],
  },
  {
    title: 'לספקים',
    links: [
      { href: '/auth/register?role=provider', label: 'הצטרף כספק' },
      { href: '/subscribe', label: 'תוכניות מחיר' },
      { href: '/tenders', label: 'מכרזים פעילים' },
    ],
  },
  {
    title: 'עזרה',
    links: [
      { href: 'mailto:support@bochnim.co.il', label: 'support@bochnim.co.il' },
      { href: '/terms', label: 'תנאי שימוש' },
      { href: '/privacy', label: 'מדיניות פרטיות' },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: 'var(--gray-50)', borderTop: '0.5px solid var(--gray-100)', marginTop: 64 }} dir="rtl">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <TrendingUp size={18} strokeWidth={1.5} color="var(--gray-900)" />
              <span style={{ fontWeight: 500, fontSize: 15, color: 'var(--gray-900)' }}>בוחנים השקעות</span>
            </div>
            <p style={{ color: 'var(--gray-500)', fontSize: 13, lineHeight: 1.6 }}>
              פלטפורמה מקצועית לחיבור בין משקיעים לספקי שירותי נדלן.
            </p>
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <h4 style={{ fontWeight: 500, marginBottom: 12, color: 'var(--gray-900)', fontSize: 13 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} style={{ color: 'var(--gray-500)', textDecoration: 'none', fontSize: 13, transition: 'color 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gray-900)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '0.5px solid var(--gray-100)', paddingTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--gray-500)' }}>
          &copy; {new Date().getFullYear()} בוחנים השקעות · כל הזכויות שמורות
        </div>
      </div>
    </footer>
  );
}
