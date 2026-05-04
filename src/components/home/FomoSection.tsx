import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

export function FomoSection({ deals, total }: {
  deals: { title?: string; return_rate?: number; location?: string; deal_type?: string }[];
  total: number;
}) {
  return (
    <section style={{ background: 'var(--white)', padding: '64px 0', borderBottom: '0.5px solid var(--gray-100)' }} dir="rtl">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>
            עסקאות שנסגרו
          </h2>
          <p style={{ fontSize: 15, color: 'var(--gray-500)' }}>
            {total} עסקאות הושלמו בהצלחה על ידי ספקים בפלטפורמה
          </p>
        </div>

        {deals.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {deals.map((deal, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <h3 style={{ fontWeight: 500, color: 'var(--gray-900)', fontSize: 14, lineHeight: 1.4, flex: 1 }}>
                    {deal.title ?? 'עסקת נדל"ן'}
                  </h3>
                  <div style={{
                    background: 'var(--green-100)',
                    color: 'var(--green-600)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 10px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1 }}>{deal.return_rate ?? 0}%</div>
                    <div style={{ fontSize: 11, color: 'var(--green-600)', opacity: 0.8 }}>תשואה</div>
                  </div>
                </div>
                {deal.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--gray-500)' }}>
                    <MapPin size={12} strokeWidth={1.5} />
                    {deal.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--gray-500)', fontSize: 14 }}>
            עסקאות יתווספו בקרוב
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <Link href="/past-deals" className="btn-ghost" style={{ padding: 0, fontSize: 13 }}>
            ראה את כל העסקאות
            <ArrowLeft size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
