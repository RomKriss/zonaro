import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';

async function getPendingReviews() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('reviews')
    .select('*, business:businesses(name, city)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function AdminRecenziiPage() {
  const reviews = await getPendingReviews();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Moderare Recenzii</h1>
        <p className="text-gray-500 text-sm mt-1">{reviews.length} recenzii în așteptare</p>
      </div>

      {reviews.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">Nicio recenzie de moderat. </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <ReviewModerationCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewModerationCard({ review }: { review: any }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{review.reviewer_name}</span>
            <Badge variant={review.type === 'invited' ? 'invited' : 'default'} size="sm">
              {review.type === 'invited' ? 'Invitată' : 'Independentă'}
            </Badge>
          </div>
          <p className="text-xs text-gray-400">
            {review.business?.name} · {review.business?.city} · {formatDate(review.created_at)}
          </p>
          <StarRating rating={review.rating} size="sm" className="mt-1" />
        </div>

        <ReviewActions reviewId={review.id} />
      </div>

      <p className="mt-3 text-sm text-gray-700 leading-relaxed">{review.comment}</p>

      {review.invoice_number && (
        <p className="mt-2 text-xs text-gray-500">
          Nr. factură: <span className="font-mono">{review.invoice_number}</span>
        </p>
      )}
    </div>
  );
}

function ReviewActions({ reviewId }: { reviewId: string }) {
  return (
    <form action={`/api/admin/reviews/${reviewId}`} method="POST" className="flex gap-2">
      <button
        type="submit"
        name="action"
        value="approve"
        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
      >
        Aprobă
      </button>
      <button
        type="submit"
        name="action"
        value="reject"
        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors"
      >
        Respinge
      </button>
    </form>
  );
}
