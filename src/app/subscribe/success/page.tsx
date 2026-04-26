'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function SubscribeSuccessPage() {
  const qc = useQueryClient();

  useEffect(() => {
    // רענן נתוני דשבורד אחרי תשלום
    qc.invalidateQueries({ queryKey: ['provider-dashboard'] });
    qc.invalidateQueries({ queryKey: ['subscription-status'] });
  }, [qc]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-scale-in">
        <div className="card p-8 md:p-10">
          <div className="text-5xl mb-4 animate-bounce">✅</div>
          <h1 className="text-2xl font-bold text-primary-800 mb-3">התשלום אושר!</h1>
          <p className="text-slate-500 mb-6">
            תודה! הגישה שלך הופעלה. כעת תוכל לגשת למכרזים ולהגיש הצעות.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/tenders" className="btn-primary py-3 rounded-xl text-center">
              📋 עיין במכרזים פעילים
            </Link>
            <Link href="/dashboard/provider" className="btn-outline py-3 rounded-xl text-center">
              כנס לדשבורד
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
