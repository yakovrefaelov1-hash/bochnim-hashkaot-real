'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiGet, apiPatch } from '@/lib/api';
import { Tender, Quote, Notification } from '@/types';
import { INVESTMENT_TYPE_LABELS, INVESTMENT_TYPE_ICONS, QUOTE_STATUS_COLORS, QUOTE_STATUS_LABELS } from '@/lib/constants';
import { LoadingCenter, StarRating, Badge, EmptyState } from '@/components/ui/index';
import { ClipboardList, SendHorizonal, Inbox, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface DashboardData {
  tenders: Tender[];
  recent_quotes: Quote[];
  notifications: Notification[];
  stats: { active_tenders: number; total_quotes: number; pending_quotes: number };
}

export default function InvestorDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/auth/login');
    else if (user.role === 'provider') router.push('/dashboard/provider');
  }, [user, router]);

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['investor-dashboard'],
    queryFn: () => apiGet('/dashboard/investor'),
    enabled: !!user,
  });

  const qc = useQueryClient();
  const readAllMutation = useMutation({
    mutationFn: () => apiPatch('/dashboard/notifications/read-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['investor-dashboard'] }),
  });

  if (!user || isLoading) return <LoadingCenter />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">
            שלום, {user.full_name.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-1">ברוך הבא לדשבורד המשקיע שלך</p>
        </div>
        <Link href="/post-tender" className="btn-primary" style={{ fontSize: 13 }}>
          + מכרז חדש
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'מכרזים פעילים', value: data?.stats.active_tenders ?? 0, Icon: ClipboardList },
          { label: 'הצעות שהתקבלו', value: data?.stats.total_quotes ?? 0, Icon: Inbox },
          { label: 'ממתינות לתגובה', value: data?.stats.pending_quotes ?? 0, Icon: Clock },
        ].map(s => (
          <div key={s.label} className="card-metric" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: 'var(--gray-500)' }}>
              <s.Icon size={20} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--gray-900)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenders + Quotes */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <h2 className="font-bold text-slate-800 mb-4">המכרזים שלי</h2>
            {!data?.tenders?.length ? (
              <EmptyState
                icon={<ClipboardList size={36} strokeWidth={1} />}
                title="עדיין לא פרסמת מכרז"
                desc="פרסם מכרז בחינם וקבל הצעות מספקים"
                action={<Link href="/post-tender" className="btn-primary inline-block text-sm">פרסם מכרז חינמית</Link>}
              />
            ) : (
              <div className="space-y-3">
                {data.tenders.map(t => (
                  <div key={t.id} className="border border-slate-200 rounded-xl p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {t.investment_types.map(type => (
                            <span key={type} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              {INVESTMENT_TYPE_ICONS[type]} {INVESTMENT_TYPE_LABELS[type]}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-slate-400">
                          פורסם {formatDistanceToNow(new Date(t.created_at), { addSuffix: true, locale: he })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mr-3">
                        <Badge variant={t.status === 'active' ? 'success' : 'default'}>
                          {t.status === 'active' ? 'פעיל' : t.status === 'closed' ? 'סגור' : 'בוטל'}
                        </Badge>
                        <Link href={`/tenders/${t.id}`} className="text-xs text-primary-600 font-semibold hover:underline">
                          צפה →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent quotes */}
          {(data?.recent_quotes?.length ?? 0) > 0 && (
            <div className="card p-5">
              <h2 className="font-bold text-slate-800 mb-4">הצעות אחרונות</h2>
              <div className="space-y-3">
                {data!.recent_quotes.slice(0, 5).map(q => (
                  <div key={q.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        {q.provider_profiles?.business_name?.[0] ?? '?'}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-800">{q.provider_profiles?.business_name}</div>
                        <div className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: he })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold text-primary-700">
                        {q.price.toLocaleString('he-IL')} ₪
                      </div>
                      <span className={`badge text-xs ${QUOTE_STATUS_COLORS[q.status]}`}>
                        {QUOTE_STATUS_LABELS[q.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications sidebar */}
        <div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">התראות</h2>
              {(data?.notifications?.length ?? 0) > 0 && (
                <button
                  onClick={() => readAllMutation.mutate()}
                  className="text-xs text-primary-600 hover:underline"
                >
                  סמן הכל כנקרא
                </button>
              )}
            </div>
            {!data?.notifications?.length ? (
              <div className="text-center py-8 text-slate-400 text-sm">אין התראות חדשות</div>
            ) : (
              <div className="space-y-2">
                {data.notifications.map(n => (
                  <div key={n.id} className="bg-blue-50 rounded-xl p-3">
                    <div className="text-xs font-semibold text-slate-800 mb-0.5">{n.title}</div>
                    <div className="text-xs text-slate-600">{n.body}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: he })}
                    </div>
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
