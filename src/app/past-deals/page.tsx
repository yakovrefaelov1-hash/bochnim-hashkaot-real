'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { PastDeal, InvestmentType } from '@/types';
import { PastDealCard } from '@/components/provider/PastDealCard';
import { INVESTMENT_TYPE_LABELS, INVESTMENT_TYPE_ICONS } from '@/lib/constants';
import { LoadingCenter, EmptyState } from '@/components/ui/index';
import Link from 'next/link';

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="badge bg-amber-100 text-amber-700 mb-3 mx-auto">
          🔥 עסקאות מוכחות
        </div>
        <h1 className="section-title mb-3">עסקאות שהמשקיעים שלנו סגרו</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          כל עסקה שמוצגת כאן בוצעה בפועל על ידי ספקים בפלטפורמה. תשואות מאומתות.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'עסקאות מוכחות', value: `${stats.total_deals}+` },
            { label: 'תשואה ממוצעת', value: `${stats.avg_return}%` },
            { label: 'הון מנוהל', value: `${Math.round(stats.total_invested / 1000000)}M ₪` },
            { label: 'תשואה מקסימלית', value: `${stats.max_return}%` },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl font-black text-primary-700">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={filterType}
          onChange={e => { setFilterType(e.target.value as InvestmentType | ''); setPage(1); }}
          className="input-field w-auto text-sm py-2"
        >
          <option value="">כל סוגי העסקאות</option>
          {(Object.entries(INVESTMENT_TYPE_LABELS) as [InvestmentType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{INVESTMENT_TYPE_ICONS[k]} {v}</option>
          ))}
        </select>

        <select
          value={minReturn}
          onChange={e => { setMinReturn(e.target.value); setPage(1); }}
          className="input-field w-auto text-sm py-2"
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
            className="text-sm text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            ✕ נקה
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingCenter />
      ) : !data?.data?.length ? (
        <EmptyState icon="📈" title="לא נמצאו עסקאות" desc="נסה לשנות את הפילטרים" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((deal, i) => (
              <PastDealCard key={deal.id} deal={deal} animationDelay={i * 0.05} />
            ))}
          </div>

          {/* Pagination */}
          {(data.pagination?.pages ?? 1) > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline text-sm px-4 py-2 rounded-lg disabled:opacity-40">← הקודם</button>
              <span className="px-4 py-2 text-sm text-slate-600">עמוד {page} מתוך {data.pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))} disabled={page === data.pagination.pages} className="btn-outline text-sm px-4 py-2 rounded-lg disabled:opacity-40">הבא →</button>
            </div>
          )}
        </>
      )}

      {/* CTA */}
      <div className="mt-16 text-center">
        <div className="card p-8 bg-gradient-to-l from-primary-50 to-blue-50 border-primary/20 border max-w-xl mx-auto">
          <h3 className="font-bold text-primary-800 text-lg mb-2">רוצה להגיע לתשואות כאלה?</h3>
          <p className="text-slate-500 text-sm mb-5">פרסם מכרז ותקבל הצעות מספקים שהוכיחו את עצמם</p>
          <Link href="/post-tender" className="btn-gold inline-block px-8 py-3 rounded-xl">
            פרסם מכרז חינמית →
          </Link>
        </div>
      </div>
    </div>
  );
}
