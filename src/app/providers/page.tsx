'use client';

import { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { ProviderProfile, ProviderCategory } from '@/types';
import { CATEGORY_LABELS, ISRAELI_CITIES } from '@/lib/constants';
import { LoadingCenter, EmptyState, StarRating } from '@/components/ui/index';
import { useSearchParams } from 'next/navigation';
import {
  Users, Building2, TrendingUp, Handshake, Scale, Ruler, HardHat,
  Lightbulb, Search, MapPin, X,
} from 'lucide-react';

interface ProvidersResponse {
  data: ProviderProfile[];
  pagination: { total: number; pages: number; page: number };
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProviderCategory[];

const CATEGORY_LUCIDE_ICONS: Record<ProviderCategory, React.ElementType> = {
  entrepreneur: Lightbulb,
  real_estate_developer: Building2,
  investment_advisor: TrendingUp,
  investor_companion: Handshake,
  lawyer: Scale,
  appraiser: Ruler,
  contractor: HardHat,
};

function ProvidersContent() {
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProviderCategory | ''>(
    (params.get('category') as ProviderCategory) ?? ''
  );
  const [region, setRegion] = useState('');
  const [minRating, setMinRating] = useState('');

  const { data, isLoading } = useQuery<ProvidersResponse>({
    queryKey: ['providers', page, search, category, region, minRating],
    queryFn: () =>
      apiGet('/providers', {
        page,
        limit: 20,
        ...(search && { q: search }),
        ...(category && { category }),
        ...(region && { region }),
        ...(minRating && { min_rating: minRating }),
      }),
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }} dir="rtl">
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--gray-50)', border: '0.5px solid var(--gray-100)',
          borderRadius: 'var(--radius-pill)', padding: '3px 10px',
          fontSize: 12, fontWeight: 500, color: 'var(--gray-500)', marginBottom: 12,
        }}>
          <Users size={12} strokeWidth={1.5} />
          ספקים מאומתים
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 6 }}>מצא את הספק המתאים לך</h1>
        <p style={{ fontSize: 15, color: 'var(--gray-500)' }}>
          {data?.pagination?.total ?? 0} ספקים מקצועיים · יזמים, יועצים, עורכי דין ועוד
        </p>
      </div>

      {/* Category filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => { setCategory(''); setPage(1); }}
          style={{
            padding: '6px 14px', borderRadius: 'var(--radius-pill)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease',
            background: category === '' ? 'var(--gray-900)' : 'var(--white)',
            color: category === '' ? 'var(--white)' : 'var(--gray-500)',
            border: category === '' ? 'none' : '0.5px solid var(--gray-100)',
          }}
        >
          הכל
        </button>
        {CATEGORIES.map(cat => {
          const Icon = CATEGORY_LUCIDE_ICONS[cat];
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 'var(--radius-pill)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease',
                background: active ? 'var(--gray-900)' : 'var(--white)',
                color: active ? 'var(--white)' : 'var(--gray-500)',
                border: active ? 'none' : '0.5px solid var(--gray-100)',
              }}
            >
              <Icon size={12} strokeWidth={1.5} />
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} strokeWidth={1.5} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field"
            style={{ paddingRight: 36, fontSize: 13, padding: '8px 36px 8px 12px' }}
            placeholder="חפש לפי שם עסק, מיקום..."
          />
        </div>

        <select value={region} onChange={e => { setRegion(e.target.value); setPage(1); }} className="input-field" style={{ width: 'auto', fontSize: 13, padding: '8px 12px' }}>
          <option value="">כל האזורים</option>
          {ISRAELI_CITIES.slice(0, 15).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={minRating} onChange={e => { setMinRating(e.target.value); setPage(1); }} className="input-field" style={{ width: 'auto', fontSize: 13, padding: '8px 12px' }}>
          <option value="">כל הדירוגים</option>
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
        </select>

        {(search || region || minRating) && (
          <button
            onClick={() => { setSearch(''); setRegion(''); setMinRating(''); setPage(1); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--gray-500)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={13} strokeWidth={1.5} />
            נקה
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingCenter />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={<Search size={36} strokeWidth={1} />}
          title="לא נמצאו ספקים"
          desc="נסה לשנות את הפילטרים"
          action={
            <button onClick={() => { setSearch(''); setCategory(''); setRegion(''); setMinRating(''); }} className="btn-secondary" style={{ fontSize: 13 }}>
              נקה פילטרים
            </button>
          }
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {data.data.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
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

export default function ProvidersPage() {
  return (
    <Suspense fallback={<LoadingCenter />}>
      <ProvidersContent />
    </Suspense>
  );
}

function ProviderCard({ provider }: { provider: ProviderProfile }) {
  const Icon = CATEGORY_LUCIDE_ICONS[provider.category] ?? Building2;

  return (
    <Link href={`/providers/${provider.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'var(--gray-50)', border: '0.5px solid var(--gray-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)' }}>
              {provider.business_name[0]}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
              <span style={{ fontWeight: 500, color: 'var(--gray-900)', fontSize: 14 }}>{provider.business_name}</span>
              {provider.is_featured && (
                <span className="badge badge-premium" style={{ fontSize: 11 }}>מומלץ</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon size={12} strokeWidth={1.5} color="var(--gray-500)" />
              <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{CATEGORY_LABELS[provider.category]}</span>
            </div>
          </div>
        </div>

        {provider.bio && (
          <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {provider.bio}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { value: provider.years_experience, label: 'שנות ניסיון' },
            { value: (provider as any).deals_count ?? '—', label: 'עסקאות' },
            { value: provider.total_reviews > 0 ? provider.avg_rating.toFixed(1) : '—', label: 'דירוג' },
          ].map(m => (
            <div key={m.label} className="card-metric" style={{ textAlign: 'center', padding: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{m.value}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {provider.total_reviews > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StarRating rating={provider.avg_rating} size="sm" />
            <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>({provider.total_reviews})</span>
          </div>
        )}

        {(provider as any).regions_served?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingTop: 8, borderTop: '0.5px solid var(--gray-100)' }}>
            {(provider as any).regions_served.slice(0, 3).map((r: string) => (
              <span key={r} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, background: 'var(--gray-50)', color: 'var(--gray-500)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
                <MapPin size={10} strokeWidth={1.5} />
                {r}
              </span>
            ))}
            {(provider as any).regions_served.length > 3 && (
              <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>+{(provider as any).regions_served.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
