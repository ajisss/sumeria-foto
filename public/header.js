/* PayHub: header global di atas konten (sapaan + notifikasi + bahasa + tema + profil).
   Dimuat SEBELUM app.js; memakai global app.js (BRAND, Sun, Moon, LogOut, Save, fmtRp) dan anIcon dari
   analytics.js hanya saat render.

   Notifikasi = invoice telat bayar (H-7) dari ctx.overdueInvoices. */

const HD_STR = {
  id: {
    morning: "Selamat pagi",
    afternoon: "Selamat siang",
    evening: "Selamat sore",
    night: "Selamat malam",
    sub_home: "Berikut ringkasan performa bisnis kamu.",
    search: "Cari customer, invoice…",
    search_ph: "Ketik untuk mencari halaman, customer, atau invoice",
    g_pages: "Halaman",
    g_customers: "Customer",
    g_invoices: "Invoice",
    no_results: "Tidak ada hasil.",
    hint_nav: "navigasi",
    hint_open: "buka",
    hint_close: "tutup",
    notif: "Notifikasi",
    notif_empty: "Tidak ada notifikasi.",
    tab_all: "Semua",
    tab_unread: "Belum dibaca",
    tab_action: "Perlu tindakan",
    mark_all: "Tandai semua dibaca",
    close: "Tutup",
    n_remind: "Kirim reminder WA",
    n_view_inv: "Lihat invoice",
    n_view_order: "Lihat order",
    n_today: "hari ini",
    n_ago: "hari lalu",
    n_in: "dalam",
    n_days: "hari",
    notif_overdue: "invoice lewat batas pelunasan",
    remaining: "Sisa",
    view_all: "Lihat semua invoice",
    profile: "Profil & akun",
    backup: "Backup & Restore",
    lang: "Ganti bahasa",
    role_owner: "Owner",
    role_admin: "Admin",
    role_staff: "Staff",
    role_viewer: "Viewer",
  },
  en: {
    morning: "Good Morning",
    afternoon: "Good Afternoon",
    evening: "Good Evening",
    night: "Good Evening",
    sub_home: "Here's your business performance snapshot.",
    search: "Search customers, invoices…",
    search_ph: "Type to search pages, customers or invoices",
    g_pages: "Pages",
    g_customers: "Customers",
    g_invoices: "Invoices",
    no_results: "No results.",
    hint_nav: "navigate",
    hint_open: "open",
    hint_close: "close",
    notif: "Notifications",
    notif_empty: "No notifications.",
    tab_all: "All",
    tab_unread: "Unread",
    tab_action: "Action Required",
    mark_all: "Mark all as read",
    close: "Close",
    n_remind: "Send WA reminder",
    n_view_inv: "View invoice",
    n_view_order: "View order",
    n_today: "today",
    n_ago: "d ago",
    n_in: "in",
    n_days: "days",
    notif_overdue: "invoices past the payment deadline",
    remaining: "Remaining",
    view_all: "View all invoices",
    profile: "Profile & account",
    backup: "Backup & Restore",
    lang: "Change language",
    role_owner: "Owner",
    role_admin: "Admin",
    role_staff: "Staff",
    role_viewer: "Viewer",
  },
};

const HD_ICONS = {
  bell: [["path", { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }], ["path", { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" }]],
  user: [["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", { cx: 12, cy: 7, r: 4 }]],
  save: [["path", { d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" }], ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }], ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7" }]],
  logout: [["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }], ["path", { d: "m16 17 5-5-5-5" }], ["path", { d: "M21 12H9" }]],
  sun: [["circle", { cx: 12, cy: 12, r: 4 }], ["path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" }]],
  moon: [["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }]],
  chevron: [["path", { d: "m6 9 6 6 6-6" }]],
  x: [["path", { d: "M18 6 6 18" }], ["path", { d: "m6 6 12 12" }]],
  alert: [["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }], ["path", { d: "M12 9v4" }], ["path", { d: "M12 17h.01" }]],
  wallet: [["path", { d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }], ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }]],
  cal: [["rect", { x: 3, y: 4, width: 18, height: 18, rx: 2 }], ["path", { d: "M16 2v4M8 2v4M3 10h18" }]],
  search: [["circle", { cx: 11, cy: 11, r: 8 }], ["path", { d: "m21 21-4.3-4.3" }]],
  file: [["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }], ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }], ["path", { d: "M10 9H8" }], ["path", { d: "M16 13H8" }], ["path", { d: "M16 17H8" }]],
  corner: [["path", { d: "M20 4v7a4 4 0 0 1-4 4H4" }], ["path", { d: "m9 10-5 5 5 5" }]],
};
function hdIcon(name, size) {
  const h = React.createElement;
  return h(
    "svg",
    { width: size || 16, height: size || 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { flexShrink: 0 } },
    HD_ICONS[name].map((n, i) => h(n[0], { key: i, ...n[1] })),
  );
}

const HD_CSS = (B) => `
  .hd { position:sticky; top:0; z-index:55; display:flex; align-items:center; justify-content:space-between; gap:16px; min-height:68px; padding:10px 32px; background:${B.surface}; border-bottom:1px solid ${B.line}; }
  .hd-hello { min-width:0; }
  .hd-hello h1 { margin:0; font-size:17px; font-weight:600; letter-spacing:-.01em; color:${B.ink}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .hd-hello p { margin:2px 0 0; font-size:12.5px; color:${B.inkSoft}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .hd-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .hd-btn { position:relative; height:38px; min-width:38px; padding:0 10px; display:inline-flex; align-items:center; justify-content:center; gap:7px; border-radius:10px; border:1px solid ${B.line}; background:${B.surface}; color:${B.inkSoft}; cursor:pointer; font-size:12px; font-weight:600; font-family:inherit; }
  .hd-btn:hover { background:${B.grayBg}; color:${B.ink}; }
  .hd-dot { position:absolute; top:-5px; right:-5px; min-width:17px; height:17px; padding:0 4px; border-radius:9px; background:#D92D20; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; border:2px solid ${B.surface}; }
  .hd-avatar { width:26px; height:26px; border-radius:50%; background:var(--brand,#18181B); color:var(--on-brand,#fff); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0; }
  .hd-pop { position:absolute; top:calc(100% + 8px); right:0; z-index:70; min-width:300px; max-width:calc(100vw - 24px); background:${B.surface}; border:1px solid ${B.line}; border-radius:14px; box-shadow:0 18px 40px -16px rgba(0,0,0,.35); overflow:hidden; text-align:left; }
  .hd-pop-h { padding:12px 14px; font-size:13px; font-weight:600; color:${B.ink}; border-bottom:1px solid ${B.line}; display:flex; align-items:center; gap:8px; }
  .nd-ov { position:fixed; inset:0; z-index:92; background:rgba(0,0,0,.35); display:flex; justify-content:flex-end; animation:ndFade .15s ease-out; }
  @keyframes ndFade { from { opacity:0; } to { opacity:1; } }
  @keyframes ndIn { from { transform:translateX(24px); opacity:0; } to { transform:none; opacity:1; } }
  .nd { width:min(440px, 100%); margin:12px; display:flex; flex-direction:column; background:${B.surface}; color:${B.ink}; border:1px solid ${B.line}; border-radius:18px; box-shadow:0 30px 80px -24px rgba(0,0,0,.55); overflow:hidden; animation:ndIn .2s ease-out; }
  .nd-head { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:18px 20px 6px; }
  .nd-head h2 { margin:0; font-size:20px; font-weight:600; letter-spacing:-.02em; }
  .nd-mark { border:none; background:none; color:${B.inkSoft}; font-size:12.5px; font-weight:600; cursor:pointer; padding:6px 8px; border-radius:8px; font-family:inherit; text-decoration:underline; text-underline-offset:3px; }
  .nd-mark:hover { color:${B.ink}; background:${B.grayBg}; }
  .nd-x { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:none; background:transparent; color:${B.inkSoft}; border-radius:8px; cursor:pointer; }
  .nd-x:hover { background:${B.grayBg}; color:${B.ink}; }
  .nd-tabs { display:flex; gap:6px; padding:10px 20px 14px; border-bottom:1px solid ${B.line}; flex-wrap:wrap; }
  .nd-tab { height:34px; padding:0 14px; border:none; border-radius:10px; background:transparent; color:${B.inkSoft}; font-size:13.5px; font-weight:500; cursor:pointer; font-family:inherit; }
  .nd-tab:hover { background:${B.grayBg}; color:${B.ink}; }
  .nd-tab.on { background:${B.blueTint}; color:${B.ink}; font-weight:600; }
  .nd-list { flex:1; overflow-y:auto; padding:4px 20px 12px; }
  .nd-item { display:flex; gap:14px; padding:16px 0; border-bottom:1px solid ${B.line}; cursor:default; }
  .nd-item:last-child { border-bottom:none; }
  .nd-ic { position:relative; width:40px; height:40px; flex-shrink:0; border-radius:12px; background:${B.grayBg}; color:${B.inkSoft}; display:flex; align-items:center; justify-content:center; }
  .nd-item.act .nd-ic { color:${B.red}; }
  .nd-dot { position:absolute; top:-3px; right:-3px; width:9px; height:9px; border-radius:50%; background:var(--an-1,#2F65E0); border:2px solid ${B.surface}; box-sizing:content-box; }
  .nd-body { min-width:0; flex:1; }
  .nd-body p { margin:0; font-size:14px; line-height:1.5; color:${B.ink}; }
  .nd-body p b { font-weight:700; }
  .nd-foot { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-top:10px; }
  .nd-links { display:flex; gap:14px; flex-wrap:wrap; }
  .nd-link { border:none; background:none; padding:0; color:${B.ink}; font-size:13px; font-weight:600; text-decoration:underline; text-underline-offset:3px; cursor:pointer; font-family:inherit; }
  .nd-link:hover { color:${B.inkSoft}; }
  .nd-time { font-size:12px; color:${B.inkSoft}; white-space:nowrap; }
  .nd-empty { padding:48px 12px; text-align:center; color:${B.inkSoft}; font-size:13.5px; }
  @media (max-width: 880px) { .nd { margin:8px; } }
  .hd-who { padding:14px; border-bottom:1px solid ${B.line}; display:flex; align-items:center; gap:10px; }
  .hd-who .hd-avatar { width:38px; height:38px; font-size:14px; }
  .hd-who div b { display:block; font-size:13.5px; color:${B.ink}; }
  .hd-who div span { display:block; font-size:12px; color:${B.inkSoft}; word-break:break-all; }
  .hd-item { width:100%; display:flex; align-items:center; gap:10px; padding:11px 14px; border:none; background:none; color:${B.ink}; font-size:13px; cursor:pointer; font-family:inherit; text-align:left; }
  .hd-item:hover { background:${B.grayBg}; }
  .hd-item.danger { color:${B.red}; }
  .hd-search { width:min(290px, 22vw); }
  .hd-kbd { font-size:11px; padding:2px 6px; border:1px solid ${B.line}; border-radius:6px; background:${B.surface}; color:${B.inkSoft}; font-family:inherit; }
  .cp-ov { position:fixed; inset:0; z-index:90; background:rgba(0,0,0,.5); display:flex; justify-content:center; align-items:flex-start; padding:12vh 12px 0; }
  .cp { width:min(580px, 100%); max-height:70vh; display:flex; flex-direction:column; background:${B.surface}; color:${B.ink}; border:1px solid ${B.line}; border-radius:16px; box-shadow:0 30px 80px -20px rgba(0,0,0,.6); overflow:hidden; }
  .cp-in { display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:1px solid ${B.line}; color:${B.inkSoft}; }
  .cp-in input { flex:1; border:none !important; box-shadow:none !important; padding:0 !important; background:transparent; outline:none; color:${B.ink}; font-size:15px; font-family:inherit; }
  .cp-list { overflow-y:auto; padding:6px; }
  .cp-g { padding:10px 10px 6px; font-size:12px; font-weight:600; color:${B.inkSoft}; }
  .cp-it { display:flex; align-items:center; gap:12px; padding:9px 10px; border-radius:10px; cursor:pointer; }
  .cp-it[data-active="true"] { background:${B.grayBg}; }
  .cp-ic { width:30px; height:30px; flex-shrink:0; border-radius:8px; border:1px solid ${B.line}; display:flex; align-items:center; justify-content:center; color:${B.inkSoft}; background:${B.surface}; }
  .cp-tx { min-width:0; flex:1; }
  .cp-tx b { display:block; font-size:13.5px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .cp-tx span { display:block; font-size:12px; color:${B.inkSoft}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .cp-empty { padding:28px 12px; text-align:center; color:${B.inkSoft}; font-size:13px; }
  .cp-foot { display:flex; gap:16px; padding:10px 16px; border-top:1px solid ${B.line}; font-size:11.5px; color:${B.inkSoft}; }
  @media (max-width: 880px) {
    .hd-search { width:38px; padding:0; justify-content:center; }
    .hd-search .ui-t, .hd-search kbd { display:none; }
    .hd { padding:8px 14px; min-height:56px; }
    .hd-hello h1 { font-size:15px !important; }
    .hd-hello p { display:none; }
    .hd-actions { gap:6px; }
    .hd-btn { height:34px; min-width:34px; padding:0 8px; }
    .hd-name { display:none; }
    .hd-pop { position:fixed; top:60px; right:10px; left:10px; min-width:0; }
  }
`;

/* Judul halaman dikirim oleh PageHeader (app.js) lewat bus kecil ini. */
const HD_BUS = { title: "", subtitle: "", subs: new Set() };
function hdSetHead(title, subtitle) {
  HD_BUS.title = title || "";
  HD_BUS.subtitle = subtitle || "";
  HD_BUS.subs.forEach((f) => f());
}

/* Notifikasi diturunkan dari data yang ada (tidak ada tabel notifikasi):
   - telat bayar (H-7)         -> "Perlu tindakan"
   - pembayaran 30 hari terakhir
   - acara 7 hari ke depan
   Status "sudah dibaca" disimpan di localStorage (payhub-notif-read). */
function hdBuildNotifs(ctx, D, lang) {
  const h = React.createElement;
  const en = lang === "en";
  const b = (t) => h("b", null, t);
  const today = anYmd(new Date());
  const days = (a, c) => Math.round((new Date(c + "T00:00:00") - new Date(a + "T00:00:00")) / 864e5);
  const rel = (d) => {
    const n = days(today, d);
    if (n === 0) return D.n_today;
    return n < 0 ? -n + (en ? "" : " ") + D.n_ago : D.n_in + " " + n + " " + D.n_days;
  };
  const out = [];
  const openOrder = (id) => () => { ctx.setSelectedInvoiceId(id); ctx.setTab("orders"); };

  (ctx.overdueInvoices || []).forEach((o) =>
    out.push({
      id: "overdue:" + o.id, action: true, rank: 1000 + o.daysOverdue, date: o.deadline, icon: "alert",
      body: en
        ? ["Invoice ", b(o.invNumber), " for ", b(o.customer), " is overdue by ", b(o.daysOverdue + " days"), ". ", b(fmtRp(o.remaining)), " remaining."]
        : ["Invoice ", b(o.invNumber), " untuk ", b(o.customer), " telat bayar ", b(o.daysOverdue + " hari"), ". Sisa tagihan ", b(fmtRp(o.remaining)), "."],
      links: [{ label: D.n_remind, run: () => sendReminderWhatsApp(o) }, { label: D.n_view_inv, run: openOrder(o.id), close: true }],
    }),
  );

  const since = anAdd(today, -30);
  const until = anAdd(today, 7);
  (ctx.invoices || []).forEach((inv) => {
    const cust = (inv.customerSnap && inv.customerSnap.name) || "-";
    (inv.payments || []).forEach((p, idx) => {
      if (!p.paid) return;
      const d = p.paidDate || inv.date;
      if (!d || d < since || d > today) return;
      out.push({
        id: "pay:" + inv.id + ":" + (p.id || idx), action: false, rank: 0, date: d, icon: "wallet",
        body: en
          ? ["Payment of ", b(fmtRp(p.amount)), " received from ", b(cust), " for invoice ", b(inv.invNumber), p.label ? " (" + p.label + ")" : "", "."]
          : ["Pembayaran ", b(fmtRp(p.amount)), " diterima dari ", b(cust), " untuk invoice ", b(inv.invNumber), p.label ? " (" + p.label + ")" : "", "."],
        links: [{ label: D.n_view_inv, run: openOrder(inv.id), close: true }],
      });
    });
    const seen = new Set();
    (inv.items || []).forEach((it) => {
      const d = it.eventDate;
      if (!d || d < today || d > until || seen.has(d)) return;
      seen.add(d);
      out.push({
        id: "event:" + inv.id + ":" + d, action: false, rank: 0, date: d, icon: "cal",
        body: en
          ? ["Event for ", b(cust), " ", b(rel(d)), " (", fmtDate(d), "), invoice ", b(inv.invNumber), "."]
          : ["Acara ", b(cust), " ", b(rel(d)), " (", fmtDate(d), "), invoice ", b(inv.invNumber), "."],
        links: [{ label: D.n_view_order, run: openOrder(inv.id), close: true }],
      });
    });
  });

  out.sort((a, c) => (c.rank - a.rank) || (a.action ? 0 : c.date.localeCompare(a.date)));
  return out.slice(0, 60).map((n) => ({ ...n, time: fmtDate(n.date) + "  |  " + rel(n.date) }));
}

function NotificationsDrawer({ items, read, markRead, markAll, D, onClose }) {
  const h = React.createElement;
  const [tab, setTab] = useState("all");
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);
  const unread = items.filter((n) => !read.has(n.id));
  const action = items.filter((n) => n.action);
  const shown = tab === "unread" ? unread : tab === "action" ? action : items;
  const tabs = [
    { k: "all", label: D.tab_all },
    { k: "unread", label: D.tab_unread + (unread.length ? " (" + unread.length + ")" : "") },
    { k: "action", label: D.tab_action + (action.length ? " (" + action.length + ")" : "") },
  ];
  return h(
    "div",
    { className: "nd-ov", onMouseDown: (e) => e.target === e.currentTarget && onClose() },
    h(
      "aside",
      { className: "nd", role: "dialog", "aria-modal": "true", "aria-label": D.notif },
      h(
        "div",
        { className: "nd-head" },
        h("h2", null, D.notif),
        h("div", { style: { display: "flex", alignItems: "center", gap: 4 } },
          unread.length > 0 && h("button", { className: "nd-mark", onClick: markAll }, D.mark_all),
          h("button", { className: "nd-x", "aria-label": D.close, onClick: onClose }, hdIcon("x", 18))),
      ),
      h("div", { className: "nd-tabs", role: "tablist" }, tabs.map((t) => h("button", { key: t.k, role: "tab", "aria-selected": tab === t.k, className: "nd-tab" + (tab === t.k ? " on" : ""), onClick: () => setTab(t.k) }, t.label))),
      h(
        "div",
        { className: "nd-list" },
        shown.length === 0
          ? h("div", { className: "nd-empty" }, D.notif_empty)
          : shown.map((n) =>
              h(
                "div",
                { key: n.id, className: "nd-item" + (n.action ? " act" : ""), onClick: () => markRead(n.id) },
                h("span", { className: "nd-ic" }, hdIcon(n.icon, 17), !read.has(n.id) && h("i", { className: "nd-dot" })),
                h(
                  "div",
                  { className: "nd-body" },
                  h("p", null, ...n.body),
                  h(
                    "div",
                    { className: "nd-foot" },
                    h("div", { className: "nd-links" }, n.links.map((l) => h("button", { key: l.label, className: "nd-link", onClick: (e) => { e.stopPropagation(); markRead(n.id); l.run(); if (l.close) onClose(); } }, l.label))),
                    h("span", { className: "nd-time" }, n.time),
                  ),
                ),
              ),
            ),
      ),
    ),
  );
}

function CommandPalette({ ctx, D, onClose }) {
  const h = React.createElement;
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const has = (...f) => !needle || f.some((x) => String(x || "").toLowerCase().includes(needle));
    const pages = visibleNav(ctx.can)
      .map((n) => ({ id: "p-" + n.key, icon: n.icon, title: ctx.t("nav_" + n.key), sub: D.g_pages, run: () => ctx.setTab(n.key) }))
      .filter((x) => has(x.title));
    const lim = needle ? 6 : 0;
    const customers = lim
      ? (ctx.customers || []).filter((c) => has(c.name, c.email, c.city, c.phone)).slice(0, lim).map((c) => ({ id: "c-" + c.id, hd: "user", title: c.name, sub: [c.email, c.city].filter(Boolean).join(" · "), run: () => { ctx.setDetailCustomerId(c.id); ctx.setTab("customers"); } }))
      : [];
    const invoices = lim
      ? (ctx.invoices || []).filter((i) => has(i.invNumber, i.customerSnap && i.customerSnap.name)).slice(0, lim).map((i) => ({ id: "i-" + i.id, hd: "file", title: i.invNumber, sub: (i.customerSnap && i.customerSnap.name) || "", run: () => { ctx.setSelectedInvoiceId(i.id); ctx.setTab("orderDetails"); } }))
      : [];
    return [
      { key: "pages", label: D.g_pages, items: needle ? pages.slice(0, 5) : pages.slice(0, 8) },
      { key: "customers", label: D.g_customers, items: customers },
      { key: "invoices", label: D.g_invoices, items: invoices },
    ].filter((g) => g.items.length);
  }, [q, ctx.customers, ctx.invoices]);
  const flat = groups.flatMap((g) => g.items);
  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    const el = document.getElementById("cp-" + active);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
  }, [active]);

  function run(item) {
    onClose();
    item.run();
  }
  function onKey(e) {
    if (e.key === "Escape") (e.preventDefault(), onClose());
    else if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(flat.length - 1, a + 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
    else if (e.key === "Enter" && flat[active]) (e.preventDefault(), run(flat[active]));
  }

  let n = -1;
  return h(
    "div",
    { className: "cp-ov", onMouseDown: (e) => e.target === e.currentTarget && onClose() },
    h(
      "div",
      { className: "cp", role: "dialog", "aria-modal": "true", "aria-label": D.search },
      h("div", { className: "cp-in" }, hdIcon("search", 17), h("input", { ref: inputRef, value: q, onChange: (e) => setQ(e.target.value), onKeyDown: onKey, placeholder: D.search_ph, "aria-label": D.search }), h("span", { className: "hd-kbd" }, "Esc")),
      h(
        "div",
        { className: "cp-list", role: "listbox" },
        flat.length === 0
          ? h("div", { className: "cp-empty" }, D.no_results)
          : groups.map((g) => [
              h("div", { className: "cp-g", key: "g-" + g.key }, g.label),
              ...g.items.map((it) => {
                n++;
                const i = n;
                const Icon = it.icon;
                return h(
                  "div",
                  { key: it.id, id: "cp-" + i, role: "option", "aria-selected": i === active, "data-active": i === active, className: "cp-it", onMouseEnter: () => setActive(i), onClick: () => run(it) },
                  h("span", { className: "cp-ic" }, Icon ? h(Icon, { size: 15, strokeWidth: 2 }) : hdIcon(it.hd, 15)),
                  h("span", { className: "cp-tx" }, h("b", null, it.title), it.sub && h("span", null, it.sub)),
                  i === active && h("span", { style: { color: BRAND.inkSoft, display: "flex" } }, hdIcon("corner", 14)),
                );
              }),
            ]),
      ),
      h("div", { className: "cp-foot" }, h("span", null, "\u2191\u2193 " + D.hint_nav), h("span", null, "\u21B5 " + D.hint_open), h("span", null, "Esc " + D.hint_close)),
    ),
  );
}

function AppHeader({ ctx, tab, dark, toggleTheme, lang, changeLang, onProfile, onBackup, onLogout }) {
  const h = React.createElement;
  const D = HD_STR[lang === "en" ? "en" : "id"];
  const [open, setOpen] = useState(null); // "notif" | "profile" | null
  const [palette, setPalette] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("payhub-notif-read") || "[]"));
    } catch (_) {
      return new Set();
    }
  });
  const notifs = useMemo(() => hdBuildNotifs(ctx, HD_STR[lang === "en" ? "en" : "id"], lang), [ctx.invoices, ctx.overdueInvoices, lang]);
  const unreadCount = notifs.filter((n) => !readIds.has(n.id)).length;
  const persistRead = (set) => {
    try {
      localStorage.setItem("payhub-notif-read", JSON.stringify([...set].filter((id) => notifs.some((n) => n.id === id))));
    } catch (_) {}
  };
  const markRead = (id) =>
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      persistRead(next);
      return next;
    });
  const markAll = () =>
    setReadIds((prev) => {
      const next = new Set(prev);
      notifs.forEach((n) => next.add(n.id));
      persistRead(next);
      return next;
    });
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const rootRef = useRef(null);
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((n) => n + 1);
    HD_BUS.subs.add(f);
    return () => HD_BUS.subs.delete(f);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => rootRef.current && !rootRef.current.contains(e.target) && setOpen(null);
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const user = (ctx.me && ctx.me.user) || {};
  const email = user.email || "";
  const name = user.name || email.split("@")[0] || "";
  const first = name.split(/\s+/)[0] || name;
  const initials = (name || "?").split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const hr = new Date().getHours();
  const greet = hr < 11 ? D.morning : hr < 15 ? D.afternoon : hr < 19 ? D.evening : D.night;
  const sub = tab === "home" ? D.sub_home : ctx.t("nav_" + tab);
  const go = (fn) => () => {
    setOpen(null);
    fn();
  };

  return h(
    "header",
    { className: "hd", ref: rootRef },
    h("style", null, HD_CSS(BRAND)),
    h("div", { className: "hd-hello" }, h("h1", null, HD_BUS.title || greet + ", " + first + "."), (HD_BUS.title ? HD_BUS.subtitle : sub) && h("p", null, HD_BUS.title ? HD_BUS.subtitle : sub)),
    h(
      "div",
      { className: "hd-actions" },
      h(SearchField, { className: "hd-search", onClick: () => setPalette(true), placeholder: D.search, kbd: "\u2318K", title: D.search + " (\u2318K)" }),
      h(
        "button",
        { className: "hd-btn", "aria-label": D.notif, "aria-haspopup": "dialog", title: D.notif, onClick: () => { setOpen(null); setNotifOpen(true); } },
        hdIcon("bell", 17),
        unreadCount > 0 && h("span", { className: "hd-dot" }, unreadCount > 99 ? "99+" : unreadCount),
      ),
      h("button", { className: "hd-btn", "aria-label": D.lang, title: D.lang, onClick: () => changeLang(lang === "en" ? "id" : "en") }, lang === "en" ? "ID" : "EN"),
      h("button", { className: "hd-btn", "aria-label": ctx.t(dark ? "light_mode" : "dark_mode"), title: ctx.t(dark ? "light_mode" : "dark_mode"), onClick: toggleTheme }, hdIcon(dark ? "sun" : "moon", 17)),
      h(
        "div",
        { style: { position: "relative" } },
        h(
          "button",
          { className: "hd-btn", "aria-label": D.profile, "aria-expanded": open === "profile", onClick: () => setOpen(open === "profile" ? null : "profile"), style: { paddingLeft: 6 } },
          h("span", { className: "hd-avatar" }, initials),
          h("span", { className: "hd-name" }, first),
          hdIcon("chevron", 14),
        ),
        open === "profile" &&
          h(
            "div",
            { className: "hd-pop", role: "menu", style: { minWidth: 260 } },
            h("div", { className: "hd-who" }, h("span", { className: "hd-avatar" }, initials), h("div", { style: { minWidth: 0 } }, h("b", null, name), h("span", null, email), user.role && h("span", null, D["role_" + user.role] || user.role))),
            h("button", { className: "hd-item", role: "menuitem", onClick: go(onProfile) }, hdIcon("user", 16), D.profile),
            h("button", { className: "hd-item", role: "menuitem", onClick: go(onBackup) }, hdIcon("save", 16), D.backup),
            h("button", { className: "hd-item danger", role: "menuitem", onClick: go(onLogout) }, hdIcon("logout", 16), ctx.t("logout")),
          ),
      ),
    ),
    palette && h(CommandPalette, { ctx, D, onClose: () => setPalette(false) }),
    notifOpen && h(NotificationsDrawer, { items: notifs, read: readIds, markRead, markAll, D, onClose: () => setNotifOpen(false) }),
  );
}
