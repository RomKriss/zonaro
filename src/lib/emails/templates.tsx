// Template-uri email pentru Resend
// Returnează HTML string pentru fiecare tip de email

export function emailWelcome(businessName: string, loginUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><title>Bine ai venit pe ZonaRo</title></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#1e40af;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;">ZonaRo</h1>
      <p style="color:#93c5fd;margin:8px 0 0;font-size:14px;">Directorul Firmelor din România</p>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#1e293b;margin:0 0 16px;">Bine ai venit, ${businessName}!</h2>
      <p style="color:#475569;line-height:1.6;">Contul tău pe ZonaRo a fost creat cu succes. Acum poți să îți completezi profilul și să începi să primești clienți noi.</p>
      <a href="${loginUrl}" style="display:inline-block;margin-top:24px;padding:14px 28px;background:#1e40af;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Accesează Dashboard-ul
      </a>
      <p style="color:#94a3b8;font-size:12px;margin-top:32px;">Dacă nu ai creat tu acest cont, poți ignora acest email.</p>
    </div>
  </div>
</body>
</html>`;
}

export function emailClaimCode(code: string, businessName: string, claimUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><title>Revendică profilul firmei tale</title></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#1e40af;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;">ZonaRo</h1>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#1e293b;margin:0 0 16px;">Revendică profilul „${businessName}"</h2>
      <p style="color:#475569;line-height:1.6;">Ai solicitat revendicarea profilului firmei tale pe ZonaRo. Folosește codul de mai jos pentru a verifica identitatea ta:</p>
      <div style="margin:32px 0;text-align:center;">
        <div style="display:inline-block;background:#f1f5f9;border-radius:12px;padding:20px 40px;">
          <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#1e40af;">${code}</span>
        </div>
        <p style="color:#64748b;font-size:13px;margin-top:12px;">Codul este valabil 30 de minute</p>
      </div>
      <a href="${claimUrl}" style="display:inline-block;padding:14px 28px;background:#f97316;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Revendică Profilul Acum
      </a>
    </div>
  </div>
</body>
</html>`;
}

export function emailReviewInvite(
  businessName: string,
  reviewUrl: string,
  clientName?: string
): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><title>Lasă o recenzie pentru ${businessName}</title></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#1e40af;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;">ZonaRo</h1>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#1e293b;margin:0 0 16px;">Cum a decurs experiența cu ${businessName}?</h2>
      <p style="color:#475569;line-height:1.6;">
        ${clientName ? `Dragă ${clientName},` : ''}
        Ai beneficiat recent de serviciile firmei <strong>${businessName}</strong>.
        Ne-ar plăcea să știm cum a decurs experiența ta — recenzia ta ajută alți clienți să facă alegeri informate.
      </p>
      <a href="${reviewUrl}" style="display:inline-block;margin-top:24px;padding:14px 28px;background:#f97316;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        ⭐ Lasă o Recenzie
      </a>
      <p style="color:#94a3b8;font-size:12px;margin-top:32px;">Recenzia ta este voluntară și nu îți va afecta relația cu firma.</p>
    </div>
  </div>
</body>
</html>`;
}

export function emailContactMessage(
  businessName: string,
  senderName: string,
  senderEmail: string,
  message: string,
  dashboardUrl: string
): string {
  return `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><title>Mesaj nou de la ${senderName}</title></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#1e40af;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;">ZonaRo</h1>
      <p style="color:#93c5fd;margin:4px 0 0;font-size:14px;">Mesaj nou prin formular de contact</p>
    </div>
    <div style="padding:40px;">
      <p style="color:#475569;margin:0 0 24px;">Ai primit un mesaj nou pe ZonaRo pentru <strong>${businessName}</strong>:</p>
      <div style="background:#f8fafc;border-left:4px solid #1e40af;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
        <p style="margin:0 0 8px;color:#1e293b;font-weight:600;">De la: ${senderName}</p>
        <p style="margin:0 0 8px;color:#64748b;font-size:14px;">${senderEmail}</p>
        <p style="margin:16px 0 0;color:#334155;line-height:1.6;">${message}</p>
      </div>
      <a href="${dashboardUrl}" style="display:inline-block;padding:14px 28px;background:#1e40af;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Răspunde din Dashboard
      </a>
    </div>
  </div>
</body>
</html>`;
}

export function emailNewReview(
  businessName: string,
  reviewerName: string,
  rating: number,
  comment: string,
  dashboardUrl: string
): string {
  const stars = '⭐'.repeat(rating);
  return `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><title>Recenzie nouă pentru ${businessName}</title></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#1e40af;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;">ZonaRo</h1>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#1e293b;margin:0 0 16px;">Recenzie nouă!</h2>
      <p style="color:#475569;">${reviewerName} a lăsat o recenzie pentru <strong>${businessName}</strong>:</p>
      <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:20px 0;">
        <p style="font-size:24px;margin:0 0 8px;">${stars}</p>
        <p style="color:#334155;line-height:1.6;margin:0;">${comment}</p>
      </div>
      <a href="${dashboardUrl}/recenzii" style="display:inline-block;padding:14px 28px;background:#1e40af;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
        Răspunde la Recenzie
      </a>
    </div>
  </div>
</body>
</html>`;
}
