'use client';

import Link from 'next/link';
import { PastDeal } from '@/types';
import { INVESTMENT_TYPE_LABELS, INVESTMENT_TYPE_ICONS, CATEGORY_LABELS } from '@/lib/constants';

interface PastDealCardProps {
  deal: PastDeal;
  animationDelay?: number;
}

export function PastDealCard({ deal, animationDelay = 0 }: PastDealCardProps) {
  const returnColor =
    deal.return_percentage >= 30
      ? 'bg-green-500'
      : deal.return_percentage >= 15
      ? 'bg-emerald-500'
      : 'bg-teal-500';

  return (
    <div
      className="card-hover animate-slide-up"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Top color strip */}
      <div className={`h-1.5 ${returnColor}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span>{INVESTMENT_TYPE_ICONS[deal.deal_type]}</span>
              <span className="text-xs font-medium text-slate-500">
                {INVESTMENT_TYPE_LABELS[deal.deal_type]}
              </span>
              {deal.is_verified && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  ✓ מאומת
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
              {deal.title}
            </h3>
          </div>

          {/* Return badge */}
          <div className={`${returnColor} text-white rounded-xl px-3 py-1.5 text-center mr-3 flex-shrink-0`}>
            <div className="text-xl font-black leading-none">
              {deal.return_percentage % 1 === 0
                ? deal.return_percentage
                : deal.return_percentage.toFixed(1)}%
            </div>
            <div className="text-xs opacity-80">תשואה</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400">מיקום</div>
            <div className="text-xs font-semibold text-slate-700 truncate">{deal.location}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400">שנה</div>
            <div className="text-xs font-semibold text-slate-700">{deal.year}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <div className="text-xs text-slate-400">משך</div>
            <div className="text-xs font-semibold text-slate-700">{deal.duration_months} חודש</div>
          </div>
        </div>

        {/* Investment amount */}
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-slate-500">סכום השקעה:</span>
          <span className="font-bold text-primary-700">
            {deal.investment_amount.toLocaleString('he-IL')} ₪
          </span>
        </div>

        {/* Provider */}
        {deal.provider_profiles && (
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                {deal.provider_profiles.business_name[0]}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700">
                  {deal.provider_profiles.business_name}
                </div>
                <div className="text-xs text-slate-400">
                  {deal.provider_profiles.category
                    ? CATEGORY_LABELS[deal.provider_profiles.category]
                    : ''}
                </div>
              </div>
            </div>
            <Link
              href={`/providers/${deal.provider_profiles.id}`}
              className="text-xs text-primary-600 font-semibold hover:underline"
            >
              פרופיל →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
