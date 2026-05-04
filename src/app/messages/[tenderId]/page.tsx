'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, ArrowRight, MessageSquare, Lock } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Message, Tender, Quote } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import Link from 'next/link';

export default function MessagesPage() {
  const { tenderId } = useParams<{ tenderId: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const withUserId = params.get('with');

  // auth guard
  useEffect(() => {
    if (!user) router.push('/auth/login');
  }, [user, router]);

  // load messages
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages', tenderId],
    queryFn: () => apiGet(`/messages/tender/${tenderId}`),
    refetchInterval: 5000,
    enabled: !!user,
  });

  // load tender for context
  const { data: tender } = useQuery<Tender>({
    queryKey: ['tender', tenderId],
    queryFn: () => apiGet(`/tenders/${tenderId}`),
    enabled: !!user,
  });

  // investor: load quotes to get provider info
  const { data: quotes } = useQuery<Quote[]>({
    queryKey: ['tender-quotes', tenderId],
    queryFn: () => apiGet(`/quotes/tender/${tenderId}`),
    enabled: !!user && user.role === 'investor',
  });

  // derive receiver
  const receiverId: string | null = (() => {
    if (withUserId) return withUserId;
    if (user?.role === 'provider' && tender?.investor_id) return tender.investor_id;
    // investor — find accepted provider's user_id
    if (user?.role === 'investor' && quotes) {
      const accepted = quotes.find(q => q.status === 'accepted');
      if (accepted?.provider_profiles?.user_id) return accepted.provider_profiles.user_id;
      // fallback: first quote
      if (quotes[0]?.provider_profiles?.user_id) return quotes[0].provider_profiles.user_id;
    }
    // derive from existing messages
    if (messages.length > 0 && user) {
      const other = messages[0];
      return other.sender_id === user.id ? other.receiver_id : other.sender_id;
    }
    return null;
  })();

  // other party name
  const otherName = (() => {
    if (user?.role === 'provider' && tender) return tender.contact_name ?? 'המשקיע';
    if (user?.role === 'investor' && quotes) {
      const q = withUserId
        ? quotes.find(q => q.provider_profiles?.user_id === withUserId)
        : quotes.find(q => q.status === 'accepted') ?? quotes[0];
      return q?.provider_profiles?.business_name ?? 'הספק';
    }
    return 'בן שיחה';
  })();

  // scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!content.trim() || !receiverId) return;
    setSending(true);
    setError('');
    try {
      await apiPost('/messages', { tender_id: tenderId, receiver_id: receiverId, content: content.trim() });
      setContent('');
      qc.invalidateQueries({ queryKey: ['messages', tenderId] });
    } catch {
      setError('שגיאה בשליחת ההודעה');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-10" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ArrowRight className="w-5 h-5" strokeWidth={1.75} />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1B4F72, #2E86AB)' }}
            >
              {otherName[0]}
            </div>
            <div>
              <div className="font-semibold text-[#0F172A] text-sm">{otherName}</div>
              {tender && (
                <div className="text-xs text-slate-400">
                  {tender.investment_types?.map(t => t).join(', ')} ·{' '}
                  <Link href={`/tenders/${tenderId}`} className="hover:underline text-primary-600">
                    מכרז #{tenderId.slice(0, 6)}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Lock className="w-3 h-3" strokeWidth={1.75} />
            שיחה מאובטחת
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.75} />
          <span>פרטי הקשר של שני הצדדים לא נחשפים. כל התקשורת מתנהלת כאן בלבד.</span>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 min-h-[60vh]">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}
            >
              <MessageSquare className="w-6 h-6" style={{ color: '#1B4F72' }} strokeWidth={1.5} />
            </div>
            <div className="font-semibold text-[#0F172A] mb-1">עדיין אין הודעות</div>
            <div className="text-sm text-slate-400">
              {receiverId ? `שלח הודעה ראשונה ל${otherName}` : 'הצעה מאושרת נדרשת לפתיחת שיחה'}
            </div>
          </div>
        )}

        {messages.map(msg => {
          const isMe = msg.sender_id === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] ${isMe ? 'items-start' : 'items-end'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'text-white rounded-tr-sm'
                      : 'text-[#0F172A] bg-slate-100 rounded-tl-sm'
                  }`}
                  style={isMe ? { background: 'linear-gradient(135deg, #1B4F72, #2E86AB)' } : {}}
                >
                  {msg.content}
                </div>
                <div className="text-xs text-slate-400 px-1">
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: he })}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100" style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          {error && (
            <div className="text-xs text-red-600 mb-2 px-1">{error}</div>
          )}
          {!receiverId && (
            <div className="text-xs text-amber-600 mb-2 px-1 bg-amber-50 border border-amber-200 rounded-lg p-2">
              ⚠️ לא ניתן לשלוח הודעה — אין הצעה מאושרת עדיין
            </div>
          )}
          <div className="flex items-end gap-3">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!receiverId || sending}
              placeholder={receiverId ? `כתוב הודעה ל${otherName}...` : 'ממתין לאישור הצעה...'}
              rows={1}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-400 resize-none transition-all disabled:opacity-50"
              style={{ minHeight: '46px', maxHeight: '120px' }}
            />
            <button
              onClick={send}
              disabled={!content.trim() || !receiverId || sending}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #1B4F72, #2E86AB)' }}
            >
              <Send className="w-4 h-4 text-white" strokeWidth={1.75} />
            </button>
          </div>
          <div className="text-xs text-slate-400 mt-2 text-center">Enter לשליחה · Shift+Enter לשורה חדשה</div>
        </div>
      </div>
    </div>
  );
}
