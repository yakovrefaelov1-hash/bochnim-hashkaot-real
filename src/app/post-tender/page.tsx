'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { apiPost } from '@/lib/api';
import {
  InvestmentType,
  TenderFormData,
} from '@/types';
import {
  INVESTMENT_TYPE_LABELS,
  INVESTMENT_TYPE_ICONS,
  INVESTMENT_TYPE_DESCRIPTIONS,
  ISRAELI_CITIES,
  WORLD_COUNTRIES,
} from '@/lib/constants';

const STEPS = ['תחום השקעה', 'מיקום והון', 'פירוט ההשקעה', 'פרטי קשר'];

export default function PostTenderPage() {
  const [step, setStep] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<InvestmentType[]>([]);
  const [isAbroad, setIsAbroad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<{ id: string; tracking_url: string } | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<TenderFormData>();

  const toggleType = (type: InvestmentType) => {
    if (type === 'real_estate_abroad') {
      setIsAbroad(!isAbroad);
      if (isAbroad) {
        setSelectedTypes(prev => prev.filter(t => t !== 'real_estate_abroad'));
      } else {
        setSelectedTypes(prev => [...prev.filter(t => t !== 'real_estate_abroad'), type]);
      }
      return;
    }
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setIsAbroad(false);
  };

  const canNext = () => {
    if (step === 1) return selectedTypes.length > 0;
    if (step === 2) return true;
    if (step === 3) return true;
    return true;
  };

  const onSubmit = async (data: TenderFormData) => {
    if (selectedTypes.length === 0) {
      setError('יש לבחור לפחות תחום השקעה אחד');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await apiPost<{ id: string; tracking_url: string }>('/tenders', {
        ...data,
        investment_types: selectedTypes,
        contact_email: data.contact_email || undefined,
      });
      setSuccess(result);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'שגיאה בפרסום המכרז. נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (success) {
    return <SuccessScreen trackingUrl={success.tracking_url} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Step indicator */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-800 mb-6 text-center">פרסם מכרז בחינם</h1>
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((label, i) => {
              const num = i + 1;
              const done = step > num;
              const active = step === num;
              return (
                <div key={num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`step-indicator ${done ? 'step-done' : active ? 'step-active' : 'step-inactive'}`}>
                      {done ? '✓' : num}
                    </div>
                    <span className={`text-xs mt-1 font-medium ${active ? 'text-primary-700' : 'text-slate-400'}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 mb-5 ${step > num ? 'bg-success' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card p-6 md:p-8">
            {/* Step 1 — Investment Types */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 mb-2">באיזה תחום אתה מחפש?</h2>
                <p className="text-slate-500 text-sm mb-6">בחר אחד או יותר</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(INVESTMENT_TYPE_LABELS) as InvestmentType[]).map(type => {
                    const active = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        className={active ? 'invest-card-active' : 'invest-card-inactive'}
                      >
                        <div className="flex items-center gap-3 w-full text-right">
                          <span className="text-3xl">{INVESTMENT_TYPE_ICONS[type]}</span>
                          <div className="flex-1">
                            <div className={`font-semibold text-sm ${active ? 'text-primary-700' : 'text-slate-700'}`}>
                              {INVESTMENT_TYPE_LABELS[type]}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {INVESTMENT_TYPE_DESCRIPTIONS[type]}
                            </div>
                          </div>
                          {active && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedTypes.length === 0 && (
                  <p className="text-sm text-red-500 mt-3">יש לבחור לפחות תחום אחד</p>
                )}
              </div>
            )}

            {/* Step 2 — Location + Equity */}
            {step === 2 && (
              <div className="animate-fade-in space-y-5">
                <h2 className="text-xl font-bold text-slate-800 mb-2">מיקום והון עצמי</h2>

                {isAbroad ? (
                  <div>
                    <label className="label">מדינה מבוקשת</label>
                    <select
                      {...register('location_country')}
                      className="input-field"
                    >
                      <option value="">בחר מדינה</option>
                      {WORLD_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="label">עיר מבוקשת (לא חובה)</label>
                    <select {...register('location_city')} className="input-field">
                      <option value="">כל הארץ</option>
                      {ISRAELI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="label">הון עצמי קיים *</label>
                  <input
                    {...register('equity_available', { required: 'שדה חובה' })}
                    className="input-field"
                    placeholder="לדוגמה: 800,000 ₪ או 1.5 מיליון"
                  />
                  {errors.equity_available && (
                    <p className="text-red-500 text-xs mt-1">{errors.equity_available.message}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    ניתן לכתוב בצורה חופשית — מה שמרגיש נכון לך
                  </p>
                </div>
              </div>
            )}

            {/* Step 3 — Description */}
            {step === 3 && (
              <div className="animate-fade-in space-y-5">
                <h2 className="text-xl font-bold text-slate-800 mb-2">ספר על ההשקעה שאתה מחפש</h2>
                <p className="text-slate-500 text-sm">ככל שתפרט יותר, כך ההצעות שתקבל יהיו ממוקדות יותר</p>

                <div>
                  <label className="label">תיאור סוג ומטרת ההשקעה *</label>
                  <textarea
                    {...register('investment_description', {
                      required: 'שדה חובה',
                      minLength: { value: 10, message: 'לפחות 10 תווים' },
                    })}
                    className="input-field min-h-[140px] resize-none"
                    placeholder="לדוגמה: מחפש השקעה בפרסייל דירה 3-4 חדרים באזור גוש דן. מטרה: תשואה של 20%+ תוך 3 שנים. מוכן לשותפות עם יזמים מנוסים..."
                  />
                  {errors.investment_description && (
                    <p className="text-red-500 text-xs mt-1">{errors.investment_description.message}</p>
                  )}
                </div>

                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                  <strong>💡 טיפ:</strong> ציין את אופק הזמן שלך, את רמת הסיכון שאתה מוכן לקחת ואת מה שהכי חשוב לך בעסקה.
                </div>
              </div>
            )}

            {/* Step 4 — Contact */}
            {step === 4 && (
              <div className="animate-fade-in space-y-5">
                <h2 className="text-xl font-bold text-slate-800 mb-2">פרטי קשר</h2>
                <p className="text-slate-500 text-sm">הספקים יצרו איתך קשר ישירות</p>

                <div>
                  <label className="label">שם מלא *</label>
                  <input
                    {...register('contact_name', { required: 'שדה חובה', minLength: { value: 2, message: 'שם חייב להכיל לפחות 2 תווים' } })}
                    className="input-field"
                    placeholder="ישראל ישראלי"
                  />
                  {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name.message}</p>}
                </div>

                <div>
                  <label className="label">טלפון *</label>
                  <input
                    {...register('contact_phone', { required: 'שדה חובה', minLength: { value: 9, message: 'מספר לא תקין' } })}
                    className="input-field"
                    placeholder="050-0000000"
                    type="tel"
                    dir="ltr"
                  />
                  {errors.contact_phone && <p className="text-red-500 text-xs mt-1">{errors.contact_phone.message}</p>}
                </div>

                <div>
                  <label className="label">אימייל (לא חובה)</label>
                  <input
                    {...register('contact_email')}
                    className="input-field"
                    placeholder="email@example.com"
                    type="email"
                    dir="ltr"
                  />
                  <p className="text-xs text-slate-400 mt-1">אם תמלא אימייל, נשלח לך אישור ועדכונים</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500">
                  בלחיצה על "פרסם מכרז" אתה מאשר שקראת את תנאי השימוש. הפרסום חינמי לחלוטין ואינו מחייב הרשמה.
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} className="btn-outline px-6 py-2.5 text-sm rounded-xl">
                  ← חזור
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => canNext() && setStep(s => s + 1)}
                  disabled={!canNext()}
                  className="btn-primary px-8 py-2.5 text-sm rounded-xl"
                >
                  הבא →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gold px-8 py-2.5 text-sm rounded-xl flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      מפרסם...
                    </>
                  ) : '🚀 פרסם מכרז חינמית'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SuccessScreen({ trackingUrl }: { trackingUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center animate-scale-in">
        <div className="card p-8 md:p-12">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-3">המכרז פורסם בהצלחה!</h1>
          <p className="text-slate-500 mb-6">
            שלחנו התראה לספקים רלוונטיים. צפה להצעות בקרוב!
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-right">
            <div className="text-xs text-slate-500 mb-2 font-medium">🔗 לינק מעקב אישי</div>
            <div className="text-sm text-primary-700 font-mono break-all mb-3 leading-relaxed">
              {trackingUrl}
            </div>
            <button
              onClick={copy}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                copied ? 'bg-green-100 text-green-700' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              }`}
            >
              {copied ? '✓ הועתק!' : 'העתק לינק'}
            </button>
          </div>

          <p className="text-xs text-slate-400">
            שמור את הלינק — בעזרתו תוכל לעקוב אחרי מספר ההצעות שקיבלת בכל עת, גם ללא הרשמה.
          </p>

          <div className="flex gap-3 mt-6">
            <a href="/" className="flex-1 btn-outline text-sm py-2.5 rounded-xl text-center">
              חזור לדף הבית
            </a>
            <a href="/auth/register" className="flex-1 btn-primary text-sm py-2.5 rounded-xl text-center">
              הירשם לעדכונים
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
