'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { ProviderProfile, PastDeal, Review } from '@/types';
import { CATEGORY_LABELS, INVESTMENT_TYPE_LABELS } from '@/lib/constants';
import { LoadingCenter, StarRating } from '@/components/ui/index';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import {
  Building2, TrendingUp, Handshake, Scale, Ruler, HardHat, Lightbulb,
  MapPin, Calendar, Clock, BadgeCheck, Search, Star,
} from 'lucide-react';
import { ProviderCategory } from '@/types';

const CATEGORY_LUCIDE_ICONS: Record<ProviderCategory, React.ElementType> = {
  entrepreneur: Lightbulb,
  real_estate_developer: Building2,
  investment_advisor: TrendingUp,
  investor_companion: Handshake,
  lawyer: Scale,
  appraiser: Ruler,
  contractor: HardHat,
};

export default function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: provider, isLoading } = useQuery<ProviderProfile>({
    queryKey: ['provider', id],
    queryFn: () => apiGet(`/providers/${id}`),
  });

  if (isLoading) return <LoadingCenter />;
  if (!provider) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: 'var(--gray-300)' }}>
        <Search size={40} strokeWidth={1} />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 16 }}>ספק לא נמצא</h2>
      <Link href="/providers" className="btn-secondary" style={{ fontSize: 13 }}>חזור לספקים</Link>
    </div>
  );

  const CategoryIcon = CATEGORY_LUCIDE_ICONS[provider.category] ?? Building2;
  const pastDeals = provider.past_deals_list ?? [];
  const reviews = provider.reviews ?? [];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }} dir="rtl">
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, fontSize: 13, color: 'var(--gray-500)' }}>
        <Link href="/providers" style={{ color: 'var(--gray-500)', textDecoration: 'none' }}>ספקים</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: 'var(--gray-900)' }}>{provider.business_name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
        {/* Profile card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 'var(--radius-md)',
                background: 'var(--gray-50)', border: '0.5px solid var(--gray-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', fontSize: 22, fontWeight: 500, color: 'var(--gray-900)',
              }}>
                {provider.business_name[0]}
              </div>
              <h1 style={{ fontSize: 18, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 6 }}>{provider.business_name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <CategoryIcon size={14} strokeWidth={1.5} color="var(--gray-500)" />
                <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>{CATEGORY_LABELS[provider.category]}</span>
              </div>
              {provider.is_featured && (
                <span className="badge badge-premium" style={{ marginTop: 8, display: 'inline-flex' }}>מומלץ</span>
              )}
            </div>

            {provider.total_reviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                <StarRating rating={provider.avg_rating} />
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-900)' }}>{provider.avg_rating.toFixed(1)}</span>
                <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>({provider.total_reviews})</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <div className="card-metric" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--gray-900)' }}>{provider.years_experience}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>שנות ניסיון</div>
              </div>
              <div className="card-metric" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--gray-900)' }}>{provider.deals_count}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>עסקאות בוצעו</div>
              </div>
            </div>

            {provider.regions_served?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-500)', marginBottom: 8 }}>אזורי פעילות</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {provider.regions_served.map(r => (
                    <span key={r} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, background: 'var(--gray-50)', color: 'var(--gray-500)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
                      <MapPin size={10} strokeWidth={1.5} />
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {provider.license_number && (
              <div style={{ fontSize: 12, color: 'var(--gray-500)', textAlign: 'center' }}>
                רישיון: {provider.license_number}
              </div>
            )}

            {provider.base_price && (
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>מחיר התחלתי</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)' }}>
                  {provider.base_price.toLocaleString('he-IL')} ₪
                </div>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 6 }}>רוצה לעבוד עם {provider.business_name}?</h3>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 16 }}>פרסם מכרז בחינם וספקים מנוסים ישלחו לך הצעות</p>
            <Link href="/post-tender" className="btn-primary" style={{ fontSize: 13, display: 'block', textAlign: 'center' }}>
              פרסם מכרז חינמית
            </Link>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {provider.bio && (
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 12 }}>אודות</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 }}>{provider.bio}</p>
            </div>
          )}

          {pastDeals.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)' }}>עסקאות מוצלחות</h2>
                <span className="badge badge-active">תשואות מוכחות</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pastDeals.map(deal => <PastDealRow key={deal.id} deal={deal} />)}
              </div>
            </div>
          )}

          {provider.gallery_urls?.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 16 }}>גלריה</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {provider.gallery_urls.map((url, i) => (
                  <div key={i} style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--gray-50)' }}>
                    <img src={url} alt={`תמונה ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 16 }}>
              חוות דעת {reviews.length > 0 && `(${reviews.length})`}
            </h2>
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--gray-500)', fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: 'var(--gray-300)' }}>
                  <Star size={24} strokeWidth={1} />
                </div>
                עדיין אין חוות דעת
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviews.map(review => <ReviewRow key={review.id} review={review} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PastDealRow({ deal }: { deal: PastDeal }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
      <div style={{
        background: 'var(--green-100)', color: 'var(--green-600)',
        borderRadius: 'var(--radius-sm)', padding: '6px 12px', textAlign: 'center', flexShrink: 0, minWidth: 60,
      }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>
          {deal.return_percentage % 1 === 0 ? deal.return_percentage : deal.return_percentage.toFixed(1)}%
        </div>
        <div style={{ fontSize: 11 }}>תשואה</div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-900)' }}>{deal.title}</span>
          {deal.is_verified && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, background: 'var(--blue-100)', color: 'var(--blue-600)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
              <BadgeCheck size={10} strokeWidth={1.5} />
              מאומת
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--gray-500)', flexWrap: 'wrap' }}>
          <span>{INVESTMENT_TYPE_LABELS[deal.deal_type]}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={11} strokeWidth={1.5} />
            {deal.location}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Calendar size={11} strokeWidth={1.5} />
            {deal.year}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Clock size={11} strokeWidth={1.5} />
            {deal.duration_months} חודשים
          </span>
        </div>

        <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
          סכום: <span style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{deal.investment_amount.toLocaleString('he-IL')} ₪</span>
        </div>

        {deal.description && (
          <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{deal.description}</p>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ review }: { review: Review }) {
  return (
    <div style={{ border: '0.5px solid var(--gray-100)', borderRadius: 'var(--radius-md)', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--gray-50)', border: '0.5px solid var(--gray-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 500, color: 'var(--gray-900)',
          }}>
            {review.users?.full_name?.[0] ?? '?'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-900)' }}>{review.users?.full_name}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: he })}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {review.comment && (
        <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 8 }}>{review.comment}</p>
      )}

      {(review.professionalism || review.communication || review.reliability) && (
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--gray-500)' }}>
          {review.professionalism && <span>מקצועיות: {review.professionalism}/5</span>}
          {review.communication && <span>תקשורת: {review.communication}/5</span>}
          {review.reliability && <span>אמינות: {review.reliability}/5</span>}
        </div>
      )}

      {review.provider_reply && (
        <div style={{ marginTop: 12, background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: 12, borderRight: '2px solid var(--gray-300)' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 4 }}>תגובת הספק:</div>
          <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{review.provider_reply}</p>
        </div>
      )}
    </div>
  );
}
