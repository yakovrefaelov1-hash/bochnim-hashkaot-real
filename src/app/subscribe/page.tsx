'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiPost } from '@/lib/api';
import { PRICE_PLANS } from '@/lib/constants';
import Link from 'next/link';

export default function SubscribePage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState<'single' | 'monthly' | null>(null);
  const [error, setError] = useState('');

  const tenderId = params.get('tender');
  const defaultType = params.get('type') as 'single' | 'monthly' | null;

  const handleSubscribe = async (type: 'single' | 'monthly') => {
    if (!user) {
      router.push(`/auth/register?role=provider&redirect=/subscribe?type=${type}${tenderId ? `&tender=${tenderId}` : ''}`);
      return;
    }
    if (user.role !== 'provider') {
      setError('רק ספקים יכולים לרכוש גישה למכרזים');
      return;
    }

    setIsLoading(type);
    setError('');
    try {
      const result = await apiPost<{ checkout_url: string }>('/subscriptions/checkout', {
        type,
        ...(type === 'single' && tenderId ? { tender_id: tenderId } : {}),
      });
      window.location.href = result.checkout_url;
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'שגיאה ביצירת תשלום');
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary-800 mb-3">בחר תוכנית</h1>
          <p className="text-slate-500 text-lg">
            ללא עמלת הצלחה. משלמים רק על גישה למכרזים.
          </p>
          {tenderId && (
            <div className="inline-flex items-center gap-2 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm text-amber-700 font-medium">
              🔔 נבחרת כדי לגשת למכרז ספציפי
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PRICE_PLANS.map(plan => (
            <div
              key={plan.type}
              className={`card p-7 flex flex-col relative ${
                plan.highlight ? 'border-2 border-primary shadow-xl' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 right-6 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  הכי פופולרי
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-800">{plan.label}</h3>
                <p className="text-slate-500 text-sm mt-0.5">{plan.desc}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black text-primary-700">
                  {plan.price.toLocaleString('he-IL')}
                </span>
                <span className="text-slate-500 text-sm mr-1">
                  ₪{plan.type === 'monthly' ? '/חודש' : ' חד-פעמי'}
                </span>
              </div>

              <ul className="space-y-2 mb-7 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-success font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.type)}
                disabled={isLoading !== null}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  plan.highlight
                    ? 'btn-gold'
                    : 'btn-outline'
                } disabled:opacity-60`}
              >
                {isLoading === plan.type ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                    מעביר לתשלום...
                  </span>
                ) : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="text-center mt-12 space-y-3">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span>🔒 תשלום מאובטח</span>
            <span>📄 ללא התחייבות</span>
            <span>🚫 ללא עמלת הצלחה</span>
          </div>
          <p className="text-xs text-slate-400">
            התשלום מעובד בצורה מאובטחת על ידי Stripe. פרטי כרטיס האשראי לא נשמרים אצלנו.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">שאלות נפוצות</h3>
          <div className="space-y-3">
            {[
              { q: 'האם יש עמלת הצלחה?', a: 'לא. אנחנו גובים רק על גישה למכרזים. אין עמלות נסתרות.' },
              { q: 'מה ההבדל בין הצעה בודדת למנוי?', a: 'הצעה בודדת מאפשרת גישה למכרז אחד ספציפי. מנוי חודשי מאפשר גישה לכל המכרזים ללא הגבלה.' },
              { q: 'האם ניתן לבטל את המנוי?', a: 'המנוי לא מתחדש אוטומטית. תשלם רק עבור החודש הנוכחי.' },
              { q: 'כמה זמן לוקח לקבל גישה?', a: 'מיד לאחר אישור התשלום. הגישה מופעלת אוטומטית.' },
            ].map(({ q, a }) => (
              <div key={q} className="card p-4">
                <div className="font-semibold text-slate-800 text-sm mb-1">{q}</div>
                <div className="text-slate-500 text-sm">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
