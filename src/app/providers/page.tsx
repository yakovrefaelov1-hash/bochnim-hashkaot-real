'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { ProviderProfile, ProviderCategory } from '@/types';
import { CATEGORY_LABELS, CATEGORY_ICONS, ISRAELI_CITIES } from '@/lib/constants';
import { LoadingCenter, EmptyState, StarRating, Badge } from '@/components/ui/index';
import { useSearchParams } from 'next/navigation';

interface ProvidersResponse {
  data: ProviderProfile[];
  pagination: { total: number; pages: number; page: number };
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProviderCategory[];

export default function ProvidersPage() {
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">ספקים מאומתים</h1>
        <p className="text-slate-500">
          {data?.pagination?.total ?? 0} ספקים מקצועיים · יזמים, יועצים, עורכי דין ועוד
        </p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setCategory(''); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            category === '' ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/40'
          }`}
        >
          הכל
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              category === cat ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/40'
            }`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pr-10 text-sm py-2"
            placeholder="חפש לפי שם עסק, מיקום..."
          />
        </div>

        <select
          value={region}
          onChange={e => { setRegion(e.target.value); setPage(1); }}
          className="input-field w-auto text-sm py-2"
        >
          <option value="">כל האזורים</option>
          {ISRAELI_CITIES.slice(0, 15).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={minRating}
          onChange={e => { setMinRating(e.target.value); setPage(1); }}
          className="input-field w-auto text-sm py-2"
        >
          <option value="">כל הדירוגים</option>
          <option value="4">4+ ⭐</option>
          <option value="4.5">4.5+ ⭐</option>
        </select>

        {(search || region || minRating) && (
          <button
            onClick={() => { setSearch(''); setRegion(''); setMinRating(''); setPage(1); }}
            className="text-sm text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕ נקה
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingCenter />
      ) : !data?.data?.length ? (
        <EmptyState
          icon="🔍"
          title="לא נמצאו ספקים"
          desc="נסה לשנות את הפילטרים"
          action={
            <button onClick={() => { setSearch(''); setCategory(''); setRegion(''); setMinRating(''); }} className="btn-outline text-sm inline-block">
              נקה פילטרים
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {data.data.map((provider, i) => (
              <ProviderCard key={provider.id} provider={provider} animationDelay={i * 0.05} />
            ))}
          </div>

          {(data.pagination?.pages ?? 1) > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline text-sm px-4 py-2 rounded-lg disabled:opacity-40">
                ← הקודם
              </button>
              <span className="px-4 py-2 text-sm text-slate-600">עמוד {page} מתוך {data.pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))} disabled={page === data.pagination.pages} className="btn-outline text-sm px-4 py-2 rounded-lg disabled:opacity-40">
                הבא →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// Provider Card
// ============================================================
function ProviderCard({ provider, animationDelay }: { provider: ProviderProfile; animationDelay: number }) {
  return (
    <Link
      href={`/providers/${provider.id}`}
      className="card-hover p-5 flex flex-col animate-slide-up"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-black text-lg flex-shrink-0">
          {provider.is_featured ? '⭐' : provider.business_name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-slate-800 text-sm truncate">{provider.business_name}</h3>
            {provider.is_featured && (
              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">מומלץ</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-lg">{CATEGORY_ICONS[provider.category]}</span>
            <span className="text-xs text-slate-500">{CATEGORY_LABELS[provider.category]}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {provider.bio && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{provider.bio}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-primary-700">{provider.years_experience}</div>
          <div className="text-xs text-slate-400">שנות ניסיון</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-primary-700">{provider.deals_count}</div>
          <div className="text-xs text-slate-400">עסקאות</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-primary-700">
            {provider.total_reviews > 0 ? provider.avg_rating.toFixed(1) : '—'}
          </div>
          <div className="text-xs text-slate-400">דירוג</div>
        </div>
      </div>

      {/* Rating */}
      {provider.total_reviews > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={provider.avg_rating} size="sm" />
          <span className="text-xs text-slate-400">({provider.total_reviews} חוות דעת)</span>
        </div>
      )}

      {/* Regions */}
      {provider.regions_served?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-slate-100">
          {provider.regions_served.slice(0, 3).map(r => (
            <span key={r} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              📍 {r}
            </span>
          ))}
          {provider.regions_served.length > 3 && (
            <span className="text-xs text-slate-400">+{provider.regions_served.length - 3}</span>
          )}
        </div>
      )}
    </Link>
  );
}
