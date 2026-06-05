'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const schema = z.object({
  reviewer_name: z.string().min(2, 'Minim 2 caractere'),
  rating:        z.number().min(1, 'Selectează un rating').max(5),
  comment:       z.string().min(20, 'Minim 20 caractere'),
});

type FormData = z.infer<typeof schema>;

export default function ReviewTokenPage() {
  const params = useParams();
  const token = params.token as string;
  const supabase = createClient();

  const [biz, setBiz] = useState<any>(null);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });
  const rating = watch('rating');

  useEffect(() => {
    (async () => {
      const { data: review } = await supabase
        .from('reviews')
        .select('*, business:businesses(name, city, county)')
        .eq('invite_token', token)
        .single();

      if (review) {
        setBiz(review.business);
        if (review.comment && review.rating > 0) {
          setExistingReview(review);
        }
      }
      setLoading(false);
    })();
  }, [token]);

  const onSubmit = async (data: FormData) => {
    setError('');
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        business_id: biz.id ?? '',
        type: 'invited',
        invite_token: token,
        reviewer_email: 'invited@zonaro.ro',
      }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const body = await res.json();
      setError(body.error ?? 'Eroare la trimiterea recenziei.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!biz) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
        <h2 className="font-semibold text-gray-900">Link invalid sau expirat</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-bold text-brand-700">{biz.name?.[0]}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recenzie pentru {biz.name}</h1>
          <p className="text-gray-500 text-sm">{biz.city}, {biz.county}</p>
        </div>

        {existingReview ? (
          <div className="card p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h2 className="font-semibold text-gray-900 mb-2">Ai lăsat deja o recenzie</h2>
            <p className="text-gray-500 text-sm">Mulțumim pentru feedback!</p>
          </div>
        ) : submitted ? (
          <div className="card p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mulțumim!</h2>
            <p className="text-gray-500 text-sm">
              Recenzia ta a fost trimisă și va fi publicată după verificare.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="card p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <StarRating
                rating={rating}
                interactive
                size="lg"
                onChange={(v) => setValue('rating', v)}
              />
              {errors.rating && <p className="text-xs text-red-600 mt-1">{errors.rating.message}</p>}
            </div>

            <Input
              {...register('reviewer_name')}
              label="Numele tău"
              placeholder="Ion Popescu"
              error={errors.reviewer_name?.message}
              required
            />

            <Textarea
              {...register('comment')}
              label="Recenzia ta"
              placeholder="Cum a decurs experiența cu această firmă?"
              rows={5}
              error={errors.comment?.message}
              required
            />

            {error && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-xl text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
              Trimite recenzia
            </Button>

            <p className="text-xs text-gray-400 text-center">
              Recenzia ta va fi verificată înainte de publicare.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
