'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiGet, apiPatch } from '@/lib/api';
import { ProviderProfile, PastDeal } from '@/types';
import { LoadingCenter, Badge, EmptyState } from '@/components/ui/index';
import { CheckCircle2 } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'admin') router.push('/');
    else if (!user) router.push('/auth/login');
  }, [user, router]);

  const qc = useQueryClient();

  const { data: pendingProviders, isLoading: loadingProviders } = useQuery<ProviderProfile[]>({
    queryKey: ['admin-pending-providers'],
    queryFn: () => apiGet('/providers/admin/pending'),
    enabled: user?.role === 'admin',
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiPatch(`/providers/${id}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-pending-providers'] }),
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      apiPatch(`/providers/${id}/feature`, { is_featured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-pending-providers'] }),
  });

  if (!user || user.role !== 'admin') return <LoadingCenter />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-800">פאנל ניהול</h1>
        <p className="text-slate-500 mt-1">בוחנים השקעות — ממשק מנהל</p>
      </div>

      {/* Pending providers */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          ⏳ ספקים ממתינים לאישור
          {pendingProviders?.length ? (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {pendingProviders.length}
            </span>
          ) : null}
        </h2>

        {loadingProviders ? (
          <LoadingCenter />
        ) : !pendingProviders?.length ? (
          <EmptyState icon={<CheckCircle2 size={36} strokeWidth={1} />} title="אין ספקים ממתינים" desc="כל הספקים אושרו" />
        ) : (
          <div className="space-y-4">
            {pendingProviders.map(provider => {
              const providerUser = provider.users as unknown as { email: string; full_name: string; phone: string } | undefined;
              return (
                <div key={provider.id} className="border border-slate-200 rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{CATEGORY_ICONS[provider.category]}</span>
                        <h3 className="font-bold text-slate-800">{provider.business_name}</h3>
                        <Badge variant="warning">ממתין לאישור</Badge>
                      </div>

                      <div className="text-sm text-slate-500 mb-2">
                        {CATEGORY_LABELS[provider.category]}
                      </div>

                      {providerUser && (
                        <div className="text-xs text-slate-400 space-y-0.5">
                          <div>👤 {providerUser.full_name}</div>
                          <div>📧 {providerUser.email}</div>
                          <div>📱 {providerUser.phone}</div>
                        </div>
                      )}

                      {provider.bio && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{provider.bio}</p>
                      )}

                      <div className="flex gap-4 mt-2 text-xs text-slate-400">
                        <span>ניסיון: {provider.years_experience} שנים</span>
                        {provider.license_number && <span>רישיון: {provider.license_number}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => approveMutation.mutate(provider.id)}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        ✓ אשר
                      </button>
                      <button
                        onClick={() => featureMutation.mutate({ id: provider.id, is_featured: true })}
                        disabled={featureMutation.isPending}
                        className="bg-amber-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                      >
                        ⭐ מומלץ
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                    נרשם {formatDistanceToNow(new Date(provider.created_at), { addSuffix: true, locale: he })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
