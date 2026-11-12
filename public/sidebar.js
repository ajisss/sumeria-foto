/* PayHub: sidebar desktop (gelap, menu dikelompokkan per bagian, item aktif berupa pill, bisa diciutkan).
   Dimuat SEBELUM app.js; memakai global app.js (NAV, visibleNav, LOGO_DATA_URI, Save) hanya saat render.
   Di mobile sidebar ini disembunyikan oleh CSS `.desktop-sidebar` (app.js) dan BottomNav yang dipakai. */

const SB_SECTIONS = [
  { key: "overview", items: ["home"] },
  { key: "sales", items: ["quotations", "invoices", "orders", "calendar", "packages"] },
  { key: "customers", items: ["customers"] },
  { key: "finance", items: ["expenses", "ledger", "margin"] },
  { key: "admin", items: ["users"] },
];

const SB_STR = {
  id: { overview: "Ringkasan", sales: "Penjualan", customers: "Pelanggan", finance: "Keuangan", admin: "Admin", other: "Lainnya", collapse: "Ciutkan menu", expand: "Perluas menu", bkTitle: "Backup", bkOk: "Aman", bkNeed: "Perlu backup", bkNow: "Backup", bkNever: "Belum pernah backup", bkToday: "Hari ini", bkAgo: "hari lalu" },
  en: { overview: "Overview", sales: "Sales", customers: "Customers", finance: "Finance", admin: "Admin", other: "Other", collapse: "Collapse menu", expand: "Expand menu", bkTitle: "Backup", bkOk: "Safe", bkNeed: "Backup due", bkNow: "Back up", bkNever: "Never backed up", bkToday: "Today", bkAgo: "days ago" },
};

const SB_CSS = `
  :root { --an-1:#2F65E0; --an-2:#9DBBF3; --an-3:#CFDDF9; --an-ink:#1D4ED8; --an-g:linear-gradient(180deg,#2F65E0,#14296B); --an-gh:linear-gradient(90deg,#14296B,#2F65E0); --brand:var(--c-blue,#18181B); --on-brand:var(--c-onBlue,#FFFFFF); --shell:#E8E8EB;
    --sb-text:#3F3F46; --sb-text-hi:#0A0A0A; --sb-sec:#5F5F68; --sb-hover:rgba(0,0,0,.06); --sb-line:rgba(0,0,0,.09); --sb-logo:none; --sb-sub:#5F5F68; }
  [data-theme="dark"] { --shell:#000000; --an-ink:#8FB0FF; --an-g:linear-gradient(180deg,#5B8CF0,#1E3A8A); --an-gh:linear-gradient(90deg,#1E3A8A,#5B8CF0); --an-1:#5B8CF0; --an-2:#34508F;
    --sb-text:#B4B4BC; --sb-text-hi:#FFFFFF; --sb-sec:#8E8E98; --sb-hover:rgba(255,255,255,.07); --sb-line:rgba(255,255,255,.08); --sb-logo:invert(1); --sb-sub:#8A8A93; }
  .sb { width:228px; min-width:228px; height:100vh; flex-direction:column; padding:16px 12px 12px; color:var(--sb-text); overflow:hidden; transition:width .2s ease, min-width .2s ease; }
  .sb::-webkit-scrollbar { width:0; }
  .sb.c { width:76px; min-width:76px; }
  .sb-top { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:2px 6px 16px; margin-bottom:2px; border-bottom:1px solid var(--sb-line); min-height:62px; }
  .sb.c .sb-top { justify-content:center; padding:2px 0 16px; }
  .sb-brand img { height:24px; width:auto; display:block; filter:var(--sb-logo); }
  .sb-brand div { font-size:10.5px; letter-spacing:.16em; text-transform:uppercase; color:var(--sb-sub); margin-top:7px; }
  .sb.c .sb-brand { display:none; }
  .sb-toggle { flex-shrink:0; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border:none; background:transparent; color:var(--sb-sub); border-radius:8px; cursor:pointer; }
  .sb-toggle:hover { background:var(--sb-hover); color:var(--sb-text-hi); }
  .sb-sec { font-size:12px; font-weight:600; letter-spacing:0; color:var(--sb-sec); padding:18px 11px 7px; white-space:nowrap; }
  .sb.c .sb-sec { height:14px; padding:0; margin:0; background:transparent; font-size:0; }
  .sb.c .sb-top { border-bottom:none; }
  .sb.c .sb-foot { border-top:none; }
  .sb-item { position:relative; display:flex; align-items:center; gap:10px; width:100%; padding:9px 11px; border:none; border-radius:10px; background:transparent; color:var(--sb-text); font-size:13.5px; font-weight:500; text-align:left; cursor:pointer; white-space:nowrap; font-family:inherit; }
  .sb-item:hover { background:var(--sb-hover); color:var(--sb-text-hi); }
  .sb-item:focus-visible { outline:2px solid var(--sb-text-hi); outline-offset:1px; }
  .sb-item.on, .sb-item.on:hover { background:var(--brand); color:var(--on-brand); font-weight:600; }
  .sb-item svg { flex-shrink:0; }
  .sb-label { overflow:hidden; text-overflow:ellipsis; }
  .sb.c .sb-item { justify-content:center; padding:11px 0; }
  .sb.c .sb-label { display:none; }
  .sb-badge { margin-left:auto; min-width:19px; height:19px; padding:0 6px; border-radius:10px; background:#D92D20; color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; }
  .sb.c .sb-badge { position:absolute; top:4px; right:10px; min-width:8px; width:8px; height:8px; padding:0; font-size:0; }
  .sb nav { flex:1 1 auto; min-height:0; overflow-y:auto; scrollbar-width:none; }
  .sb nav::-webkit-scrollbar { width:0; }
  .sb-foot { flex-shrink:0; margin-top:auto; padding-top:10px; border-top:1px solid var(--sb-line); }
  @media print { .app-shell { height:auto !important; overflow:visible !important; background:#fff !important; } .app-col { height:auto !important; overflow:visible !important; margin:0 !important; border:none !important; border-radius:0 !important; } .sb, .hd { display:none !important; } }
  .bk-side { display:block; width:100%; text-align:left; font-family:inherit; border:1px solid var(--sb-line); border-radius:12px; background:transparent; padding:10px; cursor:pointer; transition:background-color .15s; color:var(--sb-text); }
  .bk-side:hover { background:var(--sb-hover); }
  .bk-side:focus-visible { outline:2px solid var(--sb-text-hi); outline-offset:1px; }
  .bk-s-top { display:flex; align-items:center; gap:9px; }
  .bk-s-ico { flex-shrink:0; width:30px; height:30px; border-radius:9px; display:flex; align-items:center; justify-content:center; background:rgba(47,101,224,.14); color:var(--an-ink); position:relative; }
  .bk-side[data-stale="1"] .bk-s-ico { background:rgba(229,72,77,.14); color:#E5484D; }
  .bk-s-title { flex:1; min-width:0; font-size:13px; font-weight:600; color:var(--sb-text-hi); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .bk-s-pill { flex-shrink:0; font-size:11px; font-weight:600; padding:2px 8px; border-radius:7px; border:1px solid var(--sb-line); color:var(--sb-text-hi); }
  .bk-s-bar { height:5px; border-radius:3px; background:var(--sb-line); margin:9px 0 7px; overflow:hidden; }
  .bk-s-bar > div { height:100%; border-radius:3px; background:#2F65E0; }
  .bk-side[data-stale="1"] .bk-s-bar > div { background:#E5484D; }
  .bk-s-bot { display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:12px; color:var(--sb-sub); }
  .bk-s-link { font-weight:600; color:var(--an-ink); }
  .sb.c .bk-side { padding:6px; border-radius:12px; display:flex; justify-content:center; }
  .sb.c .bk-s-title, .sb.c .bk-s-pill, .sb.c .bk-s-bar, .sb.c .bk-s-bot { display:none; }
  .sb.c .bk-s-ico::after { content:none; }
  .sb-dot { width:8px; height:8px; border-radius:50%; background:#E5484D; margin-left:auto; flex-shrink:0; }
  .sb.c .sb-dot { position:absolute; top:6px; right:12px; margin:0; }
`;

const SB_ICONS = {
  // panel-left-close / panel-left-open (gaya Lucide)
  left: [["rect", { width: 18, height: 18, x: 3, y: 3, rx: 2 }], ["path", { d: "M9 3v18" }], ["path", { d: "m16 15-3-3 3-3" }]],
  right: [["rect", { width: 18, height: 18, x: 3, y: 3, rx: 2 }], ["path", { d: "M9 3v18" }], ["path", { d: "m14 9 3 3-3 3" }]],
};
function sbIcon(name) {
  const h = React.createElement;
  return h(
    "svg",
    { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
    SB_ICONS[name].map((n, i) => h(n[0], { key: i, ...n[1] })),
  );
}

function DesktopSidebar({ tab, setTab, can, overdueCount, t, lang, lastBackupAt, onBackup }) {
  const h = React.createElement;
  const L = SB_STR[lang === "en" ? "en" : "id"];
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("payhub-sidebar-collapsed") === "1";
    } catch (_) {
      return false;
    }
  });
  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem("payhub-sidebar-collapsed", c ? "0" : "1");
      } catch (_) {}
      return !c;
    });

  const nav = visibleNav(can);
  const byKey = Object.fromEntries(nav.map((n) => [n.key, n]));
  const placed = new Set(SB_SECTIONS.flatMap((s) => s.items));
  const groups = SB_SECTIONS.map((s) => ({ key: s.key, items: s.items.map((k) => byKey[k]).filter(Boolean) }));
  const extra = nav.filter((n) => !placed.has(n.key));
  if (extra.length) groups.push({ key: "other", items: extra });

  const days = lastBackupAt ? Math.floor((Date.now() - new Date(lastBackupAt).getTime()) / 864e5) : null;
  const stale = days === null || days >= 30;

  const item = (n) => {
    const Icon = n.icon;
    const on = tab === n.key;
    const label = t("nav_" + n.key);
    return h(
      "button",
      { key: n.key, className: "sb-item" + (on ? " on" : ""), onClick: () => setTab(n.key), title: collapsed ? label : undefined, "aria-current": on ? "page" : undefined, "aria-label": collapsed ? label : undefined },
      h(Icon, { size: 18, strokeWidth: 2 }),
      h("span", { className: "sb-label" }, label),
      n.key === "invoices" && overdueCount > 0 && h("span", { className: "sb-badge" }, overdueCount),
    );
  };

  return h(
    "aside",
    { className: "desktop-sidebar sb" + (collapsed ? " c" : ""), "aria-label": "Sidebar" },
    h("style", null, SB_CSS),
    h(
      "div",
      { className: "sb-top" },
      h("div", { className: "sb-brand" }, h("img", { src: LOGO_DATA_URI, alt: "Sumériapoto" }), h("div", null, "PayHub")),
      h("button", { className: "sb-toggle", onClick: toggle, "aria-label": collapsed ? L.expand : L.collapse, title: collapsed ? L.expand : L.collapse }, sbIcon(collapsed ? "right" : "left")),
    ),
    h(
      "nav",
      null,
      groups.filter((g) => g.items.length).map((g) => [h("div", { className: "sb-sec", key: "s-" + g.key }, L[g.key]), ...g.items.map(item)]),
    ),
    h(
      "div",
      { className: "sb-foot" },
      h(
        "button",
        { className: "bk-side", "data-stale": stale ? "1" : "0", onClick: onBackup, title: collapsed ? t("backup_restore") : undefined, "aria-label": t("backup_restore") },
        h(
          "div",
          { className: "bk-s-top" },
          h("span", { className: "bk-s-ico" }, h(Save, { size: 17, strokeWidth: 2 })),
          h("span", { className: "bk-s-title" }, L.bkTitle),
          h("span", { className: "bk-s-pill" }, stale ? L.bkNeed : L.bkOk),
        ),
        h("div", { className: "bk-s-bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 30, "aria-valuenow": days === null ? 30 : Math.min(days, 30) }, h("div", { style: { width: (days === null ? 100 : Math.max(4, Math.min(days, 30) / 30 * 100)) + "%" } })),
        h(
          "div",
          { className: "bk-s-bot" },
          h("span", null, days === null ? L.bkNever : days === 0 ? L.bkToday : days + " " + L.bkAgo),
          h("span", { className: "bk-s-link" }, L.bkNow),
        ),
      ),
    ),
  );
}
