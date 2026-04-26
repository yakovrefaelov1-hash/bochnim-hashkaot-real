'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { apiPost } from '@/lib/api';
import { useAuthStore, AuthUser } from '@/store/authStore';

interface LoginForm { email: string; password: string; }
interface LoginResponse { user: AuthUser; tokens: { access: string; refresh: string }; }

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await apiPost<LoginResponse>('/auth/login', data);
      setAuth(result.user, result.tokens);
      router.push(result.user.role === 'provider' ? '/dashboard/provider' : '/dashboard/investor');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'שגיאה בכניסה');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="כניסה לחשבון">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">אימייל</label>
          <input
            {...register('email', { required: 'שדה חובה', pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'אימייל לא תקין' } })}
            type="email"
            className="input-field"
            dir="ltr"
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="label mb-0">סיסמה</label>
            <Link href="/auth/forgot-password" className="text-xs text-primary-600 hover:underline">
              שכחתי סיסמה
            </Link>
          </div>
          <input
            {...register('password', { required: 'שדה חובה' })}
            type="password"
            className="input-field"
            dir="ltr"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">{error}</div>}

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
          {isLoading ? 'מתחבר...' : 'כניסה'}
        </button>

        <p className="text-center text-sm text-slate-500">
          אין לך חשבון?{' '}
          <Link href="/auth/register" className="text-primary-600 font-semibold hover:underline">
            הירשם עכשיו
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// ============================================================
// Re-export for login page
// ============================================================
export { AuthLayout };

function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-800 font-bold text-xl">
            <span className="text-3xl">🏗️</span>
            בוחנים השקעות
          </Link>
          <h1 className="text-xl font-bold text-slate-800 mt-4">{title}</h1>
        </div>
        <div className="card p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
