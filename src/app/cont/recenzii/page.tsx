'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import { Send, Copy, CheckCircle2, Star, Lock } from 'lucide-react';
import type { Business, Review } from '@/types';

export default function RecenziiPage() {
  const [biz, setBiz] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState('');
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: bizData } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
      if (bizData) {
        setBiz(bizData);
        const { data } = await supabase
          .from('reviews')
          .select('*')
          .eq('business_id', bizData.id)
          .order('created_at', { ascending: false });
        setReviews(data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  const canReply = biz?.plan === 'plus' || biz?.plan === 'pro' || biz?.plan === 'elite';

  const handleReply = async (reviewId: string) => {
    const reply = replyText[reviewId];
    if (!reply?.trim()) return;
    setReplyingId(reviewId);
    const res = await fetch(`/api/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    });
    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) => r.id === reviewId ? { ...r, owner_reply: reply } : r)
      );
      setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
    }
    setReplyingId(null);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || !biz) return;
    setInviteLoading(true);
    const res = await fetch('/api/reviews/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: biz.id, email: inviteEmail }),
    });
    if (res.ok) {
      setInviteSent(true);
      setInviteEmail('');
    }
    setInviteLoading(false);
  };

  const copyInviteLink = async (token: string) => {
    const url = `${window.location.origin}/recenzie/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(''), 2000);
  };

  if (loading) return <PageLoader text="Se încarcă recenziile..." />;

  const approved = reviews.filter((r) => r.status === 'approved');
  const pending  = reviews.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recenzii</h1>
        <p className="text-gray-500 text-sm mt-1">
          {approved.length} aprobate · {pending.length} în așteptare
        </p>
      </div>

      {/* Invitație recenzie */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Invită un client să lase recenzie</h2>
        {inviteSent ? (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-xl text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Invitație trimisă cu succes!
            <button onClick={() => setInviteSent(false)} className="ml-auto text-green-600 hover:underline text-xs">Trimite alta</button>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@client.ro"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button size="sm" onClick={handleSendInvite} loading={inviteLoading} disabled={!inviteEmail}>
              <Send className="h-4 w-4" />
              Trimite
            </Button>
          </div>
        )}
      </div>

      {/* Lista recenzii */}
      {reviews.length === 0 ? (
        <div className="card p-8 text-center">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nicio recenzie încă.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{review.reviewer_name}</span>
                    <Badge
                      variant={review.type === 'invited' ? 'invited' : 'independent'}
                      size="sm"
                    >
                      {review.type === 'invited' ? 'Invitată' : 'Independentă'}
                    </Badge>
                    <Badge
                      variant={review.status === 'approved' ? 'verified' : 'default'}
                      size="sm"
                    >
                      {review.status === 'approved' ? 'Aprobată' : review.status === 'pending' ? 'În așteptare' : 'Respinsă'}
                    </Badge>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-xs text-gray-400 mt-1">{formatDate(review.created_at)}</p>
                </div>

                {review.invite_token && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyInviteLink(review.invite_token!)}
                  >
                    {copiedToken === review.invite_token ? (
                      <><CheckCircle2 className="h-4 w-4 text-green-500" /> Copiat!</>
                    ) : (
                      <><Copy className="h-4 w-4" /> Copiază link</>
                    )}
                  </Button>
                )}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>

              {/* Răspuns existent */}
              {review.owner_reply && (
                <div className="mt-3 bg-brand-50 rounded-xl p-3 border-l-4 border-brand-300">
                  <p className="text-xs font-semibold text-brand-700 mb-1">Răspunsul tău:</p>
                  <p className="text-sm text-gray-700">{review.owner_reply}</p>
                </div>
              )}

              {/* Formular răspuns */}
              {canReply && !review.owner_reply && review.status === 'approved' && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={replyText[review.id] ?? ''}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [review.id]: e.target.value }))}
                    placeholder="Scrie un răspuns public..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleReply(review.id)}
                    loading={replyingId === review.id}
                    disabled={!replyText[review.id]?.trim()}
                  >
                    Trimite răspuns
                  </Button>
                </div>
              )}

              {!canReply && review.status === 'approved' && !review.owner_reply && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="h-3.5 w-3.5" />
                  Răspunsul la recenzii este disponibil din planul Plus.{' '}
                  <a href="/cont/abonament" className="text-brand-700 underline">Upgradează</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
