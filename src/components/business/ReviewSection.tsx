'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating, RatingDisplay } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, MessageSquare, Star } from 'lucide-react';
import type { Review } from '@/types';

const schema = z.object({
  reviewer_name:  z.string().min(2, 'Minim 2 caractere'),
  reviewer_email: z.string().email('Email invalid'),
  rating:         z.number().min(1, 'Selectează un rating').max(5),
  comment:        z.string().min(20, 'Minim 20 de caractere'),
  invoice_number: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ReviewSectionProps {
  businessId: string;
  reviews: Review[];
  canReply?: boolean;
}

function ReviewCard({ review, canReply, businessId }: { review: Review; canReply?: boolean; businessId: string }) {
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [localReply, setLocalReply] = useState(review.owner_reply);

  const submitReply = async () => {
    setReplying(true);
    const res = await fetch(`/api/reviews/${review.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: replyText }),
    });
    if (res.ok) {
      setLocalReply(replyText);
      setShowReplyForm(false);
    }
    setReplying(false);
  };

  return (
    <div className="border-b border-gray-100 last:border-0 py-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm flex-shrink-0">
            {review.reviewer_name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{review.reviewer_name}</p>
            <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StarRating rating={review.rating} size="sm" />
          {review.type === 'invited' && <Badge variant="invited" size="sm">Invitată</Badge>}
          {review.type === 'independent' && <Badge variant="independent" size="sm">Verificată</Badge>}
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed pl-11">{review.comment}</p>

      {/* Răspuns firmă */}
      {localReply && (
        <div className="ml-11 mt-3 bg-brand-50 rounded-xl p-3 border-l-4 border-brand-300">
          <p className="text-xs font-semibold text-brand-700 mb-1">Răspuns din partea firmei:</p>
          <p className="text-sm text-gray-700">{localReply}</p>
        </div>
      )}

      {/* Buton răspuns (doar proprietar, plan Basic+) */}
      {canReply && !localReply && (
        <div className="ml-11 mt-3">
          {!showReplyForm ? (
            <button
              onClick={() => setShowReplyForm(true)}
              className="text-xs text-brand-700 font-medium hover:underline flex items-center gap-1"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Răspunde
            </button>
          ) : (
            <div className="space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Scrie răspunsul tău..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={submitReply} loading={replying}>Trimite</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowReplyForm(false)}>Anulează</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ReviewSection({ businessId, reviews, canReply }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });

  const rating = watch('rating');

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, business_id: businessId, type: 'independent' }),
    });
    if (res.ok) setSubmitted(true);
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <section>
      {/* Sumar rating */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
            <StarRating rating={avgRating} size="sm" className="justify-center mt-1" />
            <p className="text-xs text-gray-500 mt-1">{reviews.length} recenzii</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{star}</span>
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-4">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista recenzii */}
      {reviews.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} canReply={canReply} businessId={businessId} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm py-4">Nicio recenzie încă. Fii primul!</p>
      )}

      {/* Formular recenzie nouă */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        {!showForm && !submitted && (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            <Star className="h-4 w-4" />
            Lasă o recenzie
          </Button>
        )}

        {submitted && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl text-sm">
            <CheckCircle2 className="h-5 w-5" />
            Recenzia ta a fost trimisă și va fi publicată după verificare. Mulțumim!
          </div>
        )}

        {showForm && !submitted && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h4 className="font-semibold text-gray-900">Scrie o recenzie</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
              <StarRating
                rating={rating}
                interactive
                size="lg"
                onChange={(v) => setValue('rating', v)}
              />
              {errors.rating && <p className="text-xs text-red-600 mt-1">{errors.rating.message}</p>}
            </div>

            <Input {...register('reviewer_name')} label="Numele tău" placeholder="Ion Popescu" error={errors.reviewer_name?.message} required />
            <Input {...register('reviewer_email')} label="Email" type="email" placeholder="ion@email.ro" error={errors.reviewer_email?.message} required hint="Nu va fi afișat public" />
            <Input {...register('invoice_number')} label="Număr factură (opțional)" placeholder="Seria și numărul facturii" />
            <Textarea {...register('comment')} label="Recenzia ta" placeholder="Descrie experiența ta cu această firmă..." rows={4} error={errors.comment?.message} required />

            <div className="flex gap-3">
              <Button type="submit" loading={isSubmitting}>Trimite recenzia</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Anulează</Button>
            </div>

            <p className="text-xs text-gray-400">
              Recenzia ta va fi verificată înainte de publicare.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
