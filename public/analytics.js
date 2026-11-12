/* PayHub: halaman Analytics (menggantikan isi menu "Home").
   Dimuat SEBELUM app.js, sama seperti auth-ui.js: BRAND, Card, fmtRp, lineTotal, docSubtotal,
   isFullyPaid, HomePage, dst. berasal dari app.js (global) dan baru dipakai saat render.

   Sumber data (semua dari ctx):
   - Revenue  = pembayaran invoice yang sudah paid (paidDate), bukan nilai invoice.
   - Expenses = semua expense (lineTotal), termasuk kategori Asset, sama seperti Master Dashboard.
   - Invoiced = nilai item invoice (docSubtotal) untuk invoice yang tanggalnya di rentang terpilih. */

const AN_STR = {
  id: {
    title: "Analytics",
    subtitle: "Ringkasan performa invoice, revenue, dan pengeluaran.",
    date: "Tanggal",
    customer: "Customer",
    all_customer: "Semua customer",
    p_30d: "30 hari terakhir",
    p_month: "Bulan ini",
    p_quarter: "Kuartal ini",
    p_year: "Tahun ini",
    p_all: "Semua waktu",
    p_custom: "Custom",
    export: "Export",
    vs_prev: "vs periode lalu",
    revenue: "Total Revenue",
    expenses: "Total Expenses",
    profit: "Net Profit",
    outstanding: "Outstanding",
    invoice_perf: "Performa Invoice",
    collected_of_billed: "dari nilai invoice sudah dibayar",
    paid: "Lunas",
    partial: "Dibayar sebagian",
    unpaid: "Belum dibayar",
    overdue: "Lewat batas bayar",
    invoices_unit: "invoice",
    rev_breakdown: "Revenue per Bulan",
    legend_revenue: "Revenue",
    legend_expense: "Expenses",
    top_customers: "Customer Teratas",
    collection: "Collection Rate",
    collected: "Terkumpul",
    of: "dari",
    left: "masih outstanding",
    top_items: "Item Terlaris",
    best_item: "Item terbaik",
    of_revenue: "dari nilai invoice",
    no_data: "Belum ada data di rentang ini.",
    overdue_banner: () => "invoice belum lunas dan sudah lewat batas pelunasan.",
    overdue_cta: "Cek sekarang",
    menu: "Menu",
    no_name: "(Tanpa nama)",
    month_col: "Bulan",
    profit_col: "Profit",
    no_access: "Tidak ada akses ke data pengeluaran",
    err_load: "Gagal memuat analytics.",
    new_badge: "Baru",
    g_collected: "Terkumpul",
    g_collected_cap: "dari nilai invoice sudah terkumpul.",
    g_outstanding: "Outstanding",
    g_outstanding_cap: "Sisa tagihan yang belum dibayar.",
    g_invoiced: "Total Invoice",
    g_invoiced_cap: "Total nilai invoice pada periode ini.",
    g_menu: "Opsi",
    g_view: "Lihat semua invoice",
  },
  en: {
    title: "Analytics",
    subtitle: "Overview of invoice performance, revenue and expenses.",
    date: "Date",
    customer: "Customer",
    all_customer: "All customers",
    p_30d: "Last 30 days",
    p_month: "This month",
    p_quarter: "This quarter",
    p_year: "This year",
    p_all: "All time",
    p_custom: "Custom",
    export: "Export",
    vs_prev: "vs last period",
    revenue: "Total Revenue",
    expenses: "Total Expenses",
    profit: "Net Profit",
    outstanding: "Outstanding",
    invoice_perf: "Invoice Performance",
    collected_of_billed: "of invoiced value collected",
    paid: "Fully paid",
    partial: "Partially paid",
    unpaid: "Unpaid",
    overdue: "Past deadline",
    invoices_unit: "invoices",
    rev_breakdown: "Revenue by Month",
    legend_revenue: "Revenue",
    legend_expense: "Expenses",
    top_customers: "Top Customers",
    collection: "Collection Rate",
    collected: "Collected",
    of: "of",
    left: "still outstanding",
    top_items: "Top Items",
    best_item: "Best performer",
    of_revenue: "of invoiced value",
    no_data: "No data in this range yet.",
    overdue_banner: (n) => (n === 1 ? "invoice is unpaid and past its payment deadline." : "invoices are unpaid and past their payment deadline."),
    overdue_cta: "Check now",
    menu: "Menu",
    no_name: "(Unnamed)",
    month_col: "Month",
    profit_col: "Profit",
    no_access: "No access to expense data",
    err_load: "Failed to load analytics.",
    new_badge: "New",
    g_collected: "Collected",
    g_collected_cap: "of invoiced value collected.",
    g_outstanding: "Outstanding",
    g_outstanding_cap: "Unpaid balance still to collect.",
    g_invoiced: "Total Invoiced",
    g_invoiced_cap: "Total invoice value in this period.",
    g_menu: "Options",
    g_view: "View all invoices",
  },
};

const AN_ICONS = {
  calendar: [["rect", { x: 3, y: 4, width: 18, height: 18, rx: 2 }], ["path", { d: "M16 2v4M8 2v4M3 10h18" }]],
  chevron: [["path", { d: "m6 9 6 6 6-6" }]],
  download: [["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }], ["path", { d: "m7 10 5 5 5-5" }], ["path", { d: "M12 15V3" }]],
  close: [["path", { d: "M18 6 6 18" }], ["path", { d: "m6 6 12 12" }]],
  alert: [["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }], ["path", { d: "M12 9v4" }], ["path", { d: "M12 17h.01" }]],
  user: [["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", { cx: 12, cy: 7, r: 4 }]],
  package: [["path", { d: "m7.5 4.27 9 5.15" }], ["path", { d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" }], ["path", { d: "m3.3 7 8.7 5 8.7-5" }], ["path", { d: "M12 22V12" }]],
  check: [["path", { d: "M20 6 9 17l-5-5" }]],
  clock: [["circle", { cx: 12, cy: 12, r: 10 }], ["path", { d: "M12 6v6l4 2" }]],
  circle: [["circle", { cx: 12, cy: 12, r: 10 }]],
  arrUp: [["path", { d: "M7 7h10v10" }], ["path", { d: "M7 17 17 7" }]],
  arrDown: [["path", { d: "m7 7 10 10" }], ["path", { d: "M17 7v10H7" }]],
  chevL: [["path", { d: "m15 18-6-6 6-6" }]],
  chevR: [["path", { d: "m9 18 6-6-6-6" }]],
  more: [["circle", { cx: 12, cy: 5, r: 1 }], ["circle", { cx: 12, cy: 12, r: 1 }], ["circle", { cx: 12, cy: 19, r: 1 }]],
};
function anIcon(name, size) {
  const h = React.createElement;
  return h(
    "svg",
    { width: size || 15, height: size || 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { flexShrink: 0 } },
    AN_ICONS[name].map((n, i) => h(n[0], { key: i, ...n[1] })),
  );
}

/* Dropdown bergaya shadcn Select (trigger + popover + ikon centang + keyboard). Tanpa dependensi:
   app ini tidak memakai build step, jadi komponen shadcn/Radix asli tidak bisa dipakai di sini. */
function ShSelect({ value, options, onChange, icon, label }) {
  const h = React.createElement;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const uid = useRef("sh" + Math.random().toString(36).slice(2, 8));
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const cur = options[idx];

  useEffect(() => {
    if (!open) return;
    const down = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const el = document.getElementById(uid.current + "-" + active);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openMenu = () => {
    setActive(idx);
    setOpen(true);
  };
  const choose = (i) => {
    onChange(options[i].value);
    setOpen(false);
  };
  function onKey(e) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") (e.preventDefault(), setOpen(false));
    else if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(options.length - 1, a + 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
    else if (e.key === "Home") (e.preventDefault(), setActive(0));
    else if (e.key === "End") (e.preventDefault(), setActive(options.length - 1));
    else if (e.key === "Enter" || e.key === " ") (e.preventDefault(), choose(active));
    else if (e.key === "Tab") setOpen(false);
  }

  return h(
    "div",
    { className: "sh", ref },
    h(
      "button",
      {
        type: "button",
        className: "sh-trigger",
        role: "combobox",
        "aria-label": label,
        "aria-expanded": open,
        "aria-haspopup": "listbox",
        "aria-controls": uid.current + "-list",
        "aria-activedescendant": open ? uid.current + "-" + active : undefined,
        onClick: () => (open ? setOpen(false) : openMenu()),
        onKeyDown: onKey,
      },
      icon && anIcon(icon, 14),
      h("span", { className: "sh-value" }, cur ? cur.label : ""),
      anIcon("chevron", 14),
    ),
    open &&
      h(
        "div",
        { className: "sh-pop", role: "listbox", id: uid.current + "-list", "aria-label": label },
        options.map((o, i) =>
          h(
            "div",
            {
              key: String(o.value),
              id: uid.current + "-" + i,
              role: "option",
              "aria-selected": o.value === value,
              "data-active": i === active,
              className: "sh-item",
              onMouseEnter: () => setActive(i),
              onMouseDown: (e) => e.preventDefault(),
              onClick: () => choose(i),
            },
            h("span", { className: "sh-label" }, o.label),
            h("span", { className: "sh-ck", style: { opacity: o.value === value ? 1 : 0 } }, anIcon("check", 14)),
          ),
        ),
      ),
  );
}

/* Date range picker bergaya shadcn Calendar (popover, dua bulan, rentang tersorot). Klik pertama = tanggal awal,
   klik kedua = tanggal akhir (otomatis ditukar bila terbalik). onChange hanya dipanggil saat rentang lengkap. */
function ShDateRange({ value, onChange, lang, label }) {
  const h = React.createElement;
  const en = lang === "en";
  const loc = en ? "en-US" : "id-ID";
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const b = value.start ? new Date(value.start + "T00:00:00") : new Date();
    return new Date(b.getFullYear(), b.getMonth(), 1);
  });
  const [pending, setPending] = useState(null);
  const [hover, setHover] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const down = (e) => ref.current && !ref.current.contains(e.target) && (setOpen(false), setPending(null));
    const key = (e) => e.key === "Escape" && (setOpen(false), setPending(null));
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString(loc, { day: "2-digit", month: "short", year: "numeric" });
  const text = value.start && value.end ? fmt(value.start) + " \u2013 " + fmt(value.end) : en ? "Pick a date range" : "Pilih rentang tanggal";

  // Rentang yang disorot: saat menunggu klik kedua, pakai tanggal awal sementara + posisi hover.
  let a = value.start, b = value.end;
  if (pending) {
    a = pending;
    b = hover || pending;
  }
  if (a && b && a > b) [a, b] = [b, a];
  const todayStr = anYmd(new Date());

  function pick(d) {
    if (!pending) {
      setPending(d);
      setHover(null);
    } else {
      const s = d < pending ? d : pending;
      const e = d < pending ? pending : d;
      setPending(null);
      setHover(null);
      onChange({ start: s, end: e });
      setOpen(false);
    }
  }

  const weekNames = Array.from({ length: 7 }, (_, i) => {
    const d = en ? new Date(2023, 11, 31 + i) : new Date(2024, 0, 1 + i);
    const n = d.toLocaleDateString(loc, { weekday: "short" });
    return en ? n.slice(0, 2) : n;
  });

  function month(base, pos) {
    const y = base.getFullYear(), m = base.getMonth();
    const first = new Date(y, m, 1);
    const lead = en ? first.getDay() : (first.getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push(h("span", { key: "b" + i, className: "shc-blank" }));
    for (let d = 1; d <= days; d++) {
      const ds = y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
      const isS = ds === a, isE = ds === b;
      const inR = a && b && ds > a && ds < b;
      cells.push(
        h(
          "button",
          {
            key: ds,
            type: "button",
            className: "shc-day" + (isS || isE ? " sel" : "") + (inR ? " rng" : "") + (isS && b && a !== b ? " cs" : "") + (isE && a !== b ? " ce" : "") + (ds === todayStr ? " today" : ""),
            onClick: () => pick(ds),
            onMouseEnter: () => pending && setHover(ds),
            "aria-label": fmt(ds),
            "aria-pressed": isS || isE,
          },
          d,
        ),
      );
    }
    const caption = base.toLocaleDateString(loc, { month: "long", year: "numeric" });
    return h(
      "div",
      { className: "shc-m" + (pos === 1 ? " shc-m2" : ""), key: pos },
      h(
        "div",
        { className: "shc-head" },
        pos === 0
          ? h("button", { type: "button", className: "shc-nav", "aria-label": en ? "Previous month" : "Bulan sebelumnya", onClick: () => setView(new Date(y, m - 1, 1)) }, anIcon("chevL", 14))
          : h("span", { className: "shc-nav ghost" }),
        h("span", { className: "shc-cap", "aria-live": "polite" }, caption),
        pos === 1 || true
          ? h("button", { type: "button", className: "shc-nav" + (pos === 0 ? " shc-nav-r1" : ""), "aria-label": en ? "Next month" : "Bulan berikutnya", onClick: () => setView(new Date(y, m + 1, 1)) }, anIcon("chevR", 14))
          : null,
      ),
      h("div", { className: "shc-wk" }, weekNames.map((n, i) => h("span", { key: i }, n))),
      h("div", { className: "shc-grid" }, cells),
    );
  }

  return h(
    "div",
    { className: "sh", ref },
    h(
      "button",
      { type: "button", className: "sh-trigger", "aria-label": label, "aria-expanded": open, "aria-haspopup": "dialog", onClick: () => (open ? (setOpen(false), setPending(null)) : (setOpen(true), value.start && setView(new Date(new Date(value.start + "T00:00:00").getFullYear(), new Date(value.start + "T00:00:00").getMonth(), 1)))) },
      anIcon("calendar", 14),
      h("span", { className: "sh-value", style: { color: value.start && value.end ? undefined : "var(--c-inkSoft)" } }, text),
    ),
    open &&
      h(
        "div",
        { className: "sh-pop shc-pop", role: "dialog", "aria-label": label, onMouseLeave: () => setHover(null) },
        month(view, 0),
        month(new Date(view.getFullYear(), view.getMonth() + 1, 1), 1),
      ),
  );
}

/* ---------- util tanggal & angka (lokal, tanpa UTC shift) ---------- */
function anYmd(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function anAdd(ymd, n) {
  const d = new Date(ymd + "T00:00:00");
  d.setDate(d.getDate() + n);
  return anYmd(d);
}
function anDays(a, b) {
  return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 864e5) + 1;
}
function anRangeFor(preset, custom, minDate) {
  const now = new Date();
  const today = anYmd(now);
  if (preset === "30d") return { start: anAdd(today, -29), end: today };
  if (preset === "month") return { start: anYmd(new Date(now.getFullYear(), now.getMonth(), 1)), end: today };
  if (preset === "quarter") return { start: anYmd(new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)), end: today };
  if (preset === "all") return { start: minDate || anYmd(new Date(now.getFullYear(), 0, 1)), end: today };
  if (preset === "custom") {
    const s = custom.start || today;
    const e = custom.end || today;
    return s <= e ? { start: s, end: e } : { start: e, end: s };
  }
  return { start: anYmd(new Date(now.getFullYear(), 0, 1)), end: today };
}
function anPct(cur, prev) {
  if (!prev) return null;
  return ((cur - prev) / Math.abs(prev)) * 100;
}
function anMonthKeys(start, end) {
  const keys = [];
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const d = new Date(s.getFullYear(), s.getMonth(), 1);
  while (d <= e) {
    keys.push(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"));
    d.setMonth(d.getMonth() + 1);
  }
  return keys.slice(-12);
}
function anCompact(n) {
  const v = Math.abs(n);
  if (v >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + " M";
  if (v >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + " jt";
  if (v >= 1e3) return Math.round(n / 1e3) + " rb";
  return String(Math.round(n));
}

function anDownloadCsv(filename, rows) {
  const esc = (v) => '"' + String(v).replace(/"/g, '""') + '"';
  const csv = "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const AN_CSS = (B) => `
  .an { padding-bottom: 8px; }
  .an * { box-sizing: border-box; }
  .an-hatch { background-image: repeating-linear-gradient(45deg, rgba(255,255,255,.32) 0 1.5px, transparent 1.5px 4.5px); }
  .an-banner { display:flex; align-items:center; gap:10px; padding:10px 14px; margin-bottom:22px; border-radius:12px; background:${B.grayBg}; border:1px solid ${B.line}; font-size:13px; color:${B.ink}; }
  .an-banner button.link { background:none; border:none; padding:0; color:var(--c-ink); text-decoration:underline; text-underline-offset:3px; font-weight:600; cursor:pointer; font-size:13px; }
  .an-banner button.x { margin-left:auto; background:none; border:none; color:${B.inkSoft}; cursor:pointer; display:flex; padding:2px; }
  .an-head { display:flex; justify-content:space-between; align-items:flex-end; gap:12px; flex-wrap:wrap; margin-bottom:18px; }
  .an-title { margin:0 0 12px; font-size:22px; font-weight:600; letter-spacing:-.02em; color:${B.ink}; }
  .an-filters { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
  .an-chip { display:inline-flex; align-items:stretch; border:1px solid ${B.line}; border-radius:10px; background:${B.surface}; font-size:13px; }
  .an-chip > :first-child { border-radius:9px 0 0 9px; }
  .an-chip > :last-child { border-radius:0 9px 9px 0; }
  .an-chip > .lbl { padding:7px 11px; background:${B.grayBg}; color:${B.inkSoft}; display:flex; align-items:center; }
  .an-chip > .val { padding:0 10px; display:flex; align-items:center; gap:7px; color:${B.ink}; }
  .an-chip select, .an-chip input { border:none; background:transparent; color:${B.ink}; font-size:13px; padding:7px 0; outline:none; cursor:pointer; font-family:inherit; max-width:190px; }
  .an-chip input[type=date] { padding:6px 2px; }
  .an-chip > .val:has(.sh) { padding:0; }
  .sh { position:relative; display:flex; height:100%; }
  .sh-trigger { display:flex; align-items:center; gap:8px; height:100%; min-height:34px; padding:0 10px; border:none; background:transparent; color:${B.ink}; font-size:13px; font-family:inherit; cursor:pointer; border-radius:inherit; white-space:nowrap; }
  .sh-trigger:hover { background:${B.grayBg}; }
  .sh-trigger:focus-visible { outline:2px solid var(--c-ink); outline-offset:-2px; }
  .sh-trigger > svg:last-child { opacity:.5; margin-left:4px; }
  .sh-value { max-width:190px; overflow:hidden; text-overflow:ellipsis; }
  .sh-pop { position:absolute; top:calc(100% + 6px); left:0; z-index:60; min-width:100%; width:max-content; max-width:300px; max-height:300px; overflow-y:auto; padding:4px; background:${B.surface}; color:${B.ink}; border:1px solid ${B.line}; border-radius:10px; box-shadow:0 12px 32px -12px rgba(0,0,0,.35); animation:shIn .12s ease-out; }
  @keyframes shIn { from { opacity:0; transform:translateY(-4px) scale(.98); } to { opacity:1; transform:none; } }
  .shc-pop { display:flex; gap:20px; padding:12px; max-width:calc(100vw - 24px); width:max-content; }
  .shc-m { width:238px; }
  .shc-head { display:flex; align-items:center; justify-content:space-between; height:30px; margin-bottom:8px; }
  .shc-cap { font-size:13px; font-weight:600; }
  .shc-nav { width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:1px solid ${B.line}; border-radius:8px; background:transparent; color:${B.ink}; cursor:pointer; padding:0; }
  .shc-nav:hover { background:${B.grayBg}; }
  .shc-nav.ghost { border-color:transparent; cursor:default; }
  .shc-m:not(.shc-m2) .shc-nav-r1 { visibility:hidden; }
  .shc-wk, .shc-grid { display:grid; grid-template-columns:repeat(7, 1fr); }
  .shc-wk span { text-align:center; font-size:11.5px; color:${B.inkSoft}; height:26px; line-height:26px; }
  .shc-day { height:34px; border:none; background:transparent; color:${B.ink}; font-size:13px; font-family:inherit; cursor:pointer; padding:0; border-radius:8px; }
  .shc-day:hover { background:${B.grayBg}; }
  .shc-day.today { background:${B.grayBg}; font-weight:600; }
  .shc-day.rng { background:rgba(47,101,224,.16); border-radius:0; }
  .shc-day.sel { background:#2F65E0; color:#fff; font-weight:600; }
  .shc-day.sel.cs { border-top-right-radius:0; border-bottom-right-radius:0; }
  .shc-day.sel.ce { border-top-left-radius:0; border-bottom-left-radius:0; }
  .shc-day:focus-visible { outline:2px solid var(--c-ink); outline-offset:-2px; }
  @media (max-width: 640px) { .shc-m2 { display:none; } .shc-m:not(.shc-m2) .shc-nav-r1 { visibility:visible; } .shc-m { width:min(266px, calc(100vw - 48px)); } }
  .sh-item { display:flex; align-items:center; justify-content:space-between; gap:14px; padding:7px 8px 7px 10px; border-radius:7px; font-size:13px; cursor:default; user-select:none; }
  .sh-item[data-active="true"] { background:${B.grayBg}; }
  .sh-item .sh-label { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .sh-item .sh-ck { display:flex; color:${B.ink}; }
  .an-range { color:${B.inkSoft}; font-size:12.5px; }
  .an-export { display:inline-flex; align-items:center; gap:8px; height:36px; padding:0 14px; border-radius:10px; border:none; background:var(--brand); color:var(--on-brand); font-size:13px; font-weight:500; cursor:pointer; }
  .an-export:hover { filter:brightness(1.06); }
  .an-grid { display:grid; gap:16px; margin-bottom:16px; }
  .an-kpis { grid-template-columns: repeat(4, 1fr); }
  .an-row2 { grid-template-columns: 1fr 1fr; }
  .an-row3 { grid-template-columns: 1fr 1fr 1fr; }
  .an-card { background:${B.surface}; border:1px solid ${B.line}; border-radius:16px; padding:18px 18px 16px; min-width:0; }
  .an-card { container-type: inline-size; }
  .an-card h3 { margin:0; font-size:14px; font-weight:500; color:${B.inkSoft}; }
  .an-big { font-size:26px; font-weight:600; letter-spacing:-.02em; color:${B.ink}; margin:10px 0 0; line-height:1.15; }
  .an-kpis .an-big { font-size:22px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .an-kpi-foot { display:flex; justify-content:space-between; align-items:center; margin-top:18px; font-size:13px; color:${B.inkSoft}; gap:8px; }
  .an-kpi-foot > span:last-child { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; font-size:12.5px; }
  .an-kpi-foot .an-delta { flex-shrink:0; }
  .an-delta { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:999px; font-size:12.5px; font-weight:600; font-variant-numeric:tabular-nums; }
  .an-delta.up { color:${B.green}; background:${B.greenBg}; }
  .an-delta.down { color:#B91C1C; background:${B.redBg}; }
  [data-theme="dark"] .an-delta.down { color:${B.red}; }
  .an-delta.flat { color:${B.inkSoft}; background:${B.grayBg}; }
  .an-divider { border:none; border-top:1px solid ${B.line}; margin:14px 0; }
  .an-legend { display:flex; gap:18px; flex-wrap:wrap; font-size:13px; color:${B.ink}; margin-bottom:14px; }
  .an-legend i { display:inline-block; width:12px; height:9px; border-radius:2px; margin-right:7px; }
  .an-stack { display:flex; height:44px; border-radius:8px; overflow:hidden; background:${B.grayBg}; margin-bottom:18px; }
  .an-stack > div { height:100%; transition:width .4s ease; }
  .an-rows > div { display:grid; grid-template-columns: 22px 1fr auto 56px; align-items:center; gap:10px; padding:8px 0; font-size:13.5px; color:${B.ink}; }
  .an-rows .muted { color:${B.inkSoft}; text-align:right; font-variant-numeric:tabular-nums; }
  .an-rows .n { font-variant-numeric:tabular-nums; text-align:right; }
  .an-chart { display:flex; gap:7px; align-items:stretch; height:210px; }
  .an-col { flex:1; min-width:0; display:flex; flex-direction:column; align-items:center; gap:8px; }
  .an-track { flex:1; width:100%; max-width:40px; border-radius:6px; background:${B.grayBg}; position:relative; display:flex; align-items:flex-end; gap:2px; padding:0 2px; overflow:hidden; }
  .an-track > span { flex:1; border-radius:3px 3px 0 0; min-height:0; transition:height .4s ease; }
  .an-mlabel { font-size:11.5px; color:${B.inkSoft}; white-space:nowrap; }
  .an-list > div { display:grid; grid-template-columns: 38px minmax(110px,1.7fr) minmax(36px,.7fr) auto; align-items:center; gap:10px; padding:11px 0; border-top:1px solid ${B.line}; font-size:13.5px; color:${B.ink}; }
  .an-list > div:first-child { border-top:none; }
  .an-pill { justify-self:start; display:inline-flex; align-items:center; gap:6px; padding:3px 9px; border-radius:8px; background:rgba(47,101,224,.14); color:var(--an-ink); font-weight:500; max-width:100%; }
  .an-pill span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .an-bar { height:7px; border-radius:4px; background:${B.grayBg}; overflow:hidden; }
  .an-bar > div { height:100%; background:var(--an-gh); border-radius:4px; transition:width .4s ease; }
  .an-amt { color:${B.inkSoft}; font-size:12.5px; text-align:right; white-space:nowrap; font-variant-numeric:tabular-nums; }
  .an-cardhead { display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .an-more { width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:none; background:transparent; color:${B.inkSoft}; border-radius:8px; cursor:pointer; }
  .an-more:hover { background:${B.grayBg}; color:${B.ink}; }
  .an-menu { position:absolute; right:0; top:calc(100% + 4px); z-index:20; min-width:170px; background:${B.surface}; border:1px solid ${B.line}; border-radius:12px; padding:4px; box-shadow:0 14px 32px -14px rgba(0,0,0,.35); }
  .an-menu button { width:100%; text-align:left; padding:9px 10px; border:none; background:none; color:${B.ink}; font-size:13px; border-radius:8px; cursor:pointer; font-family:inherit; }
  .an-menu button:hover { background:${B.grayBg}; }
  .an-gauge { position:relative; width:100%; max-width:340px; margin:10px auto 0; }
  .an-gauge .mid { position:absolute; left:0; right:0; bottom:2px; text-align:center; }
  .an-gauge .mid small { display:block; font-size:clamp(12px, 4.2cqw, 14px); color:${B.inkSoft}; margin-bottom:6px; }
  .an-gauge .mid b { font-size:clamp(14px, 6.4cqw, 26px); font-weight:700; color:${B.ink}; letter-spacing:-.02em; white-space:nowrap; }
  .an-gauge .mid b span { font-weight:600; color:${B.inkSoft}; opacity:.75; }
  .an-foot { text-align:center; font-size:14px; color:${B.inkSoft}; margin:22px 0 0; }
  .an-dots { display:flex; justify-content:center; gap:6px; margin-top:22px; }
  .an-dots button { width:8px; height:8px; padding:0; border:none; border-radius:2px; background:${B.line}; cursor:pointer; }
  .an-dots button.on { background:${B.ink}; }
  .an-best { border:1px solid ${B.line}; border-radius:12px; padding:12px 14px; margin:14px 0 6px; font-size:13.5px; color:${B.ink}; }
  .an-best b { display:block; font-size:15px; margin-bottom:2px; }
  .an-best span { color:${B.inkSoft}; }
  .an-empty { padding:26px 0; text-align:center; color:${B.inkSoft}; font-size:13px; }
  @container (max-width: 460px) {
    .an-list > div { grid-template-columns: 38px minmax(0,1fr) auto; row-gap:7px; }
    .an-list > div .an-bar { grid-column: 2 / -1; grid-row: 2; }
  }
  .an-mobile-only { display:none; }
  @media (max-width: 1100px) { .an-row3 { grid-template-columns: 1fr 1fr; } .an-row3 > :first-child { grid-column: 1 / -1; } }
  @media (max-width: 980px) { .an-kpis { grid-template-columns: 1fr 1fr; } .an-row2 { grid-template-columns: 1fr; } }
  @media (max-width: 720px) { .an-row3 { grid-template-columns: 1fr; } .an-list > div { grid-template-columns: 40px minmax(0,1fr) auto; } .an-list .an-bar { display:none; } }
  @media (max-width: 560px) { .an-kpis { grid-template-columns: 1fr; } .an-rows > div { grid-template-columns: 22px 1fr auto 44px; } }
  @media (max-width: 880px) { .an-mobile-only { display:block; margin-top:26px; } }
`;

/* Gauge setengah lingkaran: busur tebal ujung rata, penanda di ujung progres, label + nominal di tengah. */
function anGauge(h, pct, label, value, S) {
  const CX = 150, CY = 150, R = 112, SW = 30;
  const arc = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;
  const p = Math.max(0, Math.min(100, pct));
  const theta = Math.PI - (p / 100) * Math.PI;
  const ex = CX + R * Math.cos(theta);
  const ey = CY - R * Math.sin(theta);
  const rot = -(theta * 180 / Math.PI + 90);
  const txt = fmtRp(value);
  const cut = txt.indexOf(".");
  const strong = cut > 0 ? txt.slice(0, cut) : txt;
  const soft = cut > 0 ? txt.slice(cut) : "";
  return h(
    "div",
    { className: "an-gauge" },
    h(
      "svg",
      { viewBox: "0 0 300 168", width: "100%", role: "img", "aria-label": label + " " + txt },
      h("path", { d: arc, fill: "none", stroke: BRAND.grayBg, strokeWidth: SW, pathLength: 100 }),
      p > 0 && h("path", { d: arc, fill: "none", stroke: "var(--an-1)", strokeWidth: SW, pathLength: 100, strokeDasharray: p + " 100" }),
      p > 0 && p < 100 && h("g", { transform: `translate(${ex} ${ey}) rotate(${rot})` }, h("rect", { x: -5, y: -(SW / 2 + 7), width: 10, height: SW + 14, rx: 2, fill: BRAND.surface, stroke: "var(--an-1)", strokeWidth: 2.5 })),
    ),
    h("div", { className: "mid" }, h("small", null, label), h("b", null, strong, h("span", null, soft))),
  );
}

function AnalyticsPage({ ctx }) {
  const h = React.createElement;
  const { invoices, expenses, overdueInvoices, setTab, lang } = ctx;
  const S = AN_STR[lang === "en" ? "en" : "id"];
  const [preset, setPreset] = useState("year");
  const [custom, setCustom] = useState({ start: "", end: "" });
  const [customer, setCustomer] = useState("");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [slide, setSlide] = useState(0);
  const [gMenu, setGMenu] = useState(false);

  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);

  // Rentang dihitung di klien (zona waktu pengguna); "Semua waktu" tidak mengirim start,
  // server memakai tanggal paling awal di data.
  const localRange = anRangeFor(preset, custom, undefined);
  const qs = new URLSearchParams({ end: localRange.end, today: anYmd(new Date()) });
  if (preset !== "all") qs.set("start", localRange.start);
  if (customer) qs.set("customer", customer);
  const qsKey = qs.toString();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    apiFetch("/api/analytics?" + qsKey)
      .then((d) => {
        if (!alive) return;
        setResp(d);
        setErr("");
        setLoading(false);
      })
      .catch((x) => {
        if (!alive) return;
        setErr(x.message || S.err_load);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [qsKey, tick]);

  // Muat ulang saat data lokal berubah (setelah jeda singkat agar sempat tersinkron ke server),
  // saat tab kembali aktif, dan berkala.
  useEffect(() => {
    const t = setTimeout(() => setTick((n) => n + 1), 1500);
    return () => clearTimeout(t);
  }, [invoices, expenses]);
  useEffect(() => {
    const onVis = () => document.visibilityState === "visible" && setTick((n) => n + 1);
    document.addEventListener("visibilitychange", onVis);
    const iv = setInterval(() => setTick((n) => n + 1), 30000);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(iv);
    };
  }, []);

  const ZERO = { revenue: 0, expenses: 0, profit: 0, invoiced: 0, paidOfInvoiced: 0, outstanding: 0 };
  const canExp = resp ? resp.canExpenses : true;
  const customers = resp ? resp.customers : [];
  const range = resp ? resp.range : localRange;
  const cur = resp ? { ...resp.current, exp: resp.current.expenses } : { ...ZERO, exp: 0 };
  const old = resp && resp.previous ? { ...resp.previous, exp: resp.previous.expenses } : null;
  const data = resp
    ? {
        ...resp.status,
        months: resp.months.map((m) => ({ key: m.key, label: monthLabel(m.key), revenue: m.revenue, expense: m.expense || 0 })),
        topCust: resp.topCustomers.map((c) => ({ ...c, name: c.name || S.no_name })),
        topItems: resp.topItems.map((i) => ({ ...i, name: i.name || S.no_name })),
      }
    : { total: 0, paid: 0, partial: 0, unpaid: 0, overdue: 0, months: [], topCust: [], topItems: [] };

  const rate = cur.invoiced > 0 ? Math.min(100, (cur.paidOfInvoiced / cur.invoiced) * 100) : 0;
  const totalPaidRev = data.topCust.reduce((s, c) => s + c.paid, 0) || 1;
  const itemsTotal = Object.values(data.topItems).reduce((s, c) => s + c.revenue, 0) || 1;
  const maxMonth = Math.max(1, ...data.months.map((m) => Math.max(m.revenue, m.expense)));

  // Badge perubahan vs periode sebelumnya. Warna = baik/buruk (hijau/merah), panah = arah naik/turun.
  // Pengeluaran & outstanding: turun = baik (goodWhenDown). Periode pembanding kosong -> "Baru".
  function delta(curV, oldV, goodWhenDown) {
    const tip = old ? S.vs_prev + ": " + fmtRp(oldV) : undefined;
    if (!old) return h("span", { className: "an-delta flat", title: tip }, "—");
    const p = anPct(curV, oldV);
    if (p === null) return h("span", { className: "an-delta flat", title: tip }, curV ? S.new_badge : "—");
    const flat = Math.abs(p) < 0.05;
    const good = goodWhenDown ? p <= 0 : p >= 0;
    return h("span", { className: "an-delta " + (flat ? "flat" : good ? "up" : "down"), title: tip }, !flat && anIcon(p > 0 ? "arrUp" : "arrDown", 12), (p > 0 ? "+" : "") + p.toFixed(1) + "%");
  }
  function kpi(label, value, curV, oldV, goodWhenDown, hidden) {
    if (hidden)
      return h("div", { className: "an-card", key: label }, h("h3", null, label), h("p", { className: "an-big" }, "—"), h("div", { className: "an-kpi-foot" }, h("span", null, S.no_access)));
    return h(
      "div",
      { className: "an-card", key: label },
      h("h3", null, label),
      h("p", { className: "an-big" }, fmtRp(value)),
      h("div", { className: "an-kpi-foot" }, delta(curV, oldV, goodWhenDown), h("span", null, S.vs_prev)),
    );
  }

  function exportCsv() {
    const rows = [
      [S.title, range.start + " — " + range.end, customer || S.all_customer],
      [],
      [S.revenue, cur.revenue],
      [S.expenses, canExp ? cur.exp : ""],
      [S.profit, canExp ? cur.profit : ""],
      [S.outstanding, cur.outstanding],
      [],
      [S.month_col, S.legend_revenue, S.legend_expense, S.profit_col],
      ...data.months.map((m) => [m.label, m.revenue, m.expense, m.revenue - m.expense]),
    ];
    anDownloadCsv("analytics-" + range.start + "_" + range.end + ".csv", rows);
  }

  const statusRows = [
    { key: "paid", icon: "check", n: data.paid, color: "var(--an-1)" },
    { key: "partial", icon: "clock", n: data.partial, color: "var(--an-2)" },
    { key: "unpaid", icon: "circle", n: data.unpaid, color: BRAND.inkSoft },
    { key: "overdue", icon: "alert", n: data.overdue, color: BRAND.red },
  ];
  const pctOf = (n) => (data.total ? Math.round((n / data.total) * 100) : 0);

  const rangeText = fmtDate(range.start) + " – " + fmtDate(range.end);

  return h(
    "div",
    { className: "an", style: { opacity: loading && !resp ? 0.6 : 1, transition: "opacity .2s" } },
    h("style", null, AN_CSS(BRAND)),
    err && h("div", { className: "an-banner", role: "alert", style: { color: BRAND.red } }, h("span", { style: { display: "flex" } }, anIcon("alert", 16)), h("span", null, err)),
    h(PageHeader, { title: S.title, subtitle: S.subtitle }),
    overdueInvoices && overdueInvoices.length > 0 && bannerOpen &&
      h(
        "div",
        { className: "an-banner", role: "status" },
        h("span", { style: { color: BRAND.red, display: "flex" } }, anIcon("alert", 16)),
        h("span", null, h("b", null, overdueInvoices.length), " " + S.overdue_banner(overdueInvoices.length) + " "),
        h("button", { className: "link", onClick: () => setTab("invoices") }, S.overdue_cta),
        h("button", { className: "x", onClick: () => setBannerOpen(false), "aria-label": "Close" }, anIcon("close", 16)),
      ),
    h(
      "div",
      { className: "an-head" },
      h(
        "div",
        null,
        h(
          "div",
          { className: "an-filters" },
          h(
            "div",
            { className: "an-chip" },
            h("span", { className: "lbl" }, S.date),
            h("span", { className: "val" }, h(ShSelect, { value: preset, onChange: (p) => { if (p === "custom" && !custom.start) setCustom({ start: range.start, end: range.end }); setPreset(p); }, icon: "calendar", label: S.date, options: ["year", "quarter", "month", "30d", "all", "custom"].map((p) => ({ value: p, label: S["p_" + p] })) })),
          ),
          preset === "custom" &&
            h("div", { className: "an-chip" }, h("span", { className: "val" }, h(ShDateRange, { value: custom, onChange: setCustom, lang, label: S.date }))),
          preset !== "custom" && h("span", { className: "an-range" }, rangeText),
          h(
            "div",
            { className: "an-chip" },
            h("span", { className: "lbl" }, S.customer),
            h("span", { className: "val" }, h(ShSelect, { value: customer, onChange: setCustomer, label: S.customer, options: [{ value: "", label: S.all_customer }, ...customers.map((c) => ({ value: c, label: c }))] })),
          ),
        ),
      ),
      h("button", { className: "an-export", onClick: exportCsv }, anIcon("download", 15), S.export),
    ),

    h(
      "div",
      { className: "an-grid an-kpis" },
      kpi(S.revenue, cur.revenue, cur.revenue, old && old.revenue, false),
      kpi(S.expenses, cur.exp, cur.exp, old && old.exp, true, !canExp),
      kpi(S.profit, cur.profit, cur.profit, old && old.profit, false, !canExp),
      kpi(S.outstanding, cur.outstanding, cur.outstanding, old && old.outstanding, true),
    ),

    h(
      "div",
      { className: "an-grid an-row2" },
      h(
        "div",
        { className: "an-card" },
        h("h3", null, S.invoice_perf),
        h("p", { className: "an-big" }, rate.toFixed(0) + "%", h("span", { style: { fontSize: 13, fontWeight: 400, color: BRAND.inkSoft, marginLeft: 8 } }, S.collected_of_billed)),
        h("hr", { className: "an-divider" }),
        h(
          "div",
          { className: "an-legend" },
          h("span", null, h("i", { style: { background: "var(--an-1)" } }), S.paid),
          h("span", null, h("i", { style: { background: "var(--an-2)" } }), S.partial),
          h("span", null, h("i", { style: { background: BRAND.grayBg, border: `1px solid ${BRAND.line}` } }), S.unpaid),
        ),
        data.total === 0
          ? h("div", { className: "an-empty" }, S.no_data)
          : [
              h(
                "div",
                { className: "an-stack", key: "s" },
                h("div", { className: "an-hatch", style: { width: pctOf(data.paid) + "%", background: "var(--an-1)" } }),
                h("div", { className: "an-hatch", style: { width: pctOf(data.partial) + "%", background: "var(--an-2)" } }),
              ),
              h(
                "div",
                { className: "an-rows", key: "r" },
                statusRows.map((r) =>
                  h(
                    "div",
                    { key: r.key },
                    h("span", { style: { color: r.color, display: "flex" } }, anIcon(r.icon, 16)),
                    h("span", null, S[r.key]),
                    h("span", { className: "n" }, r.n + " " + S.invoices_unit),
                    h("span", { className: "muted" }, pctOf(r.n) + "%"),
                  ),
                ),
              ),
            ],
      ),
      h(
        "div",
        { className: "an-card" },
        h("h3", null, S.rev_breakdown),
        h("p", { className: "an-big" }, fmtRp(cur.revenue)),
        h("hr", { className: "an-divider" }),
        h(
          "div",
          { className: "an-legend" },
          h("span", null, h("i", { style: { background: "var(--an-1)" } }), S.legend_revenue),
          canExp && h("span", null, h("i", { style: { background: "var(--an-2)" } }), S.legend_expense),
        ),
        data.months.length === 0 || data.months.every((m) => !m.revenue && !m.expense)
          ? h("div", { className: "an-empty" }, S.no_data)
          : h(
              "div",
              { className: "an-chart" },
              data.months.map((m) =>
                h(
                  "div",
                  { className: "an-col", key: m.key, title: m.label + "\n" + S.legend_revenue + ": " + fmtRp(m.revenue) + "\n" + S.legend_expense + ": " + fmtRp(m.expense) + "\n" + S.profit_col + ": " + fmtRp(m.revenue - m.expense) },
                  h(
                    "div",
                    { className: "an-track" },
                    h("span", { className: "an-hatch", style: { height: (m.revenue / maxMonth) * 100 + "%", background: "var(--an-g)" } }),
                    h("span", { className: "an-hatch", style: { height: (m.expense / maxMonth) * 100 + "%", background: "var(--an-2)" } }),
                  ),
                  h("div", { className: "an-mlabel" }, m.label),
                ),
              ),
            ),
      ),
    ),

    h(
      "div",
      { className: "an-grid an-row3" },
      h(
        "div",
        { className: "an-card" },
        h("h3", null, S.top_customers),
        h("hr", { className: "an-divider" }),
        data.topCust.length === 0
          ? h("div", { className: "an-empty" }, S.no_data)
          : h(
              "div",
              { className: "an-list" },
              data.topCust.map((c) =>
                h(
                  "div",
                  { key: c.name },
                  h("span", { style: { fontWeight: 500 } }, Math.round((c.paid / totalPaidRev) * 100) + "%"),
                  h("span", { className: "an-pill" }, anIcon("user", 13), h("span", null, c.name)),
                  h("div", { className: "an-bar" }, h("div", { style: { width: (c.paid / totalPaidRev) * 100 + "%" } })),
                  h("span", { className: "an-amt" }, fmtRp(c.paid)),
                ),
              ),
            ),
      ),
      h(
        "div",
        { className: "an-card" },
        h(
          "div",
          { className: "an-cardhead" },
          h("h3", null, S.collection),
          h(
            "div",
            { style: { position: "relative" } },
            h("button", { className: "an-more", "aria-label": S.g_menu, "aria-expanded": gMenu, onClick: () => setGMenu((v) => !v), onBlur: () => setTimeout(() => setGMenu(false), 150) }, anIcon("more", 16)),
            gMenu && h("div", { className: "an-menu", role: "menu" }, h("button", { role: "menuitem", onMouseDown: (e) => e.preventDefault(), onClick: () => { setGMenu(false); setTab("invoices"); } }, S.g_view)),
          ),
        ),
        h("hr", { className: "an-divider" }),
        (() => {
          const slides = [
            { label: S.g_collected, value: cur.paidOfInvoiced, pct: rate, cap: Math.round(rate) + "% " + S.g_collected_cap },
            { label: S.g_outstanding, value: cur.outstanding, pct: cur.invoiced > 0 ? 100 - rate : 0, cap: S.g_outstanding_cap },
            { label: S.g_invoiced, value: cur.invoiced, pct: cur.invoiced > 0 ? 100 : 0, cap: S.g_invoiced_cap },
          ];
          const sl = slides[slide];
          return h(
            "div",
            null,
            anGauge(h, sl.pct, sl.label, sl.value, S),
            h("p", { className: "an-foot" }, sl.cap),
            h(
              "div",
              { className: "an-dots", role: "tablist" },
              slides.map((x, i) => h("button", { key: i, role: "tab", "aria-selected": i === slide, "aria-label": x.label, className: i === slide ? "on" : "", onClick: () => setSlide(i) })),
            ),
          );
        })(),
      ),
      h(
        "div",
        { className: "an-card" },
        h("h3", null, S.top_items),
        h("hr", { className: "an-divider", style: { marginBottom: 0 } }),
        data.topItems.length === 0
          ? h("div", { className: "an-empty" }, S.no_data)
          : [
              h(
                "div",
                { className: "an-best", key: "b" },
                h("b", null, Math.round((data.topItems[0].revenue / itemsTotal) * 100) + "%"),
                h("span", null, S.best_item + ": "),
                data.topItems[0].name,
              ),
              h(
                "div",
                { className: "an-list", key: "l" },
                data.topItems.map((it) =>
                  h(
                    "div",
                    { key: it.name },
                    h("span", { style: { fontWeight: 500 } }, Math.round((it.revenue / itemsTotal) * 100) + "%"),
                    h("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, title: it.name }, it.name),
                    h("div", { className: "an-bar" }, h("div", { style: { width: (it.revenue / itemsTotal) * 100 + "%" } })),
                    h("span", { className: "an-amt" }, fmtRp(it.revenue)),
                  ),
                ),
              ),
            ],
      ),
    ),

    /* Di mobile, menu Home lama (grid tile) dipertahankan karena itu pintu masuk ke halaman lain. */
    h("div", { className: "an-mobile-only" }, h("h3", { style: { margin: "0 0 10px", fontSize: 14, color: BRAND.inkSoft, fontWeight: 500 } }, S.menu), h(HomePage, { ctx })),
  );
}
