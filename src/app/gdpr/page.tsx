import { redirect } from 'next/navigation';

// /gdpr redirecționează la pagina de confidențialitate
export default function GdprPage() {
  redirect('/confidentialitate');
}
