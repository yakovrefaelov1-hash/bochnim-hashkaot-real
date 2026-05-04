'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { Tender, InvestmentType } from '@/types';
import {
  INVESTMENT_TYPE_LABELS,
  ISRAELI_CITIES,
} from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { LoadingCenter, EmptyState, Badge } from '@/components/ui/index';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { ClipboardList, MapPin, Banknote, Lock, FileText } from 'lucide-react';

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
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }} dir="rtl">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--gray-50)', border: '0.5px solid var(--gray-100)',
            borderRadius: 'var(--radius-pill)', padding: '3px 10px',
            fontSize: 12, fontWeight: 500, color: 'var(--gray-500)', marginBottom: 12,
          }}>
            <ClipboardList size={12} strokeWidth={1.5} />
            מכרזים פעילים
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 4 }}>מכרזים ממתינים להצעות</h1>
          <p style={{ fontSize: 15, color: 'var(--gray-500)' }}>
            {data?.pagination?.total ?? 0} מכרזים פעילים כרגע
          </p>
        </div>
        <Link href="/post-tender" className="btn-primary" style={{ fontSize: 13, flexShrink: 0 }}>
          + פרסם מכרז
        </Link>
      </div>

      {/* Provider subscription banner */}
      {user?.role === 'provider' && (
        <div style={{
          marginBottom: 24, background: 'var(--amber-100)',
          border: '0.5px solid var(--gray-100)', borderRadius: 'var(--radius-lg)',
          padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--amber-600)', fontSize: 14 }}>רוצה לראות פרטים מלאים?</div>
            <div style={{ fontSize: 13, color: 'var(--amber-600)', marginTop: 2 }}>
              רכוש מנוי חודשי ב-1,000₪ וגש לכל המכרזים ללא הגבלה
            </div>
          </div>
          <Link href="/subscribe" className="btn-primary" style={{ fontSize: 13, flexShrink: 0 }}>
            שדרג עכשיו
          </Link>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        <select
          value={filterType}
          onChange={e => { setFilterType(e.target.value as InvestmentType | ''); setPage(1); }}
          className="input-field"
          style={{ width: 'auto', fontSize: 13, padding: '8px 12px' }}
        >
          <option value="">כל תחומי השקעה</option>
          {(Object.entries(INVESTMENT_TYPE_LABELS) as [InvestmentType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select
          value={filterCity}
          onChange={e => { setFilterCity(e.target.value); setPage(1); }}
          className="input-field"
          style={{ width: 'auto', fontSize: 13, padding: '8px 12px' }}
        >
          <option value="">כל הערים</option>
          {ISRAELI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {(filterType || filterCity) && (
          <button
            onClick={() => { setFilterType(''); setFilterCity(''); setPage(1); }}
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
        <EmptyState
          icon={<ClipboardList size={40} strokeWidth={1} />}
          title="אין מכרזים כרגע"
          desc="היה הראשון לפרסם מכרז!"
          action={<Link href="/post-tender" className="btn-primary" style={{ fontSize: 13 }}>פרסם מכרז</Link>}
        />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.data.map(tender => (
              <TenderRow key={tender.id} tender={tender} userRole={user?.role} />
            ))}
          </div>

          {(data.pagination?.pages ?? 1) > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary" style={{ fontSize: 13, padding: '7px 14px' }}>
                הקודם
              </button>
              <span style={{ padding: '8px 16px', fontSize: 13, color: 'var(--gray-500)' }}>עמוד {page} מתוך {data.pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))} disabled={page === data.pagination.pages} className="btn-secondary" style={{ fontSize: 13, padding: '7px 14px' }}>
                הבא
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
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {tender.investment_types.map(t => (
              <span key={t} className="badge badge-new">
                {INVESTMENT_TYPE_LABELS[t]}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, marginBottom: 8, color: 'var(--gray-500)', filter: isBlurred ? 'blur(4px)' : 'none', userSelect: isBlurred ? 'none' : undefined }}>
            {(tender.location_city || tender.location_country) && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} strokeWidth={1.5} />
                {tender.location_city ?? tender.location_country}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Banknote size={13} strokeWidth={1.5} />
              {tender.equity_available}
            </span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', filter: isBlurred ? 'blur(4px)' : 'none', userSelect: isBlurred ? 'none' : undefined }}>
            {tender.investment_description}
          </p>

          {isBlurred && (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--amber-600)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Lock size={12} strokeWidth={1.5} />
              רכוש מנוי לצפייה בפרטים מלאים
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <Badge variant="success">פעיל</Badge>
          <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
            {formatDistanceToNow(new Date(tender.created_at), { addSuffix: true, locale: he })}
          </span>

          {isBlurred ? (
            <Link href="/subscribe" className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}>
              הצג
            </Link>
          ) : (
            <Link href={`/tenders/${tender.id}`} className="btn-primary" style={{ fontSize: 12, padding: '6px 12px' }}>
              הגש הצעה
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
