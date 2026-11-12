import { env, isProd } from "./env.js";

type Mail = { to: string; subject: string; html: string; text: string };

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendMail(mail: Mail): Promise<void> {
  const { RESEND_API_KEY, EMAIL_FROM } = env();
  if (!RESEND_API_KEY) {
    if (isProd()) throw new Error("RESEND_API_KEY belum diset di production");
    console.log(`\n[email:dev] to=${mail.to}\nsubject=${mail.subject}\n${mail.text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: EMAIL_FROM, to: [mail.to], subject: mail.subject, html: mail.html, text: mail.text }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend gagal (${res.status})`);
}

function layout(title: string, intro: string, cta: string, url: string, outro: string) {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#1f2933">
<h2 style="margin:0 0 12px">${esc(title)}</h2><p style="line-height:1.5">${esc(intro)}</p>
<p style="margin:24px 0"><a href="${esc(url)}" style="background:#1E3A5F;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">${esc(cta)}</a></p>
<p style="font-size:12px;color:#67707B;line-height:1.5">${esc(outro)}<br/>Atau salin tautan ini: ${esc(url)}</p></div>`;
}

export function resetLink(token: string) {
  return `${env().APP_URL}/?reset=${encodeURIComponent(token)}`;
}

export async function sendResetPasswordEmail(to: string, token: string) {
  const url = resetLink(token);
  await sendMail({
    to,
    subject: "Reset password PayHub",
    html: layout("Reset password", "Kami menerima permintaan reset password untuk akun PayHub kamu. Tautan berlaku 1 jam.", "Buat password baru", url, "Kalau bukan kamu yang meminta, abaikan email ini. Password kamu tidak berubah."),
    text: `Reset password PayHub (berlaku 1 jam):\n${url}\n\nAbaikan jika bukan kamu yang meminta.`,
  });
}

export async function sendInviteEmail(to: string, name: string, token: string, invitedBy: string) {
  const url = resetLink(token);
  await sendMail({
    to,
    subject: "Undangan akun PayHub",
    html: layout(`Halo ${name}`, `${invitedBy} mengundang kamu ke PayHub. Buat password untuk mengaktifkan akun. Tautan berlaku 1 jam; kalau kedaluwarsa, pakai "Lupa password" di halaman login.`, "Aktifkan akun", url, "Kalau kamu tidak mengenal undangan ini, abaikan email ini."),
    text: `${invitedBy} mengundang kamu ke PayHub.\nAktifkan akun (berlaku 1 jam):\n${url}`,
  });
}
