/* PayHub: komponen UI bersama (dimuat paling awal, dipakai app.js, header.js, dst. saat render).

   Aplikasi ini tanpa build step, jadi komponen shadcn/Radix asli tidak bisa dipakai. Di sini ada versi
   ringan yang meniru struktur dan tampilannya, supaya halaman cukup memanggil komponen yang sama:

   - SearchField : kolom pencarian (mode input untuk filter halaman, mode tombol untuk pemicu palet ⌘K)
   - Table, TableHeader, TableBody, TableRow, TableHead, TableCell : tabel bergaya shadcn Table.
     Merender elemen HTML biasa (table/thead/tbody/tr/th/td) dengan class `ui-*`, semua props diteruskan. */

const UI_CSS = `
  /* ---- SearchField ---- */
  .ui-search { display:flex; align-items:center; gap:10px; height:38px; width:100%; padding:0 8px 0 12px; border:1px solid var(--c-line); border-radius:12px; background:var(--c-grayBg); color:var(--c-inkSoft); font-size:13px; font-family:inherit; text-align:left; cursor:text; transition:border-color .15s, background-color .15s; }
  button.ui-search { cursor:pointer; }
  .ui-search:hover { border-color:var(--c-inkSoft); }
  .ui-search:focus-within { border-color:var(--c-ink); background:var(--c-surface); }
  .ui-search > svg { flex-shrink:0; }
  .ui-search input, .ui-search input:focus { flex:1; min-width:0; height:100%; padding:0 !important; border:none !important; box-shadow:none !important; outline:none; background:transparent !important; color:var(--c-ink); font-size:13px; font-family:inherit; }
  .ui-search input::placeholder { color:var(--c-inkSoft); }
  .ui-search .ui-t { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ui-search kbd { font:inherit; font-size:11px; padding:2px 6px; border:1px solid var(--c-line); border-radius:6px; background:var(--c-surface); color:var(--c-inkSoft); }

  /* ---- Table (shadcn) ---- */
  .ui-table { width:100%; caption-side:bottom; border-collapse:separate; border-spacing:0; font-size:13.5px; }
  .ui-table .ui-thead .ui-tr:hover { background:transparent; }
  .ui-table .ui-th { position:relative; height:36px; padding:0 14px; text-align:left; vertical-align:middle; font-size:13px; font-weight:500 !important; color:var(--c-inkSoft); white-space:nowrap; background:var(--c-grayBg); border:none; letter-spacing:0; }
  .ui-table .ui-th:first-child { border-radius:10px 0 0 10px; }
  .ui-table .ui-th:last-child { border-radius:0 10px 10px 0; }
  .ui-table .ui-th + .ui-th::before { content:""; position:absolute; left:0; top:11px; bottom:11px; width:1px; background:var(--c-line); }
  .ui-table .ui-tbody .ui-tr { transition:background-color .15s; }
  .ui-table .ui-tbody .ui-tr:hover { background:var(--c-grayBg); }
  .ui-table .ui-td { padding:8px 14px; vertical-align:middle; font-size:13.5px; color:var(--c-ink); border-bottom:1px solid var(--c-line); }
  .ui-table .ui-tbody .ui-tr:last-child .ui-td { border-bottom:none; }
  .ui-table [data-num] { text-align:right; font-variant-numeric:tabular-nums; }
  .ui-table input[type=number] { -moz-appearance:textfield; appearance:textfield; }
  .ui-table input[type=number]::-webkit-inner-spin-button, .ui-table input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
  .ui-table tr[data-pg-hide] { display:none; }
  .ui-pager { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; padding:12px 14px; border-top:1px solid var(--c-line); }
  .ui-pager-info { font-size:12.5px; color:var(--c-inkSoft); }
  .ui-pager-ctl { display:flex; align-items:center; gap:4px; }
  .ui-pg { min-width:32px; height:32px; padding:0 8px; display:inline-flex; align-items:center; justify-content:center; border:1px solid transparent; border-radius:8px; background:transparent; color:var(--c-ink); font:inherit; font-size:13px; font-weight:500; cursor:pointer; transition:background-color .15s, border-color .15s; }
  .ui-pg:hover:not(:disabled) { background:var(--c-grayBg); }
  .ui-pg.on { border-color:var(--c-line); background:var(--c-surface); box-shadow:0 1px 2px rgba(9,9,11,.06); font-weight:600; }
  .ui-pg:disabled { opacity:.4; cursor:not-allowed; }
  .ui-pg:focus-visible { outline:2px solid var(--c-ink); outline-offset:1px; }
  .ui-pg-gap { min-width:24px; text-align:center; color:var(--c-inkSoft); }
  @media print { .ui-pager { display:none; } .ui-table tr[data-pg-hide] { display:table-row; } }
  .ui-table .ui-thead + .ui-tbody .ui-tr:first-child .ui-td { border-top:none; }
  /* ---- Dialog / form controls (shadcn) ---- */
  .modal-overlay { background:var(--c-overlay); backdrop-filter:blur(2px); animation:uiFade .15s ease-out; }
  .modal-panel { border-radius:14px !important; animation:uiPop .16s ease-out; }
  @keyframes uiFade { from { opacity:0 } to { opacity:1 } }
  @keyframes uiPop { from { opacity:0; transform:translateY(6px) scale(.985) } to { opacity:1; transform:none } }
  .ui-dlg-close { border:none; background:transparent; cursor:pointer; color:var(--c-inkSoft); width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:8px; padding:0; }
  .ui-dlg-close:hover { background:var(--c-grayBg); color:var(--c-ink); }
  .modal-panel label { font-size:13px; }
  .modal-panel input:not([type=checkbox]):not([type=radio]), .modal-panel textarea { border-radius:8px; border:1px solid var(--c-line); background:var(--c-surface); color:var(--c-ink); font-size:13.5px; min-height:36px; }
  .modal-panel input:disabled, .modal-panel input[readonly] { background:var(--c-grayBg); color:var(--c-inkSoft); cursor:not-allowed; }
  .modal-panel input::placeholder, .modal-panel textarea::placeholder { color:var(--c-inkSoft); }
  .ui-trigger { display:flex; align-items:center; justify-content:space-between; gap:8px; width:100%; min-height:36px; padding:0 12px; border:1px solid var(--c-line); border-radius:8px; background:var(--c-surface); color:var(--c-ink); font-size:13.5px; font-family:inherit; text-align:left; cursor:pointer; transition:border-color .15s, box-shadow .15s; }
  .ui-trigger:hover { border-color:var(--c-inkSoft); }
  .ui-trigger[aria-expanded="true"], .ui-trigger:focus-visible { outline:none; border-color:var(--c-ink); box-shadow:0 0 0 3px var(--c-blueTint); }
  .ui-trigger.ph { color:var(--c-inkSoft); }
  .ui-trigger:disabled { opacity:.55; cursor:not-allowed; }
  .ui-trigger > span { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ui-trigger > svg { flex-shrink:0; color:var(--c-inkSoft); }
  .ui-pop { position:fixed; z-index:300; background:var(--c-surface); color:var(--c-ink); border:1px solid var(--c-line); border-radius:10px; box-shadow:0 14px 32px -12px rgba(0,0,0,.35); animation:uiPop .12s ease-out; }
  .ui-list { max-height:260px; overflow-y:auto; padding:4px; }
  .ui-opt { display:flex; align-items:center; gap:8px; width:100%; padding:8px 10px; border:none; border-radius:6px; background:transparent; color:var(--c-ink); font-size:13.5px; font-family:inherit; text-align:left; cursor:pointer; }
  .ui-opt .ck { width:14px; flex-shrink:0; color:var(--c-ink); }
  .ui-opt.act, .ui-opt:hover { background:var(--c-grayBg); }
  .ui-opt.mut { color:var(--c-inkSoft); }
  .ui-opt:disabled { opacity:.5; cursor:not-allowed; }
  .ui-cal { width:252px; padding:12px; }
  .ui-cal-h { display:flex; align-items:center; justify-content:space-between; height:30px; margin-bottom:8px; }
  .ui-cal-h b { font-size:13px; font-weight:600; }
  .ui-cal-nav { width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:1px solid var(--c-line); border-radius:8px; background:transparent; color:var(--c-ink); cursor:pointer; padding:0; }
  .ui-cal-nav:hover { background:var(--c-grayBg); }
  .ui-cal-g { display:grid; grid-template-columns:repeat(7,1fr); }
  .ui-cal-w span { text-align:center; font-size:11.5px; color:var(--c-inkSoft); height:26px; line-height:26px; }
  .ui-cal-d { height:34px; border:none; background:transparent; color:var(--c-ink); font-size:13px; font-family:inherit; cursor:pointer; padding:0; border-radius:8px; }
  .ui-cal-d:hover { background:var(--c-grayBg); }
  .ui-cal-d.today { background:var(--c-grayBg); font-weight:600; }
  .ui-cal-d.sel, .ui-cal-d.sel:hover { background:#2F65E0; color:#fff; font-weight:600; }
  .ui-scroll .ui-th, .ui-tscroll .ui-th { position:sticky; top:0; z-index:2; }
  .ui-tscroll { overflow:auto; scrollbar-width:thin; }
  .ui-tscroll > .ui-table { margin:0; }
  .dlg-x { position:absolute; top:14px; right:14px; z-index:2; }
  .dlg-head { padding:24px 24px 0; }
  .dlg-ico { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:6px 0 18px 6px; }
  .dlg-ico span { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
  .dlg-title { margin:0; font-size:18px; font-weight:700; letter-spacing:-.01em; color:var(--c-ink); }
  .dlg-sub { margin:6px 0 0; font-size:13.5px; line-height:1.55; color:var(--c-inkSoft); }
  .dlg-body { padding:20px 24px 24px; }
  .dlg-opt { display:flex; align-items:center; gap:12px; width:100%; padding:12px 14px; border:1px solid var(--c-line); border-radius:10px; background:var(--c-surface); color:var(--c-ink); font-size:14px; font-weight:500; font-family:inherit; text-align:left; cursor:pointer; transition:background-color .15s, border-color .15s; }
  .dlg-opt:hover { background:var(--c-grayBg); border-color:var(--c-inkSoft); }
  .ui-tip { position:fixed; transform:translate(-50%, calc(-100% - 8px)); z-index:500; padding:5px 9px; border-radius:7px; background:var(--c-ink); color:var(--c-bg); font-size:12px; font-weight:500; line-height:1.3; white-space:nowrap; pointer-events:none; box-shadow:0 6px 16px -6px rgba(0,0,0,.4); animation:uiFade .1s ease-out; }
  .bk-stat { display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:500; color:var(--c-inkSoft); background:var(--c-grayBg); border-radius:999px; padding:4px 11px; margin-bottom:14px; }
  .bk-dot { width:7px; height:7px; border-radius:50%; background:#16A34A; }
  .bk-stat[data-stale="1"] .bk-dot { background:#E5484D; }
  .bk-card { border:1px solid var(--c-line); border-radius:12px; padding:16px; margin-bottom:12px; }
  .bk-head { display:flex; gap:12px; align-items:flex-start; }
  .bk-ico { flex-shrink:0; width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:var(--c-grayBg); color:var(--c-ink); }
  .bk-title { font-size:14px; font-weight:600; color:var(--c-ink); }
  .bk-hint { font-size:12.5px; line-height:1.55; color:var(--c-inkSoft); margin-top:3px; }
  .bk-lbl { display:block; font-size:12.5px; font-weight:500; color:var(--c-ink); margin-bottom:6px; }
  .ui-seg { display:inline-flex; gap:2px; padding:3px; border-radius:10px; background:var(--c-grayBg); }
  .ui-seg button { min-width:52px; height:30px; padding:0 12px; border:none; border-radius:8px; background:transparent; color:var(--c-inkSoft); font:inherit; font-size:13px; font-weight:500; cursor:pointer; transition:background-color .15s, color .15s; }
  .ui-seg button:hover { color:var(--c-ink); }
  .ui-seg button.on { background:var(--c-surface); color:var(--c-ink); font-weight:600; box-shadow:0 1px 2px rgba(9,9,11,.1); }
  .inv-sum { border:1px solid var(--c-line); border-radius:12px; padding:12px 14px; margin:-4px 0 16px; background:var(--c-grayBg); }
  .inv-sum-top { display:flex; align-items:baseline; gap:8px; font-size:13.5px; color:var(--c-ink); }
  .inv-sum-top span { font-size:12.5px; color:var(--c-inkSoft); }
  .inv-sum-itemsrow { display:flex; align-items:center; justify-content:space-between; gap:10px; margin:4px 0 10px; }
  .inv-sum-itemsrow .inv-link { flex-shrink:0; }
  .inv-sum-items { font-size:12.5px; color:var(--c-inkSoft); margin:4px 0 10px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .inv-sum-bot { display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:13.5px; color:var(--c-ink); }
  .inv-sum-lbl { font-size:12.5px; color:var(--c-inkSoft); }
  .inv-link { display:inline-flex; align-items:center; gap:4px; border:none; background:none; padding:0; font:inherit; font-size:13px; font-weight:600; color:var(--an-ink,#1D4ED8); cursor:pointer; }
  .inv-link:hover { text-decoration:underline; }
  .inv-terms { position:relative; margin-top:10px; height:156px; border:1px solid var(--c-line); border-radius:10px; overflow-y:auto; overscroll-behavior:contain; scrollbar-width:thin; scrollbar-gutter:stable; }
  .inv-terms.more { background:linear-gradient(var(--c-surface) 30%, transparent), linear-gradient(transparent, var(--c-surface) 70%) 0 100%, radial-gradient(farthest-side at 50% 0, rgba(9,9,11,.14), transparent), radial-gradient(farthest-side at 50% 100%, rgba(9,9,11,.14), transparent) 0 100%; background-repeat:no-repeat; background-size:100% 28px, 100% 28px, 100% 8px, 100% 8px; background-attachment:local, local, scroll, scroll; }
  .inv-term { display:grid; grid-template-columns:1fr 56px auto; gap:10px; align-items:center; padding:9px 12px; font-size:13px; color:var(--c-ink); }
  .inv-term-due { grid-template-columns:1fr auto 126px; }
  .inv-term.inv-term-due span:nth-child(2) { color:var(--c-ink); text-align:right; font-variant-numeric:tabular-nums; }
  .inv-term-due small { display:block; font-size:11.5px; font-weight:400; color:var(--c-inkSoft); margin-top:1px; }
  .inv-term-pay.inv-term-due { grid-template-columns:1fr auto 126px 70px; }
  .inv-term-pay { grid-template-columns:1fr 44px auto 78px; }
  .inv-paid { display:inline-flex; align-items:center; justify-content:center; gap:4px; height:26px; padding:0 10px; border:1px solid var(--c-line); border-radius:8px; background:var(--c-surface); color:var(--c-inkSoft); font:inherit; font-size:12px; font-weight:600; cursor:pointer; }
  .inv-paid:hover { background:var(--c-grayBg); }
  .inv-paid.on { border-color:var(--c-green,#16A34A); background:var(--c-greenBg,#DCFCE7); color:var(--c-green,#16A34A); }
  .ui-seg button:disabled { cursor:not-allowed; }
  .inv-term + .inv-term { border-top:1px solid var(--c-line); }
  .inv-term span:nth-child(2) { color:var(--c-inkSoft); text-align:right; }
  .inv-term span:last-child { text-align:right; font-variant-numeric:tabular-nums; }
  .ord-sec-title { font-size:13px; font-weight:600; color:var(--c-ink); margin-bottom:8px; }
  .ord-note { border:1px solid var(--c-line); border-radius:10px; background:var(--c-grayBg); padding:12px 14px; font-size:13.5px; line-height:1.55; color:var(--c-ink); white-space:pre-wrap; overflow-wrap:anywhere; min-height:46px; }
  .ord-note.empty { color:var(--c-inkSoft); }
  .ui-phone { display:flex; gap:8px; align-items:stretch; }
  .ui-phone-cc { width:auto; min-width:108px; flex-shrink:0; }
  .ui-phone-cc > span { flex:none; }
  .ui-phone-in { flex:1; min-width:0; }
  .ui-phone-pop { width:300px; padding:6px; }
  .ui-phone-q { width:100%; height:34px; padding:0 10px; margin-bottom:6px; border:1px solid var(--c-line); border-radius:8px; background:var(--c-surface); color:var(--c-ink); font:inherit; font-size:13px; outline:none; }
  .ui-phone-q:focus { border-color:var(--c-ink); box-shadow:0 0 0 3px var(--c-blueTint); }
  .ui-phone-pop .ui-opt { gap:8px; }
  .ui-phone-pop .ck { width:22px; text-align:center; font-size:15px; }
  .ui-phone-none { padding:14px; text-align:center; color:var(--c-inkSoft); font-size:13px; }
  .ui-tabs { display:flex; gap:4px; border-bottom:1px solid var(--c-line); margin-bottom:16px; overflow-x:auto; }
  .ui-tab { position:relative; display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 12px; border:none; background:none; color:var(--c-inkSoft); font:inherit; font-size:13.5px; font-weight:500; cursor:pointer; white-space:nowrap; }
  .ui-tab:hover { color:var(--c-ink); }
  .ui-tab.on { color:var(--c-ink); font-weight:600; }
  .ui-tab.on::after { content:""; position:absolute; left:8px; right:8px; bottom:-1px; height:2px; border-radius:2px; background:var(--c-ink); }
  .ui-tab-n { min-width:20px; height:20px; padding:0 6px; border-radius:10px; background:var(--c-grayBg); color:var(--c-inkSoft); font-size:11.5px; font-weight:600; display:inline-flex; align-items:center; justify-content:center; }
  .ui-tab.on .ui-tab-n { background:var(--c-ink); color:var(--c-bg); }
  .cd-pane { height:340px; overflow-y:auto; }
  .cd-infos { display:grid; grid-template-columns:1fr 1fr; gap:1px; border:1px solid var(--c-line); border-radius:10px; overflow:hidden; background:var(--c-line); }
  .cd-info { display:flex; flex-direction:column; gap:2px; padding:11px 14px; background:var(--c-surface); font-size:13.5px; min-width:0; }
  .cd-info span { font-size:12px; color:var(--c-inkSoft); }
  .cd-info b { font-weight:600; color:var(--c-ink); overflow-wrap:anywhere; }
  .ui-help { font-size:12px; color:var(--c-inkSoft); margin-top:6px; }
`;

const uiCx = (...a) => a.filter(Boolean).join(" ");

/* ---- SearchField ----
   Mode input  : <SearchField value onChange placeholder kbd? />
   Mode tombol : <SearchField onClick placeholder kbd? />   (tidak mengetik, hanya memicu aksi, mis. palet ⌘K) */
function SearchField({ value, onChange, onClick, placeholder, kbd, className, title }) {
  const h = React.createElement;
  const icon = h(
    "svg",
    { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
    h("circle", { cx: 11, cy: 11, r: 8 }),
    h("path", { d: "m21 21-4.3-4.3" }),
  );
  if (onClick) {
    return h("button", { type: "button", className: uiCx("ui-search", className), onClick, "aria-label": placeholder, title: title || placeholder }, icon, h("span", { className: "ui-t" }, placeholder), kbd && h("kbd", null, kbd));
  }
  return h(
    "label",
    { className: uiCx("ui-search", className) },
    icon,
    h("input", { type: "text", value: value || "", onChange: (e) => onChange && onChange(e.target.value), placeholder, "aria-label": placeholder }),
    kbd && h("kbd", null, kbd),
  );
}

/* ---- Table primitives ---- */
// Kolom yang isinya semua angka/uang/persen otomatis rata kanan (header ikut) lewat atribut data-num.
const UI_NUM_RE = /^(?:|[\u2014\u2013-]|(Rp\.?\s?)?[-+\u2212]?\s?[\d.,]+\s?(%|x)?)$/i;
const UI_PAGE_SIZE = 10;
function uiPages(cur, n) {
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
  const s = new Set([1, n, cur, cur - 1, cur + 1]);
  if (cur <= 3) [2, 3, 4].forEach((x) => s.add(x));
  if (cur >= n - 2) [n - 1, n - 2, n - 3].forEach((x) => s.add(x));
  const a = [...s].filter((x) => x >= 1 && x <= n).sort((x, y) => x - y), o = [];
  a.forEach((x, i) => { if (i && x - a[i - 1] > 1) o.push("…" + i); o.push(x); });
  return o;
}
function Table({ className, children, paginate, fit: fitOn, ...p }) {
  const h = React.createElement;
  const ref = React.useRef(null);
  const wrapRef = React.useRef(null);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const pages = Math.max(1, Math.ceil(total / UI_PAGE_SIZE));
  const cur = Math.min(page, pages);
  React.useLayoutEffect(() => {
    const t = ref.current;
    if (!t) return;
    const all = Array.from(t.querySelectorAll("tbody > tr")).filter((r) => !Array.from(r.children).some((c) => c.colSpan > 1));
    const on = paginate !== false && !t.closest(".ui-scroll");
    // baris input tunggal (form tambah data) tidak ikut dipaginasi; kalau mayoritas baris berisi input (mis. kolom catatan), semua dipaginasi
    const inp = all.filter((r) => r.querySelector("input,select,textarea")),
      rows = !on ? [] : inp.length * 2 > all.length ? all : all.filter((r) => !inp.includes(r));
    all.forEach((r) => r.removeAttribute("data-pg-hide"));
    const n = Math.max(1, Math.ceil(rows.length / UI_PAGE_SIZE)), c = Math.min(page, n);
    rows.forEach((r, i) => { if (i < (c - 1) * UI_PAGE_SIZE || i >= c * UI_PAGE_SIZE) r.setAttribute("data-pg-hide", ""); });
    setTotal((x) => (x === rows.length ? x : rows.length));
    if (page !== c) setPage(c);
  });
  // Tabel yang berdiri sendiri di halaman: tinggi disesuaikan supaya yang scroll tabelnya, bukan seluruh halaman.
  const fit = () => {
    const w = wrapRef.current;
    if (!w) return;
    w.style.maxHeight = "none";
    if (fitOn === false || w.closest(".modal-panel") || document.querySelectorAll(".ui-tscroll").length !== 1) return;
    let sp = w.parentElement;
    while (sp && sp !== document.body) {
      const oy = getComputedStyle(sp).overflowY;
      if ((oy === "auto" || oy === "scroll") && sp.scrollHeight > sp.clientHeight + 1) break;
      sp = sp.parentElement;
    }
    if (!sp || sp === document.body) return;
    const over = sp.scrollHeight - sp.clientHeight;
    if (over > 0) w.style.maxHeight = Math.max(160, w.offsetHeight - over) + "px";
  };
  React.useLayoutEffect(fit);
  React.useEffect(() => {
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  React.useEffect(() => {
    const t = ref.current;
    if (!t) return;
    const heads = Array.from(t.querySelectorAll("thead tr:last-child > th"));
    const rows = Array.from(t.querySelectorAll("tbody > tr")).filter((r) => !Array.from(r.children).some((c) => c.colSpan > 1));
    heads.forEach((th, i) => {
      const cells = rows.map((r) => r.children[i]).filter(Boolean);
      const num = cells.some((c) => (c.textContent || "").trim()) && !/phone|telp|\bhp\b|\bwa\b|whatsapp/i.test(th.textContent) && !/^(no\.?|#)$/i.test(th.textContent.trim()) && cells.every((c) => !c.querySelector("button,input,select,svg") && UI_NUM_RE.test((c.textContent || "").trim()));
      [th, ...cells].forEach((el) => (num ? el.setAttribute("data-num", "") : el.removeAttribute("data-num")));
    });
  });
  const en = (typeof window !== "undefined" && window.__uiLang) === "en";
  const from = (cur - 1) * UI_PAGE_SIZE + 1, to = Math.min(cur * UI_PAGE_SIZE, total);
  const go = (n) => setPage(Math.min(Math.max(1, n), pages));
  const chev = (d) => h("svg", { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, h("path", { d }));
  return h(
    React.Fragment,
    null,
    h("div", { ref: wrapRef, className: "ui-tscroll" }, h("table", { ...p, ref, className: uiCx("ui-table", className) }, children)),
    total > UI_PAGE_SIZE &&
      h(
        "nav",
        { className: "ui-pager", "aria-label": "Pagination" },
        h("div", { className: "ui-pager-info" }, en ? `Showing ${from}–${to} of ${total}` : `Menampilkan ${from}–${to} dari ${total}`),
        h(
          "div",
          { className: "ui-pager-ctl" },
          h("button", { type: "button", className: "ui-pg", disabled: cur === 1, onClick: () => go(cur - 1), "aria-label": en ? "Previous page" : "Halaman sebelumnya" }, chev("m15 18-6-6 6-6")),
          uiPages(cur, pages).map((x) => (typeof x === "string" ? h("span", { key: x, className: "ui-pg-gap" }, "…") : h("button", { key: x, type: "button", className: "ui-pg" + (x === cur ? " on" : ""), onClick: () => go(x), "aria-current": x === cur ? "page" : undefined }, x))),
          h("button", { type: "button", className: "ui-pg", disabled: cur === pages, onClick: () => go(cur + 1), "aria-label": en ? "Next page" : "Halaman berikutnya" }, chev("m9 18 6-6-6-6")),
        ),
      ),
  );
}
function TableHeader({ className, children, ...p }) {
  return React.createElement("thead", { ...p, className: uiCx("ui-thead", className) }, children);
}
function TableBody({ className, children, ...p }) {
  return React.createElement("tbody", { ...p, className: uiCx("ui-tbody", className) }, children);
}
function TableRow({ className, children, ...p }) {
  return React.createElement("tr", { ...p, className: uiCx("ui-tr", className) }, children);
}
function TableHead({ className, children, ...p }) {
  return React.createElement("th", { ...p, className: uiCx("ui-th", className) }, children);
}
function TableCell({ className, children, ...p }) {
  return React.createElement("td", { ...p, className: uiCx("ui-td", className) }, children);
}

/* ---- Popover bawaan (portal ke body, posisi fixed supaya tidak terpotong overflow modal/tabel) ---- */
function uiUsePop(open, setOpen, triggerRef) {
  const [pos, setPos] = React.useState(null);
  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 6, width: r.width, upTop: r.top - 6 });
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.type === "scroll" && e.target && e.target.closest && e.target.closest(".ui-pop")) return;
      setOpen(false);
    };
    const down = (e) => {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      if (e.target.closest && e.target.closest(".ui-pop")) return;
      setOpen(false);
    };
    const key = (e) => e.key === "Escape" && (e.stopPropagation(), setOpen(false));
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key, true);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);
  return pos;
}
const uiChev = () => React.createElement("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, React.createElement("path", { d: "m6 9 6 6 6-6" }));

/* ---- UiSelect: pengganti <select>. Dipakai persis seperti <select> (value, onChange(e.target.value), children <option>). ---- */
function UiSelect({ value, onChange, children, style, disabled, className }) {
  const h = React.createElement;
  const opts = React.Children.toArray(children)
    .flat(Infinity)
    .filter((c) => c && c.type === "option")
    .map((c) => {
      const kids = React.Children.toArray(c.props.children).join("");
      return { value: c.props.value !== undefined ? String(c.props.value) : kids, label: kids, disabled: !!c.props.disabled };
    });
  const [open, setOpen] = React.useState(false);
  const [act, setAct] = React.useState(0);
  const ref = React.useRef(null);
  const pos = uiUsePop(open, setOpen, ref);
  const cur = opts.find((o) => o.value === String(value == null ? "" : value));
  const isPh = !cur || cur.value === "";
  const pick = (o) => {
    setOpen(false);
    onChange && onChange({ target: { value: o.value } });
    ref.current && ref.current.focus();
  };
  const onKey = (e) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        setAct(Math.max(0, opts.indexOf(cur)));
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") (e.preventDefault(), setAct((a) => Math.min(opts.length - 1, a + 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setAct((a) => Math.max(0, a - 1)));
    else if (e.key === "Enter") (e.preventDefault(), opts[act] && !opts[act].disabled && pick(opts[act]));
  };
  const { width, padding, minWidth, maxWidth, marginBottom, marginTop, flex } = style || {};
  return h(
    React.Fragment,
    null,
    h(
      "button",
      { type: "button", ref, className: uiCx("ui-trigger", isPh && "ph", className), disabled, "aria-haspopup": "listbox", "aria-expanded": open, onClick: () => { setAct(Math.max(0, opts.indexOf(cur))); setOpen((o) => !o); }, onKeyDown: onKey, style: { width, padding, minWidth, maxWidth, marginBottom, marginTop, flex } },
      h("span", null, cur ? cur.label : (opts[0] && opts[0].label) || ""),
      uiChev(),
    ),
    open && pos && (
      h(
        "div",
        { className: "ui-pop", role: "listbox", style: { left: pos.left, top: pos.top, minWidth: pos.width } },
        h(
          "div",
          { className: "ui-list" },
          opts.map((o, i) =>
            h(
              "button",
              { key: i, type: "button", role: "option", "aria-selected": cur === o, disabled: o.disabled, className: uiCx("ui-opt", i === act && "act", o.value === "" && "mut"), onMouseEnter: () => setAct(i), onClick: () => pick(o) },
              h("span", { className: "ck" }, cur === o ? "\u2713" : ""),
              h("span", null, o.label),
            ),
          ),
        ),
      )
    ),
  );
}

/* ---- UiPhone: input telepon dengan pemilih kode negara (searchable). value disimpan sebagai "+<kode><nomor tanpa 0 depan>". ---- */
const UI_COUNTRIES = "AF:Afghanistan:93;AL:Albania:355;DZ:Algeria:213;AS:American Samoa:1684;AD:Andorra:376;AO:Angola:244;AI:Anguilla:1264;AG:Antigua and Barbuda:1268;AR:Argentina:54;AM:Armenia:374;AW:Aruba:297;AU:Australia:61;AT:Austria:43;AZ:Azerbaijan:994;BS:Bahamas:1242;BH:Bahrain:973;BD:Bangladesh:880;BB:Barbados:1246;BY:Belarus:375;BE:Belgium:32;BZ:Belize:501;BJ:Benin:229;BM:Bermuda:1441;BT:Bhutan:975;BO:Bolivia:591;BA:Bosnia and Herzegovina:387;BW:Botswana:267;BR:Brazil:55;IO:British Indian Ocean Territory:246;VG:British Virgin Islands:1284;BN:Brunei:673;BG:Bulgaria:359;BF:Burkina Faso:226;BI:Burundi:257;KH:Cambodia:855;CM:Cameroon:237;CA:Canada:1;CV:Cape Verde:238;KY:Cayman Islands:1345;CF:Central African Republic:236;TD:Chad:235;CL:Chile:56;CN:China:86;CX:Christmas Island:61;CC:Cocos Islands:61;CO:Colombia:57;KM:Comoros:269;CK:Cook Islands:682;CR:Costa Rica:506;HR:Croatia:385;CU:Cuba:53;CW:Curacao:599;CY:Cyprus:357;CZ:Czech Republic:420;CD:DR Congo:243;DK:Denmark:45;DJ:Djibouti:253;DM:Dominica:1767;DO:Dominican Republic:1809;TL:East Timor:670;EC:Ecuador:593;EG:Egypt:20;SV:El Salvador:503;GQ:Equatorial Guinea:240;ER:Eritrea:291;EE:Estonia:372;SZ:Eswatini:268;ET:Ethiopia:251;FK:Falkland Islands:500;FO:Faroe Islands:298;FJ:Fiji:679;FI:Finland:358;FR:France:33;GF:French Guiana:594;PF:French Polynesia:689;GA:Gabon:241;GM:Gambia:220;GE:Georgia:995;DE:Germany:49;GH:Ghana:233;GI:Gibraltar:350;GR:Greece:30;GL:Greenland:299;GD:Grenada:1473;GP:Guadeloupe:590;GU:Guam:1671;GT:Guatemala:502;GG:Guernsey:44;GN:Guinea:224;GW:Guinea-Bissau:245;GY:Guyana:592;HT:Haiti:509;HN:Honduras:504;HK:Hong Kong:852;HU:Hungary:36;IS:Iceland:354;IN:India:91;ID:Indonesia:62;IR:Iran:98;IQ:Iraq:964;IE:Ireland:353;IM:Isle of Man:44;IL:Israel:972;IT:Italy:39;CI:Ivory Coast:225;JM:Jamaica:1876;JP:Japan:81;JE:Jersey:44;JO:Jordan:962;KZ:Kazakhstan:7;KE:Kenya:254;KI:Kiribati:686;XK:Kosovo:383;KW:Kuwait:965;KG:Kyrgyzstan:996;LA:Laos:856;LV:Latvia:371;LB:Lebanon:961;LS:Lesotho:266;LR:Liberia:231;LY:Libya:218;LI:Liechtenstein:423;LT:Lithuania:370;LU:Luxembourg:352;MO:Macau:853;MG:Madagascar:261;MW:Malawi:265;MY:Malaysia:60;MV:Maldives:960;ML:Mali:223;MT:Malta:356;MH:Marshall Islands:692;MQ:Martinique:596;MR:Mauritania:222;MU:Mauritius:230;YT:Mayotte:262;MX:Mexico:52;FM:Micronesia:691;MD:Moldova:373;MC:Monaco:377;MN:Mongolia:976;ME:Montenegro:382;MS:Montserrat:1664;MA:Morocco:212;MZ:Mozambique:258;MM:Myanmar:95;NA:Namibia:264;NR:Nauru:674;NP:Nepal:977;NL:Netherlands:31;NC:New Caledonia:687;NZ:New Zealand:64;NI:Nicaragua:505;NE:Niger:227;NG:Nigeria:234;NU:Niue:683;NF:Norfolk Island:672;KP:North Korea:850;MK:North Macedonia:389;MP:Northern Mariana Islands:1670;NO:Norway:47;OM:Oman:968;PK:Pakistan:92;PW:Palau:680;PS:Palestine:970;PA:Panama:507;PG:Papua New Guinea:675;PY:Paraguay:595;PE:Peru:51;PH:Philippines:63;PL:Poland:48;PT:Portugal:351;PR:Puerto Rico:1787;QA:Qatar:974;CG:Republic of the Congo:242;RE:Reunion:262;RO:Romania:40;RU:Russia:7;RW:Rwanda:250;WS:Samoa:685;SM:San Marino:378;ST:Sao Tome and Principe:239;SA:Saudi Arabia:966;SN:Senegal:221;RS:Serbia:381;SC:Seychelles:248;SL:Sierra Leone:232;SG:Singapore:65;SX:Sint Maarten:1721;SK:Slovakia:421;SI:Slovenia:386;SB:Solomon Islands:677;SO:Somalia:252;ZA:South Africa:27;KR:South Korea:82;SS:South Sudan:211;ES:Spain:34;LK:Sri Lanka:94;BL:St Barthelemy:590;SH:St Helena:290;KN:St Kitts and Nevis:1869;LC:St Lucia:1758;MF:St Martin:590;PM:St Pierre and Miquelon:508;VC:St Vincent and the Grenadines:1784;SD:Sudan:249;SR:Suriname:597;SE:Sweden:46;CH:Switzerland:41;SY:Syria:963;TW:Taiwan:886;TJ:Tajikistan:992;TZ:Tanzania:255;TH:Thailand:66;TG:Togo:228;TK:Tokelau:690;TO:Tonga:676;TT:Trinidad and Tobago:1868;TN:Tunisia:216;TR:Turkey:90;TM:Turkmenistan:993;TC:Turks and Caicos:1649;TV:Tuvalu:688;VI:US Virgin Islands:1340;UG:Uganda:256;UA:Ukraine:380;AE:United Arab Emirates:971;GB:United Kingdom:44;US:United States:1;UY:Uruguay:598;UZ:Uzbekistan:998;VU:Vanuatu:678;VA:Vatican City:379;VE:Venezuela:58;VN:Vietnam:84;WF:Wallis and Futuna:681;EH:Western Sahara:212;YE:Yemen:967;ZM:Zambia:260;ZW:Zimbabwe:263".split(";").map((x) => { const p = x.split(":"); return { iso: p[0], name: p[1], dial: p[2] }; });
const UI_DIALS = [...new Set(UI_COUNTRIES.map((c) => c.dial))].sort((a, b) => b.length - a.length);
const uiFlag = (iso) => String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
function uiParsePhone(v) {
  v = String(v || "").trim();
  if (!v) return { iso: "ID", nat: "" };
  const digits = v.replace(/\D/g, "");
  if (v[0] === "+") {
    const d = UI_DIALS.find((x) => digits.startsWith(x));
    const pref = { 1: "US", 7: "RU", 44: "GB", 61: "AU", 590: "GP", 262: "RE", 212: "MA" }[d];
    if (d) return { iso: pref || (UI_COUNTRIES.find((c) => c.dial === d) || {}).iso || "ID", dial: d, nat: digits.slice(d.length) };
    return { iso: "ID", nat: digits };
  }
  if (digits.startsWith("0")) return { iso: "ID", nat: digits.replace(/^0+/, "") };
  if (digits.startsWith("62")) return { iso: "ID", nat: digits.slice(2) };
  return { iso: "ID", nat: digits };
}
function UiPhone({ value, onChange, style, placeholder }) {
  const h = React.createElement;
  const parsed = uiParsePhone(value);
  const [iso, setIso] = React.useState(parsed.iso);
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const ref = React.useRef(null);
  const pos = uiUsePop(open, setOpen, ref);
  const country = UI_COUNTRIES.find((c) => c.iso === iso) || UI_COUNTRIES.find((c) => c.iso === "ID");
  const nat = parsed.nat;
  const emit = (c, n) => onChange && onChange(n ? "+" + c.dial + n : "");
  const needle = q.trim().toLowerCase().replace(/^\+/, "");
  const list = [UI_COUNTRIES.find((c) => c.iso === "ID"), ...UI_COUNTRIES.filter((c) => c.iso !== "ID")].filter((c) => !needle || c.name.toLowerCase().includes(needle) || c.dial.startsWith(needle) || c.iso.toLowerCase() === needle);
  return h(
    "div",
    { className: "ui-phone" },
    h(
      "button",
      { type: "button", ref, className: "ui-trigger ui-phone-cc", "aria-haspopup": "listbox", "aria-expanded": open, onClick: () => { setQ(""); setOpen((o) => !o); }, "aria-label": "Country code", title: country.name },
      h("span", null, uiFlag(country.iso), " +", country.dial),
      uiChev(),
    ),
    h("input", { type: "tel", inputMode: "numeric", className: "ui-phone-in", style, value: nat, placeholder: placeholder || "812 3456 7890", onChange: (e) => emit(country, e.target.value.replace(/\D/g, "").replace(/^0+/, "")) }),
    open && pos && h(
      "div",
      { className: "ui-pop ui-phone-pop", role: "listbox", style: { left: pos.left, top: pos.top } },
      h("input", { className: "ui-phone-q", autoFocus: true, value: q, placeholder: "Search country or code", onChange: (e) => setQ(e.target.value) }),
      h(
        "div",
        { className: "ui-list", style: { maxHeight: 260 } },
        list.length === 0 && h("div", { className: "ui-phone-none" }, "No results"),
        list.map((c) =>
          h(
            "button",
            { key: c.iso, type: "button", role: "option", "aria-selected": c.iso === iso, className: uiCx("ui-opt", c.iso === iso && "act"), onClick: () => { setIso(c.iso); setOpen(false); emit(c, nat); } },
            h("span", { className: "ck" }, uiFlag(c.iso)),
            h("span", { style: { flex: 1 } }, c.name),
            h("span", { style: { color: "var(--c-inkSoft)" } }, "+" + c.dial),
          ),
        ),
      ),
    ),
  );
}

/* ---- UiDate: pengganti <input type="date"> dengan kalender popover. value/onChange memakai "YYYY-MM-DD". ---- */
function UiDate({ value, onChange, style, disabled, className }) {
  const h = React.createElement;
  const en = (() => { try { return /en/.test(localStorage.getItem("payhub::payhub_lang") || ""); } catch (_) { return false; } })();
  const loc = en ? "en-US" : "id-ID";
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const pos = uiUsePop(open, setOpen, ref);
  const base = value ? new Date(value + "T00:00:00") : new Date();
  const [view, setView] = React.useState(new Date(base.getFullYear(), base.getMonth(), 1));
  const ymd = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const today = ymd(new Date());
  const text = value ? new Date(value + "T00:00:00").toLocaleDateString(loc, { day: "2-digit", month: "short", year: "numeric" }) : en ? "Pick a date" : "Pilih tanggal";
  const y = view.getFullYear(), m = view.getMonth();
  const lead = en ? new Date(y, m, 1).getDay() : (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const wk = Array.from({ length: 7 }, (_, i) => (en ? new Date(2023, 11, 31 + i) : new Date(2024, 0, 1 + i)).toLocaleDateString(loc, { weekday: "short" }).slice(0, en ? 2 : 3));
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(h("span", { key: "b" + i }));
  for (let d = 1; d <= days; d++) {
    const ds = y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    cells.push(h("button", { key: ds, type: "button", className: uiCx("ui-cal-d", ds === value && "sel", ds === today && "today"), onClick: () => { onChange && onChange({ target: { value: ds } }); setOpen(false); } }, d));
  }
  const nav = (n) => setView(new Date(y, m + n, 1));
  const calIcon = h("svg", { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, h("rect", { x: 3, y: 4, width: 18, height: 18, rx: 2 }), h("path", { d: "M16 2v4M8 2v4M3 10h18" }));
  const { width, padding, minWidth } = style || {};
  return h(
    React.Fragment,
    null,
    h("button", { type: "button", ref, disabled, className: uiCx("ui-trigger", !value && "ph", className), "aria-haspopup": "dialog", "aria-expanded": open, onClick: () => { if (!open) setView(new Date(base.getFullYear(), base.getMonth(), 1)); setOpen((o) => !o); }, style: { width, padding, minWidth } }, h("span", null, text), calIcon),
    open && pos && (
      h(
        "div",
        { className: "ui-pop ui-cal", style: { left: Math.min(pos.left, window.innerWidth - 268), top: Math.min(pos.top, window.innerHeight - 330) } },
        h("div", { className: "ui-cal-h" },
          h("button", { type: "button", className: "ui-cal-nav", onClick: () => nav(-1), "aria-label": "Prev" }, h("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "m15 18-6-6 6-6" }))),
          h("b", null, view.toLocaleDateString(loc, { month: "long", year: "numeric" })),
          h("button", { type: "button", className: "ui-cal-nav", onClick: () => nav(1), "aria-label": "Next" }, h("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "m9 18 6-6-6-6" }))),
        ),
        h("div", { className: "ui-cal-g ui-cal-w" }, wk.map((w, i) => h("span", { key: i }, w))),
        h("div", { className: "ui-cal-g" }, cells),
      )
    ),
  );
}

/* ---- UiDescPick: dropdown multi-pilih (checkbox) + opsi "Custom" berisi teks bebas. value = string dipisah koma. ---- */
function UiDescPick({ options, value, onChange, placeholder, customLabel, customPlaceholder }) {
  const h = React.createElement;
  const parsed = parseDescValue(value);
  const [open, setOpen] = React.useState(false);
  const [cu, setCu] = React.useState(!!parsed.custom);
  const ref = React.useRef(null);
  const pos = uiUsePop(open, setOpen, ref);
  const toggle = (o) => {
    const sel = parsed.selected.includes(o) ? parsed.selected.filter((x) => x !== o) : [...parsed.selected, o];
    onChange(buildDescValue(sel, parsed.custom));
  };
  const toggleCustom = () => {
    if (cu) onChange(buildDescValue(parsed.selected, ""));
    setCu(!cu);
  };
  const lines = splitDescLines(value);
  const chk = (on) => h("span", { style: { width: 16, height: 16, flexShrink: 0, borderRadius: 4, border: "1px solid " + (on ? "#2F65E0" : "var(--c-inkSoft)"), background: on ? "#2F65E0" : "transparent", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, lineHeight: 1 } }, on ? "✓" : "");
  return h(
    React.Fragment,
    null,
    h("button", { type: "button", ref, className: uiCx("ui-trigger", !lines.length && "ph"), "aria-haspopup": "listbox", "aria-expanded": open, onClick: () => setOpen((o) => !o), style: { minWidth: 180 }, title: lines.join(", ") }, h("span", null, lines.length ? lines.join(", ") : placeholder), uiChev()),
    open && pos && h(
      "div",
      { className: "ui-pop", style: { left: pos.left, top: Math.min(pos.top, window.innerHeight - 380), minWidth: Math.max(pos.width, 280) } },
      h(
        "div",
        { className: "ui-list" },
        options.map((o) => h("button", { key: o, type: "button", className: "ui-opt", onClick: () => toggle(o) }, chk(parsed.selected.includes(o)), h("span", null, o))),
        h("button", { type: "button", className: "ui-opt", onClick: toggleCustom }, chk(cu), h("span", null, customLabel)),
        cu && h("input", { value: parsed.custom, placeholder: customPlaceholder, autoFocus: true, onChange: (e) => onChange(buildDescValue(parsed.selected, e.target.value)), style: { width: "calc(100% - 8px)", margin: "4px", padding: "0 10px" } }),
      ),
    ),
  );
}
