import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY!);
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@zonaro.ro';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zonaro.ro';
