'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { PastDeal, InvestmentType } from '@/types';
import { PastDealCard } from '@/components/provider/PastDealCard';
import { INVESTMENT_TYPE_LABELS } from '@/lib/constants';
import { LoadingCenter, EmptyState } from '@/components/ui/index';
import Link from 'next/link';
import { TrendingUp, BarChart2 } from 'lucide-react';

interface DealsResponse {
  data: PastDeal[];
  pagination: { total: number; pages: number; page: number };
}

interface Stats {
  total_deals: number;
  avg_return: number;
  total_invested: number;
  max_return: number;
}

export default function PastDealsPage() {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<InvestmentType | ''>('');
  const [minReturn, setMinReturn] = useState('');

  const { data, isLoading } = useQuery<DealsResponse>({
    queryKey: ['past-deals', page, filterType, minReturn],
    queryFn: () =>
      apiGet('/past-deals', {
        page,
        limit: 12,
        ...(filterType && { deal_type: filterType }),
        ...(minReturn && { min_return: minReturn }),
      }),
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ['past-deals-stats'],
    queryFn: () => apiGet('/past-deals/stats'),
  });

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }} dir="rtl">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--amber-100)', borderRadius: 'var(--radius-pill)',
          padding: '3px 12px', fontSize: 12, fontWeight: 500, color: 'var(--amber-600)', marginBottom: 16,
        }}>
          <TrendingUp size={12} strokeWidth={1.5} />
          עסקאות מוכחות
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>עסקאות שהמשקיעים שלנו סגרו</h1>
        <p style={{ fontSize: 15, color: 'var(--gray-500)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          כל עסקה שמוצגת כאן בוצעה בפועל על ידי ספקים בפלטפורמה. תשואות מאומתות.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 40 }}>
          {[
            { label: 'עסקאות מוכחות', value: `${stats.total_deals}+` },
            { label: 'תשואה ממוצעת', value: `${stats.avg_return}%` },
            { label: 'הון מנוהל', value: `${Math.round(stats.total_invested / 1000000)}M ₪` },
            { label: 'תשואה מקסימלית', value: `${stats.max_return}%` },
          ].map(s => (
            <div key={s.label} className="card-metric" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--gray-900)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        <select
          value={filterType}
          onChange={e => { setFilterType(e.target.value as InvestmentType | ''); setPage(1); }}
          className="input-field"
          style={{ width: 'auto', fontSize: 13, padding: '8px 12px' }}
        >
          <option value="">כל סוגי העסקאות</option>
          {(Object.entries(INVESTMENT_TYPE_LABELS) as [InvestmentType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select
          value={minReturn}
          onChange={e => { setMinReturn(e.target.value); setPage(1); }}
          className="input-field"
          style={{ width: 'auto', fontSize: 13, padding: '8px 12px' }}
        >
          <option value="">כל התשואות</option>
          <option value="10">10%+</option>
          <option value="20">20%+</option>
          <option value="30">30%+</option>
          <option value="40">40%+</option>
        </select>

        {(filterType || minReturn) && (
          <button
            onClick={() => { setFilterType(''); setMinReturn(''); setPage(1); }}
            className="btn-ghost"
            style={{ fontSize: 13, padding: '8px 12px' }}
          >
            נקה
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingCenter />
      ) : !data?.data?.length ? (
        <EmptyState icon={<BarChart2 size={40} strokeWidth={1} />} title="לא נמצאו עסקאות" desc="נסה לשנות את הפילטרים" />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {data.data.map((deal, i) => (
              <PastDealCard key={deal.id} deal={deal} animationDelay={i * 0.05} />
            ))}
          </div>

          {(data.pagination?.pages ?? 1) > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary" style={{ fontSize: 13, padding: '7px 14px' }}>הקודם</button>
              <span style={{ padding: '8px 16px', fontSize: 13, color: 'var(--gray-500)' }}>עמוד {page} מתוך {data.pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))} disabled={page === data.pagination.pages} className="btn-secondary" style={{ fontSize: 13, padding: '7px 14px' }}>הבא</button>
            </div>
          )}
        </>
      )}

      {/* CTA */}
      <div style={{ marginTop: 64, textAlign: 'center' }}>
        <div className="card" style={{ padding: 40, maxWidth: 480, margin: '0 auto', background: 'var(--gray-50)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>רוצה להגיע לתשואות כאלה?</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>פרסם מכרז ותקבל הצעות מספקים שהוכיחו את עצמם</p>
          <Link href="/post-tender" className="btn-primary" style={{ fontSize: 13 }}>
            פרסם מכרז חינמית
          </Link>
        </div>
      </div>
    </div>
  );
}
