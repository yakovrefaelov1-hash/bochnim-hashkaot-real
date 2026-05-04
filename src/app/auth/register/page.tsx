'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { apiPost } from '@/lib/api';
import { useAuthStore, AuthUser } from '@/store/authStore';
import { AuthLayout } from '../_components/AuthLayout';
import { TrendingUp, Building2 } from 'lucide-react';

interface RegisterForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: 'investor' | 'provider';
  city?: string;
}

interface RegisterResponse {
  user: AuthUser;
  tokens: { access: string; refresh: string };
}

function RegisterContent() {
  const params = useSearchParams();
  const defaultRole = (params.get('role') as 'investor' | 'provider') ?? 'investor';
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: { role: defaultRole },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const role = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await apiPost<RegisterResponse>('/auth/register', data);
      setAuth(result.user, result.tokens);
      if (data.role === 'provider') {
        router.push('/dashboard/provider?new=true');
      } else {
        router.push('/dashboard/investor');
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'שגיאה בהרשמה');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="הצטרף לבוחנים השקעות">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">אני...</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'investor', label: 'משקיע', desc: 'מחפש הזדמנויות', Icon: TrendingUp },
              { value: 'provider', label: 'ספק', desc: 'יזם / יועץ / מלווה', Icon: Building2 },
            ].map(opt => (
              <label
                key={opt.value}
                style={{
                  cursor: 'pointer', borderRadius: 'var(--radius-lg)',
                  border: role === opt.value ? '1.5px solid var(--gray-900)' : '0.5px solid var(--gray-100)',
                  padding: 16, textAlign: 'center', transition: 'border-color 0.15s ease',
                  display: 'block',
                }}
              >
                <input
                  type="radio"
                  value={opt.value}
                  {...register('role')}
                  className="sr-only"
                />
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: role === opt.value ? 'var(--gray-900)' : 'var(--gray-500)' }}>
                  <opt.Icon size={20} strokeWidth={1.5} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-900)' }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{opt.desc}</div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label">שם מלא *</label>
          <input
            {...register('full_name', { required: 'שדה חובה', minLength: { value: 2, message: 'לפחות 2 תווים' } })}
            className="input-field"
            placeholder="ישראל ישראלי"
          />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">אימייל *</label>
            <input
              {...register('email', { required: 'שדה חובה', pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'לא תקין' } })}
              type="email"
              className="input-field"
              dir="ltr"
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">טלפון *</label>
            <input
              {...register('phone', { required: 'שדה חובה', minLength: { value: 9, message: 'לא תקין' } })}
              type="tel"
              className="input-field"
              dir="ltr"
              placeholder="050-0000000"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="label">סיסמה *</label>
          <input
            {...register('password', { required: 'שדה חובה', minLength: { value: 8, message: 'לפחות 8 תווים' } })}
            type="password"
            className="input-field"
            dir="ltr"
            placeholder="לפחות 8 תווים"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>}

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
          {isLoading ? 'נרשם...' : `הצטרף כ${role === 'provider' ? 'ספק' : 'משקיע'}`}
        </button>

        <p className="text-center text-sm text-slate-500">
          יש לך כבר חשבון?{' '}
          <Link href="/auth/login" className="text-primary-600 font-semibold hover:underline">
            כניסה
          </Link>
        </p>

        <p className="text-center text-xs text-slate-400">
          בהרשמה אתה מאשר את <Link href="/terms" className="underline">תנאי השימוש</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
