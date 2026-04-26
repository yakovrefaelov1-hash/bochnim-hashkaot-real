'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { INVESTMENT_TYPE_LABELS, INVESTMENT_TYPE_ICONS } from '@/lib/constants';
import { LoadingCenter } from '@/components/ui/index';
import { InvestmentType } from '@/types';

interface TrackData {
  id: string;
  status: string;
  created_at: string;
  investment_types: InvestmentType[];
  location_city?: string;
  location_country?: string;
  quotes_count: number;
}

export default function TrackPage() {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, isError } = useQuery<TrackData>({
    queryKey: ['track', token],
    queryFn: () => apiGet(`/tenders/track/${token}`),
    retry: false,
  });

  if (isLoading) return <LoadingCenter />;

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center card p-10 max-w-md w-full">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">לינק מעקב לא נמצא</h2>
          <p className="text-slate-400 text-sm mb-6">ייתכן שהלינק שגוי או שהמכרז הוסר</p>
          <Link href="/post-tender" className="btn-primary inline-block">פרסם מכרז חדש</Link>
        </div>
      </div>
    );
  }

  const statusLabel: Record<string, { text: string; color: string; icon: string }> = {
    active: { text: 'פעיל — מקבל הצעות', color: 'bg-green-100 text-green-700', icon: '🟢' },
    closed: { text: 'נסגר', color: 'bg-slate-100 text-slate-600', icon: '🔒' },
    cancelled: { text: 'בוטל', color: 'bg-red-100 text-red-600', icon: '❌' },
  };

  const statusInfo = statusLabel[data.status] ?? statusLabel.active;

  const quotesText =
    data.quotes_count === 0
      ? 'עדיין לא התקבלו הצעות'
      : data.quotes_count === 1
      ? 'הצעה אחת התקבלה'
      : `${data.quotes_count} הצעות התקבלו`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-800 font-bold text-lg">
            <span className="text-2xl">🏗️</span>
            בוחנים השקעות
          </Link>
        </div>

        {/* Status card */}
        <div className="card p-6">
          <h1 className="text-xl font-bold text-slate-800 mb-5">מעקב מכרז</h1>

          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">סטטוס</span>
              <span className={`badge font-semibold ${statusInfo.color}`}>
                {statusInfo.icon} {statusInfo.text}
              </span>
            </div>

            {/* Investment types */}
            <div className="flex items-start justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">תחום</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {data.investment_types.map(t => (
                  <span key={t} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {INVESTMENT_TYPE_ICONS[t]} {INVESTMENT_TYPE_LABELS[t]}
                  </span>
                ))}
              </div>
            </div>

            {/* Location */}
            {(data.location_city || data.location_country) && (
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">מיקום</span>
                <span className="text-sm font-medium text-slate-700">
                  📍 {data.location_city ?? data.location_country}
                </span>
              </div>
            )}

            {/* Quotes count */}
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">הצעות</span>
              <span className={`text-lg font-black ${data.quotes_count > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                {data.quotes_count}
              </span>
            </div>

            {/* Created */}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-500">פורסם</span>
              <span className="text-sm text-slate-700">
                {new Date(data.created_at).toLocaleDateString('he-IL', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Quotes status message */}
        <div className={`card p-5 text-center ${data.quotes_count > 0 ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-100'}`}>
          {data.quotes_count > 0 ? (
            <>
              <div className="text-3xl mb-2">🎉</div>
              <div className="font-bold text-green-800">{quotesText}!</div>
              <p className="text-green-700 text-sm mt-1">
                הירשם לאתר כדי לראות את ההצעות ולבחור ספק
              </p>
              <Link href="/auth/register" className="btn-primary inline-block mt-4 text-sm">
                הירשם וצפה בהצעות
              </Link>
            </>
          ) : (
            <>
              <div className="text-3xl mb-2">⏳</div>
              <div className="font-bold text-blue-800">ממתין להצעות</div>
              <p className="text-blue-700 text-sm mt-1">
                שלחנו התראות לספקים. הצעות מגיעות בדרך כלל תוך 24-48 שעות.
              </p>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="card p-5 text-center">
          <p className="text-slate-500 text-sm mb-3">רוצה לפרסם מכרז נוסף?</p>
          <Link href="/post-tender" className="btn-outline inline-block text-sm">
            פרסם מכרז חדש
          </Link>
        </div>
      </div>
    </div>
  );
}
