/* PayHub: template PDF Invoice & Quotation (jsPDF, A4).
   Satu mesin layout dipakai keduanya supaya tampilan konsisten: header logo + judul serif, blok penerima & meta,
   tabel item, total, (invoice) jadwal pembayaran, info rekening, dan footer alamat di setiap halaman.
   Dimuat SEBELUM app.js; memakai global app.js (LOGO_DATA_URI, LOGO_ASPECT, fmtRp, fmtDate, lineTotal, docSubtotal,
   splitDescLines, currentStatus, isFullyPaid, paymentDue) hanya saat PDF dibuat. */

const PDF_C = {
  ink: [24, 24, 28],
  text: [58, 58, 64],
  soft: [112, 112, 120],
  faint: [168, 168, 175],
  rule: [224, 224, 228],
  gold: [166, 130, 74],
  goldSoft: [246, 241, 232],
  white: [255, 255, 255],
  paidBg: [222, 241, 229],
  paidFg: [24, 98, 62],
};
// Footer: kiri = alamat, kanan = kontak.
const PDF_FOOTER_LINES = [
  "Royal Tajur Residence",
  "Jl. Raya Tajur No. 170, Pakuan, Bogor Selatan \u00B7 Cluster Avebury 9 No. 17 \u00B7 Bogor, Jawa Barat",
  "WhatsApp 0851 3939 8639 \u00B7 0813 4000 4073 \u00B7 Instagram @Sumeriapoto",
];
const PDF_BANK = { bank: "BCA", number: "8761141988", name: "Mochamad Annas Afan" };

const PDF_M = 54; // margin kiri/kanan
const PDF_FOOT = 104; // tinggi area footer dari tepi bawah (batas konten = tinggi halaman - ini)

/** Teks dengan opsi lengkap. `cs` = jarak antarhuruf (pt), digambar per huruf (operator Tc jsPDF bocor ke teks berikutnya). */
function pdfTxt(t, s, x, y, o = {}) {
  const { size = 9, font = "helvetica", style = "normal", color = PDF_C.text, align = "left", cs = 0 } = o;
  const str = String(s == null ? "" : s);
  t.setFont(font, style);
  t.setFontSize(size);
  t.setTextColor(color[0], color[1], color[2]);
  if (!cs) {
    t.text(str, x, y, { align });
    return;
  }
  const chars = Array.from(str);
  const widths = chars.map((c) => t.getTextWidth(c));
  const total = widths.reduce((a, b) => a + b, 0) + cs * Math.max(0, chars.length - 1);
  let px = align === "right" ? x - total : align === "center" ? x - total / 2 : x;
  chars.forEach((c, i) => {
    t.text(c, px, y);
    px += widths[i] + cs;
  });
}
function pdfWrap(t, s, width, size, style) {
  t.setFont("helvetica", style || "normal");
  t.setFontSize(size);
  return t.splitTextToSize(String(s == null ? "" : s), width);
}
function pdfRule(t, x1, x2, y, color, w) {
  t.setDrawColor(color[0], color[1], color[2]);
  t.setLineWidth(w || 0.6);
  t.line(x1, y, x2, y);
}
function pdfDate(d) {
  return d ? fmtDate(d) : "—";
}
function pdfLabel(t, s, x, y, align) {
  pdfTxt(t, String(s).toUpperCase(), x, y, { size: 7.2, style: "bold", color: PDF_C.gold, cs: 1.5, align });
}

/* Logo asli (PNG besar ~1,3MB) dibuat ulang 760px lebar sekali saat halaman dimuat. Cukup tajam untuk dicetak (172pt ~ 300dpi)
   dan membuat PDF puluhan KB, bukan 1,3MB. Kalau belum siap, dipakai logo asli. */
let PDF_LOGO_SM = null;
function pdfPrepareLogo() {
  try {
    const img = new Image();
    img.onload = () => {
      const w = 760;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = Math.round(w / LOGO_ASPECT);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      PDF_LOGO_SM = c.toDataURL("image/png");
    };
    img.src = LOGO_DATA_URI;
  } catch (e) {
    console.error("logo prepare failed", e);
  }
}
window.addEventListener("load", () => setTimeout(pdfPrepareLogo, 0));
const pdfLogoSrc = () => PDF_LOGO_SM || LOGO_DATA_URI;

function pdfLogo(t, x, y, w) {
  try {
    t.addImage(pdfLogoSrc(), "PNG", x, y, w, w / LOGO_ASPECT, undefined, "FAST");
  } catch (e) {
    console.error("logo embed failed", e);
  }
}

/** Header halaman pertama (besar) atau lanjutan (ringkas). Mengembalikan y awal konten. */
function pdfHeader(t, kind, o, first) {
  const W = t.internal.pageSize.getWidth();
  const title = kind === "invoice" ? "INVOICE" : "QUOTATION";
  if (first) {
    // Logo 206 pt (172 + 20%), tanpa tagline; tengah vertikal antara tepi atas halaman dan garis header (y=112).
    const lw = 206.4;
    pdfLogo(t, PDF_M, (112 - lw / LOGO_ASPECT) / 2, lw);
    pdfTxt(t, title, W - PDF_M, 74, { size: 25, font: "times", color: PDF_C.ink, align: "right", cs: 3.4 });
    pdfRule(t, PDF_M, W - PDF_M, 112, PDF_C.rule, 0.6);
    pdfRule(t, PDF_M, PDF_M + 58, 112, PDF_C.gold, 1.8);
    return 134;
  }
  pdfLogo(t, PDF_M, 40, 110);
  pdfTxt(t, title + "  " + ((kind === "invoice" ? o.invNumber : o.quoNumber) || ""), W - PDF_M, 56, { size: 8, color: PDF_C.soft, align: "right", cs: 1.2 });
  pdfRule(t, PDF_M, W - PDF_M, 76, PDF_C.rule, 0.6);
  return 100;
}

const PDF_COLS = [
  { label: "NO", w: 22, align: "left" },
  { label: "ITEM", w: 158, align: "left" },
  { label: "EVENT DATE", w: 71, align: "left" },
  { label: "QTY", w: 24, align: "center" },
  { label: "PRICE", w: 74, align: "right" },
  { label: "DISCOUNT", w: 62, align: "right" },
  { label: "AMOUNT", w: 76, align: "right" },
];
function pdfColX(i) {
  let x = PDF_M;
  for (let k = 0; k < i; k++) x += PDF_COLS[k].w;
  return x;
}
function pdfCellX(i) {
  const c = PDF_COLS[i];
  const x = pdfColX(i);
  return c.align === "right" ? x + c.w - 7 : c.align === "center" ? x + c.w / 2 : x + 7;
}
function pdfTableHead(t, y) {
  const W = t.internal.pageSize.getWidth();
  t.setFillColor(PDF_C.ink[0], PDF_C.ink[1], PDF_C.ink[2]);
  t.rect(PDF_M, y, W - PDF_M * 2, 24, "F");
  PDF_COLS.forEach((c, i) => pdfTxt(t, c.label, pdfCellX(i), y + 15.5, { size: 6.8, style: "bold", color: PDF_C.white, align: c.align, cs: 1.1 }));
  return y + 24;
}

/** Footer setiap halaman: alamat & kontak (satu baris panjang), nomor halaman. Dipanggil setelah konten selesai. */
function pdfFooters(t) {
  const W = t.internal.pageSize.getWidth();
  const H = t.internal.pageSize.getHeight();
  const n = t.internal.getNumberOfPages();
  const colW = (W - PDF_M * 2) / 2;
  for (let p = 1; p <= n; p++) {
    t.setPage(p);
    const top = H - 92;
    pdfRule(t, PDF_M, W - PDF_M, top, PDF_C.rule, 0.6);
    pdfRule(t, PDF_M, PDF_M + 58, top, PDF_C.gold, 1.8);
    PDF_FOOTER_LINES.forEach((ln, i) =>
      pdfTxt(t, ln, PDF_M, top + 18 + i * 11.5, { size: 7.8, color: i === 0 ? PDF_C.ink : PDF_C.soft, style: i === 0 ? "bold" : "normal" }),
    );
    // Credit kecil di setiap halaman; nomor halaman sejajar di kanan.
    pdfTxt(t, "Created by Sumeriapoto Payhub", W / 2, H - 22, { size: 6.6, color: PDF_C.faint, align: "center", cs: 0.5 });
    if (n > 1) pdfTxt(t, `${p} / ${n}`, W - PDF_M, H - 22, { size: 7, color: PDF_C.faint, align: "right" });
  }
}

/** Satu logo besar sangat tipis di tengah halaman (pengganti pola logo berulang). */
function pdfWatermark(t) {
  try {
    const W = t.internal.pageSize.getWidth();
    const H = t.internal.pageSize.getHeight();
    const w = 380;
    const h = w / LOGO_ASPECT;
    for (let p = 1; p <= t.internal.getNumberOfPages(); p++) {
      t.setPage(p);
      t.saveGraphicsState();
      t.setGState(new t.GState({ opacity: 0.045 }));
      t.addImage(pdfLogoSrc(), "PNG", (W - w) / 2, H / 2 - h / 2, w, h, undefined, "FAST", -22);
      t.restoreGraphicsState();
    }
  } catch (e) {
    console.error("watermark failed", e);
  }
}

function pdfPaidStamp(t, cx, cy) {
  try {
    t.saveGraphicsState();
    t.setGState(new t.GState({ opacity: 0.8 }));
    const g = PDF_C.paidFg;
    t.setDrawColor(g[0], g[1], g[2]);
    t.setLineWidth(2);
    t.circle(cx, cy, 40, "S");
    t.setLineWidth(0.8);
    t.circle(cx, cy, 33, "S");
    t.setFont("helvetica", "bold");
    t.setTextColor(g[0], g[1], g[2]);
    t.setFontSize(12);
    t.text("PAID", cx, cy - 3, { align: "center", angle: -14 });
    t.text("IN FULL", cx + 1, cy + 11, { align: "center", angle: -14 });
    t.setFontSize(5.5);
    t.text("SUMERIAPOTO", cx + 2, cy + 22, { align: "center", angle: -14 });
    t.restoreGraphicsState();
  } catch (e) {
    console.error("paid stamp failed", e);
  }
}

function pdfBuild(o, kind) {
  if (typeof window.jspdf === "undefined") throw new Error("jsPDF not loaded");
  const t = new window.jspdf.jsPDF({ unit: "pt", format: "a4" });
  const W = t.internal.pageSize.getWidth();
  const H = t.internal.pageSize.getHeight();
  const R = W - PDF_M; // tepi kanan konten
  const BOTTOM = H - PDF_FOOT;
  const inv = kind === "invoice";
  const items = o.items || [];
  const total = docSubtotal(items);
  const payments = o.payments || [];
  const paidSum = payments.filter((p) => p.paid).reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const customer = o.customerSnap || {};

  let y = pdfHeader(t, kind, o, true);

  // ---- Penerima (kiri) + meta dokumen (kanan)
  pdfLabel(t, inv ? "Billed to" : "Prepared for", PDF_M, y);
  let ly = y + 20;
  pdfTxt(t, customer.name || "", PDF_M, ly, { size: 14, font: "times", style: "bold", color: PDF_C.ink });
  ly += 6;
  [customer.address, customer.phone, customer.email].filter(Boolean).forEach((line) => {
    pdfWrap(t, line, 240, 8.8).forEach((w) => {
      ly += 12.5;
      pdfTxt(t, w, PDF_M, ly, { size: 8.8, color: PDF_C.soft });
    });
  });

  const evDates = items.map((x) => x.eventDate).filter(Boolean).sort();
  const status = inv ? currentStatus(o) : "";
  const meta = [
    [inv ? "Invoice No." : "Quotation No.", (inv ? o.invNumber : o.quoNumber) || "—"],
    ["Issue Date", pdfDate(o.date)],
    ["Event Date", evDates.length ? pdfDate(evDates[0]) + (evDates.length > 1 ? `  (+${evDates.length - 1})` : "") : "—"],
  ];
  if (inv) meta.push(["Status", status]);
  const mx = R - 210;
  let my = y;
  meta.forEach(([k, v], i) => {
    const isStatus = inv && i === meta.length - 1;
    pdfTxt(t, k, mx, my + 12, { size: 8.4, color: PDF_C.soft });
    pdfTxt(t, v, R, my + 12, { size: 9.2, style: "bold", color: isStatus && isFullyPaid(o) ? PDF_C.paidFg : PDF_C.ink, align: "right" });
    my += 22;
    pdfRule(t, mx, R, my - 5, PDF_C.rule, 0.5);
  });
  y = Math.max(ly, my) + 26;

  // ---- Tabel item
  const newPage = (withHead) => {
    t.addPage();
    y = pdfHeader(t, kind, o, false);
    if (withHead) y = pdfTableHead(t, y);
  };
  y = pdfTableHead(t, y);
  items.forEach((it, idx) => {
    const nameLines = pdfWrap(t, it.packageItem || "", PDF_COLS[1].w - 14, 9.4, "bold");
    // deskripsi dirangkai satu paragraf ("A · B · C") supaya ringkas, bukan satu baris per butir
    const descParts = splitDescLines(it.description);
    const descLines = descParts.length ? pdfWrap(t, descParts.join("  \u00B7  "), PDF_COLS[1].w - 14, 7.6) : [];
    const rowH = 14 + nameLines.length * 12 + (descLines.length ? 3 + descLines.length * 10 : 0) + 10;
    if (y + rowH > BOTTOM) newPage(true);
    const base = y + 16;
    pdfTxt(t, String(idx + 1).padStart(2, "0"), pdfCellX(0), base, { size: 8.4, color: PDF_C.faint });
    nameLines.forEach((l, i) => pdfTxt(t, l, pdfCellX(1), base + i * 12, { size: 9.4, style: "bold", color: PDF_C.ink }));
    descLines.forEach((l, i) => pdfTxt(t, l, pdfCellX(1), base + nameLines.length * 12 + 1 + i * 10, { size: 7.6, color: PDF_C.soft }));
    pdfTxt(t, pdfDate(it.eventDate), pdfCellX(2), base, { size: 8.4, color: PDF_C.text });
    pdfTxt(t, it.qty, pdfCellX(3), base, { size: 9, color: PDF_C.text, align: "center" });
    pdfTxt(t, fmtRp(it.unitPrice), pdfCellX(4), base, { size: 8.6, color: PDF_C.text, align: "right" });
    pdfTxt(t, Number(it.discount) > 0 ? "- " + fmtRp(it.discount) : "\u2014", pdfCellX(5), base, { size: 8.6, color: PDF_C.soft, align: "right" });
    pdfTxt(t, fmtRp(lineTotal(it)), pdfCellX(6), base, { size: 8.8, style: "bold", color: PDF_C.ink, align: "right" });
    y += rowH;
    pdfRule(t, PDF_M, R, y, PDF_C.rule, 0.5);
  });
  y += 20;

  // ---- Total
  const totalsRows = inv
    ? [["Paid to date", paidSum > 0 ? fmtRp(paidSum) : "—"], ["Balance due", fmtRp(Math.max(0, total - paidSum))]]
    : [["Down payment (30%)", fmtRp(total * 0.3)]];
  const blockH = Math.max(46 + totalsRows.length * 21 + 10, 92);
  if (y + blockH > BOTTOM) newPage(false);
  const tx = R - 240;
  const totalsTop = y;
  pdfRule(t, tx, R, y, PDF_C.gold, 1.2);
  pdfTxt(t, "TOTAL", tx, y + 28, { size: 8, style: "bold", color: PDF_C.ink, cs: 1.8 });
  pdfTxt(t, fmtRp(total), R, y + 29, { size: 18, font: "times", style: "bold", color: PDF_C.ink, align: "right" });
  y += 46;
  totalsRows.forEach(([k, v], i) => {
    const last = inv && i === totalsRows.length - 1;
    pdfTxt(t, k, tx, y + 4, { size: 8.8, color: last ? PDF_C.ink : PDF_C.soft, style: last ? "bold" : "normal" });
    pdfTxt(t, v, R, y + 4, { size: 9.4, style: "bold", color: last && Math.max(0, total - paidSum) === 0 ? PDF_C.paidFg : PDF_C.ink, align: "right" });
    y += 21;
  });
  if (inv && isFullyPaid(o)) {
    pdfPaidStamp(t, PDF_M + 70, totalsTop + 44);
  } else {
    // Info rekening di sisi kiri total (area kosong), tidak lagi blok terpisah yang bisa terlempar ke halaman berikutnya.
    const bw = tx - PDF_M - 26;
    pdfLabel(t, "Payment information", PDF_M, totalsTop + 14);
    pdfTxt(t, "All payments are only through this account:", PDF_M, totalsTop + 29, { size: 7.6, color: PDF_C.soft });
    const by = totalsTop + 38;
    t.setFillColor(PDF_C.goldSoft[0], PDF_C.goldSoft[1], PDF_C.goldSoft[2]);
    t.roundedRect(PDF_M, by, bw, 48, 5, 5, "F");
    t.setFillColor(PDF_C.gold[0], PDF_C.gold[1], PDF_C.gold[2]);
    t.rect(PDF_M, by + 8, 3, 32, "F");
    pdfTxt(t, PDF_BANK.bank, PDF_M + 15, by + 17, { size: 7.2, style: "bold", color: PDF_C.gold, cs: 1.6 });
    pdfTxt(t, PDF_BANK.number, PDF_M + 15, by + 32, { size: 14, font: "times", style: "bold", color: PDF_C.ink, cs: 0.8 });
    pdfTxt(t, "a.n. " + PDF_BANK.name, PDF_M + 15, by + 42, { size: 7.4, color: PDF_C.soft });
  }
  y = Math.max(y, totalsTop + 92) + 22;

  // ---- Jadwal pembayaran (invoice)
  if (inv && payments.length) {
    const need = 12 + 22 + payments.length * 24 + 8;
    if (y + need > BOTTOM) newPage(false);
    pdfLabel(t, "Payment schedule" + (o.paymentPlan ? " — " + o.paymentPlan : ""), PDF_M, y);
    y += 12;
    const pc = [
      { label: "STAGE", x: PDF_M + 10, align: "left" },
      { label: "PERCENT", x: PDF_M + 250, align: "right" },
      { label: "AMOUNT", x: PDF_M + 350, align: "right" },
      { label: "DUE DATE", x: PDF_M + 372, align: "left" },
      { label: "STATUS", x: R - 10, align: "right" },
    ];
    t.setFillColor(PDF_C.goldSoft[0], PDF_C.goldSoft[1], PDF_C.goldSoft[2]);
    t.rect(PDF_M, y, R - PDF_M, 22, "F");
    pc.forEach((c) => pdfTxt(t, c.label, c.x, y + 14.5, { size: 6.8, style: "bold", color: PDF_C.gold, align: c.align, cs: 1.1 }));
    y += 22;
    payments.forEach((p, i) => {
      const base = y + 16;
      pdfTxt(t, p.label, pc[0].x, base, { size: 9, style: "bold", color: PDF_C.ink });
      pdfTxt(t, Number(p.percent).toFixed(0) + "%", pc[1].x, base, { size: 9, color: PDF_C.text, align: "right" });
      pdfTxt(t, fmtRp(p.amount), pc[2].x, base, { size: 9, color: PDF_C.ink, align: "right" });
      pdfTxt(t, pdfDate(paymentDue(o, i)), pc[3].x, base, { size: 8.6, color: PDF_C.soft });
      if (p.paid) {
        const pw = 40;
        t.setFillColor(PDF_C.paidBg[0], PDF_C.paidBg[1], PDF_C.paidBg[2]);
        t.roundedRect(R - 10 - pw, base - 10.5, pw, 15, 7.5, 7.5, "F");
        pdfTxt(t, "PAID", R - 10 - pw / 2, base, { size: 7.4, style: "bold", color: PDF_C.paidFg, align: "center", cs: 0.8 });
      } else {
        pdfTxt(t, "PENDING", R - 10, base, { size: 7.4, style: "bold", color: PDF_C.faint, align: "right", cs: 0.8 });
      }
      y += 24;
      pdfRule(t, PDF_M, R, y, PDF_C.rule, 0.5);
    });
    y += 20;
  }

  if (y + 6 <= BOTTOM) {
    pdfTxt(t, "Thank you for trusting Sumeriapoto with your moments.", PDF_M, y, { size: 9.6, font: "times", style: "italic", color: PDF_C.soft });
  }

  pdfFooters(t);
  pdfWatermark(t);
  return t;
}

function buildInvoicePdf(o) {
  return pdfBuild(o, "invoice");
}
function buildQuotationPdf(o) {
  return pdfBuild(o, "quotation");
}
