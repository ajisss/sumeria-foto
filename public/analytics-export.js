/* PayHub: export halaman Analytics ke PDF (lanskap, siap presentasi) dan Excel (.xlsx).
   Dimuat setelah pdf.js; memakai PDF_C/pdfTxt/pdfRule/pdfLogo (pdf.js) dan fmtRp/fmtDate/anPct/anCompact/xlsSheet
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
  },
};

/* ------------------------------------------------------------------ PDF ---- */

const AX_GREEN = [24, 98, 62];
const AX_RED = [176, 48, 48];
const AX_REV = PDF_C.gold; // revenue
const AX_EXP = [150, 150, 158]; // expenses
const AX_PANEL = [250, 249, 246];

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

/** Batas atas sumbu "bulat" (1, 2, 2.5, 5 x 10^n) dan langkah 4-5 garis. */
function axNiceMax(v) {
  if (v <= 0) return { max: 1, step: 0.25 };
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (m * mag >= v) return { max: m * mag, step: (m * mag) / 4 };
  }
  return { max: 10 * mag, step: (10 * mag) / 4 };
}

function axDelta(S, cur, old) {
  // -> { text, tone: "up" | "down" | "flat", dir: 1 | -1 | 0 }
  if (!old) return { text: "—", tone: "flat", dir: 0 };
  const p = anPct(cur, old.v);
  if (p === null) return { text: cur ? S.new_badge : "—", tone: "flat", dir: 0 };
  if (Math.abs(p) < 0.05) return { text: "0.0%", tone: "flat", dir: 0 };
  const good = old.goodWhenDown ? p <= 0 : p >= 0;
  return { text: (p > 0 ? "+" : "") + p.toFixed(1) + "%", tone: good ? "up" : "down", dir: p > 0 ? 1 : -1 };
}

function axPageChrome(t, S, d, pageNo, title) {
  const W = t.internal.pageSize.getWidth();
  const H = t.internal.pageSize.getHeight();
  const M = 48;
  pdfLogo(t, M, 28, 104);
  pdfTxt(t, (d.reportTitle + "  ·  " + (d.periodLabel || d.rangeText)).toUpperCase(), W - M, 42, { size: 6.8, color: PDF_C.soft, align: "right", cs: 1.4 });
  pdfRule(t, M, W - M, 64, PDF_C.rule, 0.6);
  pdfRule(t, M, M + 46, 64, PDF_C.gold, 1.8);
  if (title) pdfTxt(t, title, M, 104, { size: 25, font: "times", color: PDF_C.ink });
  // footer
  pdfRule(t, M, W - M, H - 38, PDF_C.rule, 0.6);
  pdfTxt(t, "Created by Sumeriapoto Payhub", M, H - 22, { size: 6.8, color: PDF_C.faint, cs: 0.5 });
  pdfTxt(t, String(pageNo), W - M, H - 22, { size: 7.2, color: PDF_C.faint, align: "right" });
}

function axCover(t, S, d) {
  const W = t.internal.pageSize.getWidth();
  const H = t.internal.pageSize.getHeight();
  const M = 64;
  pdfLogo(t, M, 76, 250);
  pdfRule(t, M, W - M, 140, PDF_C.rule, 0.6);
  pdfRule(t, M, M + 70, 140, PDF_C.gold, 2.2);
  pdfTxt(t, d.reportTitle, M, 250, { size: 46, font: "times", color: PDF_C.ink });
  pdfTxt(t, d.periodLabel || d.rangeText, M, 290, { size: 17, color: PDF_C.text });
  if (d.periodLabel) pdfTxt(t, d.rangeText, M, 310, { size: 10.5, color: PDF_C.soft });
  pdfLabel(t, S.customer, M, 342);
  pdfTxt(t, d.customerLabel, M, 362, { size: 13, color: PDF_C.ink, font: "times", style: "bold" });
  pdfLabel(t, S.generated, M, 400);
  pdfTxt(t, d.generated, M, 420, { size: 11, color: PDF_C.text });
  // alamat di dasar sampul
  pdfRule(t, M, W - M, H - 96, PDF_C.rule, 0.6);
  pdfRule(t, M, M + 70, H - 96, PDF_C.gold, 1.8);
  PDF_FOOTER_LINES.forEach((ln, i) =>
    pdfTxt(t, ln, M, H - 76 + i * 12.5, { size: 8.2, color: i === 0 ? PDF_C.ink : PDF_C.soft, style: i === 0 ? "bold" : "normal" }),
  );
  pdfTxt(t, "Created by Sumeriapoto Payhub", W - M, H - 30, { size: 7, color: PDF_C.faint, align: "right", cs: 0.5 });
}

function axKpiCard(t, S, x, y, w, h, label, valueText, delta) {
  axRoundRect(t, x, y, w, h, 8, PDF_C.white, PDF_C.rule);
  pdfTxt(t, label.toUpperCase(), x + 16, y + 24, { size: 7, style: "bold", color: PDF_C.gold, cs: 1.3 });
  pdfTxt(t, valueText, x + 16, y + 56, { size: valueText.length > 14 ? 16 : 19, style: "bold", color: PDF_C.ink });
  if (!delta) return;
  const col = delta.tone === "up" ? AX_GREEN : delta.tone === "down" ? AX_RED : PDF_C.soft;
  let tx = x + 16;
  if (delta.dir !== 0) {
    // segitiga kecil (naik / turun)
    t.setFillColor(col[0], col[1], col[2]);
    const cx = x + 20.5,
      cy = y + 80;
    if (delta.dir > 0) t.triangle(cx - 4, cy + 3, cx + 4, cy + 3, cx, cy - 4, "F");
    else t.triangle(cx - 4, cy - 3, cx + 4, cy - 3, cx, cy + 4, "F");
    tx = x + 29;
  }
  pdfTxt(t, delta.text, tx, y + 83, { size: 9, style: "bold", color: col });
  const tw = (t.setFont("helvetica", "bold"), t.setFontSize(9), t.getTextWidth(delta.text));
  pdfTxt(t, S.vsLabel || S.vs_prev, tx + tw + 6, y + 83, { size: 8, color: PDF_C.soft });
}

function axProgress(t, x, y, w, pct, color) {
  axRoundRect(t, x, y, w, 8, 4, [238, 238, 241]);
  const p = Math.max(0, Math.min(100, pct || 0));
  if (p > 0) axRoundRect(t, x, y, Math.max(8, (w * p) / 100), 8, 4, color);
}

function axSummaryPage(t, S, d) {
  const W = t.internal.pageSize.getWidth();
  const M = 48;
  const gap = 14;
  const cw = (W - M * 2 - gap * 3) / 4;
  const cy = 128;
  const ch = 108;
  const cards = [
    [d.S.revenue, fmtRp(d.cur.revenue), axDelta(S, d.cur.revenue, d.old && { v: d.old.revenue })],
    [d.S.expenses, d.canExp ? fmtRp(d.cur.exp) : "—", d.canExp ? axDelta(S, d.cur.exp, d.old && { v: d.old.exp, goodWhenDown: true }) : { text: S.no_access, tone: "flat", dir: 0 }],
    [d.S.profit, d.canExp ? fmtRp(d.cur.profit) : "—", d.canExp ? axDelta(S, d.cur.profit, d.old && { v: d.old.profit }) : { text: S.no_access, tone: "flat", dir: 0 }],
    [d.S.outstanding, fmtRp(d.cur.outstanding), axDelta(S, d.cur.outstanding, d.old && { v: d.old.outstanding, goodWhenDown: true })],
  ];
  cards.forEach((c, i) => axKpiCard(t, S, M + i * (cw + gap), cy, cw, ch, c[0], c[1], c[2]));

  const py = cy + ch + 22;
  const ph = 250;
  const lw = (W - M * 2 - gap) * 0.55;
  const rw = W - M * 2 - gap - lw;

  // --- Performa invoice
  axRoundRect(t, M, py, lw, ph, 8, AX_PANEL, PDF_C.rule);
  pdfLabel(t, S.perf, M + 20, py + 28);
  pdfTxt(t, d.rate.toFixed(0) + "%", M + 20, py + 74, { size: 38, style: "bold", color: PDF_C.ink });
  t.setFont("helvetica", "bold");
  t.setFontSize(38);
  const rx = M + 20 + t.getTextWidth(d.rate.toFixed(0) + "%") + 10;
  pdfTxt(t, S.perf_sub, rx, py + 72, { size: 10, color: PDF_C.soft });
  const bw = lw - 40;
  const total = d.data.total;
  const bx = M + 20;
  const by = py + 94;
  axRoundRect(t, bx, by, bw, 14, 7, [232, 232, 236]);
  if (total > 0) {
    const paidW = (bw * d.data.paid) / total;
    const partW = (bw * d.data.partial) / total;
    if (paidW > 0) axRoundRect(t, bx, by, Math.max(14, paidW), 14, 7, AX_REV);
    if (partW > 0) {
      t.setFillColor(214, 190, 148);
      t.rect(bx + paidW, by, partW, 14, "F");
    }
  }
  const rows = [
    [d.S.paid, d.data.paid, AX_REV],
    [d.S.partial, d.data.partial, [214, 190, 148]],
    [d.S.unpaid, d.data.unpaid, [200, 200, 206]],
    [d.S.overdue, d.data.overdue, AX_RED],
  ];
  rows.forEach((r, i) => {
    const ry = by + 46 + i * 30;
    t.setFillColor(r[2][0], r[2][1], r[2][2]);
    t.circle(bx + 4, ry - 3, 3.4, "F");
    pdfTxt(t, r[0], bx + 16, ry, { size: 10.5, color: PDF_C.text });
    pdfTxt(t, r[1] + " " + S.inv, bx + bw - 54, ry, { size: 10.5, style: "bold", color: PDF_C.ink, align: "right" });
    pdfTxt(t, (total ? Math.round((r[1] / total) * 100) : 0) + "%", bx + bw, ry, { size: 10.5, color: PDF_C.soft, align: "right" });
    if (i < rows.length - 1) pdfRule(t, bx, bx + bw, ry + 13, PDF_C.rule, 0.4);
  });

  // --- Target revenue
  const rxp = M + lw + gap;
  axRoundRect(t, rxp, py, rw, ph, 8, AX_PANEL, PDF_C.rule);
  pdfLabel(t, S.target, rxp + 20, py + 28);
  const tg = d.target;
  const has = (b) => b && b.percent !== null && b.percent !== undefined;
  const blocks = [];
  if (tg && tg.showMonth !== false) blocks.push([S.monthly + " · " + tg.monthLabel, tg.month, "month"]);
  if (tg) blocks.push([S.yearly + " · " + tg.yearLabel, tg.year, "year"]);
  if (!tg || blocks.every(([, b]) => !has(b))) {
    pdfTxt(t, S.target_none, rxp + 20, py + 70, { size: 10.5, color: PDF_C.soft });
  } else {
    blocks.forEach(([label, b, kind], i) => {
      const y0 = py + 56 + i * 96;
      pdfTxt(t, label, rxp + 20, y0, { size: 9.5, color: PDF_C.soft });
      if (!has(b)) {
        pdfTxt(t, S.target_none, rxp + 20, y0 + 26, { size: 10, color: PDF_C.faint });
        return;
      }
      const pct = b.percent;
      const color = kind === "year" ? PDF_C.ink : pct < 30 ? AX_RED : pct < 70 ? [214, 164, 40] : AX_GREEN;
      const pt = (Number.isInteger(pct) ? pct : pct.toFixed(1)) + "%";
      pdfTxt(t, pt, rxp + 20, y0 + 30, { size: 22, style: "bold", color: PDF_C.ink });
      t.setFont("helvetica", "bold");
      t.setFontSize(22);
      pdfTxt(t, S.achieved, rxp + 20 + t.getTextWidth(pt) + 8, y0 + 29, { size: 9.5, color: PDF_C.soft });
      axProgress(t, rxp + 20, y0 + 40, rw - 40, pct, color);
      if (b.target !== undefined && b.target !== null)
        pdfTxt(t, fmtRp(b.revenue) + " " + S.target_of + " " + fmtRp(b.target), rxp + 20, y0 + 64, { size: 8.8, color: PDF_C.soft });
    });
  }
}

function axChartPage(t, S, d) {
  const W = t.internal.pageSize.getWidth();
  const H = t.internal.pageSize.getHeight();
  const M = 48;
  const months = d.data.months;
  const hasData = months.length > 0 && months.some((m) => m.revenue || m.expense);
  pdfTxt(t, fmtRp(d.cur.revenue), M, 142, { size: 20, style: "bold", color: PDF_C.ink });
  if (d.highlight) pdfTxt(t, S.rev_of + " " + d.periodLabel, M, 157, { size: 9, color: PDF_C.soft });
  // legenda (kanan)
  let lx = W - M;
  const legend = [[d.S.legend_revenue, AX_REV]];
  if (d.canExp) legend.push([d.S.legend_expense, AX_EXP]);
  legend
    .slice()
    .reverse()
    .forEach(([lab, col]) => {
      t.setFont("helvetica", "normal");
      t.setFontSize(9.5);
      const w = t.getTextWidth(lab);
      pdfTxt(t, lab, lx, 140, { size: 9.5, color: PDF_C.text, align: "right" });
      t.setFillColor(col[0], col[1], col[2]);
      t.roundedRect(lx - w - 16, 132, 9, 9, 2, 2, "F");
      lx -= w + 36;
    });
  if (!hasData) {
    pdfTxt(t, S.no_data, W / 2, H / 2, { size: 12, color: PDF_C.soft, align: "center" });
    return;
  }
  const cx = M + 52;
  const cw = W - M - cx;
  const top = 172;
  const bottom = H - 120;
  const ch = bottom - top;
  const maxV = Math.max(1, ...months.map((m) => Math.max(m.revenue || 0, d.canExp ? m.expense || 0 : 0)));
  const { max, step } = axNiceMax(maxV);
  for (let i = 0; i <= 4; i++) {
    const v = step * i;
    const y = bottom - (v / max) * ch;
    pdfRule(t, cx, cx + cw, y, i === 0 ? PDF_C.faint : PDF_C.rule, i === 0 ? 0.8 : 0.4);
    pdfTxt(t, anCompact(v), cx - 8, y + 3, { size: 7.6, color: PDF_C.soft, align: "right" });
  }
  const n = months.length;
  const slot = cw / n;
  const groupW = Math.min(slot * 0.7, 64);
  const barW = d.canExp ? groupW / 2 - 1.5 : Math.min(groupW, 36);
  const showVals = n <= 8;
  months.forEach((m, i) => {
    const gx = cx + slot * i + slot / 2;
    const dim = d.highlight && m.key !== d.highlight; // mode bulanan: bulan lain dipucatkan
    const cRev = dim ? [222, 205, 176] : AX_REV;
    const cExp = dim ? [214, 214, 219] : AX_EXP;
    const bars = d.canExp
      ? [
          [m.revenue || 0, cRev, gx - barW - 1.5],
          [m.expense || 0, cExp, gx + 1.5],
        ]
      : [[m.revenue || 0, cRev, gx - barW / 2]];
    bars.forEach(([v, col, bx]) => {
      const bh = (v / max) * ch;
      if (bh > 0.4) {
        t.setFillColor(col[0], col[1], col[2]);
        t.roundedRect(bx, bottom - bh, barW, bh, Math.min(3, barW / 2, bh / 2), Math.min(3, barW / 2, bh / 2), "F");
        // tutup sudut bawah supaya bar rata dengan garis dasar
        t.rect(bx, bottom - Math.min(bh, 4), barW, Math.min(bh, 4), "F");
      }
      if (showVals && v > 0) pdfTxt(t, anCompact(v), bx + barW / 2, bottom - bh - 5, { size: 7.4, color: PDF_C.text, align: "center" });
    });
    const on = d.highlight && m.key === d.highlight;
    pdfTxt(t, m.label, gx, bottom + 16, { size: n > 9 ? 7.4 : 8.6, color: on ? PDF_C.ink : PDF_C.soft, style: on ? "bold" : "normal", align: "center" });
  });
  // ringkasan di bawah grafik
  const best = months.reduce((a, b) => ((b.revenue || 0) > (a.revenue || 0) ? b : a), months[0]);
  const avg = months.reduce((a, b) => a + (b.revenue || 0), 0) / Math.max(1, months.length);
  const sy = H - 82;
  [
    [S.best_month, best.label + " · " + fmtRp(best.revenue || 0)],
    [S.avg_month, fmtRp(Math.round(avg))],
  ].forEach(([lab, val], i) => {
    const x = M + i * 300;
    pdfLabel(t, lab, x, sy);
    pdfTxt(t, val, x, sy + 17, { size: 11.5, style: "bold", color: PDF_C.ink });
  });
}

function axRankedList(t, S, x, y, w, title, rows, nameKey, valKey, totalVal, unitColor) {
  const rowH = 56;
  axRoundRect(t, x, y, w, 58 + Math.max(rows.length, 1) * rowH - 14, 8, AX_PANEL, PDF_C.rule);
  pdfLabel(t, title, x + 20, y + 28);
  if (!rows.length) {
    pdfTxt(t, S.no_data, x + 20, y + 62, { size: 10.5, color: PDF_C.soft });
    return;
  }
  rows.forEach((r, i) => {
    const ry = y + 58 + i * rowH;
    const pct = totalVal ? (r[valKey] / totalVal) * 100 : 0;
    pdfTxt(t, String(i + 1), x + 20, ry, { size: 9.5, style: "bold", color: PDF_C.gold });
    const amt = fmtRp(r[valKey]);
    t.setFont("helvetica", "bold");
    t.setFontSize(10.5);
    const aw = t.getTextWidth(amt);
    pdfTxt(t, axFit(t, r[nameKey], w - 40 - 24 - aw - 18, 10.5, "normal"), x + 38, ry, { size: 10.5, color: PDF_C.ink });
    pdfTxt(t, amt, x + w - 20, ry, { size: 10.5, style: "bold", color: PDF_C.ink, align: "right" });
    axProgress(t, x + 38, ry + 9, w - 38 - 20 - 44, pct, unitColor);
    pdfTxt(t, Math.round(pct) + "%", x + w - 20, ry + 16.5, { size: 8.6, color: PDF_C.soft, align: "right" });
  });
}

function axPeoplePage(t, S, d) {
  const W = t.internal.pageSize.getWidth();
  const M = 48;
  const gap = 14;
  const w = (W - M * 2 - gap) / 2;
  const y = 128;
  const cust = d.data.topCust.slice(0, 5);
  const items = d.data.topItems.slice(0, 5);
  axRankedList(t, S, M, y, w, d.S.top_customers, cust, "name", "paid", cust.reduce((s, c) => s + c.paid, 0) || 1, AX_REV);
  axRankedList(t, S, M + w + gap, y, w, d.S.top_items, items, "name", "revenue", Object.values(d.data.topItems).reduce((s, c) => s + c.revenue, 0) || 1, PDF_C.ink);
}

function buildAnalyticsPdf(d) {
  if (typeof window.jspdf === "undefined") throw new Error("jsPDF not loaded");
  const S = { ...AX_STR[d.lang === "en" ? "en" : "id"], vsLabel: d.vsLabel };
  const t = new window.jspdf.jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  axCover(t, S, d);
  t.addPage();
  axPageChrome(t, S, d, 2, S.summary);
  axSummaryPage(t, S, d);
  t.addPage();
  axPageChrome(t, S, d, 3, d.mode === "month" ? S.trend12 : S.by_month);
  axChartPage(t, S, d);
  t.addPage();
  axPageChrome(t, S, d, 4, S.people);
  axPeoplePage(t, S, d);
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
