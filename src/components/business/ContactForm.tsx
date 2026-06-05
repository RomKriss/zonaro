'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  sender_name:  z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  sender_email: z.string().email('Email invalid'),
  sender_phone: z.string().optional(),
  message:      z.string().min(10, 'Mesajul trebuie să aibă cel puțin 10 caractere'),
});

type FormData = z.infer<typeof schema>;

interface ContactFormProps {
  businessId: string;
  businessName: string;
}

export function ContactForm({ businessId, businessName }: ContactFormProps) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, business_id: businessId }),
    });
    if (res.ok) {
      setSent(true);
    } else {
      const body = await res.json();
      setError(body.error ?? 'Eroare la trimiterea mesajului. Încearcă din nou.');
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h3 className="font-semibold text-gray-900">Mesaj trimis cu succes!</h3>
        <p className="text-sm text-gray-500">
          {businessName} va răspunde în cel mai scurt timp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('sender_name')}
        label="Numele tău"
        placeholder="Ion Popescu"
        error={errors.sender_name?.message}
        required
      />
      <Input
        {...register('sender_email')}
        label="Email"
        type="email"
        placeholder="ion@email.ro"
        error={errors.sender_email?.message}
        required
      />
      <Input
        {...register('sender_phone')}
        label="Telefon (opțional)"
        type="tel"
        placeholder="07xx xxx xxx"
        error={errors.sender_phone?.message}
      />
      <Textarea
        {...register('message')}
        label="Mesajul tău"
        placeholder="Descrie serviciul de care ai nevoie..."
        rows={4}
        error={errors.message?.message}
        required
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <Button type="submit" loading={isSubmitting} fullWidth size="lg">
        <Send className="h-4 w-4" />
        Trimite Mesajul
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Datele tale sunt protejate conform{' '}
        <Link href="/confidentialitate" className="underline hover:text-gray-500">
          GDPR
        </Link>
        . Nu le vom vinde sau distribui.
      </p>
    </form>
  );
}
