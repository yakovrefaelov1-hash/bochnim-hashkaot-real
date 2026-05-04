'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiGet } from '@/lib/api';
import { Quote, PastDeal, Notification } from '@/types';
import { QUOTE_STATUS_COLORS, QUOTE_STATUS_LABELS, INVESTMENT_TYPE_LABELS } from '@/lib/constants';
import { LoadingCenter, Badge, EmptyState, StarRating } from '@/components/ui/index';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface ProviderDashData {
  profile: Record<string, unknown> | null;
  quotes: Quote[];
  past_deals: PastDeal[];
  notifications: Notification[];
  subscription: { is_active: boolean; tier: string; expires_at?: string };
  stats: { total_quotes: number; accepted_quotes: number; pending_quotes: number; total_deals: number; avg_rating: number };
}

export default function ProviderDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/auth/login');
    else if (user.role === 'investor') router.push('/dashboard/investor');
  }, [user, router]);

  const { data, isLoading } = useQuery<ProviderDashData>({
    queryKey: ['provider-dashboard'],
    queryFn: () => apiGet('/dashboard/provider'),
    enabled: !!user,
  });

  if (!user || isLoading) return <LoadingCenter />;

  const { subscription, stats, quotes, past_deals, notifications, profile } = data ?? {};

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Subscription banner */}
      {!subscription?.is_active && (
        <div className="mb-6 bg-gradient-to-l from-amber-500 to-orange-500 text-white rounded-2xl p-5 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="font-bold text-lg">🔓 שדרג לגישה מלאה</div>
            <div className="text-amber-100 text-sm mt-0.5">
              מנוי חודשי ב-1,000 ₪ — הצעות ללא הגבלה לכל המכרזים
            </div>
          </div>
          <Link href="/subscribe?type=monthly" className="bg-white text-amber-700 font-bold px-5 py-2.5 rounded-xl text-sm flex-shrink-0 hover:bg-amber-50 transition-colors">
            שדרג עכשיו
          </Link>
        </div>
      )}

      {subscription?.is_active && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
          <div>
            <div className="font-semibold text-green-800 text-sm">מנוי חודשי פעיל</div>
            <div className="text-green-600 text-xs">
              בתוקף עד {new Date(subscription.expires_at!).toLocaleDateString('he-IL')}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">דשבורד ספק</h1>
          <p className="text-slate-500 mt-1">{user.full_name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenders" className="btn-outline text-sm px-4 py-2 rounded-xl">מכרזים פעילים</Link>
          {!profile && <Link href="/dashboard/provider/profile" className="btn-primary text-sm px-4 py-2 rounded-xl">צור פרופיל</Link>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'הצעות שהגשתי', value: stats?.total_quotes ?? 0, icon: '📤', color: 'text-blue-600' },
          { label: 'הצעות שהתקבלו', value: stats?.accepted_quotes ?? 0, icon: '🏆', color: 'text-green-600' },
          { label: 'ממתין לתגובה', value: stats?.pending_quotes ?? 0, icon: '⏳', color: 'text-amber-600' },
          { label: 'דירוג ממוצע', value: stats?.avg_rating?.toFixed(1) ?? '—', icon: '⭐', color: 'text-primary-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* My Quotes */}
          <div className="card p-5">
            <h2 className="font-bold text-slate-800 mb-4">ההצעות שלי</h2>
            {!quotes?.length ? (
              <EmptyState
                icon="📤"
                title="עדיין לא הגשת הצעות"
                desc="גלוש במכרזים הפעילים והגש הצעות למשקיעים"
                action={<Link href="/tenders" className="btn-primary inline-block text-sm">עיין במכרזים</Link>}
              />
            ) : (
              <div className="space-y-3">
                {quotes.map(q => {
                  const tender = q.tenders;
                  return (
                    <div key={q.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {tender?.investment_types?.map(t => (
                              <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                {INVESTMENT_TYPE_LABELS[t]}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm font-medium text-slate-700">
                            {tender?.equity_available && `הון: ${tender.equity_available}`}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: he })}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`badge text-xs ${QUOTE_STATUS_COLORS[q.status]}`}>
                            {QUOTE_STATUS_LABELS[q.status]}
                          </span>
                          <span className="text-sm font-bold text-primary-700">
                            {q.price.toLocaleString('he-IL')} ₪
                          </span>
                          <Link href={`/tenders/${q.tender_id}`} className="text-xs text-slate-400 hover:text-primary-600">
                            צפה →
                          </Link>
                          {q.status === 'accepted' && (
                            <Link
                              href={`/messages/${q.tender_id}`}
                              className="text-xs font-semibold text-white px-2 py-0.5 rounded-full"
                              style={{ background: 'linear-gradient(135deg, #1B4F72, #2E86AB)' }}
                            >
                              💬 הודעה
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Deals */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">עסקאות עבר שלי</h2>
              <Link href="/dashboard/provider/past-deals" className="text-xs text-primary-600 font-semibold hover:underline">
                + הוסף עסקה
              </Link>
            </div>
            {!past_deals?.length ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <div className="text-3xl mb-2">📈</div>
                הוסף עסקאות עבר כדי לשפר את הסיכוי לקבל הצעות מאושרות
              </div>
            ) : (
              <div className="space-y-2">
                {past_deals.map(d => (
                  <div key={d.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-slate-800">{d.title}</div>
                      <div className="text-xs text-slate-400">{d.location} · {d.year}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-600">{d.return_percentage}%</span>
                      {d.is_verified ? (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">מאומת</span>
                      ) : (
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">ממתין</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="card p-4">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">פעולות מהירות</h3>
            <div className="space-y-2">
              <Link href="/tenders" className="btn-primary w-full text-center block text-sm py-2.5 rounded-xl">
                📋 עיין במכרזים
              </Link>
              <Link href="/dashboard/provider/past-deals" className="btn-outline w-full text-center block text-sm py-2.5 rounded-xl">
                📈 הוסף עסקת עבר
              </Link>
              {!subscription?.is_active && (
                <Link href="/subscribe" className="btn-gold w-full text-center block text-sm py-2.5 rounded-xl">
                  ✨ שדרג מנוי
                </Link>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-4">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">התראות</h3>
            {!notifications?.length ? (
              <div className="text-center py-6 text-slate-400 text-xs">אין התראות חדשות</div>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 5).map(n => (
                  <div key={n.id} className="bg-blue-50 rounded-lg p-2.5">
                    <div className="text-xs font-semibold text-slate-800">{n.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{n.body}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
