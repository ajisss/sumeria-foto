/* PayHub: klien API, layar login/lupa password/reset, dan halaman kelola user.
   Dimuat SEBELUM app.js. BRAND, Card, Button, Modal, dst. berasal dari app.js (global) dan
   baru dipakai saat render, jadi urutan muat aman. */

async function apiFetch(path, opts) {
  opts = opts || {};
  const hasBody = opts.body !== undefined;
  const res = await fetch(path, {
    method: opts.method || "GET",
    credentials: "same-origin",
    headers: hasBody ? { "Content-Type": "application/json" } : {},
    body: hasBody ? JSON.stringify(opts.body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch (_) {}
  if (!res.ok) {
    const err = new Error((data && (data.error || data.message)) || "HTTP " + res.status);
    err.status = res.status;
    err.code = data && data.code;
    throw err;
  }
  return data;
}

const AUTH_STR = {
  id: {
    login_title: "Masuk ke akun kamu",
    login_sub: "Gunakan email dan password akun PayHub kamu.",
    email: "Email",
    password: "Password",
    login_btn: "Masuk",
    loading: "Memproses…",
    forgot_link: "Lupa password?",
    forgot_title: "Lupa password",
    forgot_sub: "Masukkan email akun kamu. Kami kirim tautan untuk membuat password baru.",
    forgot_btn: "Kirim tautan reset",
    forgot_done: "Jika email terdaftar, tautan reset sudah dikirim. Cek inbox (dan folder spam). Tautan berlaku 1 jam.",
    back_login: "Kembali ke halaman masuk",
    reset_title: "Buat password baru",
    reset_sub: "Password minimal 10 karakter. Dipakai juga untuk mengaktifkan akun yang baru diundang.",
    new_password: "Password baru",
    confirm_password: "Ulangi password baru",
    reset_btn: "Simpan password",
    reset_done: "Password tersimpan. Silakan masuk.",
    err_email: "Masukkan alamat email yang valid.",
    err_creds: "Email atau password salah.",
    err_disabled: "Akun ini dinonaktifkan. Hubungi owner.",
    err_rate: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.",
    err_generic: "Terjadi kesalahan. Coba lagi.",
    err_short: "Password minimal 10 karakter.",
    err_mismatch: "Password tidak sama.",
    err_token: "Tautan tidak valid atau sudah kedaluwarsa. Minta tautan baru lewat \"Lupa password?\".",
    footer: "Akses internal untuk tim Sumériapoto. Akun dibuat lewat undangan.",
    panel_quote: "Penawaran, invoice, dan arus kas dalam satu tempat, rapi, cepat, dan mudah dilacak.",
    panel_name: "Sumériapoto PayHub",
    panel_role: "Penawaran, invoice, dan keuangan",
  },
  en: {
    login_title: "Sign in to your account",
    login_sub: "Use your PayHub email and password.",
    email: "Email",
    password: "Password",
    login_btn: "Sign in",
    loading: "Working…",
    forgot_link: "Forgot password?",
    forgot_title: "Forgot password",
    forgot_sub: "Enter your account email. We'll send a link to set a new password.",
    forgot_btn: "Send reset link",
    forgot_done: "If the email is registered, a reset link has been sent. Check your inbox (and spam). The link is valid for 1 hour.",
    back_login: "Back to sign in",
    reset_title: "Set a new password",
    reset_sub: "At least 10 characters. Also used to activate a newly invited account.",
    new_password: "New password",
    confirm_password: "Repeat new password",
    reset_btn: "Save password",
    reset_done: "Password saved. Please sign in.",
    err_email: "Enter a valid email address.",
    err_creds: "Wrong email or password.",
    err_disabled: "This account is disabled. Contact the owner.",
    err_rate: "Too many attempts. Try again in a few minutes.",
    err_generic: "Something went wrong. Try again.",
    err_short: "Password must be at least 10 characters.",
    err_mismatch: "Passwords do not match.",
    err_token: "The link is invalid or expired. Request a new one via \"Forgot password?\".",
    footer: "Internal access for the Sumériapoto team. Accounts are created by invitation.",
    panel_quote: "Quotations, invoices, and cash flow in one place: tidy, fast, and easy to track.",
    panel_name: "Sumériapoto PayHub",
    panel_role: "Quotations, invoices, and finance",
  },
};

/* Ikon SVG lokal (gaya Lucide) untuk layar auth. Tidak memakai makeIcon dari app.js karena
   app.js dimuat setelah file ini. */
const AUTH_ICONS = {
  eye: [["path", { d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", { cx: 12, cy: 12, r: 3 }]],
  eyeOff: [
    ["path", { d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" }],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
    ["path", { d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" }],
    ["path", { d: "m2 2 20 20" }],
  ],
  login: [["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }], ["path", { d: "m10 17 5-5-5-5" }], ["path", { d: "M15 12H3" }]],
  mail: [["rect", { x: 2, y: 4, width: 20, height: 16, rx: 2 }], ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }]],
  key: [
    ["path", { d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" }],
    ["circle", { cx: 16.5, cy: 7.5, r: 0.5, fill: "currentColor" }],
  ],
  back: [["path", { d: "m12 19-7-7 7-7" }], ["path", { d: "M19 12H5" }]],
};
function authIcon(name, size) {
  const h = React.createElement;
  return h(
    "svg",
    { width: size || 16, height: size || 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { flexShrink: 0 } },
    AUTH_ICONS[name].map((n, i) => h(n[0], { key: i, ...n[1] })),
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readResetTokenOnce() {
  try {
    const u = new URL(window.location.href);
    const tok = u.searchParams.get("reset");
    if (tok) {
      // Buang token dari address bar/history segera supaya tidak bocor lewat referrer atau screenshot.
      u.searchParams.delete("reset");
      window.history.replaceState(null, "", u.pathname + (u.search || "") + u.hash);
    }
    return tok || "";
  } catch (_) {
    return "";
  }
}

function AuthGate({ onLogin, dark, toggleTheme, lang, changeLang }) {
  const S = AUTH_STR[lang === "en" ? "en" : "id"];
  const h = React.createElement;
  const [token] = useState(readResetTokenOnce);
  const [mode, setMode] = useState(token ? "reset" : "login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  function go(m) {
    setMode(m);
    setErr("");
    setPw("");
    setPw2("");
    setShowPw(false);
    setShowPw2(false);
  }

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setErr("");
    if (mode === "login") {
      if (!EMAIL_RE.test(email)) return setErr(S.err_email);
      if (!pw) return setErr(S.err_creds);
      setBusy(true);
      try {
        await apiFetch("/api/auth/sign-in/email", { method: "POST", body: { email: email.trim(), password: pw } });
        const me = await apiFetch("/api/me");
        onLogin(me);
      } catch (x) {
        setErr(x.status === 403 ? S.err_disabled : x.status === 429 ? S.err_rate : x.status === 401 ? S.err_creds : S.err_generic);
        setBusy(false);
      }
    } else if (mode === "forgot") {
      if (!EMAIL_RE.test(email)) return setErr(S.err_email);
      setBusy(true);
      try {
        await apiFetch("/api/auth/request-password-reset", { method: "POST", body: { email: email.trim() } });
        setInfo(S.forgot_done);
        setMode("forgot_done");
      } catch (x) {
        setErr(x.status === 429 ? S.err_rate : S.err_generic);
      }
      setBusy(false);
    } else if (mode === "reset") {
      if (pw.length < 10) return setErr(S.err_short);
      if (pw !== pw2) return setErr(S.err_mismatch);
      setBusy(true);
      try {
        await apiFetch("/api/auth/reset-password", { method: "POST", body: { token, newPassword: pw } });
        setInfo(S.reset_done);
        setPw("");
        setPw2("");
        setMode("login");
      } catch (x) {
        setErr(x.status === 429 ? S.err_rate : x.status === 400 ? S.err_token : S.err_generic);
      }
      setBusy(false);
    }
  }

  const input = (props) =>
    h("input", {
      ...props,
      required: true,
      disabled: busy,
      style: { ...inputStyle, marginBottom: 14 },
    });
  const pwLabel = (shown) => (shown ? (lang === "en" ? "Hide password" : "Sembunyikan password") : lang === "en" ? "Show password" : "Tampilkan password");
  const pwInput = (props, shown, toggle) =>
    h(
      "div",
      { style: { position: "relative", marginBottom: 14 } },
      h("input", { ...props, type: shown ? "text" : "password", required: true, disabled: busy, style: { ...inputStyle, paddingRight: 40 } }),
      h(
        "button",
        { type: "button", onClick: toggle, "aria-label": pwLabel(shown), title: pwLabel(shown), "aria-pressed": shown, style: { position: "absolute", top: 0, right: 0, height: "100%", width: 38, background: "none", border: "none", color: BRAND.inkSoft, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } },
        authIcon(shown ? "eyeOff" : "eye", 17),
      ),
    );
  const link = (label, onClick, icon) =>
    h("button", { type: "button", onClick, style: { background: "none", border: "none", color: BRAND.inkSoft, cursor: "pointer", fontSize: 12.5, textDecoration: "underline", padding: 0, display: "inline-flex", alignItems: "center", gap: 6 } }, icon && authIcon(icon, 14), label);

  const title = mode === "login" ? S.login_title : mode === "reset" ? S.reset_title : S.forgot_title;
  const sub = mode === "login" ? S.login_sub : mode === "reset" ? S.reset_sub : mode === "forgot" ? S.forgot_sub : "";
  const btn = mode === "login" ? S.login_btn : mode === "reset" ? S.reset_btn : S.forgot_btn;

  const css = `
    * { box-sizing: border-box; }
    input:focus { border-color: ${BRAND.blue} !important; box-shadow: 0 0 0 3px var(--c-blueTint); }
    button:active { transform: scale(0.99); }
    .ag-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: ${BRAND.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
    .ag-card { width: 100%; max-width: 1020px; min-height: 640px; display: grid; grid-template-columns: 1fr 1fr; background: ${BRAND.surface}; border: 1px solid ${BRAND.line}; border-radius: 24px; box-shadow: 0 24px 60px -24px rgba(0,0,0,.25); overflow: hidden; }
    .ag-panel { position: relative; margin: 10px; border-radius: 16px; padding: 32px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; color: #fff; background: #0a0a0a; }
    .ag-glow { position: absolute; inset: 0; background: radial-gradient(120% 80% at 0% 0%, rgba(30,110,80,.55), transparent 60%), radial-gradient(90% 70% at 100% 100%, rgba(40,80,170,.5), transparent 60%); }
    .ag-grid { position: absolute; inset: 0; opacity: .12; background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 44px 44px; -webkit-mask-image: radial-gradient(ellipse at center, #000, transparent 75%); mask-image: radial-gradient(ellipse at center, #000, transparent 75%); }
    .ag-quote { position: relative; border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.1); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 16px; padding: 24px; }
    .ag-main { position: relative; display: flex; align-items: center; justify-content: center; padding: 56px 48px; }
    .ag-form { width: 100%; max-width: 380px; }
    .ag-submit { color: #fff; }
    [data-theme="dark"] .ag-submit { color: #09090B; }
    .ag-mobile-brand { display: none; }
    @media (max-width: 860px) { .ag-card { grid-template-columns: 1fr; min-height: 0; } .ag-panel { display: none; } .ag-main { padding: 64px 22px 32px; } .ag-mobile-brand { display: block; } }
  `;
  const lbl = { display: "block", fontSize: 12.5, fontWeight: 500, color: BRAND.ink, marginBottom: 6 };
  const iconBtn = { height: 38, minWidth: 38, borderRadius: 8, border: `1px solid ${BRAND.line}`, background: BRAND.surface, color: BRAND.inkSoft, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

  return h(
    "div",
    { className: "ag-wrap" },
    h("style", null, css),
    h(
      "div",
      { className: "ag-card" },
      h(
        "aside",
        { className: "ag-panel" },
        h("div", { className: "ag-glow", "aria-hidden": true }),
        h("div", { className: "ag-grid", "aria-hidden": true }),
        h(
          "div",
          { style: { position: "relative" } },
          h("p", { style: { margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" } }, "Sumériapoto"),
          h("p", { style: { margin: "4px 0 0", fontSize: 11, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,.7)" } }, "PayHub"),
        ),
        h(
          "figure",
          { className: "ag-quote", style: { margin: 0 } },
          h("blockquote", { style: { margin: 0, fontSize: 18, lineHeight: 1.4 } }, "\u201C" + S.panel_quote + "\u201D"),
          h("figcaption", { style: { marginTop: 20 } },
            h("p", { style: { margin: 0, fontSize: 15, fontWeight: 600 } }, S.panel_name),
            h("p", { style: { margin: "2px 0 0", fontSize: 13, color: "rgba(255,255,255,.8)" } }, S.panel_role)),
        ),
      ),
      h(
        "main",
        { className: "ag-main" },
        h(
          "div",
          { style: { position: "absolute", top: 16, right: 16, display: "flex", gap: 8 } },
          h("button", { onClick: () => changeLang(lang === "en" ? "id" : "en"), "aria-label": "Language", style: { ...iconBtn, fontSize: 12, fontWeight: 600 } }, lang === "en" ? "ID" : "EN"),
          h("button", { onClick: toggleTheme, "aria-label": "Theme", style: iconBtn }, dark ? h(Sun, { size: 17 }) : h(Moon, { size: 17 })),
        ),
        h(
          "form",
          { className: "ag-form", onSubmit: submit, noValidate: true },
          h("p", { className: "ag-mobile-brand", style: { margin: "0 0 20px", textAlign: "center", fontSize: 17, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: BRAND.ink } }, "Sumériapoto"),
          h("h1", { style: { margin: "0 0 8px", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em", color: BRAND.ink, textAlign: "center" } }, title),
          sub && h("p", { style: { margin: "0 0 24px", fontSize: 13.5, color: BRAND.inkSoft, lineHeight: 1.5, textAlign: "center" } }, sub),
          mode === "forgot_done"
            ? h("p", { role: "status", style: { fontSize: 13.5, color: BRAND.ink, lineHeight: 1.5, textAlign: "center" } }, info)
            : [
                info && mode === "login" && h("p", { key: "i", role: "status", style: { margin: "0 0 14px", fontSize: 13, color: BRAND.green } }, info),
                (mode === "login" || mode === "forgot") &&
                  h("div", { key: "e" }, h("label", { style: lbl }, S.email), input({ type: "email", autoComplete: "username", value: email, onChange: (e) => setEmail(e.target.value), autoFocus: true })),
                mode === "login" &&
                  h("div", { key: "p" }, h("label", { style: lbl }, S.password), pwInput({ autoComplete: "current-password", value: pw, onChange: (e) => setPw(e.target.value) }, showPw, () => setShowPw((v) => !v))),
                mode === "reset" &&
                  h("div", { key: "n" },
                    h("label", { style: lbl }, S.new_password), pwInput({ autoComplete: "new-password", minLength: 10, value: pw, onChange: (e) => setPw(e.target.value), autoFocus: true }, showPw, () => setShowPw((v) => !v)),
                    h("label", { style: lbl }, S.confirm_password), pwInput({ autoComplete: "new-password", minLength: 10, value: pw2, onChange: (e) => setPw2(e.target.value) }, showPw2, () => setShowPw2((v) => !v))),
                err && h("p", { key: "x", role: "alert", style: { margin: "0 0 14px", fontSize: 12.5, color: BRAND.red, lineHeight: 1.5 } }, err),
                h("button", { key: "b", type: "submit", className: "ag-submit", disabled: busy, style: { width: "100%", height: 44, padding: "0 16px", borderRadius: 10, border: "none", background: BRAND.blue, fontSize: 14, fontWeight: 500, cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, !busy && authIcon(mode === "login" ? "login" : mode === "reset" ? "key" : "mail", 17), busy ? S.loading : btn),
              ],
          h(
            "div",
            { style: { marginTop: 18, display: "flex", justifyContent: "center" } },
            mode === "login" ? link(S.forgot_link, () => { setInfo(""); go("forgot"); }) : link(S.back_login, () => { setInfo(""); go("login"); }, "back"),
          ),
          h("p", { style: { margin: "28px 0 0", fontSize: 12, color: BRAND.inkSoft, textAlign: "center", lineHeight: 1.5 } }, S.footer),
        ),
      ),
    ),
  );
}

/* ---------- Kelola user (owner/admin) ---------- */

const ROLE_LABEL = { owner: "Owner", admin: "Admin", staff: "Staff", viewer: "Viewer" };
const MANAGEABLE = { owner: ["owner", "admin", "staff", "viewer"], admin: ["staff", "viewer"] };

function UsersPage({ ctx }) {
  const h = React.createElement;
  const me = ctx.me.user;
  const roles = MANAGEABLE[me.role] || [];
  const [users, setUsers] = useState(null);
  const [loadErr, setLoadErr] = useState("");
  const [invite, setInvite] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "staff" });
  const [busy, setBusy] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [confirm, setConfirm] = useState(null);

  async function load() {
    try {
      const d = await apiFetch("/api/users");
      setUsers(d.users);
      setLoadErr("");
    } catch (x) {
      setLoadErr(x.message);
    }
  }
  useEffect(() => { load(); }, []);

  async function act(fn, okMsg) {
    try {
      await fn();
      ctx.showToast(okMsg);
      await load();
    } catch (x) {
      ctx.showToast(x.message || "Gagal", "error");
    }
  }

  async function submitInvite(e) {
    e.preventDefault();
    if (busy) return;
    setFormErr("");
    if (!EMAIL_RE.test(form.email)) return setFormErr("Email tidak valid.");
    if (!form.name.trim()) return setFormErr("Nama wajib diisi.");
    setBusy(true);
    try {
      await apiFetch("/api/users/invite", { method: "POST", body: { name: form.name.trim(), email: form.email.trim(), role: form.role } });
      ctx.showToast("Undangan dikirim ke " + form.email.trim());
      setInvite(false);
      setForm({ name: "", email: "", role: roles.includes("staff") ? "staff" : roles[0] });
      await load();
    } catch (x) {
      setFormErr(x.message);
    }
    setBusy(false);
  }

  const manageable = (u) => u.id !== me.id && roles.includes(u.role);

  return h(
    "div",
    null,
    h(PageHeader, {
      title: "Pengguna",
      subtitle: "Kelola akses tim. Akun dibuat lewat undangan email.",
      action: h(Button, { icon: Plus, onClick: () => setInvite(true) }, "Undang pengguna"),
    }),
    loadErr && h("p", { role: "alert", style: { color: BRAND.red, fontSize: 13 } }, loadErr),
    !users && !loadErr && h("p", { style: { color: BRAND.inkSoft } }, "Memuat…"),
    users &&
      h(Card, { style: { padding: 0, overflowX: "auto" } }, h(Table, null,
          h(TableHeader, null, h(TableRow, null, ["Nama", "Email", "Role", "Status", ""].map((c, i) => h(TableHead, { key: i }, c)))),
          h(TableBody, null, users.map((u) =>
            h(TableRow, { key: u.id },
              h(TableCell, { style: { fontWeight: 600 } }, u.name, u.id === me.id && h("span", { style: { color: BRAND.inkSoft } }, " (kamu)")),
              h(TableCell, null, u.email),
              h(TableCell, null,
                manageable(u)
                  ? h(UiSelect, {
                      value: u.role,
                      "aria-label": "Role " + u.email,
                      onChange: (e) => setConfirm({ title: "Ubah role", message: `Ubah role ${u.email} menjadi ${ROLE_LABEL[e.target.value]}? Sesi login user ini akan diakhiri.`, run: () => act(() => apiFetch("/api/users/" + u.id, { method: "PATCH", body: { role: e.target.value } }), "Role diperbarui") }),
                      style: { ...inputStyle, width: "auto", padding: "5px 8px" },
                    }, roles.map((r) => h("option", { key: r, value: r }, ROLE_LABEL[r])))
                  : h(Badge, { tone: "gray" }, ROLE_LABEL[u.role] || u.role)),
              h(TableCell, null, h(Badge, { tone: u.banned ? "red" : "green" }, u.banned ? "Nonaktif" : "Aktif")),
              h(TableCell, { style: { textAlign: "right", whiteSpace: "nowrap" } },
                h("div", { style: { display: "flex", gap: 6, justifyContent: "flex-end" } },
                  manageable(u) && !u.banned && h(IconBtn, { icon: Mail, title: "Kirim ulang tautan", onClick: () => act(() => apiFetch("/api/users/" + u.id + "/resend-invite", { method: "POST", body: {} }), "Tautan dikirim ulang") }),
                  manageable(u) && h(IconBtn, { icon: u.banned ? Check : Lock, tone: u.banned ? "default" : "danger", title: u.banned ? "Aktifkan" : "Nonaktifkan", onClick: () => setConfirm({ title: u.banned ? "Aktifkan akun" : "Nonaktifkan akun", message: u.banned ? `Aktifkan kembali ${u.email}?` : `Nonaktifkan ${u.email}? User ini langsung keluar dan tidak bisa masuk.`, run: () => act(() => apiFetch("/api/users/" + u.id, { method: "PATCH", body: { banned: !u.banned } }), u.banned ? "Akun diaktifkan" : "Akun dinonaktifkan") }) })))))))),
    invite &&
      h(Modal, { title: "Undang pengguna", subtitle: "Kirim undangan email agar anggota tim bisa membuat akun.", icon: Users, onClose: () => setInvite(false), width: 440 },
        h("form", { onSubmit: submitInvite, noValidate: true },
          h(Field, { label: "Nama" }, h("input", { style: inputStyle, value: form.name, maxLength: 100, onChange: (e) => setForm({ ...form, name: e.target.value }), autoFocus: true })),
          h(Field, { label: "Email" }, h("input", { style: inputStyle, type: "email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) })),
          h(Field, { label: "Role" }, h(UiSelect, { style: inputStyle, value: form.role, onChange: (e) => setForm({ ...form, role: e.target.value }) }, roles.map((r) => h("option", { key: r, value: r }, ROLE_LABEL[r])))),
          h("p", { style: { fontSize: 12, color: BRAND.inkSoft, lineHeight: 1.5 } }, "Staff: customer, quotation, invoice. Viewer: hanya lihat. Admin: semua data + kelola staff/viewer. Owner: semuanya."),
          formErr && h("p", { role: "alert", style: { color: BRAND.red, fontSize: 12.5 } }, formErr),
          h("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 } },
            h(Button, { variant: "secondary", icon: X, onClick: () => setInvite(false) }, "Batal"),
            h(Button, { type: "submit", icon: Check, disabled: busy }, busy ? "Mengirim…" : "Kirim undangan")))),
    confirm &&
      h(Modal, { title: confirm.title, onClose: () => setConfirm(null), width: 420 },
        h("p", { style: { fontSize: 13.5, lineHeight: 1.5, color: BRAND.ink } }, confirm.message),
        h("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 } },
          h(Button, { variant: "secondary", icon: X, onClick: () => { setConfirm(null); load(); } }, "Batal"),
          h(Button, { icon: Check, onClick: () => { const run = confirm.run; setConfirm(null); run(); } }, "Lanjut"))),
  );
}

/* ---------- Migrasi data lama (localStorage -> server), sekali jalan ---------- */

const LEGACY_KEYS = [
  ["payhub_customers", "customers", "setCustomers"],
  ["payhub_quotations", "quotations", "setQuotations"],
  ["payhub_invoices", "invoices", "setInvoices"],
  ["payhub_expenses", "expenses", "setExpenses"],
];

function findLegacyData(ctx) {
  try {
    if (localStorage.getItem("payhub::legacy_imported")) return null;
    const out = [];
    for (const [key, name, setter] of LEGACY_KEYS) {
      const raw = localStorage.getItem("payhub::" + key);
      if (!raw) continue;
      const arr = JSON.parse(raw);
      // Hanya impor koleksi yang masih kosong di server dan boleh ditulis role ini.
      if (Array.isArray(arr) && arr.length && ctx[name].length === 0 && ctx.can("write:" + name)) out.push({ name, setter, arr });
    }
    return out.length ? out : null;
  } catch (_) {
    return null;
  }
}

function LegacyImportBanner({ items, ctx, onDone }) {
  const h = React.createElement;
  const summary = items.map((i) => `${i.arr.length} ${i.name}`).join(", ");
  function doImport() {
    items.forEach((i) => ctx[i.setter](i.arr));
    try { localStorage.setItem("payhub::legacy_imported", new Date().toISOString()); } catch (_) {}
    ctx.showToast("Data lama diimpor ke server");
    onDone();
  }
  function dismiss() {
    try { localStorage.setItem("payhub::legacy_imported", "dismissed"); } catch (_) {}
    onDone();
  }
  return h(Card, { style: { marginBottom: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" } },
    h("div", { style: { fontSize: 13, color: BRAND.ink, lineHeight: 1.5 } },
      h("strong", null, "Ada data lama di browser ini. "),
      `Ditemukan ${summary}. Impor ke server supaya bisa diakses semua perangkat. Salinan di browser tidak dihapus.`),
    h("div", { style: { display: "flex", gap: 8 } },
      h(Button, { variant: "ghost", onClick: dismiss }, "Abaikan"),
      h(Button, { onClick: doImport }, "Impor sekarang")));
}

/* ---------- Akun sendiri: ganti nama & password ---------- */

function AccountPanel({ me, showToast }) {
  const h = React.createElement;
  const [name, setName] = useState(me.user.name || "");
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  const label = (t) => h("label", { style: { display: "block", fontSize: 12.5, fontWeight: 500, color: BRAND.ink, marginBottom: 6 } }, t);
  const field = (props) => h("input", { ...props, style: { ...inputStyle, marginBottom: 12 } });

  async function saveName(e) {
    e.preventDefault();
    if (!name.trim() || name.trim() === me.user.name || busy) return;
    setBusy("name");
    try {
      await apiFetch("/api/auth/update-user", { method: "POST", body: { name: name.trim() } });
      me.user.name = name.trim();
      showToast("Nama diperbarui");
    } catch (x) {
      showToast(x.message || "Gagal", "error");
    }
    setBusy("");
  }

  async function savePassword(e) {
    e.preventDefault();
    if (busy) return;
    setErr("");
    if (pw.length < 10) return setErr("Password baru minimal 10 karakter.");
    if (pw !== pw2) return setErr("Password baru tidak sama.");
    setBusy("pw");
    try {
      await apiFetch("/api/auth/change-password", { method: "POST", body: { currentPassword: cur, newPassword: pw, revokeOtherSessions: true } });
      setCur(""); setPw(""); setPw2("");
      showToast("Password diganti. Sesi di perangkat lain diakhiri.");
    } catch (x) {
      setErr(x.status === 429 ? "Terlalu banyak percobaan. Coba lagi nanti." : "Password saat ini salah atau password baru tidak valid.");
    }
    setBusy("");
  }

  return h("div", { style: { marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${BRAND.line}` } },
    h("p", { style: { margin: "0 0 12px", fontSize: 12, color: BRAND.inkSoft } }, `${me.user.email} · ${ROLE_LABEL[me.user.role] || me.user.role}`),
    h("form", { onSubmit: saveName, style: { marginBottom: 14 } },
      label("Nama"),
      field({ value: name, maxLength: 100, onChange: (e) => setName(e.target.value), autoComplete: "name" }),
      h(Button, { type: "submit", size: "sm", variant: "secondary", disabled: busy === "name" }, "Simpan nama")),
    h("form", { onSubmit: savePassword },
      label("Password saat ini"),
      field({ type: "password", value: cur, onChange: (e) => setCur(e.target.value), autoComplete: "current-password" }),
      label("Password baru (min. 10 karakter)"),
      field({ type: "password", value: pw, onChange: (e) => setPw(e.target.value), autoComplete: "new-password" }),
      label("Ulangi password baru"),
      field({ type: "password", value: pw2, onChange: (e) => setPw2(e.target.value), autoComplete: "new-password" }),
      err && h("p", { role: "alert", style: { margin: "0 0 10px", fontSize: 12.5, color: BRAND.red } }, err),
      h(Button, { type: "submit", size: "sm", variant: "secondary", disabled: busy === "pw" || !cur || !pw }, busy === "pw" ? "Menyimpan…" : "Ganti password")));
}
