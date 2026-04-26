'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { Tender, InvestmentType } from '@/types';
import {
  INVESTMENT_TYPE_LABELS,
  INVESTMENT_TYPE_ICONS,
  ISRAELI_CITIES,
} from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { LoadingCenter, EmptyState, Badge } from '@/components/ui/index';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface TendersResponse {
  data: Tender[];
  pagination: { total: number; pages: number; page: number };
}

export default function TendersPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<InvestmentType | ''>('');
  const [filterCity, setFilterCity] = useState('');

  const { data, isLoading } = useQuery<TendersResponse>({
    queryKey: ['tenders', page, filterType, filterCity],
    queryFn: () =>
      apiGet('/tenders', {
        page,
        limit: 20,
        ...(filterType && { investment_type: filterType }),
        ...(filterCity && { location_city: filterCity }),
      }),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="section-title">מכרזים פעילים</h1>
          <p className="text-slate-500 mt-1">
            {data?.pagination?.total ?? 0} מכרזים פעילים ממתינים להצעות
          </p>
        </div>
        <Link href="/post-tender" className="btn-gold text-sm px-5 py-2.5 rounded-xl">
          + פרסם מכרז
        </Link>
      </div>

      {/* Provider subscription banner */}
      {user?.role === 'provider' && (
        <div className="mb-6 bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-amber-800">🔓 רוצה לראות פרטים מלאים?</div>
            <div className="text-sm text-amber-700 mt-0.5">
              רכוש מנוי חודשי ב-1,000₪ וגש לכל המכרזים ללא הגבלה
            </div>
          </div>
          <Link href="/subscribe" className="btn-gold text-sm px-5 py-2.5 rounded-xl flex-shrink-0">
            שדרג עכשיו
          </Link>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterType}
          onChange={e => { setFilterType(e.target.value as InvestmentType | ''); setPage(1); }}
          className="input-field w-auto text-sm py-2"
        >
          <option value="">כל תחומי השקעה</option>
          {(Object.entries(INVESTMENT_TYPE_LABELS) as [InvestmentType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select
          value={filterCity}
          onChange={e => { setFilterCity(e.target.value); setPage(1); }}
          className="input-field w-auto text-sm py-2"
        >
          <option value="">כל הערים</option>
          {ISRAELI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {(filterType || filterCity) && (
          <button
            onClick={() => { setFilterType(''); setFilterCity(''); setPage(1); }}
            className="text-sm text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕ נקה פילטרים
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingCenter />
      ) : !data?.data?.length ? (
        <EmptyState icon="📋" title="אין מכרזים כרגע" desc="היה הראשון לפרסם מכרז!" action={<Link href="/post-tender" className="btn-primary inline-block">פרסם מכרז</Link>} />
      ) : (
        <>
          <div className="grid gap-4">
            {data.data.map(tender => (
              <TenderRow key={tender.id} tender={tender} userRole={user?.role} />
            ))}
          </div>

          {/* Pagination */}
          {(data.pagination?.pages ?? 1) > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline text-sm px-4 py-2 rounded-lg disabled:opacity-40"
              >
                ← הקודם
              </button>
              <span className="px-4 py-2 text-sm text-slate-600">
                עמוד {page} מתוך {data.pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
                className="btn-outline text-sm px-4 py-2 rounded-lg disabled:opacity-40"
              >
                הבא →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TenderRow({ tender, userRole }: { tender: Tender; userRole?: string }) {
  const isBlurred = tender.is_blurred;

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Types */}
          <div className="flex flex-wrap gap-2 mb-2">
            {tender.investment_types.map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                {INVESTMENT_TYPE_ICONS[t]} {INVESTMENT_TYPE_LABELS[t]}
              </span>
            ))}
          </div>

          {/* Location + equity */}
          <div className={`flex items-center gap-4 text-sm mb-2 ${isBlurred ? 'blurred-content' : ''}`}>
            {(tender.location_city || tender.location_country) && (
              <span className="flex items-center gap-1 text-slate-600">
                📍 {tender.location_city ?? tender.location_country}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-600">
              💰 {tender.equity_available}
            </span>
          </div>

          {/* Description */}
          <p className={`text-sm text-slate-600 leading-relaxed line-clamp-2 ${isBlurred ? 'blurred-content select-none' : ''}`}>
            {tender.investment_description}
          </p>

          {isBlurred && (
            <div className="mt-2 text-xs text-amber-600 font-medium">
              🔒 רכוש מנוי לצפייה בפרטים מלאים
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <Badge variant="success">פעיל</Badge>
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(tender.created_at), { addSuffix: true, locale: he })}
          </span>

          {isBlurred ? (
            <Link href="/subscribe" className="btn-gold text-xs px-3 py-1.5 rounded-lg">
              הצג
            </Link>
          ) : (
            <Link href={`/tenders/${tender.id}`} className="btn-primary text-xs px-4 py-2 rounded-lg">
              הגש הצעה
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
