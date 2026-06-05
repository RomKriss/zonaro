'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Upload, Trash2, Star, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { getPlanConfig } from '@/lib/utils';
import type { Business, Photo } from '@/types';

export default function PozePage() {
  const [biz, setBiz] = useState<Business | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: bizData } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
      if (bizData) {
        setBiz(bizData);
        const { data: photoData } = await supabase
          .from('photos')
          .select('*')
          .eq('business_id', bizData.id)
          .order('order_index');
        setPhotos(photoData ?? []);
      }
      setLoading(false);
    })();
  }, []);

  const plan = biz ? getPlanConfig(biz.plan) : null;
  const maxPhotos = plan?.limits.photos ?? 1;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !biz) return;

    if (photos.length >= maxPhotos) {
      setError(`Ai atins limita de ${maxPhotos} poze pentru planul tău.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Poza trebuie să fie mai mică de 5 MB.');
      return;
    }

    setUploading(true);
    setError('');

    const ext = file.name.split('.').pop();
    const fileName = `${biz.id}/${Date.now()}.${ext}`;

    const { error: uploadError, data } = await supabase.storage
      .from('business-photos')
      .upload(fileName, file, { upsert: false });

    if (uploadError) {
      setError('Eroare la încărcare. Încearcă din nou.');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('business-photos').getPublicUrl(fileName);

    const { data: photoData, error: dbError } = await supabase
      .from('photos')
      .insert({
        business_id: biz.id,
        url: urlData.publicUrl,
        is_primary: photos.length === 0,
        order_index: photos.length,
      })
      .select()
      .single();

    if (!dbError && photoData) {
      setPhotos((prev) => [...prev, photoData]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm('Ești sigur că vrei să ștergi această poză?')) return;

    const path = new URL(photo.url).pathname.split('/business-photos/')[1];
    await supabase.storage.from('business-photos').remove([path]);
    await supabase.from('photos').delete().eq('id', photo.id);

    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));

    // Dacă era primară, setează prima din liste
    if (photo.is_primary && photos.length > 1) {
      const next = photos.find((p) => p.id !== photo.id);
      if (next) {
        await supabase.from('photos').update({ is_primary: true }).eq('id', next.id);
        setPhotos((prev) => prev.map((p) => ({ ...p, is_primary: p.id === next.id })));
      }
    }
  };

  const handleSetPrimary = async (photo: Photo) => {
    await supabase.from('photos').update({ is_primary: false }).eq('business_id', biz!.id);
    await supabase.from('photos').update({ is_primary: true }).eq('id', photo.id);
    setPhotos((prev) => prev.map((p) => ({ ...p, is_primary: p.id === photo.id })));
  };

  if (loading) return <PageLoader text="Se încarcă pozele..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestionare Poze</h1>
        <p className="text-gray-500 text-sm mt-1">
          {photos.length}/{maxPhotos} poze — Plan {plan?.name}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Upload */}
      {photos.length < maxPhotos && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-gray-300 hover:border-brand-400 rounded-2xl p-8 text-center transition-colors group"
          >
            <Upload className="h-10 w-10 text-gray-400 group-hover:text-brand-500 mx-auto mb-3 transition-colors" />
            <p className="font-medium text-gray-700">
              {uploading ? 'Se încarcă...' : 'Apasă pentru a adăuga o poză'}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — max. 5 MB</p>
          </button>
        </div>
      )}

      {/* Grid poze */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
              <Image
                src={photo.url}
                alt="Poza firmă"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />

              {/* Overlay acțiuni */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleSetPrimary(photo)}
                  title="Setează ca primară"
                  className="p-2 bg-white/90 rounded-lg hover:bg-white text-amber-600"
                >
                  <Star className={`h-4 w-4 ${photo.is_primary ? 'fill-amber-400' : ''}`} />
                </button>
                <button
                  onClick={() => handleDelete(photo)}
                  title="Șterge"
                  className="p-2 bg-white/90 rounded-lg hover:bg-white text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {photo.is_primary && (
                <div className="absolute top-2 left-2">
                  <span className="bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    Principală
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nicio poză încă. Adaugă prima poză a firmei tale!</p>
        </div>
      )}

      {photos.length >= maxPhotos && biz?.plan !== 'pro' && biz?.plan !== 'elite' && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm text-brand-800">
          Ai atins limita de poze pentru planul tău.{' '}
          <a href="/cont/abonament" className="font-semibold underline">Upgradează</a>
          {' '}pentru mai multe poze.
        </div>
      )}
    </div>
  );
}
