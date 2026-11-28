/* PayHub: export halaman Analytics ke PDF (satu halaman portrait panjang, gaya laporan) dan Excel (.xlsx).
   Dimuat setelah pdf.js; memakai PDF_C/pdfTxt/pdfRule/pdfWrap (pdf.js) dan fmtRp/fmtDate/anPct/anCompact/xlsSheet
   (analytics.js / app.js) hanya saat tombol Export diklik. Semua angka diambil dari data yang sedang tampil di halaman. */

const AX_STR = {
  id: {
    report: "Laporan Analytics",
    period: "Periode",
    customer: "Customer",
    generated: "Dibuat",
    summary: "Ringkasan Kinerja",
    vs_prev: "vs periode lalu",
    new_badge: "Baru",
    no_access: "Tidak ada akses",
    perf: "Performa Invoice",
    perf_sub: "dari nilai invoice sudah dibayar",
    inv: "invoice",
    target: "Target Revenue",
    target_none: "Belum ada target untuk periode ini",
    target_of: "dari target",
    achieved: "tercapai",
    monthly: "Bulanan",
    yearly: "Tahunan",
    by_month: "Revenue per Bulan",
    best_month: "Bulan terbaik",
    avg_month: "Rata-rata revenue / bulan",
    people: "Customer & Item Terlaris",
    no_data: "Belum ada data di rentang ini.",
    share: "Porsi",
    rank: "No",
    month: "Bulan",
    profit: "Profit",
    paid_col: "Sudah dibayar",
    invoiced_col: "Nilai invoice",
    item_col: "Item",
    cust_col: "Customer",
    sheet_sum: "Ringkasan",
    sheet_month: "Bulanan",
    sheet_cust: "Customer Teratas",
    sheet_item: "Item Terlaris",
    metric: "Metrik",
    value: "Nilai",
    prev: "Periode lalu",
    change: "Perubahan",
    status: "Status invoice",
    count: "Jumlah",
    total: "Total",
    page: "Halaman",
    export_pdf: "PDF",
    export_xls: "Excel (.xlsx)",
    exporting: "Menyiapkan…",
    fail: "Export gagal. Coba lagi setelah koneksi internet aktif.",
    report_month: "Laporan Bulanan",
    report_year: "Laporan Tahunan",
    vs_month: "vs bulan lalu",
    vs_year: "vs tahun lalu",
    trend12: "Tren 12 Bulan",
    rev_of: "Revenue",
    dlg_title: "Export Analytics",
    dlg_sub: "Pilih format dan periode laporan.",
    dlg_format: "Format",
    dlg_pdf_sub: "Laporan visual dengan grafik",
    dlg_xls_sub: "Data & tabel, siap diolah",
    dlg_period: "Periode",
    dlg_filter: "Sesuai filter halaman",
    dlg_month: "Per bulan",
    dlg_month_sub: "Satu bulan penuh + tren 12 bulan",
    dlg_year: "Per tahun",
    dlg_year_sub: "Satu tahun penuh, rincian per bulan",
    dlg_cust: "Customer",
    dlg_cancel: "Batal",
    dlg_go: "Export",
    sheet_target: "Target",
    target_col: "Target",
    real_col: "Realisasi",
    pct_col: "Pencapaian",
    fin_sum: "Ringkasan keuangan",
    rev_lbl: "Pendapatan",
    exp_lbl: "Pengeluaran",
    profit_lbl: "Laba bersih",
    out_lbl: "Outstanding",
    out_cap: "Jumlah tagihan yang belum dilunasi.",
    rev_cap: "Total pemasukan pada periode ini.",
    exp_cap: "Total biaya pada periode ini.",
    profit_cap: "Pendapatan dikurangi pengeluaran.",
    laba: "Laba",
    chart_title: "Pendapatan dan pengeluaran per bulan",
    breakdown: "Rincian per bulan (Rp)",
    inv_perf: "Performa invoice",
    src: "Sumber: Sumeriapoto Payhub · data sampai",
    gen_at: "Dibuat pada",
  },
  en: {
    report: "Analytics Report",
    period: "Period",
    customer: "Customer",
    generated: "Generated",
    summary: "Performance Summary",
    vs_prev: "vs last period",
    new_badge: "New",
    no_access: "No access",
    perf: "Invoice Performance",
    perf_sub: "of invoiced value collected",
    inv: "invoices",
    target: "Revenue Target",
    target_none: "No target set for this period",
    target_of: "of target",
    achieved: "achieved",
    monthly: "Monthly",
    yearly: "Yearly",
    by_month: "Revenue by Month",
    best_month: "Best month",
    avg_month: "Average revenue / month",
    people: "Top Customers & Items",
    no_data: "No data in this range yet.",
    share: "Share",
    rank: "No",
    month: "Month",
    profit: "Profit",
    paid_col: "Paid",
    invoiced_col: "Invoiced",
    item_col: "Item",
    cust_col: "Customer",
    sheet_sum: "Summary",
    sheet_month: "Monthly",
    sheet_cust: "Top Customers",
    sheet_item: "Top Items",
    metric: "Metric",
    value: "Value",
    prev: "Previous period",
    change: "Change",
    status: "Invoice status",
    count: "Count",
    total: "Total",
    page: "Page",
    export_pdf: "PDF",
    export_xls: "Excel (.xlsx)",
    exporting: "Preparing…",
    fail: "Export failed. Try again once you're online.",
    report_month: "Monthly Report",
    report_year: "Annual Report",
    vs_month: "vs last month",
    vs_year: "vs last year",
    trend12: "12-Month Trend",
    rev_of: "Revenue",
    dlg_title: "Export Analytics",
    dlg_sub: "Choose the format and report period.",
    dlg_format: "Format",
    dlg_pdf_sub: "Visual report with charts",
    dlg_xls_sub: "Data & tables, ready to analyse",
    dlg_period: "Period",
    dlg_filter: "Match page filter",
    dlg_month: "By month",
    dlg_month_sub: "One full month + 12-month trend",
    dlg_year: "By year",
    dlg_year_sub: "One full year, month-by-month breakdown",
    dlg_cust: "Customer",
    dlg_cancel: "Cancel",
    dlg_go: "Export",
    sheet_target: "Targets",
    target_col: "Target",
    real_col: "Actual",
    pct_col: "Achievement",
    fin_sum: "Financial summary",
    rev_lbl: "Revenue",
    exp_lbl: "Expenses",
    profit_lbl: "Net profit",
    out_lbl: "Outstanding",
    out_cap: "Total invoiced amount not yet settled.",
    rev_cap: "Total income in this period.",
    exp_cap: "Total costs in this period.",
    profit_cap: "Revenue minus expenses.",
    laba: "Profit",
    chart_title: "Revenue and expenses by month",
    breakdown: "Monthly breakdown (Rp)",
    inv_perf: "Invoice performance",
    src: "Source: Sumeriapoto Payhub · data up to",
    gen_at: "Generated on",
  },
};

/* ------------------------------------------------------------------ PDF ---- */

const AX_GREEN = [24, 98, 62];
const AX_RED = [176, 48, 48];

function axRoundRect(t, x, y, w, h, r, fill, stroke) {
  if (fill) t.setFillColor(fill[0], fill[1], fill[2]);
  if (stroke) {
    t.setDrawColor(stroke[0], stroke[1], stroke[2]);
    t.setLineWidth(0.7);
  }
  t.roundedRect(x, y, w, h, r, r, fill && stroke ? "FD" : fill ? "F" : "S");
}

/** Potong teks dengan "…" supaya muat `maxW` pt. */
function axFit(t, s, maxW, size, style) {
  t.setFont("helvetica", style || "normal");
  t.setFontSize(size);
  let str = String(s == null ? "" : s);
  if (t.getTextWidth(str) <= maxW) return str;
  while (str.length > 1 && t.getTextWidth(str + "…") > maxW) str = str.slice(0, -1);
  return str.trimEnd() + "…";
}

/** Sumbu "bulat": langkah 1/2/2.5/5 x 10^n dengan 4-6 interval; pilih batas atas terkecil yang memuat nilai. */
function axNiceMax(v) {
  if (v <= 0) return { max: 4, step: 1, n: 4 };
  let best = null;
  const k0 = Math.floor(Math.log10(v)) - 2;
  for (let k = k0; k <= k0 + 4; k++) {
    for (const m of [1, 2, 2.5, 5]) {
      const step = m * Math.pow(10, k);
      for (const n of [4, 5, 6]) {
        const max = step * n;
        if (max >= v && (!best || max < best.max - 1e-9 || (Math.abs(max - best.max) < 1e-9 && n < best.n))) best = { max, step, n };
      }
    }
  }
  return best;
}

function axDelta(S, cur, old) {
  // -> { text, tone: "up" | "down" | "flat", dir: 1 | -1 | 0 }
  if (!old) return { text: "—", tone: "flat", dir: 0 };
  const p = anPct(cur, old.v);
  if (p === null) return { text: cur ? S.new_badge : "—", tone: "flat", dir: 0 };
  if (Math.abs(p) < 0.05) return { text: "0.0%", tone: "flat", dir: 0 };
  const good = old.goodWhenDown ? p <= 0 : p >= 0;
  const txt = Math.abs(p) >= 1000 ? (p > 0 ? "+" : "-") + "999%+" : (p > 0 ? "+" : "") + p.toFixed(1) + "%";
  return { text: txt, tone: good ? "up" : "down", dir: p > 0 ? 1 : -1 };
}

/* Laporan satu halaman panjang (portrait) bergaya dokumen: judul serif, kalimat ringkasan, kartu angka,
   grafik batang per bulan, lalu tabel rincian. Tinggi halaman mengikuti isi (diukur dulu, lalu digambar). */

const AX_BLUE = [38, 125, 228];
const AX_ORANGE = [243, 115, 48];
const AX_BLUE_DIM = [190, 214, 246];
const AX_ORANGE_DIM = [250, 208, 186];
const AX_PROFIT = [22, 128, 61];
const AX_MON = {
  id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

function axMonthShort(key, lang, withYear) {
  const [y, m] = key.split("-").map(Number);
  const n = AX_MON[lang][m - 1] || key;
  return withYear ? n + " " + String(y).slice(2) : n;
}

/** "Rp 716,4 jt" / "Rp 1,2 M"; di bawah sejuta tampil penuh. */
function axRpShort(n, lang) {
  const v = Math.abs(n);
  const dec = (x) => (Math.round(x * 10) / 10).toString().replace(".", lang === "en" ? "." : ",");
  const sign = n < 0 ? "-" : "";
  if (v >= 1e9) return sign + "Rp " + dec(v / 1e9) + (lang === "en" ? " bn" : " M");
  if (v >= 1e6) return sign + "Rp " + dec(v / 1e6) + (lang === "en" ? " m" : " jt");
  return fmtRp(n);
}

/** Paragraf dengan potongan tebal. parts: string | { b: string }. Mengembalikan baseline baris terakhir. */
function axRich(t, parts, x, y, maxW, size, lh) {
  const toks = [];
  parts.forEach((p) => {
    const b = typeof p !== "string";
    (b ? p.b : p).split(/(\s+)/).forEach((w) => w && toks.push({ w, b }));
  });
  let cx = x,
    cy = y;
  toks.forEach((k) => {
    t.setFont("helvetica", k.b ? "bold" : "normal");
    t.setFontSize(size);
    const w = t.getTextWidth(k.w);
    if (/^\s+$/.test(k.w)) {
      if (cx > x) cx += w;
      return;
    }
    if (cx + w > x + maxW && cx > x) {
      cx = x;
      cy += lh;
    }
    pdfTxt(t, k.w, cx, cy, { size, style: k.b ? "bold" : "normal", color: k.b ? PDF_C.ink : PDF_C.text });
    cx += w;
  });
  return cy;
}

/** Tabel polos: header abu kecil, garis tipis antar baris. cols: [{ label, w (pecahan), align }]. cell = string | { t, color, bold }. */
function axTable(t, x, y, w, cols, rows) {
  const hh = 26,
    rh = 28,
    pad = 10;
  const xs = [];
  let cx = x;
  cols.forEach((c) => {
    xs.push(cx);
    cx += w * c.w;
  });
  const put = (txt, i, by, o) => {
    const colW = w * cols[i].w;
    const right = cols[i].align === "right";
    pdfTxt(t, axFit(t, txt, colW - pad * 2, o.size, o.bold ? "bold" : "normal"), right ? xs[i] + colW - pad : xs[i] + pad, by, {
      size: o.size,
      style: o.bold ? "bold" : "normal",
      color: o.color,
      align: right ? "right" : "left",
    });
  };
  cols.forEach((c, i) => put(c.label, i, y + 16, { size: 8.8, color: PDF_C.soft }));
  pdfRule(t, x, x + w, y + hh, PDF_C.rule, 0.6);
  rows.forEach((r, ri) => {
    const by = y + hh + ri * rh;
    r.forEach((cell, i) => {
      const o = typeof cell === "string" ? { t: cell } : cell;
      put(o.t, i, by + 18, { size: 10.2, color: o.color || PDF_C.ink, bold: !!o.bold });
    });
    if (ri < rows.length - 1) pdfRule(t, x, x + w, by + rh, [236, 236, 240], 0.5);
  });
  return y + hh + rows.length * rh;
}

/** Segitiga naik/turun + teks perubahan kecil. */
function axDeltaLine(t, S, x, y, delta) {
  const col = delta.tone === "up" ? AX_GREEN : delta.tone === "down" ? AX_RED : PDF_C.soft;
  let tx = x;
  if (delta.dir !== 0) {
    t.setFillColor(col[0], col[1], col[2]);
    if (delta.dir > 0) t.triangle(x, y - 1, x + 7, y - 1, x + 3.5, y - 7, "F");
    else t.triangle(x, y - 6, x + 7, y - 6, x + 3.5, y, "F");
    tx = x + 11;
  }
  pdfTxt(t, delta.text, tx, y, { size: 8, style: "bold", color: col });
  t.setFont("helvetica", "bold");
  t.setFontSize(8);
  const tw = t.getTextWidth(delta.text);
  pdfTxt(t, S.vsLabel || S.vs_prev, tx + tw + 5, y, { size: 7.6, color: PDF_C.soft });
}

/** Menggambar seluruh laporan; mengembalikan tinggi total yang dibutuhkan (pt). */
function axReport(t, S, d) {
  const W = t.internal.pageSize.getWidth();
  const M = 42,
    cw = W - M * 2,
    gap = 12;
  const lang = d.lang === "en" ? "en" : "id";
  const canExp = !!d.canExp;
  let y = 46;

  // --- judul
  pdfTxt(t, d.rangeText + "  ·  " + d.customerLabel, M, y, { size: 8.6, color: PDF_C.soft });
  pdfTxt(t, d.reportTitle, M, y + 30, { size: 22, font: "times", color: PDF_C.ink });
  y += 56;

  const ry = /^(\d{4})-01-01$/.exec(d.range.start);
  const whole = ry && d.range.end.slice(0, 4) === ry[1];
  const when =
    d.mode === "month"
      ? (lang === "en" ? "In " : "Pada ") + d.periodLabel
      : d.mode === "year" || whole
        ? (lang === "en" ? "Throughout " : "Sepanjang ") + (d.mode === "year" ? d.key : ry[1])
        : (lang === "en" ? "For " : "Pada periode ") + d.rangeText;
  const rev = { b: fmtRp(d.cur.revenue) },
    exp = { b: fmtRp(d.cur.exp) },
    out = { b: fmtRp(d.cur.outstanding) };
  const lead =
    lang === "en"
      ? canExp
        ? [when + ", revenue was ", rev, " and expenses ", exp, ", while ", out, " is still outstanding."]
        : [when + ", revenue was ", rev, ", while ", out, " is still outstanding."]
      : canExp
        ? [when + " tercatat pendapatan ", rev, " dan pengeluaran ", exp, ", sementara ", out, " masih outstanding."]
        : [when + " tercatat pendapatan ", rev, ", sementara ", out, " masih outstanding."];
  y = axRich(t, lead, M, y, cw, 11.5, 17) + 36;

  // --- ringkasan keuangan
  pdfTxt(t, S.fin_sum, M, y, { size: 11, style: "bold", color: PDF_C.ink });
  y += 16;
  axRoundRect(t, M, y, cw, 100, 8, PDF_C.white, PDF_C.rule);
  pdfTxt(t, S.out_lbl, M + 18, y + 27, { size: 9, color: PDF_C.soft });
  pdfTxt(t, fmtRp(d.cur.outstanding), M + 18, y + 67, { size: 32, font: "times", color: PDF_C.ink });
  pdfTxt(t, S.out_cap, M + 18, y + 86, { size: 8.6, color: PDF_C.soft });
  y += 100 + gap;

  const noAcc = { text: S.no_access, tone: "flat", dir: 0 };
  const c3 = (cw - gap * 2) / 3;
  const profitCol = d.cur.profit < 0 ? AX_RED : AX_PROFIT;
  [
    [S.rev_lbl, axRpShort(d.cur.revenue, lang), S.rev_cap, PDF_C.ink, d.old && axDelta(S, d.cur.revenue, { v: d.old.revenue })],
    [S.exp_lbl, canExp ? axRpShort(d.cur.exp, lang) : "—", canExp ? S.exp_cap : S.no_access, PDF_C.ink, canExp && d.old ? axDelta(S, d.cur.exp, { v: d.old.exp, goodWhenDown: true }) : null],
    [S.profit_lbl, canExp ? axRpShort(d.cur.profit, lang) : "—", canExp ? S.profit_cap : S.no_access, canExp ? profitCol : PDF_C.ink, canExp && d.old ? axDelta(S, d.cur.profit, { v: d.old.profit }) : null],
  ].forEach((c, i) => {
    const x = M + i * (c3 + gap);
    axRoundRect(t, x, y, c3, 100, 8, PDF_C.white, PDF_C.rule);
    pdfTxt(t, c[0], x + 16, y + 25, { size: 8.8, color: PDF_C.soft });
    pdfTxt(t, c[1], x + 16, y + 52, { size: 17, font: "times", color: c[3] });
    pdfWrap(t, c[2], c3 - 32, 8).slice(0, 2).forEach((ln, k) => pdfTxt(t, ln, x + 16, y + 68 + k * 10.5, { size: 8, color: PDF_C.soft }));
    if (c[4]) axDeltaLine(t, S, x + 16, y + 91, c[4]);
  });
  y += 100 + 36;

  // --- grafik per bulan
  const months = d.data.months || [];
  const withTx = months.filter((m) => m.revenue || (canExp && m.expense)).length;
  pdfTxt(t, S.chart_title, M, y, { size: 11, style: "bold", color: PDF_C.ink });
  pdfTxt(t, lang === "en" ? "Months with transactions: " + withTx + " of " + months.length + "." : "Bulan yang punya transaksi: " + withTx + " dari " + months.length + " bulan.", M, y + 19, { size: 9.2, color: PDF_C.soft });
  y += 44;
  let lx = M;
  [[S.rev_lbl, AX_BLUE]].concat(canExp ? [[S.exp_lbl, AX_ORANGE]] : []).forEach(([lab, col]) => {
    t.setFillColor(col[0], col[1], col[2]);
    t.circle(lx + 3.5, y - 3, 3.5, "F");
    pdfTxt(t, lab, lx + 12, y, { size: 9, color: PDF_C.soft });
    t.setFont("helvetica", "normal");
    t.setFontSize(9);
    lx += 12 + t.getTextWidth(lab) + 18;
  });
  y += 12;
  const ch = 214;
  axRoundRect(t, M, y, cw, ch, 8, PDF_C.white, PDF_C.rule);
  if (!months.length || !months.some((m) => m.revenue || m.expense)) {
    pdfTxt(t, S.no_data, M + cw / 2, y + ch / 2, { size: 11, color: PDF_C.soft, align: "center" });
  } else {
    const x0 = M + 48,
      x1 = M + cw - 16,
      top = y + 18,
      bottom = y + ch - 30,
      ph = bottom - top;
    const { max, step, n: gl } = axNiceMax(Math.max(1, ...months.map((m) => Math.max(m.revenue || 0, canExp ? m.expense || 0 : 0))));
    for (let i = 0; i <= gl; i++) {
      const v = step * i,
        gy = bottom - (v / max) * ph;
      pdfRule(t, x0, x1, gy, i === 0 ? PDF_C.faint : [236, 236, 240], i === 0 ? 0.8 : 0.5);
      pdfTxt(t, anCompact(v), x0 - 8, gy + 2.8, { size: 8, color: PDF_C.soft, align: "right" });
    }
    const n = months.length,
      slot = (x1 - x0) / n,
      groupW = Math.min(slot * 0.78, 46),
      barW = canExp ? groupW / 2 - 1 : Math.min(groupW, 28);
    const multiYear = new Set(months.map((m) => m.key.slice(0, 4))).size > 1;
    months.forEach((m, i) => {
      const gx = x0 + slot * i + slot / 2;
      const dim = d.highlight && m.key !== d.highlight;
      const bars = canExp
        ? [
            [m.revenue || 0, dim ? AX_BLUE_DIM : AX_BLUE, gx - barW - 1],
            [m.expense || 0, dim ? AX_ORANGE_DIM : AX_ORANGE, gx + 1],
          ]
        : [[m.revenue || 0, dim ? AX_BLUE_DIM : AX_BLUE, gx - barW / 2]];
      bars.forEach(([v, col, bx]) => {
        const bh = (v / max) * ph;
        if (bh <= 0.4) return;
        t.setFillColor(col[0], col[1], col[2]);
        const r = Math.min(2.5, barW / 2, bh / 2);
        t.roundedRect(bx, bottom - bh, barW, bh, r, r, "F");
        t.rect(bx, bottom - Math.min(bh, 4), barW, Math.min(bh, 4), "F");
      });
      const on = d.highlight && m.key === d.highlight;
      pdfTxt(t, axMonthShort(m.key, lang, multiYear), gx, bottom + 16, { size: multiYear ? 7.2 : 8.4, color: on ? PDF_C.ink : PDF_C.soft, style: on ? "bold" : "normal", align: "center" });
    });
  }
  y += ch + 32;

  // --- rincian per bulan
  if (months.length) {
    const sec = (title) => {
      t.setFillColor(PDF_C.soft[0], PDF_C.soft[1], PDF_C.soft[2]);
      t.triangle(M + 1, y - 7, M + 9, y - 7, M + 5, y - 1.5, "F");
      pdfTxt(t, title, M + 15, y, { size: 9.8, color: PDF_C.soft });
      y += 12;
    };
    sec(S.breakdown);
    const cols = canExp
      ? [{ label: S.month, w: 0.25 }, { label: S.rev_lbl, w: 0.25, align: "right" }, { label: S.exp_lbl, w: 0.25, align: "right" }, { label: S.laba, w: 0.25, align: "right" }]
      : [{ label: S.month, w: 0.5 }, { label: S.rev_lbl, w: 0.5, align: "right" }];
    const rows = months.map((m) => {
      const base = [axMonthShort(m.key, lang, true), fmtRp(m.revenue || 0)];
      if (!canExp) return base;
      const pr = (m.revenue || 0) - (m.expense || 0);
      return base.concat([fmtRp(m.expense || 0), { t: fmtRp(pr), color: pr < 0 ? AX_RED : PDF_C.ink }]);
    });
    y = axTable(t, M, y, cw, cols, rows) + 36;
  }

  // --- tambahan: performa invoice, target, customer & item teratas (gaya tabel yang sama)
  const heading = (title, sub) => {
    pdfTxt(t, title, M, y, { size: 11, style: "bold", color: PDF_C.ink });
    if (sub) pdfTxt(t, sub, M, y + 18, { size: 9.2, color: PDF_C.soft });
    y += sub ? 28 : 12;
  };
  const dd = d.data,
    totInv = dd.total || 0;
  heading(S.inv_perf, d.rate.toFixed(0) + "% " + S.perf_sub + ".");
  y =
    axTable(
      t,
      M,
      y,
      cw,
      [{ label: S.status, w: 0.5 }, { label: S.count, w: 0.25, align: "right" }, { label: S.share, w: 0.25, align: "right" }],
      [
        [d.S.paid, dd.paid],
        [d.S.partial, dd.partial],
        [d.S.unpaid, dd.unpaid],
        [d.S.overdue, dd.overdue],
      ].map(([lab, v], i) => [lab, { t: v + " " + (lang === "en" && v === 1 ? "invoice" : S.inv), color: i === 3 && v ? AX_RED : PDF_C.ink }, (totInv ? Math.round((v / totInv) * 100) : 0) + "%"]),
    ) + 36;

  const tg = d.target;
  const has = (b) => b && b.percent !== null && b.percent !== undefined;
  const tgRows = [];
  if (tg && tg.showMonth !== false && has(tg.month)) tgRows.push([S.monthly + " · " + tg.monthLabel, tg.month]);
  if (tg && has(tg.year)) tgRows.push([S.yearly + " · " + tg.yearLabel, tg.year]);
  if (tgRows.length) {
    heading(S.target);
    y =
      axTable(
        t,
        M,
        y,
        cw,
        [{ label: S.period, w: 0.37 }, { label: S.real_col, w: 0.23, align: "right" }, { label: S.target_col, w: 0.23, align: "right" }, { label: S.pct_col, w: 0.17, align: "right" }],
        tgRows.map(([lab, b]) => [lab, fmtRp(b.revenue || 0), b.target != null ? fmtRp(b.target) : "—", (Number.isInteger(b.percent) ? b.percent : b.percent.toFixed(1)) + "%"]),
      ) + 36;
  }

  const cust = (dd.topCust || []).slice(0, 5);
  const items = (dd.topItems || []).slice(0, 5);
  const ranked = (title, colLabel, list, key, valLabel, total) => {
    if (!list.length) return;
    heading(title);
    y =
      axTable(
        t,
        M,
        y,
        cw,
        [{ label: colLabel, w: 0.55 }, { label: valLabel, w: 0.27, align: "right" }, { label: S.share, w: 0.18, align: "right" }],
        list.map((r, i) => [i + 1 + ".  " + r.name, fmtRp(r[key]), (total ? Math.round((r[key] / total) * 100) : 0) + "%"]),
      ) + 36;
  };
  ranked(d.S.top_customers, S.cust_col, cust, "paid", S.paid_col, cust.reduce((a, c) => a + c.paid, 0));
  ranked(d.S.top_items, S.item_col, items, "revenue", S.rev_lbl, (dd.topItems || []).reduce((a, c) => a + c.revenue, 0));

  // --- footer
  pdfTxt(t, S.src + " " + fmtDate(d.range.end), M, y, { size: 8.6, color: PDF_C.soft });
  pdfTxt(t, S.gen_at + " " + d.generated + ".", W / 2, y + 34, { size: 8.2, color: PDF_C.soft, align: "center" });
  return y + 34 + 44;
}

function buildAnalyticsPdf(d) {
  if (typeof window.jspdf === "undefined") throw new Error("jsPDF not loaded");
  const S = { ...AX_STR[d.lang === "en" ? "en" : "id"], vsLabel: d.vsLabel };
  const mk = (h) => new window.jspdf.jsPDF({ unit: "pt", format: [595, h], orientation: "portrait" });
  // Ukur dulu pada halaman tinggi, lalu gambar ulang pada halaman setinggi isi.
  const H = Math.ceil(axReport(mk(8000), S, d));
  const t = mk(Math.max(H, 640));
  axReport(t, S, d);
  t.setProperties({ title: d.reportTitle + " · " + d.rangeText });
  return t;
}

/* ---------------------------------------------------------------- Excel ---- */

function buildAnalyticsWorkbook(d) {
  const S = AX_STR[d.lang === "en" ? "en" : "id"];
  const wb = XLSX.utils.book_new();
  const pct = (cur, prev) => {
    const p = anPct(cur, prev);
    return p === null ? "" : p / 100;
  };
  const prevOr = (v) => (d.old ? v : "");
  const kpis = [
    [d.S.revenue, d.cur.revenue, prevOr(d.old && d.old.revenue), d.old ? pct(d.cur.revenue, d.old.revenue) : ""],
    [d.S.expenses, d.canExp ? d.cur.exp : "", d.canExp ? prevOr(d.old && d.old.exp) : "", d.canExp && d.old ? pct(d.cur.exp, d.old.exp) : ""],
    [d.S.profit, d.canExp ? d.cur.profit : "", d.canExp ? prevOr(d.old && d.old.profit) : "", d.canExp && d.old ? pct(d.cur.profit, d.old.profit) : ""],
    [d.S.outstanding, d.cur.outstanding, prevOr(d.old && d.old.outstanding), d.old ? pct(d.cur.outstanding, d.old.outstanding) : ""],
    [d.S.g_invoiced, d.cur.invoiced, "", ""],
    [d.S.g_collected, d.cur.paidOfInvoiced, "", ""],
  ];
  const aoa = [
    [d.reportTitle],
    [S.period, d.periodLabel ? d.periodLabel + " (" + d.rangeText + ")" : d.rangeText],
    [S.customer, d.customerLabel],
    [S.generated, d.generated],
    [],
    [S.metric, S.value, S.prev, S.change],
    ...kpis,
    [d.S.invoice_perf + " (%)", d.rate / 100, "", ""],
    [],
    [S.status, S.count],
    [d.S.paid, d.data.paid],
    [d.S.partial, d.data.partial],
    [d.S.unpaid, d.data.unpaid],
    [d.S.overdue, d.data.overdue],
    [S.total, d.data.total],
  ];
  const tg = d.target;
  if (tg && tg.month && tg.month.percent !== null && tg.month.percent !== undefined) {
    aoa.push([], [S.target, "", "", ""]);
    aoa.push([S.monthly + " " + tg.monthLabel + " (%)", tg.month.percent / 100, tg.month.revenue !== undefined ? tg.month.revenue : "", tg.month.target !== undefined ? tg.month.target : ""]);
  }
  if (tg && tg.year && tg.year.percent !== null && tg.year.percent !== undefined)
    aoa.push([S.yearly + " " + tg.yearLabel + " (%)", tg.year.percent / 100, tg.year.revenue !== undefined ? tg.year.revenue : "", tg.year.target !== undefined ? tg.year.target : ""]);
  const ws0 = XLSX.utils.aoa_to_sheet(aoa);
  aoa.forEach((row, r) =>
    row.forEach((v, c) => {
      const cell = ws0[XLSX.utils.encode_cell({ r, c })];
      if (!cell || typeof cell.v !== "number") return;
      const label = String(row[0] || "");
      cell.z = /\(%\)$/.test(label) || (c === 3 && r >= 6 && r < 12) ? "0.0%" : "#,##0";
    }),
  );
  ws0["!cols"] = [{ wch: 34 }, { wch: 26 }, { wch: 20 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, ws0, S.sheet_sum);

  const monthRows = d.data.months.map((m) => [m.label, m.revenue || 0, d.canExp ? m.expense || 0 : "", d.canExp ? (m.revenue || 0) - (m.expense || 0) : ""]);
  const sumRev = d.data.months.reduce((s, m) => s + (m.revenue || 0), 0);
  const sumExp = d.data.months.reduce((s, m) => s + (m.expense || 0), 0);
  XLSX.utils.book_append_sheet(
    wb,
    xlsSheet(
      [{ h: S.month, w: 20, k: "t" }, { h: d.S.legend_revenue, w: 20, k: "n" }, { h: d.S.legend_expense, w: 20, k: "n" }, { h: S.profit, w: 20, k: "n" }],
      monthRows,
      monthRows.length ? [S.total, sumRev, d.canExp ? sumExp : "", d.canExp ? sumRev - sumExp : ""] : null,
    ),
    S.sheet_month,
  );

  const totC = d.data.topCust.reduce((s, c) => s + c.paid, 0) || 1;
  XLSX.utils.book_append_sheet(
    wb,
    xlsSheet(
      [{ h: S.rank, w: 6, k: "t" }, { h: S.cust_col, w: 34, k: "t" }, { h: S.paid_col, w: 20, k: "n" }, { h: S.invoiced_col, w: 20, k: "n" }, { h: S.share, w: 10, k: "t" }],
      d.data.topCust.map((c, i) => [i + 1, c.name, c.paid, c.invoiced === undefined ? "" : c.invoiced, Math.round((c.paid / totC) * 100) + "%"]),
      null,
    ),
    S.sheet_cust,
  );

  const totI = Object.values(d.data.topItems).reduce((s, c) => s + c.revenue, 0) || 1;
  XLSX.utils.book_append_sheet(
    wb,
    xlsSheet(
      [{ h: S.rank, w: 6, k: "t" }, { h: S.item_col, w: 40, k: "t" }, { h: d.S.legend_revenue, w: 20, k: "n" }, { h: S.share, w: 10, k: "t" }],
      d.data.topItems.map((it, i) => [i + 1, it.name, it.revenue, Math.round((it.revenue / totI) * 100) + "%"]),
      null,
    ),
    S.sheet_item,
  );
  if (d.monthTargets && d.monthTargets.length) {
    const rows = d.monthTargets.map((m) => [tgMonthLabel(m.month, d.lang, false), m.target === null ? "" : m.target, m.revenue, m.percent === null || m.percent === undefined ? "" : m.percent / 100]);
    const ws = xlsSheet(
      [{ h: S.month, w: 20, k: "t" }, { h: S.target_col, w: 22, k: "n" }, { h: S.real_col, w: 22, k: "n" }, { h: S.pct_col, w: 16, k: "n" }],
      rows,
      d.yearTarget ? [S.yearly + " " + d.yearTarget.year, d.yearTarget.target === null ? "" : d.yearTarget.target, d.yearTarget.revenue, d.yearTarget.percent === null || d.yearTarget.percent === undefined ? "" : d.yearTarget.percent / 100] : null,
    );
    // kolom Pencapaian = persen
    for (let r = 1; r <= rows.length + 1; r++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c: 3 })];
      if (cell && typeof cell.v === "number") cell.z = "0.0%";
    }
    XLSX.utils.book_append_sheet(wb, ws, S.sheet_target);
  }
  return wb;
}

/* --------------------------------------------------------------- Entry ---- */

const axPad2 = (n) => String(n).padStart(2, "0");
const axLastDay = (y, m) => new Date(y, m, 0).getDate();
const axTodayYmd = () => anYmd(new Date());

function axFileBase(d) {
  if (d.mode === "month") return "Sumeriapoto-Analytics-" + d.key;
  if (d.mode === "year") return "Sumeriapoto-Analytics-" + d.key;
  return "Sumeriapoto-Analytics-" + d.range.start + "_" + d.range.end;
}

/** Bentuk data halaman dari respons /api/analytics (sama seperti yang dihitung AnalyticsPage). */
function axShape(resp, S) {
  const noName = S.no_name;
  return {
    range: resp.range,
    canExp: resp.canExpenses,
    cur: { ...resp.current, exp: resp.current.expenses },
    prevCur: resp.current,
    data: {
      ...resp.status,
      months: resp.months.map((m) => ({ key: m.key, label: monthLabel(m.key), revenue: m.revenue, expense: m.expense || 0 })),
      topCust: resp.topCustomers.map((c) => ({ ...c, name: c.name || noName })),
      topItems: resp.topItems.map((i) => ({ ...i, name: i.name || noName })),
    },
  };
}

function axFetch(start, end, customer) {
  const qs = new URLSearchParams({ start, end, today: axTodayYmd() });
  if (customer) qs.set("customer", customer);
  return apiFetch("/api/analytics?" + qs.toString());
}

async function axLoadTarget(monthKey, lang, showMonth) {
  // Gagal / tidak ada akses -> null (laporan tetap dibuat tanpa blok target).
  try {
    const r = await apiFetch("/api/targets/progress?month=" + monthKey);
    return {
      showMonth,
      monthLabel: tgMonthLabel(r.month, lang, true),
      yearLabel: String(r.year.year),
      month: { percent: r.percent, revenue: r.revenue, target: r.target },
      year: { percent: r.year.percent, revenue: r.year.revenue, target: r.year.target },
    };
  } catch (e) {
    return null;
  }
}

async function axLoadMonthTargets(year) {
  try {
    const r = await apiFetch("/api/targets?year=" + year);
    return { months: r.months, yearly: { year: r.year, target: r.yearly.target, revenue: r.yearly.revenue, percent: r.yearly.percent } };
  } catch (e) {
    return null; // hanya role dengan izin kelola target
  }
}

/** opts: { format: "pdf" | "xlsx", scope: "filter" | "month" | "year", year, month }. base = data halaman saat ini. */
async function exportAnalytics(opts, base) {
  const lang = base.lang === "en" ? "en" : "id";
  const X = AX_STR[lang];
  const customer = base.customerValue || "";
  const generated = new Date().toLocaleString(lang === "en" ? "en-GB" : "id-ID", { dateStyle: "long", timeStyle: "short" });
  let d;
  if (opts.scope === "month") {
    const y = Number(opts.year),
      m = Number(opts.month);
    const key = y + "-" + axPad2(m);
    const today = axTodayYmd();
    const mStart = key + "-01";
    const mEnd = key + "-" + axPad2(axLastDay(y, m));
    const end = mEnd > today ? today : mEnd;
    const py = m === 1 ? y - 1 : y,
      pm = m === 1 ? 12 : m - 1;
    const prevStart = py + "-" + axPad2(pm) + "-01",
      prevEnd = py + "-" + axPad2(pm) + "-" + axPad2(axLastDay(py, pm));
    const trendStart = anYmd(new Date(y, m - 1 - 11, 1));
    const [rCur, rTrend, rPrev, tg] = await Promise.all([axFetch(mStart, end, customer), axFetch(trendStart, end, customer), axFetch(prevStart, prevEnd, customer), axLoadTarget(key, lang, true)]);
    d = axShape(rCur, base.S);
    d.data.months = axShape(rTrend, base.S).data.months;
    d.old = { ...rPrev.current, exp: rPrev.current.expenses };
    d.mode = "month";
    d.key = key;
    d.highlight = key;
    d.reportTitle = X.report_month;
    d.periodLabel = tgMonthLabel(key, lang, true);
    d.vsLabel = X.vs_month;
    d.target = tg;
  } else if (opts.scope === "year") {
    const y = Number(opts.year);
    const today = axTodayYmd();
    const yEnd = y + "-12-31";
    const end = yEnd > today ? today : yEnd;
    const [rCur, rPrev, tg, mt] = await Promise.all([
      axFetch(y + "-01-01", end, customer),
      axFetch(y - 1 + "-01-01", y - 1 + "-12-31", customer),
      axLoadTarget(y + "-12", lang, false),
      axLoadMonthTargets(y),
    ]);
    d = axShape(rCur, base.S);
    d.old = { ...rPrev.current, exp: rPrev.current.expenses };
    d.mode = "year";
    d.key = String(y);
    d.reportTitle = X.report_year;
    d.periodLabel = X.yearly + " " + y;
    d.vsLabel = X.vs_year;
    d.target = tg;
    if (mt) {
      d.monthTargets = mt.months;
      d.yearTarget = mt.yearly;
    }
  } else {
    d = { range: base.range, canExp: base.canExp, cur: base.cur, old: base.old, data: base.data };
    d.mode = "range";
    d.reportTitle = X.report;
    d.vsLabel = X.vs_prev;
    d.target = await axLoadTarget(base.range.end.slice(0, 7), lang, true);
  }
  d.lang = lang;
  d.S = base.S;
  d.rangeText = fmtDate(d.range.start) + " – " + fmtDate(d.range.end);
  d.customerLabel = customer || base.S.all_customer;
  d.rate = d.cur.invoiced > 0 ? Math.min(100, (d.cur.paidOfInvoiced / d.cur.invoiced) * 100) : 0;
  d.generated = generated;
  if (opts.format === "pdf") buildAnalyticsPdf(d).save(axFileBase(d) + ".pdf");
  else XLSX.writeFile(buildAnalyticsWorkbook(d), axFileBase(d) + ".xlsx");
}

/* --------------------------------------------------------------- Dialog ---- */

const AX_DLG_CSS = (BRAND) => `
  .ax-lbl { font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:${BRAND.inkSoft}; font-weight:600; margin:0 0 8px; }
  .ax-sec { margin-bottom:20px; }
  .ax-fmt { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .ax-opt { display:flex; flex-direction:column; align-items:flex-start; gap:3px; width:100%; padding:13px 14px; border:1px solid ${BRAND.line}; border-radius:12px; background:${BRAND.surface}; color:${BRAND.ink}; font:inherit; font-size:14px; font-weight:600; text-align:left; cursor:pointer; transition:border-color .15s, background .15s; }
  .ax-opt small { font-size:12px; font-weight:400; color:${BRAND.inkSoft}; }
  .ax-opt:hover { background:${BRAND.grayBg}; }
  .ax-opt.on { border-color:${BRAND.ink}; box-shadow:0 0 0 1px ${BRAND.ink} inset; }
  .ax-scopes { display:flex; flex-direction:column; gap:8px; }
  .ax-row { display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid ${BRAND.line}; border-radius:12px; background:${BRAND.surface}; color:${BRAND.ink}; font:inherit; font-size:14px; text-align:left; cursor:pointer; width:100%; }
  .ax-row:hover { background:${BRAND.grayBg}; }
  .ax-row.on { border-color:${BRAND.ink}; box-shadow:0 0 0 1px ${BRAND.ink} inset; }
  .ax-row .dot { width:16px; height:16px; border-radius:50%; border:1.5px solid ${BRAND.inkSoft}; flex:none; display:flex; align-items:center; justify-content:center; }
  .ax-row.on .dot { border-color:${BRAND.ink}; }
  .ax-row.on .dot::after { content:""; width:8px; height:8px; border-radius:50%; background:${BRAND.ink}; }
  .ax-row b { font-weight:600; display:block; }
  .ax-row small { display:block; color:${BRAND.inkSoft}; font-size:12px; margin-top:1px; }
  .ax-pick { display:flex; gap:8px; margin:8px 0 2px 28px; }
  .ax-pick select { flex:1; min-width:0; height:38px; border:1px solid ${BRAND.line}; border-radius:10px; background:${BRAND.surface}; color:${BRAND.ink}; padding:0 10px; font:inherit; font-size:14px; }
  .ax-note { font-size:12.5px; color:${BRAND.inkSoft}; margin:0 0 4px; }
`;

function ExportDialog({ lang, base, onClose }) {
  const h = React.createElement;
  const T = AX_STR[lang === "en" ? "en" : "id"];
  const now = new Date();
  const [format, setFormat] = useState("pdf");
  const [scope, setScope] = useState("filter");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [busy, setBusy] = useState(false);
  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 4 + i);
  const monthName = (m) => new Date(2000, m - 1, 1).toLocaleDateString(lang === "en" ? "en-GB" : "id-ID", { month: "long" });
  const rangeText = fmtDate(base.range.start) + " – " + fmtDate(base.range.end);

  const scopeRow = (key, title, sub, pick) =>
    h(
      "div",
      { key },
      h(
        "button",
        { type: "button", className: "ax-row" + (scope === key ? " on" : ""), onClick: () => setScope(key), "aria-pressed": scope === key },
        h("span", { className: "dot" }),
        h("span", null, h("b", null, title), h("small", null, sub)),
      ),
      scope === key && pick,
    );
  const yearSel = h("select", { "aria-label": T.dlg_year, value: year, onChange: (e) => setYear(Number(e.target.value)) }, years.map((y) => h("option", { key: y, value: y }, y)));

  function go() {
    if (busy) return;
    setBusy(true);
    exportAnalytics({ format, scope, year, month }, base)
      .then(onClose)
      .catch((e) => {
        console.error("analytics export failed", e);
        alert(T.fail);
        setBusy(false);
      });
  }

  return h(
    Modal,
    { title: T.dlg_title, subtitle: T.dlg_sub, onClose, width: 480, icon: Download },
    h("style", null, AX_DLG_CSS(BRAND)),
    h(
      "div",
      { className: "ax-sec" },
      h("p", { className: "ax-lbl" }, T.dlg_format),
      h(
        "div",
        { className: "ax-fmt" },
        h("button", { type: "button", className: "ax-opt" + (format === "pdf" ? " on" : ""), onClick: () => setFormat("pdf"), "aria-pressed": format === "pdf" }, T.export_pdf, h("small", null, T.dlg_pdf_sub)),
        h("button", { type: "button", className: "ax-opt" + (format === "xlsx" ? " on" : ""), onClick: () => setFormat("xlsx"), "aria-pressed": format === "xlsx" }, T.export_xls, h("small", null, T.dlg_xls_sub)),
      ),
    ),
    h(
      "div",
      { className: "ax-sec" },
      h("p", { className: "ax-lbl" }, T.dlg_period),
      h(
        "div",
        { className: "ax-scopes" },
        scopeRow("filter", T.dlg_filter, rangeText),
        scopeRow(
          "month",
          T.dlg_month,
          T.dlg_month_sub,
          h("div", { className: "ax-pick" }, h("select", { "aria-label": "Bulan", value: month, onChange: (e) => setMonth(Number(e.target.value)) }, Array.from({ length: 12 }, (_, i) => h("option", { key: i, value: i + 1 }, monthName(i + 1)))), yearSel),
        ),
        scopeRow("year", T.dlg_year, T.dlg_year_sub, h("div", { className: "ax-pick" }, yearSel)),
      ),
    ),
    h("p", { className: "ax-note" }, T.dlg_cust + ": " + base.customerLabel),
    h(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 } },
      h(Button, { variant: "secondary", icon: X, onClick: onClose }, T.dlg_cancel),
      h(Button, { icon: Download, onClick: go, disabled: busy }, busy ? T.exporting : T.dlg_go),
    ),
  );
}
