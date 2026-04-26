'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { ProviderProfile, PastDeal, Review } from '@/types';
import { CATEGORY_LABELS, CATEGORY_ICONS, INVESTMENT_TYPE_LABELS, INVESTMENT_TYPE_ICONS } from '@/lib/constants';
import { LoadingCenter, StarRating, Badge } from '@/components/ui/index';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

export default function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: provider, isLoading } = useQuery<ProviderProfile>({
    queryKey: ['provider', id],
    queryFn: () => apiGet(`/providers/${id}`),
  });

  if (isLoading) return <LoadingCenter />;
  if (!provider) return (
    <div className="text-center py-20">
      <div className="text-4xl mb-3">🔍</div>
      <h2 className="text-xl font-bold text-slate-700">ספק לא נמצא</h2>
      <Link href="/providers" className="btn-outline inline-block mt-4 text-sm">חזור לספקים</Link>
    </div>
  );

  const pastDeals = provider.past_deals_list ?? [];
  const reviews = provider.reviews ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-slate-500">
        <Link href="/providers" className="hover:text-primary transition-colors">ספקים</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-700">{provider.business_name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: profile card */}
        <div className="space-y-4">
          <div className="card p-6">
            {/* Avatar + name */}
            <div className="text-center mb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-black text-3xl mx-auto mb-3">
                {provider.is_featured ? '⭐' : provider.business_name[0]}
              </div>
              <h1 className="text-xl font-bold text-slate-800">{provider.business_name}</h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xl">{CATEGORY_ICONS[provider.category]}</span>
                <span className="text-sm text-slate-500">{CATEGORY_LABELS[provider.category]}</span>
              </div>
              {provider.is_featured && (
                <div className="mt-2 inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ⭐ ספק מומלץ
                </div>
              )}
            </div>

            {/* Rating */}
            {provider.total_reviews > 0 && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <StarRating rating={provider.avg_rating} />
                <span className="text-sm font-semibold text-slate-700">{provider.avg_rating.toFixed(1)}</span>
                <span className="text-sm text-slate-400">({provider.total_reviews})</span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-primary-700">{provider.years_experience}</div>
                <div className="text-xs text-slate-400">שנות ניסיון</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-primary-700">{provider.deals_count}</div>
                <div className="text-xs text-slate-400">עסקאות בוצעו</div>
              </div>
            </div>

            {/* Regions */}
            {provider.regions_served?.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 mb-2">אזורי פעילות</div>
                <div className="flex flex-wrap gap-1.5">
                  {provider.regions_served.map(r => (
                    <span key={r} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      📍 {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* License */}
            {provider.license_number && (
              <div className="text-xs text-slate-400 text-center">
                רישיון: {provider.license_number}
              </div>
            )}

            {/* Base price */}
            {provider.base_price && (
              <div className="mt-3 text-center">
                <div className="text-xs text-slate-400">מחיר התחלתי</div>
                <div className="font-bold text-primary-700">
                  {provider.base_price.toLocaleString('he-IL')} ₪
                </div>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">רוצה לעבוד עם {provider.business_name}?</h3>
            <p className="text-xs text-slate-500 mb-4">פרסם מכרז בחינם וספקים מנוסים ישלחו לך הצעות</p>
            <Link href="/post-tender" className="btn-gold w-full text-center block text-sm py-2.5 rounded-xl">
              פרסם מכרז חינמית
            </Link>
          </div>
        </div>

        {/* Right: bio, deals, reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {provider.bio && (
            <div className="card p-6">
              <h2 className="font-bold text-slate-800 mb-3">אודות</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{provider.bio}</p>
            </div>
          )}

          {/* Past Deals — FOMO */}
          {pastDeals.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="font-bold text-slate-800">עסקאות מוצלחות</h2>
                <span className="badge bg-amber-100 text-amber-700 text-xs">🔥 תשואות מוכחות</span>
              </div>

              <div className="space-y-4">
                {pastDeals.map(deal => (
                  <PastDealRow key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {provider.gallery_urls?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-bold text-slate-800 mb-4">גלריה</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {provider.gallery_urls.map((url, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                    <img src={url} alt={`תמונה ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-800 mb-5">
              חוות דעת {reviews.length > 0 && `(${reviews.length})`}
            </h2>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <div className="text-3xl mb-2">⭐</div>
                עדיין אין חוות דעת
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <ReviewRow key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Past Deal Row
// ============================================================
function PastDealRow({ deal }: { deal: PastDeal }) {
  const returnColor =
    deal.return_percentage >= 30
      ? 'bg-green-500'
      : deal.return_percentage >= 15
      ? 'bg-emerald-500'
      : 'bg-teal-500';

  return (
    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
      {/* Return badge */}
      <div className={`${returnColor} text-white rounded-xl px-3 py-2 text-center flex-shrink-0 min-w-[64px]`}>
        <div className="text-lg font-black leading-none">
          {deal.return_percentage % 1 === 0 ? deal.return_percentage : deal.return_percentage.toFixed(1)}%
        </div>
        <div className="text-xs opacity-80">תשואה</div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-semibold text-slate-800 text-sm">{deal.title}</span>
          {deal.is_verified && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">✓ מאומת</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
          <span>{INVESTMENT_TYPE_ICONS[deal.deal_type]} {INVESTMENT_TYPE_LABELS[deal.deal_type]}</span>
          <span>📍 {deal.location}</span>
          <span>📅 {deal.year}</span>
          <span>⏱ {deal.duration_months} חודשים</span>
        </div>

        <div className="flex items-center gap-3 mt-1.5 text-xs">
          <span className="text-slate-500">
            סכום: <span className="font-semibold text-slate-700">{deal.investment_amount.toLocaleString('he-IL')} ₪</span>
          </span>
        </div>

        {deal.description && (
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{deal.description}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Review Row
// ============================================================
function ReviewRow({ review }: { review: Review }) {
  return (
    <div className="border border-slate-100 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
            {review.users?.full_name?.[0] ?? '?'}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">{review.users?.full_name}</div>
            <div className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: he })}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {review.comment && (
        <p className="text-sm text-slate-600 leading-relaxed mb-3">{review.comment}</p>
      )}

      {/* Sub-ratings */}
      {(review.professionalism || review.communication || review.reliability) && (
        <div className="flex gap-4 text-xs text-slate-500">
          {review.professionalism && <span>מקצועיות: {review.professionalism}/5</span>}
          {review.communication && <span>תקשורת: {review.communication}/5</span>}
          {review.reliability && <span>אמינות: {review.reliability}/5</span>}
        </div>
      )}

      {/* Provider reply */}
      {review.provider_reply && (
        <div className="mt-3 bg-blue-50 border-r-2 border-primary rounded-r-lg p-3 pr-3 mr-0">
          <div className="text-xs font-semibold text-primary-700 mb-1">תגובת הספק:</div>
          <p className="text-xs text-slate-600">{review.provider_reply}</p>
        </div>
      )}
    </div>
  );
}
