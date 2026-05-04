'use client';
import { Building2, TrendingUp, Scale, ClipboardList, HardHat, Handshake, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
    <section style={{ background: 'var(--white)', padding: '64px 0', borderBottom: '0.5px solid var(--gray-100)' }} dir="rtl">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>
            קטגוריות ספקים
          </h2>
          <p style={{ fontSize: 15, color: 'var(--gray-500)' }}>מצא את המומחה המתאים לסוג ההשקעה שלך</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 32 }}>
          {cats.map(({ name, icon: Icon, href }) => (
            <Link key={name} href={href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, padding: 20, cursor: 'pointer' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gray-50)',
                  border: '0.5px solid var(--gray-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={16} strokeWidth={1.5} color="var(--gray-900)" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{name}</div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/providers" className="btn-ghost" style={{ padding: 0, fontSize: 13 }}>
          עיין בכל הספקים
          <ArrowLeft size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
