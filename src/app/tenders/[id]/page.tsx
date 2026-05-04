'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { apiGet, apiPost } from '@/lib/api';
import { Tender, Quote, QuoteFormData } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { INVESTMENT_TYPE_LABELS, INVESTMENT_TYPE_ICONS } from '@/lib/constants';
import { LoadingCenter, StarRating, Badge, Modal } from '@/components/ui/index';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const { data: tender, isLoading } = useQuery<Tender>({
    queryKey: ['tender', id],
    queryFn: () => apiGet(`/tenders/${id}`),
  });

  const { data: quotes } = useQuery<Quote[]>({
    queryKey: ['tender-quotes', id],
    queryFn: () => apiGet(`/quotes/tender/${id}`),
    enabled: !!user && (user.role === 'investor' || user.role === 'admin'),
  });

  if (isLoading) return <LoadingCenter />;
  if (!tender) return <div className="text-center py-20 text-slate-400">מכרז לא נמצא</div>;

  const isOwner = user?.id === tender.investor_id;
  const isProvider = user?.role === 'provider';
  const isBlurred = tender.is_blurred;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/tenders" className="text-sm text-slate-500 hover:text-primary transition-colors">
          ← חזור למכרזים
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tender.investment_types.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                      {INVESTMENT_TYPE_ICONS[t]} {INVESTMENT_TYPE_LABELS[t]}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-slate-400">
                  פורסם {formatDistanceToNow(new Date(tender.created_at), { addSuffix: true, locale: he })}
                </div>
              </div>
              <Badge variant="success">פעיל</Badge>
            </div>

            {/* Location + equity */}
            <div className={`grid grid-cols-2 gap-4 mb-5 ${isBlurred ? 'blurred-content' : ''}`}>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">מיקום</div>
                <div className="font-semibold text-slate-800">
                  {tender.location_city ?? tender.location_country ?? 'לא צוין'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">הון עצמי</div>
                <div className="font-semibold text-primary-700">{tender.equity_available}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">תיאור ההשקעה</h3>
              <div className={`relative ${isBlurred ? 'overflow-hidden' : ''}`}>
                <p className={`text-slate-600 leading-relaxed text-sm ${isBlurred ? 'blurred-content select-none' : ''}`}>
                  {tender.investment_description}
                </p>
                {isBlurred && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-slate-200">
                      <div className="text-2xl mb-2">🔒</div>
                      <div className="font-bold text-slate-800 mb-1">פרטים מוגנים</div>
                      <div className="text-xs text-slate-500 mb-3">רכוש גישה לצפייה בפרטי המשקיע</div>
                      <Link href="/subscribe" className="btn-gold text-xs px-4 py-2 rounded-lg inline-block">
                        פתח גישה
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quotes (investor view) */}
          {isOwner && quotes && quotes.length > 0 && (
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">הצעות שהתקבלו ({quotes.length})</h3>
              <div className="space-y-4">
                {quotes.map(q => (
                  <QuoteCard key={q.id} quote={q} tenderId={id} />
                ))}
              </div>
            </div>
          )}

          {isOwner && (!quotes || quotes.length === 0) && (
            <div className="card p-8 text-center">
              <div className="text-3xl mb-3">⏳</div>
              <div className="font-semibold text-slate-700">ממתין להצעות</div>
              <div className="text-sm text-slate-400 mt-1">ספקים קיבלו התראה ויגישו הצעות בקרוב</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* CTA for provider */}
          {isProvider && !isBlurred && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3">הגש הצעה</h3>
              <p className="text-sm text-slate-500 mb-4">
                המשקיע מחפש פתרון בתחומך. שתף אותו בניסיון שלך.
              </p>
              <button
                onClick={() => setShowQuoteModal(true)}
                className="btn-primary w-full text-center"
              >
                הגש הצעה עכשיו
              </button>
            </div>
          )}

          {isProvider && isBlurred && (
            <div className="card p-5 border-2 border-amber-200 bg-amber-50">
              <h3 className="font-bold text-amber-800 mb-2">🔓 בטל נעילה</h3>
              <p className="text-sm text-amber-700 mb-4">
                כדי לראות פרטים ולהגיש הצעה, בחר תוכנית:
              </p>
              <div className="space-y-3">
                <Link
                  href={`/subscribe?type=single&tender=${id}`}
                  className="block w-full text-center py-2.5 rounded-xl bg-white border-2 border-amber-300 text-amber-800 font-semibold text-sm hover:bg-amber-50 transition-colors"
                >
                  250 ₪ — הצעה בודדת
                </Link>
                <Link
                  href="/subscribe?type=monthly"
                  className="btn-gold w-full text-center block py-2.5 rounded-xl text-sm"
                >
                  1,000 ₪/חודש — ללא הגבלה
                </Link>
              </div>
            </div>
          )}

          {!user && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-2">רוצה להגיש הצעה?</h3>
              <p className="text-sm text-slate-500 mb-4">הירשם כספק והתחל להגיש הצעות</p>
              <Link href="/auth/register?role=provider" className="btn-primary w-full text-center block">
                הירשם כספק
              </Link>
              <Link href="/auth/login" className="btn-ghost w-full text-center block mt-2 text-sm">
                יש לי חשבון
              </Link>
            </div>
          )}

          {/* Tender stats */}
          <div className="card p-5">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm">פרטי מכרז</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">סטטוס</span>
                <Badge variant="success">פעיל</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">פורסם</span>
                <span className="text-slate-700">
                  {formatDistanceToNow(new Date(tender.created_at), { addSuffix: true, locale: he })}
                </span>
              </div>
              {tender.quotes_count !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-500">הצעות שהתקבלו</span>
                  <span className="font-semibold text-primary-700">{tender.quotes_count}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      <Modal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} title="הגש הצעה">
        <QuoteForm tenderId={id} onSuccess={() => setShowQuoteModal(false)} />
      </Modal>
    </div>
  );
}

// ============================================================
// QuoteCard
// ============================================================
function QuoteCard({ quote, tenderId }: { quote: Quote; tenderId: string }) {
  const qc = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: () => apiPost(`/quotes/${quote.id}/accept`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tender-quotes', tenderId] }),
  });

  const rejectMutation = useMutation({
    mutationFn: () => apiPost(`/quotes/${quote.id}/reject`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tender-quotes', tenderId] }),
  });

  const provider = quote.provider_profiles;

  return (
    <div className="border border-slate-200 rounded-xl p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
            {provider?.business_name?.[0] ?? '?'}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{provider?.business_name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              {provider?.avg_rating ? <StarRating rating={provider.avg_rating} size="sm" /> : null}
              <span className="text-xs text-slate-400">
                {provider?.deals_count ?? 0} עסקאות
              </span>
            </div>
          </div>
        </div>
        <div className="text-left">
          <div className="text-lg font-bold text-primary-700">
            {quote.price.toLocaleString('he-IL')} ₪
          </div>
          {quote.price_notes && (
            <div className="text-xs text-slate-400">{quote.price_notes}</div>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 mt-3 leading-relaxed">{quote.description}</p>

      {quote.past_deal_reference && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-green-700 mb-1">📈 עסקה דומה שביצענו:</div>
          <div className="text-xs text-green-600">
            {quote.past_deal_reference.title} — תשואה: <strong>{quote.past_deal_reference.return_percentage}%</strong>
          </div>
        </div>
      )}

      {quote.status === 'pending' && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending}
            className="flex-1 bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            ✓ אשר
          </button>
          <button
            onClick={() => rejectMutation.mutate()}
            disabled={rejectMutation.isPending}
            className="flex-1 bg-slate-100 text-slate-700 text-sm py-2 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
          >
            ✕ דחה
          </button>
          <Link
            href={`/providers/${quote.provider_id}`}
            className="flex-1 btn-outline text-sm py-2 rounded-lg text-center"
          >
            פרופיל
          </Link>
        </div>
      )}

      {quote.status !== 'pending' && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
            quote.status === 'accepted' ? 'bg-green-100 text-green-700' :
            quote.status === 'rejected' ? 'bg-red-100 text-red-700' :
            'bg-slate-100 text-slate-600'
          }`}>
            {quote.status === 'accepted' ? '✓ הצעה אושרה' :
             quote.status === 'rejected' ? '✕ הצעה נדחתה' : 'בוטל'}
          </div>
          {quote.status === 'accepted' && provider?.user_id && (
            <Link
              href={`/messages/${tenderId}?with=${provider.user_id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1 rounded-full transition-all"
              style={{ background: 'linear-gradient(135deg, #1B4F72, #2E86AB)' }}
            >
              💬 שלח הודעה לספק
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// QuoteForm
// ============================================================
function QuoteForm({ tenderId, onSuccess }: { tenderId: string; onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<QuoteFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const qc = useQueryClient();

  const onSubmit = async (data: QuoteFormData) => {
    setIsLoading(true);
    setError('');
    try {
      await apiPost('/quotes', {
        ...data,
        tender_id: tenderId,
        price: Number(data.price),
        purchase_type: 'monthly',
      });
      qc.invalidateQueries({ queryKey: ['tender-quotes', tenderId] });
      onSuccess();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'שגיאה בהגשת ההצעה');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">מחיר / עמלה (₪) *</label>
        <input
          {...register('price', { required: 'שדה חובה', min: { value: 1, message: 'חייב להיות חיובי' } })}
          type="number"
          className="input-field"
          placeholder="50,000"
          dir="ltr"
        />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
      </div>

      <div>
        <label className="label">הסבר על המחיר (לא חובה)</label>
        <input {...register('price_notes')} className="input-field" placeholder="כולל שרותי ליווי מלא / עמלה מהרווח..." />
      </div>

      <div>
        <label className="label">תיאור ההצעה שלך *</label>
        <textarea
          {...register('description', { required: 'שדה חובה', minLength: { value: 20, message: 'לפחות 20 תווים' } })}
          className="input-field min-h-[120px] resize-none"
          placeholder="ספר על הניסיון שלך, על הפרויקטים הדומים שביצעת, ולמה כדאי למשקיע לעבוד איתך..."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>}

      <button type="submit" disabled={isLoading} className="btn-primary w-full">
        {isLoading ? 'שולח...' : 'הגש הצעה'}
      </button>
    </form>
  );
}
