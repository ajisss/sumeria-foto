const { useState, useEffect, useRef, useMemo, useCallback } = React,
  storage = {
    get: function (o) {
      return Promise.resolve().then(function () {
        const a = localStorage.getItem("payhub::" + o);
        if (a === null) throw new Error("not found");
        return { key: o, value: a, shared: !1 };
      });
    },
    set: function (o, a) {
      return Promise.resolve().then(function () {
        return (
          localStorage.setItem("payhub::" + o, a),
          { key: o, value: a, shared: !1 }
        );
      });
    },
    delete: function (o) {
      return Promise.resolve().then(function () {
        return (
          localStorage.removeItem("payhub::" + o),
          { key: o, deleted: !0, shared: !1 }
        );
      });
    },
  };
function makeIcon(o) {
  return function (t) {
    const r = (t && t.size) || 14,
      s = (t && t.strokeWidth) || 2,
      c = t && t.className;
    return React.createElement(
      "svg",
      {
        width: r,
        height: r,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: s,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: c,
        style: {
          display: "inline-block",
          verticalAlign: "middle",
          flexShrink: 0,
        },
        "aria-hidden": "true",
      },
      o,
    );
  };
}
const Search = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: "11", cy: "11", r: "7" }),
      React.createElement("line", { x1: "21", y1: "21", x2: "16", y2: "16" }),
    ),
  ),
  Plus = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
      React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
    ),
  ),
  Pencil = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", { d: "M4 20l4-1 11-11-3-3L5 16l-1 4z" }),
      React.createElement("line", { x1: "14", y1: "7", x2: "17", y2: "10" }),
    ),
  ),
  Eye = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", { d: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" }),
      React.createElement("circle", { cx: "12", cy: "12", r: "3" }),
    ),
  ),
  StickyNote = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", { d: "M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z" }),
      React.createElement("path", { d: "M15 3v6h6" }),
    ),
  ),
  Package = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", { d: "M21 8 12 3 3 8v8l9 5 9-5V8z" }),
      React.createElement("path", { d: "M3.3 7.7 12 12.5l8.7-4.8M12 12.5V21" }),
    ),
  ),
  Trash2 = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("line", { x1: "4", y1: "7", x2: "20", y2: "7" }),
      React.createElement("line", { x1: "9", y1: "7", x2: "9", y2: "4" }),
      React.createElement("line", { x1: "15", y1: "7", x2: "15", y2: "4" }),
      React.createElement("rect", {
        x: "6",
        y: "7",
        width: "12",
        height: "13",
        rx: "1",
      }),
      React.createElement("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
      React.createElement("line", { x1: "14", y1: "11", x2: "14", y2: "17" }),
    ),
  ),
  X = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
      React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }),
    ),
  ),
  Printer = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("rect", { x: "7", y: "3", width: "10", height: "6" }),
      React.createElement("rect", {
        x: "4",
        y: "8",
        width: "16",
        height: "8",
        rx: "1",
      }),
      React.createElement("rect", {
        x: "7",
        y: "15",
        width: "10",
        height: "6",
      }),
    ),
  ),
  Check = makeIcon(
    React.createElement("polyline", { points: "4 12 9 17 20 6" }),
  ),
  ArrowUpDown = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("polyline", { points: "7 9 12 4 17 9" }),
      React.createElement("polyline", { points: "7 15 12 20 17 15" }),
    ),
  ),
  Calendar = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("rect", {
        x: "3",
        y: "4",
        width: "18",
        height: "17",
        rx: "2",
      }),
      React.createElement("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
      React.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
      React.createElement("line", { x1: "3", y1: "10", x2: "21", y2: "10" }),
    ),
  ),
  ArrowRight = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
      React.createElement("polyline", { points: "12 5 19 12 12 19" }),
    ),
  ),
  Download = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("line", { x1: "12", y1: "3", x2: "12", y2: "15" }),
      React.createElement("polyline", { points: "7 10 12 15 17 10" }),
      React.createElement("line", { x1: "4", y1: "20", x2: "20", y2: "20" }),
    ),
  ),
  Sheet = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
      React.createElement("path", { d: "M3 9h18M3 15h18M9 3v18" }),
    ),
  ),
  Database = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("ellipse", { cx: "12", cy: "5", rx: "8", ry: "3" }),
      React.createElement("path", { d: "M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" }),
      React.createElement("path", { d: "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" }),
    ),
  ),
  LogOut = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", {
        d: "M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4",
      }),
      React.createElement("line", { x1: "21", y1: "12", x2: "9", y2: "12" }),
      React.createElement("polyline", { points: "16 7 21 12 16 17" }),
    ),
  ),
  Users = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: "9", cy: "8", r: "3.2" }),
      React.createElement("path", {
        d: "M3 19c0-3.2 2.5-5.5 6-5.5s6 2.3 6 5.5",
      }),
      React.createElement("circle", { cx: "17.2", cy: "9", r: "2.4" }),
      React.createElement("path", { d: "M15.3 13.7c2.6.2 4.7 2.4 4.7 5.3" }),
    ),
  ),
  FileText = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", {
        d: "M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
      }),
      React.createElement("line", { x1: "9", y1: "12", x2: "15", y2: "12" }),
      React.createElement("line", { x1: "9", y1: "16", x2: "15", y2: "16" }),
    ),
  ),
  Receipt = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("rect", {
        x: "6",
        y: "3",
        width: "12",
        height: "18",
        rx: "1",
      }),
      React.createElement("line", { x1: "9", y1: "7", x2: "15", y2: "7" }),
      React.createElement("line", { x1: "9", y1: "11", x2: "15", y2: "11" }),
      React.createElement("line", { x1: "9", y1: "15", x2: "13", y2: "15" }),
    ),
  ),
  ShoppingBag = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", { d: "M6 8h12l-1 12H7L6 8z" }),
      React.createElement("path", { d: "M9 8V6a3 3 0 0 1 6 0v2" }),
    ),
  ),
  ClipboardList = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("rect", {
        x: "5",
        y: "4",
        width: "14",
        height: "17",
        rx: "1",
      }),
      React.createElement("rect", {
        x: "9",
        y: "2",
        width: "6",
        height: "4",
        rx: "1",
      }),
      React.createElement("line", { x1: "8", y1: "11", x2: "16", y2: "11" }),
      React.createElement("line", { x1: "8", y1: "14", x2: "16", y2: "14" }),
      React.createElement("line", { x1: "8", y1: "18", x2: "13", y2: "18" }),
    ),
  ),
  Wallet = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("rect", {
        x: "3",
        y: "6",
        width: "18",
        height: "13",
        rx: "2",
      }),
      React.createElement("path", { d: "M3 10h18" }),
      React.createElement("circle", { cx: "17", cy: "14.5", r: "1.3" }),
    ),
  ),
  ArrowLeftRight = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("line", { x1: "4", y1: "9", x2: "20", y2: "9" }),
      React.createElement("polyline", { points: "16 5 20 9 16 13" }),
      React.createElement("line", { x1: "20", y1: "15", x2: "4", y2: "15" }),
      React.createElement("polyline", { points: "8 11 4 15 8 19" }),
    ),
  ),
  TrendingUp = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("polyline", { points: "4 17 10 11 14 15 20 7" }),
      React.createElement("polyline", { points: "14 7 20 7 20 13" }),
    ),
  ),
  BarChart3 = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("rect", {
        x: "3",
        y: "3",
        width: "8",
        height: "8",
        rx: "1.5",
      }),
      React.createElement("rect", {
        x: "13",
        y: "3",
        width: "8",
        height: "8",
        rx: "1.5",
      }),
      React.createElement("rect", {
        x: "3",
        y: "13",
        width: "8",
        height: "8",
        rx: "1.5",
      }),
      React.createElement("rect", {
        x: "13",
        y: "13",
        width: "8",
        height: "8",
        rx: "1.5",
      }),
    ),
  ),
  Menu = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("line", { x1: "4", y1: "6", x2: "20", y2: "6" }),
      React.createElement("line", { x1: "4", y1: "12", x2: "20", y2: "12" }),
      React.createElement("line", { x1: "4", y1: "18", x2: "20", y2: "18" }),
    ),
  ),
  MessageCircle = makeIcon(
    React.createElement("path", {
      d: "M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.5-.3-3.6-.8L4 21l1.4-4.3A8.4 8.4 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5 8.5 8.5 0 0 1 21 12z",
    }),
  ),
  Sun = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: "12", cy: "12", r: "4.5" }),
      React.createElement("line", { x1: "12", y1: "2", x2: "12", y2: "4.5" }),
      React.createElement("line", { x1: "12", y1: "19.5", x2: "12", y2: "22" }),
      React.createElement("line", { x1: "2", y1: "12", x2: "4.5", y2: "12" }),
      React.createElement("line", { x1: "19.5", y1: "12", x2: "22", y2: "12" }),
      React.createElement("line", {
        x1: "4.6",
        y1: "4.6",
        x2: "6.3",
        y2: "6.3",
      }),
      React.createElement("line", {
        x1: "17.7",
        y1: "17.7",
        x2: "19.4",
        y2: "19.4",
      }),
      React.createElement("line", {
        x1: "4.6",
        y1: "19.4",
        x2: "6.3",
        y2: "17.7",
      }),
      React.createElement("line", {
        x1: "17.7",
        y1: "6.3",
        x2: "19.4",
        y2: "4.6",
      }),
    ),
  ),
  Moon = makeIcon(
    React.createElement("path", {
      d: "M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z",
    }),
  ),
  AlertTriangle = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", {
        d: "M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0z",
      }),
      React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13.5" }),
      React.createElement("line", { x1: "12", y1: "17", x2: "12", y2: "17.2" }),
    ),
  ),
  Award = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: "12", cy: "8.5", r: "6" }),
      React.createElement("path", {
        d: "M8.3 13.8 6.5 22l5.5-3 5.5 3-1.8-8.2",
      }),
    ),
  ),
  ChevronLeft = makeIcon(
    React.createElement("polyline", { points: "15 5 8 12 15 19" }),
  ),
  ChevronRight = makeIcon(
    React.createElement("polyline", { points: "9 5 16 12 9 19" }),
  ),
  Upload = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("line", { x1: "12", y1: "15", x2: "12", y2: "3" }),
      React.createElement("polyline", { points: "7 8 12 3 17 8" }),
      React.createElement("line", { x1: "4", y1: "20", x2: "20", y2: "20" }),
    ),
  ),
  Save = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", {
        d: "M4 4h13l3 3v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z",
      }),
      React.createElement("rect", { x: "7", y: "4", width: "8", height: "5" }),
      React.createElement("rect", {
        x: "6.5",
        y: "13",
        width: "11",
        height: "7",
      }),
    ),
  ),
  Mail = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }),
      React.createElement("path", { d: "m3 7 9 6 9-6" }),
    ),
  ),
  Lock = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("rect", {
        x: "5",
        y: "11",
        width: "14",
        height: "9",
        rx: "2",
      }),
      React.createElement("path", { d: "M8 11V7a4 4 0 0 1 8 0v4" }),
    ),
  ),
  Couple = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: "8", cy: "7", r: "2.3" }),
      React.createElement("path", {
        d: "M8 11.2c-2.9 0-4.6 2-4.6 5.6h9.2c0-3.6-1.7-5.6-4.6-5.6z",
      }),
      React.createElement("circle", { cx: "16.4", cy: "7", r: "2.3" }),
      React.createElement("path", {
        d: "M16.4 11.2c-.5 0-1 .06-1.4.2.9 1.1 1.4 2.6 1.4 4.4v1h4.6v-1c0-3-1.5-4.6-4.6-4.6z",
      }),
    ),
  ),
  Handshake = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", {
        d: "M2 13l4.3-4.3a1.9 1.9 0 0 1 2.7 0L11 10.7",
      }),
      React.createElement("path", {
        d: "M22 13l-4.3-4.3a1.9 1.9 0 0 0-2.7 0L13 10.7",
      }),
      React.createElement("path", {
        d: "M8.7 11l1.9 1.9a1.6 1.6 0 0 0 2.3 0h0a1.6 1.6 0 0 0 0-2.3L11 8.7",
      }),
      React.createElement("path", { d: "M6 13.5l2.3 2.3a1.6 1.6 0 0 0 2.3 0" }),
      React.createElement("path", {
        d: "M18 13.5l-2.3 2.3a1.6 1.6 0 0 1-2.3 0",
      }),
    ),
  ),
  UserCircle = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
      React.createElement("circle", { cx: "12", cy: "10", r: "3" }),
      React.createElement("path", { d: "M6.5 19a5.7 5.7 0 0 1 11 0" }),
    ),
  ),
  HomeIcon = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("path", { d: "M4 11.5 12 4l8 7.5" }),
      React.createElement("path", { d: "M6 10v9h12v-9" }),
    ),
  ),
  LOGO_DATA_URI =
    "data:image/png;base64,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",
  LOGO_ASPECT = 1400 / 232,
  BRAND = {
    bg: "var(--c-bg)",
    surface: "var(--c-surface)",
    ink: "var(--c-ink)",
    inkSoft: "var(--c-inkSoft)",
    blue: "var(--c-blue)",
    blueDeep: "var(--c-blueDeep)",
    blueFaint: "var(--c-blueFaint)",
    blueTint: "var(--c-blueTint)",
    line: "var(--c-line)",
    green: "var(--c-green)",
    greenBg: "var(--c-greenBg)",
    amber: "var(--c-amber)",
    amberBg: "var(--c-amberBg)",
    red: "var(--c-red)",
    redBg: "var(--c-redBg)",
    redBorder: "var(--c-redBorder)",
    gray: "var(--c-gray)",
    grayBg: "var(--c-grayBg)",
    expenseBar: "var(--c-expenseBar)",
  },
  THEME_CSS = `
  :root {
    --c-bg: #FAFAFA;
    --c-surface: #FFFFFF;
    --c-ink: #0A0A0A;
    --c-inkSoft: #5F5F68;
    --c-blue: #18181B;
    --c-blueDeep: #09090B;
    --c-blueFaint: #F4F4F5;
    --c-blueTint: #E4E4E7;
    --c-line: #E4E4E7;
    --c-green: #15803D;
    --c-greenBg: #F0FDF4;
    --c-amber: #A16207;
    --c-amberBg: #FEFCE8;
    --c-red: #DC2626;
    --c-redBg: #FEF2F2;
    --c-redBorder: #FECACA;
    --c-gray: #5F5F68;
    --c-grayBg: #F4F4F5;
    --c-expenseBar: #D4D4D8;
    --c-overlay: rgba(9,9,11,0.5);
    --c-shadow: rgba(9,9,11,0.04);
    --c-onBlue: #FFFFFF;
    color-scheme: light;
  }
  [data-theme="dark"] {
    --c-bg: #0D0D10;
    --c-surface: #1A1A1F;
    --c-ink: #F4F4F5;
    --c-inkSoft: #A8A8B3;
    --c-blue: #EDEDEF;
    --c-blueDeep: #FFFFFF;
    --c-blueFaint: #232329;
    --c-blueTint: #2F2F36;
    --c-line: #34343C;
    --c-green: #4ADE80;
    --c-greenBg: #0E2117;
    --c-amber: #FACC15;
    --c-amberBg: #26210B;
    --c-red: #F87171;
    --c-redBg: #2A1213;
    --c-redBorder: #3F1B1D;
    --c-gray: #A8A8B3;
    --c-grayBg: #232329;
    --c-expenseBar: #52525B;
    --c-overlay: rgba(0,0,0,0.66);
    --c-shadow: rgba(0,0,0,0.5);
    --c-onBlue: #09090B;
    color-scheme: dark;
  }

  body, body *:not(svg):not(svg *) { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif !important; }
  body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; font-feature-settings: "cv11", "ss01"; letter-spacing: -0.006em; }
  h1, h2, h3 { letter-spacing: -0.02em !important; }
  td, th, input[type="number"] { font-variant-numeric: tabular-nums; }
  button { transition: background-color .15s ease, border-color .15s ease, color .15s ease, opacity .15s ease; }
  input, select, textarea { transition: border-color .15s ease, box-shadow .15s ease; }
  input:focus, select:focus, textarea:focus { outline: none; border-color: var(--c-ink) !important; box-shadow: 0 0 0 3px var(--c-blueTint) !important; }
  ::selection { background: var(--c-blueTint); }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb { background: var(--c-blueTint); border-radius: 999px; border: 3px solid transparent; background-clip: content-box; }
  ::-webkit-scrollbar-track { background: transparent; }
`,
  TRANSLATIONS = {
    id: {
      tagline: "PAYHUB",
      nav_home: "Analytics",
      nav_customers: "Data Customer",
      nav_quotations: "Quotations",
      nav_invoices: "Invoice",
      nav_orders: "Orders",
      nav_orderDetails: "Order Details",
      nav_calendar: "Kalender Event",
      nav_expenses: "Expenses",
      nav_ledger: "Income & Expense",
      nav_margin: "Project Margin",
      nav_packages: "Package Item",
      pkg_title: "Package Item",
      pkg_subtitle: "Katalog paket beserta harga default, dan laporan penjualan per paket.",
      pkg_tab_catalog: "Katalog",
      pkg_tab_best: "Best Sellers",
      pkg_add: "Tambah paket",
      pkg_search: "Cari paket...",
      pkg_col_name: "Package item",
      pkg_col_price: "Harga default",
      pkg_empty: "Belum ada paket. Tambahkan yang pertama.",
      pkg_modal_add: "Tambah paket",
      pkg_modal_edit: "Edit paket",
      pkg_modal_add_sub: "Paket yang ditambahkan muncul di pilihan Package item pada quotation dan invoice.",
      pkg_modal_edit_sub: "Mengubah nama atau harga tidak mengubah quotation dan invoice yang sudah dibuat.",
      pkg_field_name: "Nama paket",
      pkg_field_price: "Harga default",
      pkg_price_hint: "Dipakai sebagai harga awal saat paket dipilih. Harga di item tetap bisa diubah.",
      pkg_dup: "Nama paket sudah ada.",
      pkg_saved: "Paket tersimpan.",
      pkg_deleted: "Paket dihapus dari katalog.",
      pkg_delete_prefix: "Paket",
      pkg_delete_confirm: "akan dihapus dari katalog. Quotation dan invoice yang sudah ada tidak berubah.",
      nav_bestsellers: "Paket Terlaris",
      nav_users: "Pengguna",
      no_access: "Tidak punya akses untuk mengubah data ini",
      save: "Simpan",
      cancel: "Batal",
      delete: "Hapus",
      edit: "Edit",
      close: "Tutup",
      search_placeholder: "Cari...",
      logout: "Keluar",
      backup_restore: "Backup & Restore",
      dark_mode: "Mode gelap",
      light_mode: "Mode terang",
      language: "Bahasa",
      back: "\u2190 Kembali",
      confirm_delete_title: "Konfirmasi hapus",
      login_title: "Masuk ke akun kamu",
      login_subtitle: "Gunakan email tim untuk mengakses PayHub.",
      login_email_label: "Email",
      login_email_placeholder: "nama@email.com",
      login_button: "Masuk",
      login_loading: "Memproses\u2026",
      login_footer: "Akses internal untuk tim Sum\xE9riapoto.",
      login_error: "Masukkan alamat email yang valid.",
      loading: "Memuat\u2026",
      pin_title: "Masukkan PIN",
      pin_subtitle: "PIN diperlukan untuk membuka aplikasi ini.",
      pin_unlock: "Buka",
      pin_wrong: "PIN salah. Coba lagi.",
      dash_title: "Master Dashboard",
      dash_subtitle:
        "Dashboard untuk memantau seluruh data keuangan Sum\xE9riapoto",
      dash_overdue_prefix:
        "invoice sudah lewat batas pelunasan (H-7 sebelum event)",
      dash_remaining: "Sisa",
      dash_late: "telat",
      dash_days: "hari",
      dash_send_reminder: "Kirim reminder WA",
      dash_overdue_short: "invoice lewat batas pelunasan",
      dash_days_short: "h telat",
      dash_day: "Hari",
      dash_week: "Minggu",
      dash_month: "Bulan",
      dash_year: "Tahun",
      dash_custom: "Custom",
      dash_monthly: "Bulanan",
      dash_yearly: "Tahunan",
      dash_revenue: "Revenue",
      dash_outstanding: "Outstanding",
      dash_menu_title: "Menu",
      dash_expenses: "Expenses",
      dash_assets: "Assets",
      dash_profit: "Profit",
      dash_chart_title: "Revenue vs Expense vs Profit",
      dash_no_data: "Belum ada data untuk rentang tanggal ini.",
      cust_title: "Data Customer",
      cust_subtitle: "Kelola data pelanggan beserta riwayat invoice dan pembayarannya.",
      cust_export_xls: "Export to XLS",
      cust_add: "Add customer",
      cust_search_placeholder: "Cari nama, email, kota...",
      cust_empty: "Belum ada customer. Tambahkan yang pertama.",
      cust_col_name: "Nama",
      cust_col_gender: "Gender",
      cust_col_email: "Email",
      cust_col_phone: "Phone",
      cust_col_city: "Kota",
      cust_modal_add: "Add customer",
      cust_modal_edit: "Edit customer",
      cust_modal_add_sub: "Tambahkan pelanggan baru untuk dipakai di quotation dan invoice.",
      cust_modal_edit_sub: "Ubah data pelanggan. Invoice yang sudah dibuat tidak ikut berubah.",
      cust_field_name: "Nama",
      cust_field_gender: "Gender",
      cust_field_email: "Email",
      cust_field_phone: "Phone",
      cust_field_city: "Kota",
      cust_delete_confirm: "akan dihapus permanen.",
      cust_delete_prefix: "Data customer",
      export_pwd_title: "Export to XLS",
      export_pwd_label: "Masukkan PIN untuk export data",
      export_pwd_wrong: "PIN salah.",
      export_btn: "Export",
      xls_offline:
        "Fitur export XLS butuh koneksi internet aktif. Coba lagi setelah tersambung ke internet.",
      cust_detail_title: "Detail customer",
      cust_tab_overview: "Ringkasan",
      cust_tab_payments: "Pembayaran",
      cust_detail_title: "Customer details",
      cust_tab_overview: "Overview",
      cust_tab_payments: "Payments",
      detail_gender: "Gender",
      detail_phone: "Phone",
      detail_email: "Email",
      detail_city: "Kota",
      detail_revenue: "Total revenue",
      detail_outstanding: "Outstanding",
      detail_quotations: "Quotations",
      detail_invoices: "Invoices",
      detail_invoice_history: "Riwayat Invoice",
      detail_quotation_history: "Riwayat Quotation",
      detail_payment_history: "Riwayat Pembayaran",
      detail_no_invoice: "Belum ada invoice.",
      detail_no_quotation: "Belum ada quotation.",
      detail_no_payment: "Belum ada pembayaran yang lunas.",
      col_invoice_no: "No. Invoice",
      col_quotation_no: "No. Quotation",
      col_date: "Tanggal",
      col_total: "Total",
      col_subtotal: "Subtotal",
      col_status: "Status",
      col_stage: "Tahap",
      col_amount: "Jumlah",
      quo_title: "Quotations",
      quo_subtitle: "Buat dan kelola penawaran harga, lalu ubah menjadi invoice.",
      quo_create: "Buat quotation",
      quo_empty: "Belum ada quotation.",
      quo_col_customer: "Customer",
      quo_col_dp: "DP (30%)",
      quo_delete_confirm_prefix: "Quotation",
      quo_delete_confirm_suffix: "akan dihapus permanen.",
      quo_modal_create: "Buat quotation",
      quo_modal_edit: "Edit quotation",
      quo_pick_customer: "Pilih customer (wajib terdaftar di Data Customer)",
      pick_customer_placeholder: "\u2014 Pilih customer \u2014",
      quo_no_customer_warning:
        "Belum ada customer. Tambahkan dulu di halaman Data Customer.",
      quo_items: "Item",
      quo_subtotal: "Subtotal",
      quo_dp: "Down payment (30%)",
      quo_number: "No. Quotation",
      quo_number_auto: "Nomor dibuat otomatis.",
      quo_convert: "Jadikan invoice",
      quo_date: "Tanggal",
      inv_title: "Invoice",
      inv_subtitle: "Terbitkan invoice dan pantau status pembayarannya.",
      inv_create: "Buat invoice",
      inv_empty: "Belum ada invoice.",
      inv_col_status: "Status",
      inv_col_updated: "Terakhir diupdate",
      inv_delete_confirm_prefix: "Invoice",
      inv_delete_confirm_mid:
        "beserta data pembayaran terkait akan dihapus permanen.",
      inv_modal_create: "Buat invoice",
      inv_modal_edit: "Edit invoice",
      inv_number: "No. Invoice",
      inv_date: "Tanggal",
      inv_payment_plan: "Payment plan",
      inv_fill_from_quo_hint: "Customer ini punya quotation",
      inv_pick_quo: "Pilih quotation",
      inv_pick_quo_ph: "\u2014 Pilih quotation \u2014",
      inv_pick_quo_hint: "Customer dan item diambil otomatis dari quotation, tidak perlu diisi ulang.",
      inv_no_quo: "Belum ada quotation. Buat quotation dulu di menu Quotations.",
      inv_new_sub: "Invoice dibuat dari quotation yang sudah ada.",
      inv_view_items: "Lihat item",
      inv_items_unit: "item",
      inv_and_more: "dan",
      inv_others: "lainnya",
      inv_installments: "Cicilan",
      inv_add_notes: "Tambah catatan",
      inv_create_btn: "Buat invoice",
      inv_total_label: "Total",
      inv_close: "Tutup",
      ev_time: "Jam",
      ev_location: "Lokasi",
      ev_client: "Client",
      ev_invoice: "Invoice",
      ev_services: "Layanan",
      ev_note: "Catatan event",
      ev_empty: "Belum diisi",
      ev_edit: "Edit detail",
      ev_edit_title: "Detail event",
      ev_saved: "Detail event tersimpan.",
      ev_loc_ph: "Contoh: Gedung Serbaguna, Bandung",
      ev_note_ph: "Dresscode, rundown, kontak PIC...",
      ev_view_order: "Lihat order",
      ev_manage: "Jam & lokasi",
      ev_no_dates: "Item di invoice ini belum punya tanggal event. Isi dulu tanggal event di item (Edit invoice › Lihat & edit item), lalu atur jam dan lokasinya di sini.",
      ev_manage_title: "Jam & lokasi event",
      ev_manage_sub: "Isi jam dan lokasi untuk tiap tanggal event.",
      ev_save_btn: "Simpan",
      orders_note_empty: "Belum ada catatan untuk order ini.",
      orders_detail: "Lihat detail",
      orders_note_btn: "Catatan",
      orders_note_title: "Catatan order",
      orders_note_ph: "Tulis catatan untuk tim...",
      orders_note_saved: "Catatan tersimpan.",
      orders_open: "Lihat order",
      orders_col_event: "Tanggal event",
      orders_col_items: "Item",
      inv_col_due: "Jatuh tempo",
      inv_due_paid: "Lunas",
      inv_due_label: "Jatuh tempo",
      inv_toast_paid: "{label} ditandai lunas. Klik Simpan untuk menerapkan.",
      inv_toast_unpaid: "{label} dikembalikan ke belum lunas. Klik Simpan untuk menerapkan.",
      inv_edit_items: "Lihat & edit item",
      inv_save_items: "Simpan item",
      inv_plan_locked: "Cicilan tidak bisa diganti setelah ada termin yang dibayar.",
      inv_edit_sub: "Ubah tanggal, item, status pembayaran, atau catatan.",
      inv_fill_from_quo_btn: "Isi dari Quotation",
      inv_pick_other_quo: "\u2014 Pilih quotation lain \u2014",
      inv_recalc: "Hitung ulang dari subtotal",
      inv_current_subtotal: "Subtotal saat ini:",
      inv_col_stage: "Tahap",
      inv_col_pct: "%",
      inv_col_amount: "Jumlah",
      inv_col_paid: "Lunas?",
      inv_paid: "Lunas",
      inv_unpaid: "Belum",
      inv_notes: "Catatan (opsional)",
      status_unpaid: "Belum Bayar",
      orders_title: "Orders",
      orders_subtitle:
        "Daftar order dan pekerjaan dari invoice. Klik baris untuk melihat item yang dikerjakan.",
      orders_empty:
        "Belum ada order. Order muncul otomatis setelah invoice dibuat.",
      orders_col_total: "Total order",
      orders_col_note: "Note",
      orders_note_placeholder: "Tambahkan catatan...",
      status_paid_full: "Paid in Full",
      status_not_paid: "Not Yet Paid",
      od_title: "Order Details",
      od_subtitle: "Item pekerjaan per invoice",
      od_pick_invoice: "Pilih invoice",
      od_pick_placeholder: "\u2014 Pilih invoice \u2014",
      od_empty: "Belum ada invoice untuk ditampilkan.",
      od_no_items: "Tidak ada item.",
      od_col_execdate: "Execution date",
      cal_title: "Kalender Event",
      cal_subtitle: "Kalender untuk memantau seluruh jadwal event.",
      cal_prev: "Bulan sebelumnya",
      cal_today: "Hari ini",
      cal_f_all: "Semua",
      cal_f_paid: "Lunas",
      cal_f_partial: "Sebagian",
      cal_f_unpaid: "Belum bayar",
      cal_all_customers: "Semua customer",
      cal_search: "Cari event...",
      cal_more: "lainnya",
      cal_next: "Bulan berikutnya",
      cal_events_on: "Event pada",
      cal_clash_warning: "\u26A0 Ada",
      cal_clash_warning_suffix:
        "event di tanggal yang sama \u2014 cek jangan sampai bentrok jadwal kru.",
      cal_empty: "Tap tanggal yang ada titik biru buat lihat detail event-nya.",
      exp_title: "Expenses",
      exp_subtitle:
        "Catat pengeluaran project, marketing, asset, dan lainnya \u2014 bisa input beberapa item sekaligus",
      exp_input_title: "Input",
      exp_input_hint: "(1 project bisa langsung beberapa item)",
      exp_field_date: "Tanggal",
      exp_field_invoice: "No. Invoice (wajib)",
      exp_pick_invoice: "\u2014 Pilih invoice \u2014",
      exp_field_item: "Item",
      exp_field_itemname: "Nama item",
      exp_field_qty: "Qty",
      exp_field_unitprice: "Unit price",
      exp_field_total: "Total",
      exp_add_btn: "Tambah pengeluaran",
      exp_add_row: "Tambah baris item",
      exp_save_all: "Simpan semua item",
      exp_empty_prefix: "Belum ada",
      exp_empty_suffix: "expense.",
      exp_col_invoice: "Invoice",
      exp_delete_confirm:
        "Data expense ini akan dihapus permanen dan memengaruhi Income & Expense serta Project Margin.",
      exp_custom_placeholder: "Sebutkan item",
      exp_custom_placeholder2: "Nama item",
      exp_field_month: "Bulan",
      exp_field_name: "Nama",
      exp_field_salary: "Jumlah Gaji",
      exp_salary_placeholder: "Nama karyawan",
      ledger_title: "Income & Expense",
      ledger_subtitle: "Pusat seluruh transaksi kas",
      ledger_total_income: "Total income",
      ledger_total_expense: "Total expense",
      ledger_balance: "Balance (total cash)",
      ledger_all_types: "Semua tipe",
      ledger_income: "Income",
      ledger_expense: "Expense",
      ledger_empty: "Belum ada transaksi.",
      ledger_col_invoice: "No. Invoice",
      ledger_col_type: "Tipe",
      ledger_col_category: "Kategori",
      ledger_col_desc: "Deskripsi",
      ledger_col_income: "Income",
      ledger_col_expense: "Expense",
      ledger_col_balance: "Balance",
      ledger_delete_confirm: "Semua data terkait akan ikut terhapus.",
      margin_title: "Project Margin",
      margin_subtitle:
        "Menampilkan profitabilitas setiap proyek berdasarkan total pendapatan, biaya proyek, dan margin keuntungan.",
      margin_total_revenue: "Total revenue",
      margin_total_expense: "Total project expense",
      margin_total_profit: "Total profit",
      margin_empty: "Belum ada data margin.",
      margin_col_expense: "Expense",
      margin_col_profit: "Profit",
      margin_col_margin: "Margin",
      margin_f_all: "Semua margin",
      margin_f_good: "Sehat (≥35%)",
      margin_f_mid: "Sedang (25–35%)",
      margin_f_low: "Rendah (<25%)",
      best_title: "Paket Terlaris",
      best_subtitle:
        "Ranking package item berdasarkan penjualan dari semua invoice",
      best_empty:
        "Belum ada data penjualan. Data muncul begitu ada item di invoice.",
      best_col_package: "Package Item",
      best_col_qty: "Qty Terjual",
      best_col_orders: "Jumlah Order",
      best_col_revenue: "Total Revenue",
      best_col_share: "Proporsi",
      backup_title: "Backup Data",
      backup_monthly_title: "Laporan bulanan (Excel)",
      backup_monthly_hint:
        "Satu file Excel rapi berisi ringkasan, pemasukan, pengeluaran, invoice, dan quotation untuk bulan yang dipilih.",
      backup_monthly_button: "Download Excel (.xlsx)",
      backup_full_title: "Backup & restore lengkap",
      backup_full_hint:
        "Buat jaga-jaga kalau ganti HP atau history browser ke-clear \u2014 simpan seluruh data (bukan cuma 1 bulan).",
      backup_full_export: "Backup (.json)",
      backup_full_restore: "Restore",
      backup_offline:
        "Export butuh koneksi internet aktif. Coba lagi setelah tersambung.",
      backup_invalid: "File backup tidak valid atau rusak.",
      backup_confirm_title: "Timpa semua data?",
      backup_never: "Belum pernah backup",
      backup_last: "Terakhir backup:",
      backup_today: "hari ini",
      backup_days_ago: "hari lalu",
      backup_subtitle: "Simpan data kamu dengan aman, atau pindahkan ke perangkat lain.",
      backup_month_label: "Bulan laporan",
      backup_close: "Tutup",
      backup_status_label: "Status backup",
      item_no: "No.",
      item_eventdate: "Event date",
      item_package: "Package item",
      item_desc: "Description",
      item_qty: "Qty",
      item_unitprice: "Unit price",
      item_discount: "Discount",
      item_subtotal: "Subtotal",
      item_add: "Tambah item",
      item_empty: 'Belum ada item. Klik "Tambah item".',
      item_pick: "\u2014 Pilih \u2014",
      item_custom: "Lainnya - (isi sendiri)",
      item_pick_desc: "Pilih deskripsi...",
      item_pick_desc_title: "Pilih deskripsi (bisa lebih dari satu)",
      item_desc_custom_placeholder: "Tulis deskripsi lainnya",
      item_pkg_custom_placeholder: "Tulis package item",
      item_done: "Selesai",
      print_menu_export: "Export PDF",
      print_menu_whatsapp: "Kirim via WhatsApp",
      print_menu_cancel: "Batal",
      print_menu_title: "Cetak / kirim",
    },
    en: {
      tagline: "PAYHUB",
      nav_home: "Analytics",
      nav_customers: "Customer Data",
      nav_quotations: "Quotations",
      nav_invoices: "Invoice",
      nav_orders: "Orders",
      nav_orderDetails: "Order Details",
      nav_calendar: "Event Calendar",
      nav_expenses: "Expenses",
      nav_ledger: "Income & Expense",
      nav_margin: "Project Margin",
      nav_packages: "Package Item",
      pkg_title: "Package Item",
      pkg_subtitle: "Package catalog with default prices, plus sales reports per package.",
      pkg_tab_catalog: "Catalog",
      pkg_tab_best: "Best Sellers",
      pkg_add: "Add package",
      pkg_search: "Search packages...",
      pkg_col_name: "Package item",
      pkg_col_price: "Default price",
      pkg_empty: "No packages yet. Add the first one.",
      pkg_modal_add: "Add package",
      pkg_modal_edit: "Edit package",
      pkg_modal_add_sub: "Added packages show up in the Package item options on quotations and invoices.",
      pkg_modal_edit_sub: "Changing the name or price does not change existing quotations and invoices.",
      pkg_field_name: "Package name",
      pkg_field_price: "Default price",
      pkg_price_hint: "Used as the starting price when the package is picked. The price on the item can still be changed.",
      pkg_dup: "A package with this name already exists.",
      pkg_saved: "Package saved.",
      pkg_deleted: "Package removed from the catalog.",
      pkg_delete_prefix: "Package",
      pkg_delete_confirm: "will be removed from the catalog. Existing quotations and invoices won't change.",
      nav_bestsellers: "Best Sellers",
      nav_users: "Users",
      no_access: "You do not have access to change this data",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      search_placeholder: "Search...",
      logout: "Log out",
      backup_restore: "Backup & Restore",
      dark_mode: "Dark mode",
      light_mode: "Light mode",
      language: "Language",
      back: "\u2190 Back",
      confirm_delete_title: "Confirm deletion",
      login_title: "Sign in to your account",
      login_subtitle: "Use your team email to access PayHub.",
      login_email_label: "Email",
      login_email_placeholder: "name@email.com",
      login_button: "Sign in",
      login_loading: "Signing in\u2026",
      login_footer: "Internal access for the Sum\xE9riapoto team.",
      login_error: "Enter a valid email address.",
      loading: "Loading\u2026",
      pin_title: "Enter PIN",
      pin_subtitle: "A PIN is required to open this app.",
      pin_unlock: "Unlock",
      pin_wrong: "Wrong PIN. Try again.",
      dash_title: "Master Dashboard",
      dash_subtitle:
        "Dashboard to monitor all of Sum\xE9riapoto's financial data",
      dash_overdue_prefix:
        "invoice(s) past the payment deadline (H-7 before the event)",
      dash_remaining: "Remaining",
      dash_late: "late by",
      dash_days: "days",
      dash_send_reminder: "Send WA reminder",
      dash_overdue_short: "invoices past the payment deadline",
      dash_days_short: "d late",
      dash_day: "Day",
      dash_week: "Week",
      dash_month: "Month",
      dash_year: "Year",
      dash_custom: "Custom",
      dash_monthly: "Monthly",
      dash_yearly: "Yearly",
      dash_revenue: "Revenue",
      dash_outstanding: "Outstanding",
      dash_menu_title: "Menu",
      dash_expenses: "Expenses",
      dash_assets: "Assets",
      dash_profit: "Profit",
      dash_chart_title: "Revenue vs Expense vs Profit",
      dash_no_data: "No data yet for this date range.",
      cust_title: "Customer Data",
      cust_subtitle: "Manage customer data along with their invoice and payment history.",
      cust_export_xls: "Export to XLS",
      cust_add: "Add customer",
      cust_search_placeholder: "Search name, email, city...",
      cust_empty: "No customers yet. Add your first one.",
      cust_col_name: "Name",
      cust_col_gender: "Gender",
      cust_col_email: "Email",
      cust_col_phone: "Phone",
      cust_col_city: "City",
      cust_modal_add: "Add customer",
      cust_modal_edit: "Edit customer",
      cust_modal_add_sub: "Add a new customer to use in quotations and invoices.",
      cust_modal_edit_sub: "Update the customer details. Invoices that were already issued will not change.",
      cust_field_name: "Name",
      cust_field_gender: "Gender",
      cust_field_email: "Email",
      cust_field_phone: "Phone",
      cust_field_city: "City",
      cust_delete_confirm: "will be permanently deleted.",
      cust_delete_prefix: "Customer data",
      export_pwd_title: "Export to XLS",
      export_pwd_label: "Enter PIN to export data",
      export_pwd_wrong: "Wrong PIN.",
      export_btn: "Export",
      xls_offline:
        "The XLS export feature needs an active internet connection. Try again once you're connected.",
      detail_gender: "Gender",
      detail_phone: "Phone",
      detail_email: "Email",
      detail_city: "City",
      detail_revenue: "Total revenue",
      detail_outstanding: "Outstanding",
      detail_quotations: "Quotations",
      detail_invoices: "Invoices",
      detail_invoice_history: "Invoice History",
      detail_quotation_history: "Quotation History",
      detail_payment_history: "Payment History",
      detail_no_invoice: "No invoices yet.",
      detail_no_quotation: "No quotations yet.",
      detail_no_payment: "No paid payments yet.",
      col_invoice_no: "Invoice No.",
      col_quotation_no: "Quotation No.",
      col_date: "Date",
      col_total: "Total",
      col_subtotal: "Subtotal",
      col_status: "Status",
      col_stage: "Stage",
      col_amount: "Amount",
      quo_title: "Quotations",
      quo_subtitle: "Create and manage price quotations, then turn them into invoices.",
      quo_create: "New quotation",
      quo_empty: "No quotations yet.",
      quo_col_customer: "Customer",
      quo_col_dp: "DP (30%)",
      quo_delete_confirm_prefix: "Quotation",
      quo_delete_confirm_suffix: "will be permanently deleted.",
      quo_modal_create: "New quotation",
      quo_modal_edit: "Edit quotation",
      quo_pick_customer:
        "Select customer (must be registered under Customer Data)",
      pick_customer_placeholder: "\u2014 Select customer \u2014",
      quo_no_customer_warning:
        "No customers yet. Add one first on the Customer Data page.",
      quo_items: "Items",
      quo_subtotal: "Subtotal",
      quo_dp: "Down payment (30%)",
      quo_number: "Quotation No.",
      quo_number_auto: "Number is generated automatically.",
      quo_convert: "Convert to invoice",
      quo_date: "Date",
      inv_title: "Invoice",
      inv_subtitle: "Issue invoices and track their payment status.",
      inv_create: "New invoice",
      inv_empty: "No invoices yet.",
      inv_col_status: "Status",
      inv_col_updated: "Last updated",
      inv_delete_confirm_prefix: "Invoice",
      inv_delete_confirm_mid:
        "and its related payment data will be permanently deleted.",
      inv_modal_create: "New invoice",
      inv_modal_edit: "Edit invoice",
      inv_number: "Invoice No.",
      inv_date: "Date",
      inv_payment_plan: "Payment plan",
      inv_fill_from_quo_hint: "This customer has a quotation",
      inv_pick_quo: "Select quotation",
      inv_pick_quo_ph: "\u2014 Select quotation \u2014",
      inv_pick_quo_hint: "Customer and items are pulled from the quotation automatically, no need to re-enter them.",
      inv_no_quo: "No quotations yet. Create one first in the Quotations menu.",
      inv_new_sub: "The invoice is created from an existing quotation.",
      inv_view_items: "View items",
      inv_items_unit: "item(s)",
      inv_and_more: "and",
      inv_others: "more",
      inv_installments: "Installments",
      inv_add_notes: "Add notes",
      inv_create_btn: "Create invoice",
      inv_total_label: "Total",
      inv_close: "Close",
      ev_time: "Time",
      ev_location: "Location",
      ev_client: "Client",
      ev_invoice: "Invoice",
      ev_services: "Services",
      ev_note: "Event note",
      ev_empty: "Not filled in yet",
      ev_edit: "Edit details",
      ev_edit_title: "Event details",
      ev_saved: "Event details saved.",
      ev_loc_ph: "e.g. Grand Ballroom, Bandung",
      ev_note_ph: "Dress code, rundown, PIC contact...",
      ev_view_order: "View order",
      ev_manage: "Time & location",
      ev_no_dates: "The items on this invoice have no event date yet. Add an event date to the items first (Edit invoice › View & edit items), then set the time and location here.",
      ev_manage_title: "Event time & location",
      ev_manage_sub: "Fill in the time and location for each event date.",
      ev_save_btn: "Save",
      orders_note_empty: "No note for this order yet.",
      orders_detail: "View details",
      orders_note_btn: "Note",
      orders_note_title: "Order note",
      orders_note_ph: "Write a note for the team...",
      orders_note_saved: "Note saved.",
      orders_open: "View order",
      orders_col_event: "Event date",
      orders_col_items: "Items",
      inv_col_due: "Due date",
      inv_due_paid: "Paid",
      inv_due_label: "Due",
      inv_toast_paid: "{label} marked as paid. Click Save to apply.",
      inv_toast_unpaid: "{label} set back to unpaid. Click Save to apply.",
      inv_edit_items: "View & edit items",
      inv_save_items: "Save items",
      inv_plan_locked: "Installments cannot be changed once a stage has been paid.",
      inv_edit_sub: "Change the date, items, payment status, or notes.",
      inv_fill_from_quo_btn: "Fill from Quotation",
      inv_pick_other_quo: "\u2014 Pick another quotation \u2014",
      inv_recalc: "Recalculate from subtotal",
      inv_current_subtotal: "Current subtotal:",
      inv_col_stage: "Stage",
      inv_col_pct: "%",
      inv_col_amount: "Amount",
      inv_col_paid: "Paid?",
      inv_paid: "Paid",
      inv_unpaid: "Unpaid",
      inv_notes: "Notes (optional)",
      status_unpaid: "Unpaid",
      orders_title: "Orders",
      orders_subtitle:
        "Orders and work items from your invoices. Click a row to see the items to deliver.",
      orders_empty:
        "No orders yet. Orders appear automatically once an invoice is created.",
      orders_col_total: "Order total",
      orders_col_note: "Note",
      orders_note_placeholder: "Add a note...",
      status_paid_full: "Paid in Full",
      status_not_paid: "Not Yet Paid",
      od_title: "Order Details",
      od_subtitle: "Work items per invoice",
      od_pick_invoice: "Select invoice",
      od_pick_placeholder: "\u2014 Select invoice \u2014",
      od_empty: "No invoice to show yet.",
      od_no_items: "No items.",
      od_col_execdate: "Execution date",
      cal_title: "Event Calendar",
      cal_subtitle: "Calendar to keep track of all event schedules.",
      cal_prev: "Previous month",
      cal_today: "Today",
      cal_f_all: "All",
      cal_f_paid: "Paid",
      cal_f_partial: "Partial",
      cal_f_unpaid: "Unpaid",
      cal_all_customers: "All customers",
      cal_search: "Search events...",
      cal_more: "more",
      cal_next: "Next month",
      cal_events_on: "Events on",
      cal_clash_warning: "\u26A0 There are",
      cal_clash_warning_suffix:
        "events on the same date \u2014 watch out for crew scheduling clashes.",
      cal_empty: "Tap a date with a blue dot to see its event details.",
      exp_title: "Expenses",
      exp_subtitle:
        "Track project, marketing, asset, and other expenses \u2014 add several items at once",
      exp_input_title: "Input",
      exp_input_hint: "(1 project can have several items at once)",
      exp_field_date: "Date",
      exp_field_invoice: "Invoice No. (required)",
      exp_pick_invoice: "\u2014 Select invoice \u2014",
      exp_field_item: "Item",
      exp_field_itemname: "Item name",
      exp_field_qty: "Qty",
      exp_field_unitprice: "Unit price",
      exp_field_total: "Total",
      exp_add_btn: "Add expense",
      exp_add_row: "Add item row",
      exp_save_all: "Save all items",
      exp_empty_prefix: "No",
      exp_empty_suffix: "expenses yet.",
      exp_col_invoice: "Invoice",
      exp_delete_confirm:
        "This expense will be permanently deleted and will affect Income & Expense and Project Margin.",
      exp_custom_placeholder: "Specify item",
      exp_custom_placeholder2: "Item name",
      exp_field_month: "Month",
      exp_field_name: "Name",
      exp_field_salary: "Salary Amount",
      exp_salary_placeholder: "Employee name",
      ledger_title: "Income & Expense",
      ledger_subtitle: "The hub for all cash transactions",
      ledger_total_income: "Total income",
      ledger_total_expense: "Total expense",
      ledger_balance: "Balance (total cash)",
      ledger_all_types: "All types",
      ledger_income: "Income",
      ledger_expense: "Expense",
      ledger_empty: "No transactions yet.",
      ledger_col_invoice: "Invoice No.",
      ledger_col_type: "Type",
      ledger_col_category: "Category",
      ledger_col_desc: "Description",
      ledger_col_income: "Income",
      ledger_col_expense: "Expense",
      ledger_col_balance: "Balance",
      ledger_delete_confirm: "All related data will be removed too.",
      margin_title: "Project Margin",
      margin_subtitle:
        "Shows each project's profitability based on total revenue, project cost, and profit margin.",
      margin_total_revenue: "Total revenue",
      margin_total_expense: "Total project expense",
      margin_total_profit: "Total profit",
      margin_empty: "No margin data yet.",
      margin_col_expense: "Expense",
      margin_col_profit: "Profit",
      margin_col_margin: "Margin",
      margin_f_all: "All margins",
      margin_f_good: "Healthy (≥35%)",
      margin_f_mid: "Medium (25–35%)",
      margin_f_low: "Low (<25%)",
      best_title: "Best Sellers",
      best_subtitle: "Package item ranking based on sales across all invoices",
      best_empty: "No sales data yet. It appears once invoices have items.",
      best_col_package: "Package Item",
      best_col_qty: "Qty Sold",
      best_col_orders: "Order Count",
      best_col_revenue: "Total Revenue",
      best_col_share: "Share",
      backup_title: "Backup Data",
      backup_monthly_title: "Monthly report (Excel)",
      backup_monthly_hint:
        "Pick a month, then export that month's quotation, invoice, income, and expense data into one Excel file (one sheet each).",
      backup_monthly_button: "Download Excel (.xlsx)",
      backup_full_title: "Full backup & restore",
      backup_full_hint:
        "A safety net in case you switch phones or your browser history gets cleared \u2014 saves all data (not just one month).",
      backup_full_export: "Backup (.json)",
      backup_full_restore: "Restore",
      backup_offline:
        "Export needs an active internet connection. Try again once connected.",
      backup_invalid: "The backup file is invalid or corrupted.",
      backup_confirm_title: "Overwrite all data?",
      backup_never: "Never backed up",
      backup_last: "Last backup:",
      backup_today: "today",
      backup_days_ago: "days ago",
      backup_subtitle: "Keep your data safe, or move it to another device.",
      backup_month_label: "Report month",
      backup_close: "Close",
      backup_status_label: "Backup status",
      item_no: "No.",
      item_eventdate: "Event date",
      item_package: "Package item",
      item_desc: "Description",
      item_qty: "Qty",
      item_unitprice: "Unit price",
      item_discount: "Discount",
      item_subtotal: "Subtotal",
      item_add: "Add item",
      item_empty: 'No items yet. Click "Add item".',
      item_pick: "\u2014 Select \u2014",
      item_custom: "Other - (specify)",
      item_pick_desc: "Select description...",
      item_pick_desc_title: "Select description (multiple allowed)",
      item_desc_custom_placeholder: "Write other description",
      item_pkg_custom_placeholder: "Write package item",
      item_done: "Done",
      print_menu_export: "Export PDF",
      print_menu_whatsapp: "Send via WhatsApp",
      print_menu_cancel: "Cancel",
      print_menu_title: "Print / send",
    },
  };
// Menu yang butuh data pengeluaran disembunyikan untuk role tanpa akses expenses.
const NAV_NEEDS = {
  expenses: "read:expenses",
  ledger: "read:expenses",
  margin: "read:expenses",
};
const PACKAGE_PRICES = {};
const PACKAGE_DEFAULTS_BOX = { list: null };
function visibleNav(can) {
  return NAV.filter((i) => (!i.perm || can(i.perm)) && (!NAV_NEEDS[i.key] || can(NAV_NEEDS[i.key])));
}
function makeT(o) {
  return function (t) {
    return (TRANSLATIONS[o] && TRANSLATIONS[o][t]) || TRANSLATIONS.id[t] || t;
  };
}
const WA_ICON_DATA_URI =
    "data:image/png;base64,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",
  NAV = [
    { key: "home", label: "Analytics", icon: HomeIcon },
    { key: "customers", label: "Data Customer", icon: Couple },
    { key: "quotations", label: "Quotations", icon: Handshake },
    { key: "invoices", label: "Invoice", icon: Receipt },
    { key: "orders", label: "Orders", icon: ShoppingBag },
    { key: "calendar", label: "Kalender Event", icon: Calendar },
    { key: "expenses", label: "Expenses", icon: Wallet },
    { key: "ledger", label: "Income & Expense", icon: ArrowLeftRight },
    { key: "margin", label: "Project Margin", icon: TrendingUp },
    { key: "packages", label: "Package Item", icon: Package },
    { key: "users", label: "Pengguna", icon: Couple, perm: "users:manage" },
  ],
  PROJECT_ITEMS = [
    "Photographer Half Day",
    "Photographer Full Day",
    "Videographer Half Day",
    "Videographer Full Day",
    "Drone",
    "Canvas 40x60 Frameless",
    "Canvas 60x90 Frameless",
    "Mini Studio up to 6x6 Meter",
    "Same Day Edit",
    "Album 20x30 cm (22 Pages)",
    "Full Documentation 2 Hours (2 Crew)",
    "Full Clip Video Max 15 Minutes",
    "Highlight Video 3 Minutes",
    "Teaser Video 1 Minute",
    "Studio Partner",
    "Others",
  ],
  MARKETING_ITEMS = [
    "Endorsement",
    "KOL / Influencer",
    "Meta Ads",
    "Google Ads",
    "TikTok Ads",
    "Subscription",
    "Monthly Salary",
    "Others",
  ],
  PACKAGE_ITEMS_LIST = [
    "Wedding Gold Halfday",
    "Wedding Diamond Halfday",
    "Wedding Exclusive Halfday",
    "Wedding Gold Fullday",
    "Wedding Diamond Fullday",
    "Wedding Exclusive Fullday",
    "Candid Wedding Halfday",
    "Candid Wedding Fullday",
    "Couple Session Gold",
    "Couple Session Diamond",
    "Couple Session Exclusive",
    "Special Event Gold",
    "Special Event Diamond",
    "Special Event Exclusive",
    "Additional",
  ],
  PACKAGE_ITEM_OTHER = "Lainnya - (isi sendiri)",
  DESC_ITEMS_LIST = [
    "Photographer",
    "Videographer",
    "Assistant",
    "Drone",
    "Same Day Edit",
    "Canvas 40 x 60 frameless",
    "Canvas 60 x 90 frameless",
    "Mini Studio up to 6 x 6 meter",
    "Album 20 x 30 cm - 22 pages",
    "Full Doc. 2 Hour (2 Crew)",
    "Full Clip Video max. 15 min",
    "Extra Revision Video",
    "Revision Video Backsound",
    "Add Photo Edit /15 Photos",
    "Wedding Content Creator",
    "Studio Partner",
    "Charge Extra Time",
  ],
  DESC_ITEM_OTHER = "Lainnya - (isi sendiri)",
  PLAN_STAGES = {
    "2x": ["Down Payment", "Paid Full"],
    "3x": ["Down Payment", "Second Payment", "Paid Full"],
    "4x": ["Down Payment", "Second Payment", "Third Payment", "Paid Full"],
    "5x": [
      "Down Payment",
      "Second Payment",
      "Third Payment",
      "Fourth Payment",
      "Paid Full",
    ],
  },
  PLAN_PERCENTS = {
    "2x": [30, 70],
    "3x": [30, 35, 35],
    "4x": [30, 23.333, 23.333, 23.334],
    "5x": [30, 17.5, 17.5, 17.5, 17.5],
  },
  CATEGORIES = ["Project", "Marketing", "Asset", "Salary", "Other"],
  uid = () =>
    Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4),
  todayStr = () => new Date().toISOString().slice(0, 10),
  fmtRp = (o) => "Rp " + Math.round(o || 0).toLocaleString("id-ID"),
  fmtDate = (o) => {
    if (!o) return "-";
    try {
      return new Date(o).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return o;
    }
  },
  fmtDatePdf = (o) => {
    if (!o) return "-";
    try {
      const a = new Date(o);
      return (
        String(a.getDate()).padStart(2, "0") +
        "/" +
        String(a.getMonth() + 1).padStart(2, "0") +
        "/" +
        String(a.getFullYear()).slice(-2)
      );
    } catch {
      return o;
    }
  },
  monthKey = (o) => {
    const a = new Date(o);
    return `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}`;
  },
  monthLabel = (o) => {
    const [a, t] = o.split("-");
    return new Date(Number(a), Number(t) - 1, 1).toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    });
  };
function lineTotal(o) {
  return Math.max(
    0,
    (Number(o.qty) || 0) * (Number(o.unitPrice) || 0) -
      (Number(o.discount) || 0),
  );
}
function docSubtotal(o) {
  return (o || []).reduce((a, t) => a + lineTotal(t), 0);
}
function nextNumber(o, a, t) {
  const r = new Date().getFullYear(),
    n = (o || [])
      .filter((l) => (l[a] || "").endsWith("/" + r))
      .map((l) => parseInt((l[a] || "").split("/")[1], 10) || 0),
    e = n.length ? Math.max(...n) : 0;
  return `${t}/${String(e + 1).padStart(3, "0")}/${r}`;
}
// Jatuh tempo default tiap termin: termin pertama 7 hari setelah tanggal invoice, termin terakhir 7 hari sebelum event
// pertama (atau 30 hari setelah invoice kalau belum ada tanggal event), termin di tengah dibagi rata.
function defaultDueDates(n, invDate, items) {
  const ev = (items || []).map((i) => i.eventDate).filter(Boolean).sort()[0],
    base = invDate || todayStr(),
    last = ev ? addDays(ev, -7) : addDays(base, 30),
    first = addDays(base, 7) < last ? addDays(base, 7) : last,
    span = Math.round((new Date(last) - new Date(first)) / 864e5);
  return Array.from({ length: n }, (_, i) => (n === 1 ? last : i === n - 1 ? last : addDays(first, Math.round((span * i) / (n - 1)))));
}
function paymentDue(inv, i) {
  const p = (inv.payments || [])[i];
  return (p && p.dueDate) || defaultDueDates((inv.payments || []).length, inv.date, inv.items)[i] || "";
}
// Termin berikutnya yang belum dibayar (null kalau semua lunas).
function nextDue(inv) {
  const ps = inv.payments || [],
    i = ps.findIndex((p) => !p.paid);
  if (i < 0 || ps.length === 0) return null;
  const due = paymentDue(inv, i);
  return { due, idx: i, n: ps.length, label: ps[i].label, amount: ps[i].amount, overdue: !!due && todayStr() > due };
}
function generatePayments(o, a, c) {
  const t = PLAN_STAGES[o],
    r = PLAN_PERCENTS[o],
    n = r.map((l) => Math.round((a * l) / 100)),
    e = n.reduce((l, p) => l + p, 0),
    d = c ? defaultDueDates(t.length, c.date, c.items) : [];
  return (
    (n[n.length - 1] += a - e),
    t.map((l, p) => ({
      id: uid(),
      label: l,
      percent: r[p],
      amount: n[p],
      dueDate: d[p] || null,
      paid: !1,
      paidDate: null,
    }))
  );
}
function currentStatus(o) {
  const a = (o.payments || []).filter((t) => t.paid);
  return a.length ? a[a.length - 1].label : "Belum Bayar";
}
function isFullyPaid(o) {
  const a = o.payments || [];
  return a.length > 0 && a[a.length - 1].paid;
}
function addDays(o, a) {
  const t = new Date(o);
  return (t.setDate(t.getDate() + a), t.toISOString().slice(0, 10));
}
function computeOverdueInvoices(o) {
  const a = todayStr(),
    t = [];
  (o || []).forEach((r) => {
    if (isFullyPaid(r)) return;
    const ps = r.payments || [],
      late = ps
        .map((p, i) => ({ p, i, due: paymentDue(r, i) }))
        .filter((x) => !x.p.paid && x.due && a > x.due)
        .sort((x, y) => x.due.localeCompare(y.due));
    if (!late.length) return;
    const first = late[0],
      paid = ps.filter((u) => u.paid).reduce((u, y) => u + y.amount, 0),
      ev = (r.items || []).map((p) => p.eventDate).filter(Boolean).sort()[0];
    t.push({
      id: r.id,
      invNumber: r.invNumber,
      customer: r.customerSnap?.name,
      phone: r.customerSnap?.phone,
      eventDate: ev || "",
      deadline: first.due,
      stage: first.p.label,
      stageAmount: first.p.amount,
      remaining: docSubtotal(r.items) - paid,
      daysOverdue: Math.round((new Date(a) - new Date(first.due)) / 864e5),
    });
  });
  return t.sort((r, n) => n.daysOverdue - r.daysOverdue);
}
function waPhone(o) {
  const raw = String(o || "").trim();
  let a = raw.replace(/[^0-9]/g, "");
  if (raw.startsWith("+")) return a;
  return (a.startsWith("0") ? (a = "62" + a.slice(1)) : a.startsWith("62") || (a = "62" + a), a);
}
function sendReminderWhatsApp(o) {
  const a = waPhone(o.phone),
    t = `#${o.invNumber}
Halo Kak ${o.customer}, mengingatkan kembali untuk pembayaran *${o.stage}* sebesar *${fmtRp(o.stageAmount)}* yang jatuh tempo pada ${fmtDate(o.deadline)}.

Sisa pembayaran keseluruhan: *${fmtRp(o.remaining)}*
Pembayaran hanya dilakukan melalui rekening *BCA 8761141988* an. Mochamad Annas Afan

Mohon segera diselesaikan ya Kak, terima kasih \u{1F64F}

Cheers,
Tim Sumeriapoto`;
  window.open(`https://wa.me/${a}?text=${encodeURIComponent(t)}`, "_blank");
}
function quotationItemLabel(o) {
  const a = o.packageItem || "",
    t = o.description || "";
  return a.toLowerCase() === "additional" && t ? `${a} ${t}` : a || t || "Item";
}
function buildQuotationWaMessage(o) {
  const a = o.items || [],
    t = a.map((l) => `* ${quotationItemLabel(l)}: ${fmtRp(lineTotal(l))}`)
      .join(`
`),
    r = docSubtotal(a),
    n = r * 0.3,
    e = r - n;
  return `*Details Item,*
${t}

*Total : ${fmtRp(r)}*
*Down Payment (30%): ${fmtRp(n)}*
Pembayaran hanya dilakukan melalui rekening *BCA 8761141988* an. Mochamad Annas Afan

Sisa Pembayaran (70%): ${fmtRp(e)}

Thanks for choosing us! Looking forward to working with you \u{1F90D}`;
}
function exportCustomersXLS(o) {
  if (typeof XLSX > "u") {
    alert(
      "Fitur export XLS butuh koneksi internet aktif. Coba lagi setelah tersambung ke internet.",
    );
    return;
  }
  const a = o.map((n) => ({
      Name: n.name,
      Gender: n.gender,
      Email: n.email,
      Phone: n.phone,
      City: n.city,
    })),
    t = XLSX.utils.json_to_sheet(a),
    r = XLSX.utils.book_new();
  (XLSX.utils.book_append_sheet(r, t, "Customers"),
    XLSX.writeFile(r, `Sumeriapoto_Customers_${todayStr()}.xlsx`));
}
const COLLECTION_NAMES = {
  payhub_customers: "customers",
  payhub_quotations: "quotations",
  payhub_invoices: "invoices",
  payhub_expenses: "expenses",
  payhub_packages: "packages",
};
function ensureIds(arr) {
  const seen = new Set();
  let changed = !1;
  const out = (Array.isArray(arr) ? arr : []).map((it) => {
    const ok = it && typeof it === "object" && it.id != null && it.id !== "" && !seen.has(String(it.id));
    if (ok) {
      seen.add(String(it.id));
      return it;
    }
    changed = !0;
    const id = uid();
    seen.add(id);
    return { ...it, id };
  });
  return changed ? out : arr;
}
function useCollection(o, a, hooks) {
  const name = COLLECTION_NAMES[o];
  const [t, r] = useState(a),
    [n, e] = useState(!1),
    timer = useRef(null),
    base = useRef(new Map()),
    rev = useRef(""),
    dirty = useRef(!1),
    busy = useRef(!1),
    latest = useRef(a),
    mode = useRef("ok"),
    hk = useRef(hooks);
  hk.current = hooks || {};
  latest.current = t;
  // Terapkan snapshot dari server: ini juga jadi acuan diff berikutnya.
  function applyServer(d) {
    base.current = new Map(
      d.records.map((x) => [x.id, { version: x.version, json: JSON.stringify(x.data) }]),
    );
    rev.current = d.rev;
    const items = d.records.map((x) => x.data);
    latest.current = items;
    r(items);
  }
  async function reload() {
    applyServer(await apiFetch("/api/data/" + name));
  }
  useEffect(() => {
    let p = !1;
    return (
      (async () => {
        try {
          const d = await apiFetch("/api/data/" + name);
          if (!p) applyServer(d);
        } catch (err) {
          // Gagal memuat => blokir tulis supaya state kosong tidak menghapus data server.
          mode.current = err.status === 403 ? "forbidden" : "error";
          if (!p && err.status !== 403 && hk.current.onLoadError) hk.current.onLoadError(err);
        } finally {
          p || e(!0);
        }
      })(),
      () => {
        p = !0;
      }
    );
  }, [name]);
  function computeChanges(items) {
    const changes = [],
      seen = new Set();
    for (const it of items) {
      const id = String(it.id),
        b = base.current.get(id),
        json = JSON.stringify(it);
      seen.add(id);
      if (!b) changes.push({ op: "upsert", id, version: 0, data: it, _json: json });
      else if (b.json !== json)
        changes.push({ op: "upsert", id, version: b.version, data: it, _json: json });
    }
    for (const [id, b] of base.current)
      if (!seen.has(id)) changes.push({ op: "delete", id, version: b.version });
    return changes;
  }
  async function flush() {
    if (busy.current || !dirty.current || mode.current !== "ok") return;
    busy.current = !0;
    try {
      while (dirty.current) {
        dirty.current = !1;
        const changes = computeChanges(latest.current);
        let conflict = !1;
        for (let i = 0; i < changes.length; i += 200) {
          const chunk = changes.slice(i, i + 200);
          let res;
          try {
            res = await apiFetch("/api/data/" + name + "/sync", {
              method: "POST",
              body: { changes: chunk.map(({ _json, ...c }) => c) },
            });
          } catch (err) {
            if (err.status === 403) {
              mode.current = "forbidden";
              hk.current.onDenied && hk.current.onDenied();
              reload().catch(() => {});
            } else {
              dirty.current = !0;
              hk.current.onSaveError && hk.current.onSaveError(err);
              clearTimeout(timer.current);
              timer.current = setTimeout(flush, 5000);
            }
            return;
          }
          for (const x of res.results) {
            const ch = chunk.find((c) => c.id === x.id);
            if (x.ok) {
              if (ch.op === "delete") base.current.delete(x.id);
              else base.current.set(x.id, { version: x.version, json: ch._json });
            } else conflict = !0;
          }
          // Sengaja TIDAK menyimpan res.rev: itu bisa memuat perubahan user lain yang belum kita muat.
        }
        if (conflict) {
          // Record yang bentrok diganti versi server; sisanya sudah tersimpan.
          await reload();
          dirty.current = !1;
          hk.current.onConflict && hk.current.onConflict();
        }
      }
    } finally {
      busy.current = !1;
    }
  }
  const set = useCallback((v) => {
    if (mode.current !== "ok" || (hk.current.readOnly && hk.current.readOnly())) {
      hk.current.onDenied && hk.current.onDenied();
      return;
    }
    dirty.current = !0;
    r((prev) => ensureIds(typeof v === "function" ? v(prev) : v));
  }, []);
  useEffect(() => {
    if (n && dirty.current)
      return (
        clearTimeout(timer.current),
        (timer.current = setTimeout(flush, 500)),
        () => clearTimeout(timer.current)
      );
  }, [t, n]);
  // Ambil perubahan user lain: tiap 30 dtk dan saat tab kembali aktif (hanya bila tidak ada edit tertunda).
  useEffect(() => {
    if (!n || mode.current !== "ok") return;
    const tick = async () => {
      if (document.visibilityState !== "visible" || dirty.current || busy.current) return;
      try {
        const d = await apiFetch("/api/data/" + name + "?rev=" + encodeURIComponent(rev.current));
        if (!d.unchanged && !dirty.current && !busy.current) applyServer(d);
      } catch {}
    };
    const id = setInterval(tick, 30000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [n, name]);
  useEffect(() => {
    const warn = (ev) => {
      if (dirty.current || busy.current) {
        ev.preventDefault();
        ev.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => {
      window.removeEventListener("beforeunload", warn);
      dirty.current && flush();
    };
  }, []);
  return [t, set, n];
}
function App() {
  const [o, a] = useState(null),
    [t, r] = useState(!1),
    [n, e] = useState(!1),
    [l, p] = useState("en"),
    [d, f] = useState(!1),
    [v, u] = useState(!0);
  (useEffect(() => {
    ((async () => {
      try {
        a(await apiFetch("/api/me"));
      } catch {
        a(!1);
      }
    })(),
      (async () => {
        try {
          const w = await storage.get("payhub_theme", !1);
          w && w.value === "dark" && r(!0);
        } catch {
        } finally {
          e(!0);
        }
      })(),
      (async () => {
        try {
          const w = await storage.get("payhub_lang", !1);
          w && w.value === "en" && p("en");
        } catch {
        } finally {
          f(!0);
        }
      })());
  }, []),
    useEffect(() => {
      document.documentElement.setAttribute("data-theme", t ? "dark" : "light");
    }, [t]));
  function y() {
    r((w) => {
      const B = !w;
      return (
        storage.set("payhub_theme", B ? "dark" : "light", !1).catch(() => {}),
        B
      );
    });
  }
  function c(w) {
    (p(w), storage.set("payhub_lang", w, !1).catch(() => {}));
  }
  const m = makeT(l);
  window.__uiLang = l;
  function k(w) {
    a(w);
  }
  function C() {
    apiFetch("/api/auth/sign-out", { method: "POST", body: {} })
      .catch(() => {})
      .finally(() => a(!1));
  }
  const P = React.createElement("style", null, THEME_CSS);
  return o === null || !n || !d
    ? React.createElement(
        "div",
        {
          style: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: BRAND.inkSoft,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
            background: BRAND.bg,
          },
        },
        P,
        "Memuat\u2026",
      )
    : v
      ? o
        ? React.createElement(
            React.Fragment,
            null,
            P,
            React.createElement(MainApp, {
              me: o,
              email: o.user.email,
              onLogout: C,
              dark: t,
              toggleTheme: y,
              lang: l,
              changeLang: c,
              t: m,
            }),
          )
        : React.createElement(
            React.Fragment,
            null,
            P,
            React.createElement(AuthGate, {
              onLogin: k,
              dark: t,
              toggleTheme: y,
              lang: l,
              changeLang: c,
              t: m,
            }),
          )
      : null;
}
function MainApp({
  me: ME,
  email: o,
  onLogout: a,
  dark: t,
  toggleTheme: r,
  lang: n,
  changeLang: e,
  t: l,
}) {
  const perms = ME.permissions || [],
    can = (x) => perms.includes(x),
    collHooks = (name) => ({
      readOnly: () => !can("write:" + name),
      onDenied: () => showToast(l("no_access") || "Tidak punya akses untuk mengubah data ini", "error"),
      onConflict: () =>
        showToast("Data diubah pengguna lain. Data dimuat ulang, silakan ulangi perubahanmu.", "error"),
      onSaveError: () => showToast("Gagal menyimpan. Mencoba lagi\u2026", "error"),
      onLoadError: () => showToast("Gagal memuat data. Muat ulang halaman.", "error"),
    }),
    [p, d, f] = useCollection("payhub_customers", [], collHooks("customers")),
    [v, u, y] = useCollection("payhub_quotations", [], collHooks("quotations")),
    [c, m, k] = useCollection("payhub_invoices", [], collHooks("invoices")),
    [C, P, w] = useCollection("payhub_expenses", [], collHooks("expenses")),
    [PK, setPK, pkLoaded] = useCollection("payhub_packages", [], collHooks("packages")),
    seededRef = useRef(false),
    defaultsRef = PACKAGE_DEFAULTS_BOX.list || (PACKAGE_DEFAULTS_BOX.list = PACKAGE_ITEMS_LIST.slice()),
    B = f && y && k && w,
    [I, s] = useState("home"),
    [g, i] = useState(null),
    [h, b] = useState(null),
    [S, E] = useState(null),
    [T, x] = useState(null),
    [PR, setPR] = useState(!1),
    [BK, setBK] = useState(!1),
    [TS, setTS] = useState(null),
    TSref = useRef(null),
    [LG, setLG] = useState(null),
    [LGchecked, setLGchecked] = useState(!1);
  function showToast(msg, tone) {
    (TSref.current && clearTimeout(TSref.current),
      setTS({ msg, tone: tone || "success" }),
      (TSref.current = setTimeout(() => setTS(null), 2600)));
  }
  useEffect(() => {
    (async () => {
      try {
        const F = await storage.get("payhub_last_backup", !1);
        F && F.value && x(F.value);
      } catch {}
    })();
  }, []);
  function z() {
    const F = new Date().toISOString();
    (storage.set("payhub_last_backup", F, !1).catch(() => {}), x(F));
  }
  useEffect(() => {
    if (B && !LGchecked) {
      setLGchecked(!0);
      setLG(findLegacyData({ customers: p, quotations: v, invoices: c, expenses: C, can, showToast }));
    }
  }, [B, LGchecked]);
  useMemo(() => {
    if (PK.length) {
      PACKAGE_ITEMS_LIST.length = 0;
      Object.keys(PACKAGE_PRICES).forEach((k) => delete PACKAGE_PRICES[k]);
      PK.forEach((x) => {
        PACKAGE_ITEMS_LIST.push(x.name);
        PACKAGE_PRICES[x.name] = Number(x.price) || 0;
      });
    }
  }, [PK]);
  useEffect(() => {
    if (pkLoaded && PK.length === 0 && !seededRef.current && can("write:packages")) {
      seededRef.current = !0;
      setPK(defaultsRef.map((nm) => ({ id: uid(), name: nm, price: 0 })));
    }
  }, [pkLoaded, PK.length]);
  const _ = useMemo(() => computeOverdueInvoices(c), [c]),
    N = {
      customers: p,
      setCustomers: d,
      quotations: v,
      setQuotations: u,
      invoices: c,
      setInvoices: m,
      expenses: C,
      setExpenses: P,
      packages: PK,
      setPackages: setPK,
      setTab: s,
      selectedInvoiceId: g,
      setSelectedInvoiceId: i,
      setPrintTarget: b,
      detailCustomerId: S,
      setDetailCustomerId: E,
      overdueInvoices: _,
      t: l,
      lang: n,
      markBackupDone: z,
      showToast,
      me: ME,
      can,
      openAccount: () => setPR(!0),
    };
  if (h)
    return React.createElement(PrintView, {
      target: h,
      onClose: () => b(null),
    });
  const j = l(`nav_${I}`) || NAV.find((F) => F.key === I)?.label || "";
  return React.createElement(
    "div",
    {
      className: "app-shell",
      style: {
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
        background: "var(--shell, " + BRAND.bg + ")",
        minHeight: "100%",
        height: "100vh",
        overflow: "hidden",
        color: BRAND.ink,
        display: "flex",
      },
    },
    React.createElement(
      "style",
      null,
      `
        
        * { box-sizing: border-box; -webkit-overflow-scrolling: touch; }
        html, body { -webkit-text-size-adjust: 100%; }
        input, select, textarea, button { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
        input, select, textarea { outline: none; }
        input:focus, select:focus, textarea:focus { border-color: ${BRAND.blue} !important; }
        button { touch-action: manipulation; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${BRAND.line}; border-radius: 8px; }
        table { border-collapse: collapse; width: 100%; }
        th { text-align: left; font-size: 11.5px; letter-spacing: 0.01em; color: ${BRAND.inkSoft}; font-weight: 600; padding: 10px 12px; border-bottom: 1px solid ${BRAND.line}; white-space: nowrap; }
        td { padding: 10px 12px; border-bottom: 1px solid ${BRAND.line}; font-size: 12.5px; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tbody tr:hover { background: ${BRAND.blueFaint}; }
        th { font-weight: 500 !important; color: ${BRAND.inkSoft}; }

        ${UI_CSS}
        .desktop-sidebar { display: flex; }
        .mobile-topbar { display: none; }
        .mobile-bottomnav { display: none; }
        .ph-fab { position: relative; overflow: hidden; transition: transform .15s ease; -webkit-tap-highlight-color: transparent; }
        .ph-fab::after { content: ""; position: absolute; inset: 0; border-radius: inherit; box-shadow: none; pointer-events: none; }
        .ph-fab:active { transform: scale(.92); }
        .ph-glyph { filter: none; }
        .ph-toast { animation: phToastIn .28s cubic-bezier(.34,1.56,.64,1) both; }
        .ph-toast-check { animation: phCheckPop .35s cubic-bezier(.34,1.56,.64,1) .1s both; }
        @keyframes phToastIn { 0%{transform:translate(-50%,16px);opacity:0;} 100%{transform:translate(-50%,0);opacity:1;} }
        @keyframes phCheckPop { 0%{transform:scale(0);} 70%{transform:scale(1.25);} 100%{transform:scale(1);} }

        @media (max-width: 880px) {
          .app-shell { flex-direction: column; height: auto !important; overflow: visible !important; background: ${BRAND.bg} !important; }
          .app-col { margin: 0 !important; height: auto !important; overflow: visible !important; border-radius: 0 !important; border: none !important; }
          .desktop-sidebar { display: none; }
          .mobile-topbar { display: none; }
          .mobile-bottomnav { display: flex; }
          .main-content { padding: 18px 14px 90px !important; }
          h1 { font-size: 19px !important; }
          .modal-overlay { padding: 0 !important; display: block !important; }
          .modal-panel { max-width: 100% !important; min-height: 100vh; border-radius: 0 !important; margin: 0 !important; }
          input, select, textarea { font-size: 16px !important; }
          input[type="date"].dash-date { font-size: 11.5px !important; padding: 4px 4px !important; }
          .top-toolbar { top: 9px !important; right: 10px !important; }
          .top-toolbar button { width: 30px !important; min-width: 30px !important; height: 30px !important; font-size: 10.5px !important; }
        }
        @media (max-width: 520px) {
          td, th { padding: 9px 8px !important; font-size: 12.5px !important; }
        }
      `,
    ),
    React.createElement(Sidebar, {
      tab: I,
      setTab: s,
      email: o,
      onLogout: a,
      currentLabel: j,
      dark: t,
      toggleTheme: r,
      ctx: N,
      overdueCount: _.length,
      lang: n,
      changeLang: e,
      t: l,
      lastBackupAt: T,
    }),
    React.createElement(
      "div",
      { className: "app-col", style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", margin: "12px 12px 12px 0", height: "calc(100vh - 24px)", overflowY: "auto", background: BRAND.bg, borderRadius: 18, border: `1px solid ${BRAND.line}` } },
      React.createElement(AppHeader, {
        ctx: N,
        tab: I,
        dark: t,
        toggleTheme: r,
        lang: n,
        changeLang: e,
        onProfile: () => setPR(!0),
        onBackup: () => setBK(!0),
        onLogout: a,
      }),
    React.createElement(
      "main",
      {
        className: "main-content",
        style: {
          flex: 1,
          minWidth: 0,
          padding: "28px 32px 60px",
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
        },
      },
      B &&
        LG &&
        React.createElement(LegacyImportBanner, { items: LG, ctx: N, onDone: () => setLG(null) }),
      B
        ? React.createElement(PageRouter, { tab: I, ctx: N })
        : React.createElement(
            "div",
            {
              style: { padding: 60, textAlign: "center", color: BRAND.inkSoft },
            },
            "Memuat data\u2026",
          ),
    ),
    ),
    React.createElement(BottomNav, {
      tab: I,
      setTab: s,
      onProfile: () => setPR(!0),
      overdueCount: _.length,
    }),
    PR &&
      React.createElement(
        Modal,
        { title: "Profile", onClose: () => setPR(!1), width: 420, icon: UserCircle },
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              paddingBottom: 18,
              borderBottom: `1px solid ${BRAND.line}`,
            },
          },
          React.createElement(
            "div",
            {
              style: {
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: BRAND.blueFaint,
                border: `1px solid ${BRAND.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: BRAND.ink,
              },
            },
            React.createElement(UserCircle, { size: 24 }),
          ),
          React.createElement(
            "div",
            { style: { minWidth: 0 } },
            React.createElement(
              "div",
              {
                style: {
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: BRAND.ink,
                  wordBreak: "break-all",
                },
              },
              o,
            ),
            React.createElement(
              "div",
              { style: { fontSize: 11.5, color: BRAND.inkSoft, marginTop: 2 } },
              "Sum\xE9riapoto PayHub",
            ),
          ),
        ),
        React.createElement(AccountPanel, { me: ME, showToast }),
        React.createElement(
          "button",
          {
            onClick: () => {
              (setPR(!1), setBK(!0));
            },
            style: {
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 13.5,
              color: BRAND.ink,
              background: "transparent",
              border: `1px solid ${BRAND.line}`,
              borderRadius: 8,
              padding: "11px 12px",
              cursor: "pointer",
              width: "100%",
              marginBottom: 9,
            },
          },
          React.createElement(Save, { size: 15 }),
          "Backup & Restore",
        ),
        React.createElement(
          "button",
          {
            onClick: r,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 13.5,
              color: BRAND.ink,
              background: "transparent",
              border: `1px solid ${BRAND.line}`,
              borderRadius: 8,
              padding: "11px 12px",
              cursor: "pointer",
              width: "100%",
              marginBottom: 16,
            },
          },
          t
            ? React.createElement(Sun, { size: 15 })
            : React.createElement(Moon, { size: 15 }),
          l(t ? "light_mode" : "dark_mode"),
        ),
        React.createElement(
          "button",
          {
            onClick: a,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 13.5,
              color: BRAND.red,
              background: BRAND.redBg,
              border: `1px solid ${BRAND.redBorder}`,
              borderRadius: 8,
              padding: "11px 12px",
              cursor: "pointer",
              width: "100%",
            },
          },
          React.createElement(LogOut, { size: 15 }),
          l("logout"),
        ),
      ),
    BK &&
      React.createElement(BackupModal, { ctx: N, onClose: () => setBK(!1) }),
    TS &&
      React.createElement(Toast, {
        msg: TS.msg,
        tone: TS.tone,
        onDone: () => setTS(null),
      }),
  );
}
function Sidebar({
  tab: o,
  setTab: a,
  email: t,
  onLogout: r,
  currentLabel: n,
  dark: e,
  toggleTheme: l,
  ctx: p,
  overdueCount: d,
  lang: f,
  changeLang: v,
  t: u,
  lastBackupAt: y,
}) {
  const [c, m] = useState(!1),
    [k, C] = useState(!1),
    P = (s, g, i) =>
      React.createElement(
        "nav",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          },
        },
        visibleNav(p.can).map((h) => {
          const b = h.icon,
            S = o === h.key,
            E = h.key === "invoices" && d > 0;
          return React.createElement(
            "button",
            {
              key: h.key,
              onClick: () => {
                (a(h.key), s && s());
              },
              style: {
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: i,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                background: S ? BRAND.blueFaint : "transparent",
                color: S ? BRAND.ink : BRAND.inkSoft,
                fontSize: g,
                fontWeight: S ? 600 : 500,
                position: "relative",
              },
            },
            React.createElement(b, { size: 17, strokeWidth: 2 }),
            u(`nav_${h.key}`),
            E &&
              React.createElement(
                "span",
                {
                  style: {
                    marginLeft: "auto",
                    minWidth: 18,
                    height: 18,
                    borderRadius: 8,
                    background: "#D92D20",
                    color: "#fff",
                    fontSize: 10.5,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  },
                },
                d,
              ),
          );
        }),
      ),
    w = y ? Math.floor((Date.now() - new Date(y).getTime()) / 864e5) : null,
    B = w === null || w >= 30,
    I = React.createElement(
      "div",
      {
        style: {
          marginTop: "auto",
          paddingTop: 16,
          borderTop: `1px solid ${BRAND.line}`,
        },
      },
      React.createElement(
        "button",
        {
          onClick: () => {
            (C(!0), m(!1));
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontSize: 13,
            color: BRAND.inkSoft,
            background: "transparent",
            border: `1px solid ${B ? BRAND.redBorder : BRAND.line}`,
            borderRadius: 8,
            padding: "9px 10px",
            cursor: "pointer",
            width: "100%",
          },
        },
        React.createElement(Save, { size: 14 }),
        " ",
        u("backup_restore"),
      ),
      React.createElement(
        "div",
        {
          style: {
            fontSize: 10.5,
            color: B ? BRAND.red : BRAND.inkSoft,
            marginTop: 5,
            marginBottom: 8,
          },
        },
        w === null
          ? u("backup_never")
          : `${u("backup_last")} ${w === 0 ? u("backup_today") : `${w} ${u("backup_days_ago")}`}`,
      ),
      React.createElement(
        "button",
        {
          onClick: p.openAccount,
          title: "Akun",
          style: {
            fontSize: 11.5,
            color: BRAND.inkSoft,
            marginBottom: 8,
            wordBreak: "break-all",
            textAlign: "left",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textDecoration: "underline",
          },
        },
        t,
      ),
      React.createElement(
        "button",
        {
          onClick: r,
          style: {
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontSize: 13,
            color: BRAND.inkSoft,
            background: "transparent",
            border: `1px solid ${BRAND.line}`,
            borderRadius: 8,
            padding: "9px 10px",
            cursor: "pointer",
            width: "100%",
          },
        },
        React.createElement(LogOut, { size: 14 }),
        " ",
        u("logout"),
      ),
    );
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(DesktopSidebar, {
      tab: o,
      setTab: a,
      can: p.can,
      overdueCount: d,
      t: u,
      lang: f,
      lastBackupAt: y,
      onBackup: () => C(!0),
    }),
    React.createElement(
      "div",
      {
        className: "mobile-topbar",
        style: {
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: BRAND.surface,
          borderBottom: `1px solid ${BRAND.line}`,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 14px",
        },
      },
      React.createElement(
        "button",
        {
          onClick: () => m(!0),
          "aria-label": "Menu",
          style: {
            border: "none",
            background: "transparent",
            padding: 4,
            display: "flex",
            color: BRAND.ink,
          },
        },
        React.createElement(Menu, { size: 22 }),
      ),
      React.createElement(
        "div",
        { style: { fontSize: 14.5, fontWeight: 700, color: BRAND.blue } },
        n || "Sum\xE9riapoto",
      ),
      React.createElement("div", { style: { width: 78 } }),
    ),
    c &&
      React.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "var(--c-overlay)",
          },
          onClick: () => m(!1),
        },
        React.createElement(
          "div",
          {
            onClick: (s) => s.stopPropagation(),
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "80%",
              maxWidth: 300,
              background: BRAND.surface,
              padding: "22px 16px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 0 0 1px var(--c-line)",
            },
          },
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              },
            },
            React.createElement(
              "div",
              null,
              React.createElement("img", {
                src: LOGO_DATA_URI,
                alt: "Sum\xE9riapoto",
                style: {
                  height: 22,
                  width: "auto",
                  display: "block",
                  filter: e ? "invert(1)" : "none",
                },
              }),
              React.createElement(
                "div",
                {
                  style: {
                    fontSize: 10.5,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: BRAND.inkSoft,
                    marginTop: 7,
                  },
                },
                "PayHub",
              ),
            ),
            React.createElement(
              "button",
              {
                onClick: () => m(!1),
                "aria-label": "Tutup menu",
                style: {
                  border: "none",
                  background: "transparent",
                  color: BRAND.inkSoft,
                },
              },
              React.createElement(X, { size: 20 }),
            ),
          ),
          P(() => m(!1), 14.5, "12px 12px"),
          I,
        ),
      ),
    k && React.createElement(BackupModal, { ctx: p, onClose: () => C(!1) }),
  );
}
function BottomNav({ tab: o, setTab: a, onProfile: t, overdueCount: r }) {
  const n = [
      { key: "home", label: "Analytics", icon: HomeIcon },
      { key: "invoices", label: "Invoice", icon: Receipt },
    ],
    e = [{ key: "calendar", label: "Calendar", icon: Calendar }],
    l = (p, d, f) => {
      const v = o === p.key,
        u = p.icon;
      return React.createElement(
        "button",
        {
          key: p.key,
          onClick: d,
          style: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px 2px",
            color: v ? BRAND.blue : BRAND.inkSoft,
            position: "relative",
          },
        },
        React.createElement(u, { size: 19, strokeWidth: v ? 2.3 : 2 }),
        React.createElement(
          "div",
          { style: { fontSize: 9.5, fontWeight: v ? 700 : 500 } },
          p.label,
        ),
        f > 0 &&
          React.createElement(
            "span",
            {
              style: {
                position: "absolute",
                top: 2,
                right: "28%",
                minWidth: 15,
                height: 15,
                borderRadius: 8,
                background: "#D92D20",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 3px",
              },
            },
            f,
          ),
      );
    };
  return React.createElement(
    "div",
    {
      className: "mobile-bottomnav",
      style: {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        background: BRAND.surface,
        borderTop: `1px solid ${BRAND.line}`,
        alignItems: "center",
        padding: "4px 4px calc(4px + env(safe-area-inset-bottom))",
        boxShadow: "none",
      },
    },
    l(n[0], () => a("home")),
    l(n[1], () => a("invoices"), r),
    React.createElement(
      "div",
      {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -22,
        },
      },
      React.createElement(
        "button",
        {
          className: "ph-fab",
          onClick: () => a("quotations"),
          "aria-label": "New Quo",
          style: {
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: BRAND.blue,
            border: `3px solid ${BRAND.surface}`,
            color: "var(--c-onBlue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px -4px rgba(9,9,11,0.25)",
            position: "relative",
            overflow: "hidden",
          },
        },
        React.createElement(Plus, {
          size: 25,
          strokeWidth: 2.5,
          className: "ph-glyph",
        }),
      ),
      React.createElement(
        "div",
        {
          style: {
            fontSize: 10,
            fontWeight: 600,
            color: BRAND.ink,
            marginTop: 2,
          },
        },
        "New Quo",
      ),
    ),
    l(e[0], () => a("calendar")),
    l({ key: "profile", label: "Profile", icon: UserCircle }, t),
  );
}
function Toast({ msg: o, tone: a, onDone: t }) {
  const r = a === "error";
  return React.createElement(
    "div",
    {
      className: "ph-toast",
      style: {
        position: "fixed",
        left: "50%",
        bottom: "calc(72px + env(safe-area-inset-bottom))",
        transform: "translateX(-50%)",
        zIndex: 400,
        background: "#18181B",
        color: "#FAFAFA",
        border: "1px solid #27272A",
        padding: "12px 18px",
        borderRadius: 12,
        fontSize: 13.5,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.3)",
        maxWidth: "88vw",
      },
    },
    React.createElement(
      "div",
      {
        className: "ph-toast-check",
        style: {
          width: 20,
          height: 20,
          minWidth: 20,
          borderRadius: "50%",
          background: r ? "#DC2626" : "#16A34A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      r
        ? React.createElement(AlertTriangle, { size: 12, color: "#fff" })
        : React.createElement(Check, {
            size: 12,
            color: "#fff",
            strokeWidth: 3,
          }),
    ),
    React.createElement("div", null, o),
  );
}
function monthLabelID(o) {
  const [a, t] = o.split("-").map(Number);
  return new Date(a, t - 1, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}
function collectAvailableMonths(o) {
  const { quotations: a, invoices: t, expenses: r } = o,
    n = new Set();
  return (
    a.forEach((e) => e.date && n.add(e.date.slice(0, 7))),
    t.forEach((e) => {
      (e.date && n.add(e.date.slice(0, 7)),
        (e.payments || []).forEach((l) => {
          l.paid && n.add((l.paidDate || e.date).slice(0, 7));
        }));
    }),
    r.forEach((e) => e.date && n.add(e.date.slice(0, 7))),
    n.add(todayStr().slice(0, 7)),
    Array.from(n).sort().reverse()
  );
}
const XLS_L = {
  id: {
    sum: "Ringkasan", inc: "Pemasukan", exp: "Pengeluaran", inv: "Invoice", quo: "Quotation",
    period: "Periode", gen: "Dibuat pada", income: "Total pemasukan", expense: "Total pengeluaran", net: "Selisih (pemasukan - pengeluaran)",
    cInv: "Jumlah invoice", cQuo: "Jumlah quotation", metric: "Keterangan", value: "Nilai",
    date: "Tanggal", invNo: "No. Invoice", quoNo: "No. Quotation", cust: "Customer", stage: "Tahap", amount: "Jumlah (Rp)",
    cat: "Kategori", item: "Item", qty: "Qty", price: "Harga satuan (Rp)", disc: "Diskon (Rp)", total: "Total (Rp)",
    paid: "Sudah dibayar (Rp)", rest: "Sisa (Rp)", status: "Status", sub: "Subtotal (Rp)", dp: "DP 30% (Rp)", sumRow: "TOTAL", unpaid: "Belum Bayar",
  },
  en: {
    sum: "Summary", inc: "Income", exp: "Expenses", inv: "Invoices", quo: "Quotations",
    period: "Period", gen: "Generated on", income: "Total income", expense: "Total expenses", net: "Net (income - expenses)",
    cInv: "Invoices", cQuo: "Quotations", metric: "Item", value: "Value",
    date: "Date", invNo: "Invoice No.", quoNo: "Quotation No.", cust: "Customer", stage: "Stage", amount: "Amount (IDR)",
    cat: "Category", item: "Item", qty: "Qty", price: "Unit price (IDR)", disc: "Discount (IDR)", total: "Total (IDR)",
    paid: "Paid (IDR)", rest: "Balance (IDR)", status: "Status", sub: "Subtotal (IDR)", dp: "30% down payment (IDR)", sumRow: "TOTAL", unpaid: "Unpaid",
  },
};
function xlsSerial(o) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(o || "");
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5 + 25569 : o || "";
}
// cols: [{ h: header, w: lebar, k: "t" teks | "n" angka | "d" tanggal | "q" qty }]
function xlsSheet(cols, rows, totalRow) {
  const data = [cols.map((c) => c.h), ...rows.map((r) => r.map((v, i) => (cols[i].k === "d" ? xlsSerial(v) : v)))];
  const n = data.length;
  if (totalRow) data.push(totalRow);
  const ws = XLSX.utils.aoa_to_sheet(data);
  for (let r = 1; r < data.length; r++)
    cols.forEach((c, ci) => {
      const cell = ws[XLSX.utils.encode_cell({ r, c: ci })];
      if (!cell) return;
      if (c.k === "d" && typeof cell.v === "number") cell.z = "dd/mm/yyyy";
      else if (c.k === "n" && typeof cell.v === "number") cell.z = "#,##0";
    });
  ws["!cols"] = cols.map((c) => ({ wch: c.w }));
  ws["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: Math.max(n - 1, 0), c: cols.length - 1 } }) };
  ws["!views"] = [{ state: "frozen", ySplit: 1 }];
  return ws;
}
function buildMonthlyWorkbook(o, a, lang) {
  const L = XLS_L[lang === "en" ? "en" : "id"];
  const { quotations: t, invoices: r, expenses: n } = o,
    inM = (u) => !!u && u.slice(0, 7) === a,
    byDate = (k) => (x, y) => String(x[k]).localeCompare(String(y[k])),
    income = [];
  r.forEach((u) =>
    (u.payments || []).forEach((y) => {
      y.paid && inM(y.paidDate || u.date) && income.push({ d: y.paidDate || u.date, no: u.invNumber, c: u.customerSnap?.name || "", st: y.label, v: Number(y.amount) || 0 });
    }),
  );
  income.sort(byDate("d"));
  const exps = n.filter((u) => inM(u.date)).sort(byDate("date")),
    invs = r.filter((u) => inM(u.date)).sort(byDate("date")),
    quos = t.filter((u) => inM(u.date)).sort(byDate("date")),
    sum = (arr, f) => arr.reduce((x, y) => x + f(y), 0),
    totalIn = sum(income, (x) => x.v),
    totalEx = sum(exps, lineTotal),
    wb = XLSX.utils.book_new(),
    [yy, mm] = a.split("-").map(Number),
    period = new Date(yy, mm - 1, 1).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { month: "long", year: "numeric" });
  const ws0 = XLSX.utils.aoa_to_sheet([
    [L.metric, L.value],
    [L.period, period],
    [L.gen, new Date().toLocaleString(lang === "en" ? "en-US" : "id-ID")],
    [L.income, totalIn],
    [L.expense, totalEx],
    [L.net, totalIn - totalEx],
    [L.cInv, invs.length],
    [L.cQuo, quos.length],
  ]);
  [3, 4, 5].forEach((i) => {
    const c = ws0[XLSX.utils.encode_cell({ r: i, c: 1 })];
    c && (c.z = "#,##0");
  });
  ws0["!cols"] = [{ wch: 36 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws0, L.sum);
  XLSX.utils.book_append_sheet(
    wb,
    xlsSheet(
      [{ h: L.date, w: 13, k: "d" }, { h: L.invNo, w: 20, k: "t" }, { h: L.cust, w: 28, k: "t" }, { h: L.stage, w: 22, k: "t" }, { h: L.amount, w: 18, k: "n" }],
      income.map((x) => [x.d, x.no, x.c, x.st, x.v]),
      income.length ? [L.sumRow, "", "", "", totalIn] : null,
    ),
    L.inc,
  );
  XLSX.utils.book_append_sheet(
    wb,
    xlsSheet(
      [{ h: L.date, w: 13, k: "d" }, { h: L.cat, w: 18, k: "t" }, { h: L.item, w: 34, k: "t" }, { h: L.qty, w: 8, k: "n" }, { h: L.price, w: 20, k: "n" }, { h: L.disc, w: 16, k: "n" }, { h: L.total, w: 18, k: "n" }],
      exps.map((u) => [u.date, u.category || "", u.itemName || "", Number(u.qty) || 0, Number(u.unitPrice) || 0, Number(u.discount) || 0, lineTotal(u)]),
      exps.length ? [L.sumRow, "", "", "", "", "", totalEx] : null,
    ),
    L.exp,
  );
  XLSX.utils.book_append_sheet(
    wb,
    xlsSheet(
      [{ h: L.invNo, w: 20, k: "t" }, { h: L.date, w: 13, k: "d" }, { h: L.cust, w: 28, k: "t" }, { h: L.total, w: 18, k: "n" }, { h: L.paid, w: 20, k: "n" }, { h: L.rest, w: 18, k: "n" }, { h: L.status, w: 22, k: "t" }],
      invs.map((u) => {
        const tot = docSubtotal(u.items),
          pd = sum((u.payments || []).filter((p) => p.paid), (p) => Number(p.amount) || 0),
          st = currentStatus(u);
        return [u.invNumber, u.date, u.customerSnap?.name || "", tot, pd, Math.max(0, tot - pd), st === "Belum Bayar" ? L.unpaid : st];
      }),
      null,
    ),
    L.inv,
  );
  XLSX.utils.book_append_sheet(
    wb,
    xlsSheet(
      [{ h: L.quoNo, w: 20, k: "t" }, { h: L.date, w: 13, k: "d" }, { h: L.cust, w: 28, k: "t" }, { h: L.sub, w: 18, k: "n" }, { h: L.dp, w: 22, k: "n" }],
      quos.map((u) => {
        const st = docSubtotal(u.items);
        return [u.quoNumber, u.date, u.customerSnap?.name || "", st, Math.round(st * 0.3)];
      }),
      null,
    ),
    L.quo,
  );
  return wb;
}
function exportMonthlyXLS(o, a, lang) {
  if (typeof XLSX > "u") return !1;
  XLSX.writeFile(buildMonthlyWorkbook(o, a, lang), `Sumeriapoto-Laporan-${a}.xlsx`);
  return !0;
}
function BackupModal({ ctx: o, onClose: a }) {
  const {
      customers: t,
      quotations: r,
      invoices: n,
      expenses: e,
      setCustomers: l,
      setQuotations: p,
      setInvoices: d,
      setExpenses: f,
      t: v,
      lang: u,
      markBackupDone: y,
    } = o,
    c = useRef(null),
    [m, k] = useState(null),
    [C, P] = useState(""),
    w = useMemo(() => collectAvailableMonths(o), [r, n, e]),
    [B, I] = useState(w[0]);
  function s(S) {
    const [E, T] = S.split("-").map(Number);
    return new Date(E, T - 1, 1).toLocaleDateString(
      u === "en" ? "en-US" : "id-ID",
      { month: "long", year: "numeric" },
    );
  }
  function g() {
    exportMonthlyXLS(o, B, u) ? (P(""), y && y()) : P(v("backup_offline"));
  }
  function i() {
    const S = {
        app: "Sumeriapoto PayHub",
        version: 1,
        exportedAt: new Date().toISOString(),
        customers: t,
        quotations: r,
        invoices: n,
        expenses: e,
        packages: o.packages || [],
      },
      E = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }),
      T = URL.createObjectURL(E),
      x = document.createElement("a");
    ((x.href = T),
      (x.download = `Sumeriapoto-Backup-Lengkap-${todayStr()}.json`),
      document.body.appendChild(x),
      x.click(),
      x.remove(),
      URL.revokeObjectURL(T),
      y && y());
  }
  function h(S) {
    const E = S.target.files && S.target.files[0];
    if (!E) return;
    const T = new FileReader();
    ((T.onload = () => {
      try {
        const x = JSON.parse(String(T.result));
        const ks = ["customers", "quotations", "invoices", "expenses"];
        if (!x || ks.some((q) => !Array.isArray(x[q])) || ks.every((q) => x[q].length === 0))
          throw new Error("format");
        (k(x), P(""));
      } catch {
        P(v("backup_invalid"));
      }
    }),
      T.readAsText(E),
      (S.target.value = ""));
  }
  function b() {
    m &&
      (l(m.customers || []),
      p(m.quotations || []),
      d(m.invoices || []),
      f(m.expenses || []),
      Array.isArray(m.packages) && o.setPackages && o.setPackages(m.packages),
      k(null),
      a());
  }
  const e2 = React.createElement,
    canRestore = !o.can || ["customers", "quotations", "invoices", "expenses"].every((q) => o.can("write:" + q)),
    lb = o.lastBackupAt ? Math.floor((Date.now() - new Date(o.lastBackupAt).getTime()) / 864e5) : null,
    stat = lb === null ? v("backup_never") : `${v("backup_last")} ${lb === 0 ? v("backup_today") : `${lb} ${v("backup_days_ago")}`}`,
    sec = (icon, title, hint, kids) =>
      e2(
        "div",
        { className: "bk-card" },
        e2("div", { className: "bk-head" }, e2("span", { className: "bk-ico" }, e2(icon, { size: 18 })), e2("div", { style: { minWidth: 0 } }, e2("div", { className: "bk-title" }, title), e2("div", { className: "bk-hint" }, hint))),
        kids,
      );
  return e2(
    Modal,
    { title: v("backup_title"), onClose: a, width: 480, icon: Save, subtitle: v("backup_subtitle") },
    e2("div", { className: "bk-stat", "data-stale": lb === null || lb >= 30 ? "1" : "0" }, e2("span", { className: "bk-dot" }), stat),
    sec(
      Sheet,
      v("backup_monthly_title"),
      v("backup_monthly_hint"),
      e2(
        "div",
        { style: { marginTop: 14 } },
        e2("label", { className: "bk-lbl" }, v("backup_month_label")),
        e2(UiSelect, { style: { ...inputStyle, marginBottom: 10 }, value: B, onChange: (S) => I(S.target.value) }, w.map((S) => e2("option", { key: S, value: S }, s(S)))),
        e2(Button, { icon: Download, onClick: g, style: { width: "100%", justifyContent: "center" } }, v("backup_monthly_button")),
      ),
    ),
    sec(
      Database,
      v("backup_full_title"),
      v("backup_full_hint"),
      e2(
        "div",
        { style: { display: "flex", gap: 8, marginTop: 14 } },
        e2(Button, { variant: "secondary", icon: Download, onClick: i, style: { flex: 1, justifyContent: "center" } }, v("backup_full_export")),
        e2("input", { ref: c, type: "file", accept: "application/json", style: { display: "none" }, onChange: h }),
        e2(Button, { variant: "secondary", icon: Upload, disabled: !canRestore, title: canRestore ? void 0 : v("no_access"), onClick: () => c.current.click(), style: { flex: 1, justifyContent: "center", opacity: canRestore ? 1 : 0.5, cursor: canRestore ? "pointer" : "not-allowed" } }, v("backup_full_restore")),
      ),
    ),
    C && e2("div", { style: { fontSize: 12, color: BRAND.red, marginTop: 10 } }, C),
    e2("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 18 } }, e2(Button, { icon: X, variant: "secondary", onClick: a }, v("backup_close"))),
    m &&
      e2(ConfirmModal, {
        title: v("backup_confirm_title"),
        message: `File ini berisi ${(m.customers || []).length} customer, ${(m.quotations || []).length} quotation, ${(m.invoices || []).length} invoice, dan ${(m.expenses || []).length} expense. Semua data yang ada sekarang di aplikasi akan diganti dengan isi file ini dan tidak bisa dibatalkan.`,
        onConfirm: b,
        onCancel: () => k(null),
        t: v,
      }),
  );
}
function PageRouter({ tab: o, ctx: a }) {
  switch (o) {
    case "home":
      return React.createElement(AnalyticsPage, { ctx: a });
    case "customers":
      return React.createElement(CustomersPage, { ctx: a });
    case "quotations":
      return React.createElement(QuotationsPage, { ctx: a });
    case "invoices":
      return React.createElement(InvoicesPage, { ctx: a });
    case "orders":
      return React.createElement(OrdersPage, { ctx: a });
    case "orderDetails":
      return React.createElement(OrdersPage, { ctx: a });
    case "calendar":
      return React.createElement(CalendarPage, { ctx: a });
    case "expenses":
      return React.createElement(ExpensesPage, { ctx: a });
    case "users":
      return a.can("users:manage")
        ? React.createElement(UsersPage, { ctx: a })
        : React.createElement(HomePage, { ctx: a });
    case "ledger":
      return React.createElement(LedgerPage, { ctx: a });
    case "margin":
      return React.createElement(MarginPage, { ctx: a });
    case "packages":
    case "bestsellers":
      return React.createElement(PackagesPage, { ctx: a });
    default:
      return React.createElement(AnalyticsPage, { ctx: a });
  }
}
// Judul & subjudul halaman tampil di header global (header.js); di sini hanya baris aksi (tombol) jika ada.
function PageHeader({ title: o, subtitle: a, action: t, search: q }) {
  useEffect(() => {
    hdSetHead(o, a);
    return () => hdSetHead("", "");
  }, [o, a]);
  return t || q
    ? React.createElement(
        "div",
        { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 } },
        q && React.createElement("div", { style: { flex: "0 1 320px", minWidth: 200 } }, q),
        t,
      )
    : null;
}
function Card({ children: o, style: a, ...t }) {
  return React.createElement(
    "div",
    {
      style: {
        background: BRAND.surface,
        border: `1px solid ${BRAND.line}`,
        borderRadius: 12,
        padding: 20,
        ...a,
      },
      ...t,
    },
    o,
  );
}
function Button({
  children: o,
  onClick: a,
  variant: t = "primary",
  size: r = "md",
  icon: n,
  style: e,
  type: l = "button",
  disabled: p,
}) {
  const d = {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      cursor: p ? "default" : "pointer",
      border: "1px solid transparent",
      borderRadius: 8,
      fontWeight: 500,
      fontSize: r === "sm" ? 12.5 : 13.3,
      letterSpacing: "-0.005em",
      padding: r === "sm" ? "7px 12px" : "9px 16px",
      opacity: p ? 0.5 : 1,
    },
    f = {
      primary: { background: BRAND.blue, color: "var(--c-onBlue)" },
      secondary: {
        background: BRAND.surface,
        color: BRAND.ink,
        borderColor: BRAND.line,
      },
      ghost: {
        background: "transparent",
        color: BRAND.ink,
        borderColor: "transparent",
      },
      danger: {
        background: BRAND.surface,
        color: BRAND.red,
        borderColor: BRAND.line,
      },
    };
  return React.createElement(
    "button",
    { type: l, disabled: p, onClick: a, style: { ...d, ...f[t], ...e } },
    n && React.createElement(n, { size: 14 }),
    o,
  );
}
function IconBtn({
  icon: o,
  img: a,
  onClick: t,
  title: r,
  tone: n = "default",
}) {
  const e = { default: BRAND.inkSoft, danger: BRAND.red, blue: BRAND.blue };
  const [tip, setTip] = useState(null);
  const show = (ev) => {
    if (!r) return;
    const b = ev.currentTarget.getBoundingClientRect();
    setTip({ x: b.left + b.width / 2, y: b.top });
  };
  return React.createElement(
    "button",
    {
      "aria-label": r,
      onMouseEnter: show,
      onFocus: show,
      onMouseLeave: () => setTip(null),
      onBlur: () => setTip(null),
      onClick: (ev) => {
        setTip(null);
        t && t(ev);
      },
      style: {
        width: 28,
        height: 28,
        minWidth: 34,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${BRAND.line}`,
        borderRadius: 8,
        background: BRAND.surface,
        cursor: "pointer",
        color: e[n],
      },
    },
    a
      ? React.createElement("img", {
          src: a,
          alt: "",
          style: { width: 16, height: 16 },
        })
      : React.createElement(o, { size: 14 }),
    tip && React.createElement("span", { className: "ui-tip", style: { left: tip.x, top: tip.y }, role: "tooltip" }, r),
  );
}
function CurrencyInput({ value: o, onChange: a, style: t, placeholder: r }) {
  function n(l) {
    const p = String(l == null ? "" : l).replace(/[^\d]/g, "");
    return p ? Number(p).toLocaleString("id-ID") : "";
  }
  return React.createElement("input", {
    type: "text",
    inputMode: "numeric",
    value: n(o),
    placeholder: r,
    onChange: (l) => {
      a(l.target.value.replace(/[^\d]/g, ""));
    },
    style: t,
  });
}
function SearchBox({ value: o, onChange: a, placeholder: t = "Cari..." }) {
  return React.createElement(SearchField, { value: o, onChange: a, placeholder: t });
}
function Th({ label: o, sortKey: a, sort: t, setSort: r }) {
  const n = t.key === a;
  return React.createElement(
    TableHead,
    {
      onClick: () =>
        r((e) => ({
          key: a,
          dir: e.key === a && e.dir === "asc" ? "desc" : "asc",
        })),
      style: { cursor: "pointer", userSelect: "none" },
    },
    React.createElement(
      "span",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          color: n ? BRAND.blue : void 0,
        },
      },
      o,
      React.createElement(ArrowUpDown, {
        size: 11,
        style: { opacity: n ? 1 : 0.35 },
      }),
    ),
  );
}
function sortRows(o, a) {
  if (!a.key) return o;
  const t = [...o];
  return (
    t.sort((r, n) => {
      const e = r[a.key],
        l = n[a.key];
      let p;
      return (
        typeof e == "number" && typeof l == "number"
          ? (p = e - l)
          : (p = String(e || "").localeCompare(String(l || ""))),
        a.dir === "asc" ? p : -p
      );
    }),
    t
  );
}
function DlgIcon({ icon: o, tone: a = "brand" }) {
  const t = a === "danger" ? { c: "#D92D20", r1: "rgba(217,45,32,.14)", r2: "rgba(217,45,32,.07)" } : { c: "var(--c-blue)", r1: "var(--c-grayBg)", r2: "var(--c-blueFaint)" };
  return React.createElement(
    "div",
    { className: "dlg-ico", style: { background: t.r2, boxShadow: `0 0 0 6px ${t.r1}` } },
    React.createElement("span", { style: { background: t.c, color: a === "danger" ? "#fff" : "var(--c-onBlue)" } }, React.createElement(o, { size: 15, strokeWidth: 2.4 })),
  );
}
const MODAL_STACK = [];
function Modal({ title: o, onClose: a, children: t, width: r = 640, icon: ic, subtitle: sub }) {
  useEffect(() => {
    const tok = {};
    MODAL_STACK.push(tok);
    const k = (e) => e.key === "Escape" && !e.defaultPrevented && MODAL_STACK[MODAL_STACK.length - 1] === tok && a();
    document.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      const i = MODAL_STACK.indexOf(tok);
      i >= 0 && MODAL_STACK.splice(i, 1);
      document.removeEventListener("keydown", k);
      document.body.style.overflow = prev;
    };
  }, []);
  return React.createElement(
    "div",
    {
      className: "modal-overlay",
      style: { position: "fixed", inset: 0, background: "var(--c-overlay)", zIndex: 65, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" },
      onClick: (n) => {
        n.target === n.currentTarget && a();
      },
    },
    React.createElement(
      "div",
      { className: "modal-panel", role: "dialog", "aria-modal": "true", style: { background: BRAND.surface, borderRadius: 16, width: "100%", maxWidth: r, margin: "auto", position: "relative", boxShadow: "0 24px 48px -16px rgba(9,9,11,0.22), 0 0 0 1px var(--c-line)" } },
      React.createElement("button", { onClick: a, "aria-label": "Tutup", className: "ui-dlg-close dlg-x" }, React.createElement(X, { size: 18 })),
      React.createElement(
        "div",
        { className: "dlg-head" },
        React.createElement(DlgIcon, { icon: ic || FileText }),
        React.createElement("h3", { className: "dlg-title" }, o),
        sub && React.createElement("p", { className: "dlg-sub" }, sub),
      ),
      React.createElement("div", { className: "dlg-body" }, t),
    ),
  );
}
function ConfirmModal({ title: o, message: a, onConfirm: t, onCancel: r, t: n }) {
  const e = n || ((l) => ({ confirm_delete_title: "Konfirmasi hapus", cancel: "Cancel", delete: "Delete" })[l] || l);
  useEffect(() => {
    const k = (ev) => ev.key === "Escape" && r();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);
  return React.createElement(
    "div",
    {
      className: "modal-overlay",
      style: { position: "fixed", inset: 0, background: "var(--c-overlay)", zIndex: 66, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
      onClick: (l) => {
        l.target === l.currentTarget && r();
      },
    },
    React.createElement(
      "div",
      { className: "modal-panel", role: "alertdialog", "aria-modal": "true", style: { background: BRAND.surface, borderRadius: 16, width: "100%", maxWidth: 420, position: "relative", boxShadow: "0 24px 48px -16px rgba(9,9,11,0.22), 0 0 0 1px var(--c-line)" } },
      React.createElement("button", { onClick: r, "aria-label": "Tutup", className: "ui-dlg-close dlg-x" }, React.createElement(X, { size: 18 })),
      React.createElement(
        "div",
        { className: "dlg-head" },
        React.createElement(DlgIcon, { icon: AlertTriangle, tone: "danger" }),
        React.createElement("h3", { className: "dlg-title" }, o || e("confirm_delete_title")),
        React.createElement("p", { className: "dlg-sub" }, a),
      ),
      React.createElement(
        "div",
        { className: "dlg-body", style: { paddingTop: 20 } },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "flex-end", gap: 8 } },
          React.createElement(Button, { icon: X, variant: "secondary", onClick: r }, e("cancel")),
          React.createElement(Button, { icon: Trash2, variant: "primary", onClick: t }, e("delete")),
        ),
      ),
    ),
  );
}
function Field({ label: o, children: a, full: t }) {
  return React.createElement(
    "div",
    { style: { gridColumn: t ? "1 / -1" : void 0, marginBottom: 14 } },
    React.createElement(
      "label",
      {
        style: {
          display: "block",
          fontSize: 12.5,
          fontWeight: 500,
          color: BRAND.ink,
          marginBottom: 6,
        },
      },
      o,
    ),
    a,
  );
}
const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: `1px solid ${BRAND.line}`,
  fontSize: 13.3,
  background: BRAND.surface,
};
function Badge({ children: o, tone: a = "blue" }) {
  const r = {
    blue: { bg: BRAND.blueFaint, fg: BRAND.blue },
    green: { bg: BRAND.greenBg, fg: BRAND.green },
    amber: { bg: BRAND.amberBg, fg: BRAND.amber },
    red: { bg: BRAND.redBg, fg: BRAND.red },
    gray: { bg: BRAND.grayBg, fg: BRAND.inkSoft },
  }[a];
  return React.createElement(
    "span",
    {
      style: {
        background: r.bg,
        color: r.fg,
        fontSize: 11.5,
        fontWeight: 500,
        padding: "2px 8px",
        borderRadius: 6,
        whiteSpace: "nowrap",
      },
    },
    o,
  );
}
function EmptyState({ text: o, cta: a }) {
  return React.createElement(
    "div",
    {
      style: {
        padding: "48px 20px",
        textAlign: "center",
        color: BRAND.inkSoft,
      },
    },
    React.createElement(
      "div",
      { style: { fontSize: 13.3, marginBottom: a ? 14 : 0 } },
      o,
    ),
    a,
  );
}
function StatCard({
  label: o,
  value: a,
  tone: t = "gray",
  icon: r,
  sublabel: n,
  compact: e,
}) {
  const p = {
    blue: { border: BRAND.blue, fg: BRAND.blue, bg: BRAND.blueFaint },
    amber: { border: BRAND.amber, fg: BRAND.amber, bg: BRAND.amberBg },
    green: { border: BRAND.green, fg: BRAND.green, bg: BRAND.greenBg },
    red: { border: BRAND.red, fg: BRAND.red, bg: BRAND.redBg },
    gray: { border: BRAND.inkSoft, fg: BRAND.ink, bg: BRAND.grayBg },
  }[t];
  return e
    ? React.createElement(
        "div",
        {
          style: {
            background: BRAND.surface,
            border: `1px solid ${BRAND.line}`,
            borderRadius: 12,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "relative",
            overflow: "hidden",
          },
        },
        r &&
          React.createElement(
            "div",
            {
              style: {
                width: 30,
                height: 30,
                minWidth: 30,
                borderRadius: 8,
                background: p.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: p.fg,
              },
            },
            React.createElement(r, { size: 14, strokeWidth: 2.2 }),
          ),
        React.createElement(
          "div",
          { style: { flex: 1, minWidth: 0 } },
          React.createElement(
            "div",
            {
              style: {
                fontSize: 10.5,
                fontWeight: 700,
                color: BRAND.inkSoft,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              },
            },
            o,
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: 17,
                fontWeight: 700,
                color: p.fg,
                lineHeight: 1.3,
              },
            },
            a,
          ),
          n &&
            React.createElement(
              "div",
              { style: { fontSize: 10.5, color: BRAND.inkSoft, marginTop: 1 } },
              n,
            ),
        ),
      )
    : React.createElement(
        "div",
        {
          style: {
            background: BRAND.surface,
            border: `1px solid ${BRAND.line}`,
            borderRadius: 12,
            padding: "17px 18px 15px",
            boxShadow: "none",
            position: "relative",
            overflow: "hidden",
          },
        },
        React.createElement("div", {
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3.5,
            background: p.border,
          },
        }),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            },
          },
          React.createElement(
            "div",
            {
              style: {
                fontSize: 11,
                fontWeight: 700,
                color: BRAND.inkSoft,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              },
            },
            o,
          ),
          r &&
            React.createElement(
              "div",
              {
                style: {
                  width: 28,
                  height: 28,
                  minWidth: 28,
                  borderRadius: 8,
                  background: p.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: p.fg,
                },
              },
              React.createElement(r, { size: 14, strokeWidth: 2.2 }),
            ),
        ),
        React.createElement(
          "div",
          {
            style: {
              fontSize: "clamp(17px, 4.2vw, 22px)",
              fontWeight: 700,
              color: p.fg,
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            },
          },
          a,
        ),
        n &&
          React.createElement(
            "div",
            { style: { fontSize: 11, color: BRAND.inkSoft, marginTop: 5 } },
            n,
          ),
      );
}
function HomePage({ ctx: o }) {
  const { setTab: n, t: l } = o;
  return React.createElement(
    "div",
    null,
    React.createElement(
      "style",
      null,
      `[data-theme="dark"] .ph-logo-invert{filter:invert(1)}
        .ph-tile{transition:transform .15s ease;-webkit-tap-highlight-color:transparent;}
        .ph-tile:active{transform:scale(.94);}
        .ph-badge{position:relative;overflow:hidden;animation:phPop .55s cubic-bezier(.34,1.56,.64,1) both;}
        .ph-glyph{filter:none;}
        @keyframes phPop{0%{transform:translateY(4px);opacity:0;}100%{transform:none;opacity:1;}}`,
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
          padding: "2px 2px",
        },
      },
      React.createElement("img", {
        src: LOGO_DATA_URI,
        alt: "Sum\xE9riapoto",
        className: "ph-logo-invert",
        style: { height: 22, width: "auto", display: "block" },
      }),
      React.createElement(
        "div",
        {
          style: {
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: BRAND.inkSoft,
          },
        },
        "PayHub",
      ),
    ),
    React.createElement(
      "div",
      { style: { marginBottom: 18 } },
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 12,
          },
        },
        visibleNav(o.can).filter((i) =>
          [
            "customers",
            "quotations",
            "invoices",
            "orders",
            "calendar",
            "expenses",
            "ledger",
            "margin",
            "users",
          ].includes(i.key),
        ).map((i, idx) =>
          React.createElement(
            "button",
            {
              key: i.key,
              className: "ph-tile",
              onClick: () => n(i.key),
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 14,
                background: BRAND.surface,
                border: `1px solid ${BRAND.line}`,
                borderRadius: 12,
                cursor: "pointer",
                padding: "18px 18px",
                minWidth: 0,
                textAlign: "left",
              },
            },
            React.createElement(
              "div",
              {
                className: "ph-badge",
                style: {
                  width: 36,
                  height: 36,
                  minWidth: 36,
                  borderRadius: 8,
                  background: BRAND.blueFaint,
                  border: `1px solid ${BRAND.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: BRAND.ink,
                  animationDelay: `${idx * 40}ms`,
                },
              },
              React.createElement(i.icon, { size: 18, strokeWidth: 1.75 }),
            ),
            React.createElement(
              "div",
              {
                style: {
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: BRAND.ink,
                  textAlign: "left",
                  lineHeight: 1.25,
                },
              },
              l(`nav_${i.key}`),
            ),
          ),
        ),
      ),
    ),
  );
}
function CustomersPage({ ctx: o }) {
  const {
      customers: a,
      setCustomers: t,
      detailCustomerId: r,
      setDetailCustomerId: n,
      t: e,
      showToast: h,
    } = o,
    [l, p] = useState(""),
    [d, f] = useState({ key: "name", dir: "asc" }),
    [v, u] = useState(null),
    [y, c] = useState(null),
    [m, k] = useState(!1),
    C = sortRows(
      a.filter((I) =>
        JSON.stringify(I).toLowerCase().includes(l.toLowerCase()),
      ),
      d,
    ),
    P = a.find((I) => I.id === r);
  function w(I) {
    const S = !I.id;
    (t((s) =>
      I.id
        ? s.map((g) => (g.id === I.id ? I : g))
        : [...s, { ...I, id: uid() }],
    ),
      u(null),
      h && h(S ? "Customer added ✓" : "Customer updated ✓"));
  }
  function B(I) {
    (t((s) => s.filter((g) => g.id !== I)),
      c(null),
      h && h("Customer deleted"));
  }
  return React.createElement(
    "div",
    null,
    React.createElement(PageHeader, {
      title: e("cust_title"),
      subtitle: e("cust_subtitle"),
      action: React.createElement(
        "div",
        { style: { display: "flex", gap: 8 } },
        React.createElement(
          Button,
          {
            variant: "secondary",
            icon: Download,
            onClick: () => exportCustomersXLS(a),
          },
          e("cust_export_xls"),
        ),
        React.createElement(
          Button,
          { icon: Plus, onClick: () => u({}) },
          e("cust_add"),
        ),
      ),
      search: React.createElement(SearchBox, {
        value: l,
        onChange: p,
        placeholder: e("cust_search_placeholder"),
      }),
    }),
    React.createElement(
      Card,
      { style: { padding: 0, overflowX: "auto" } },
      C.length === 0
        ? React.createElement(EmptyState, { text: e("cust_empty") })
        : React.createElement(
            Table,
            null,
            React.createElement(
              TableHeader,
              null,
              React.createElement(
                TableRow,
                null,
                React.createElement(TableHead, { style: { width: 56 } }, e("item_no")),
                React.createElement(Th, {
                  label: e("cust_col_name"),
                  sortKey: "name",
                  sort: d,
                  setSort: f,
                }),
                React.createElement(Th, {
                  label: e("cust_col_gender"),
                  sortKey: "gender",
                  sort: d,
                  setSort: f,
                }),
                React.createElement(Th, {
                  label: e("cust_col_email"),
                  sortKey: "email",
                  sort: d,
                  setSort: f,
                }),
                React.createElement(Th, {
                  label: e("cust_col_phone"),
                  sortKey: "phone",
                  sort: d,
                  setSort: f,
                }),
                React.createElement(Th, {
                  label: e("cust_col_city"),
                  sortKey: "city",
                  sort: d,
                  setSort: f,
                }),
                React.createElement(TableHead, { style: { width: 130 } }),
              ),
            ),
            React.createElement(
              TableBody,
              null,
              C.map((I, idx) =>
                React.createElement(
                  TableRow,
                  { key: I.id },
                  React.createElement(TableCell, { style: { color: BRAND.inkSoft } }, idx + 1),
                  React.createElement(TableCell, { style: { fontWeight: 600 } }, I.name),
                  React.createElement(TableCell, null, I.gender),
                  React.createElement(TableCell, null, I.email),
                  React.createElement(TableCell, null, I.phone),
                  React.createElement(TableCell, null, I.city),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(
                      "div",
                      { style: { display: "flex", gap: 6 } },
                      React.createElement(IconBtn, {
                        icon: Eye,
                        title: e("orders_detail"),
                        onClick: () => n(I.id),
                      }),
                      React.createElement(IconBtn, {
                        icon: Pencil,
                        title: e("edit"),
                        onClick: () => u(I),
                      }),
                      React.createElement(IconBtn, {
                        icon: Trash2,
                        title: e("delete"),
                        tone: "danger",
                        onClick: () => c(I),
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
    ),
    v &&
      React.createElement(CustomerModal, {
        customer: v,
        onSave: w,
        onClose: () => u(null),
        t: e,
      }),
    y &&
      React.createElement(ConfirmModal, {
        message: `${e("cust_delete_prefix")} "${y.name}" ${e("cust_delete_confirm")}`,
        onConfirm: () => B(y.id),
        onCancel: () => c(null),
        t: e,
      }),
    P &&
      React.createElement(CustomerDetailModal, {
        customer: P,
        ctx: o,
        onClose: () => n(null),
      }),
  );
}
function CustomerDetailModal({ customer: o, ctx: a, onClose: t }) {
  const { quotations: r, invoices: n, t: e } = a,
    h = React.createElement,
    [tab, setTab] = useState("overview"),
    l = sortRows(r.filter((c) => c.customerId === o.id).map((c) => ({ ...c, subtotal: docSubtotal(c.items) })), { key: "date", dir: "desc" }),
    p = sortRows(n.filter((c) => c.customerId === o.id).map((c) => ({ ...c, total: docSubtotal(c.items), status: currentStatus(c) })), { key: "date", dir: "desc" }),
    d = [];
  p.forEach((c) =>
    (c.payments || []).forEach((m) => {
      m.paid && d.push({ date: m.paidDate || c.date, label: m.label, amount: m.amount, invNumber: c.invNumber });
    }),
  );
  d.sort((c, m) => (c.date > m.date ? -1 : 1));
  const f = d.reduce((c, m) => c + m.amount, 0),
    v = p.reduce((c, m) => c + m.total, 0),
    u = Math.max(0, v - f),
    y = (c) => (c === "Paid Full" ? "green" : c === "Belum Bayar" ? "gray" : "amber"),
    tabs = [
      ["overview", e("cust_tab_overview"), null],
      ["invoices", e("detail_invoices"), p.length],
      ["quotations", e("detail_quotations"), l.length],
      ["payments", e("cust_tab_payments"), d.length],
    ],
    tbl = (heads, rows, empty) =>
      rows.length === 0
        ? h(EmptyState, { text: empty })
        : h(
            "div",
            { className: "ui-scroll", style: { border: `1px solid ${BRAND.line}`, borderRadius: 10, overflow: "auto", maxHeight: 340 } },
            h(Table, { paginate: !1 }, h(TableHeader, null, h(TableRow, null, heads.map((x) => h(TableHead, { key: x }, x)))), h(TableBody, null, rows)),
          ),
    nw = { whiteSpace: "nowrap" },
    info = (k, val) => h("div", { className: "cd-info" }, h("span", null, k), h("b", null, val || "—"));
  return h(
    Modal,
    { title: e("cust_detail_title"), onClose: t, width: 760, icon: Users, subtitle: `${o.name}${o.city ? " · " + o.city : ""}` },
    h(
      "div",
      { className: "ui-tabs", role: "tablist" },
      tabs.map(([k, label, cnt]) =>
        h("button", { key: k, type: "button", role: "tab", "aria-selected": tab === k, className: "ui-tab" + (tab === k ? " on" : ""), onClick: () => setTab(k) }, label, cnt !== null && h("span", { className: "ui-tab-n" }, cnt)),
      ),
    ),
    h(
      "div",
      { className: "cd-pane" },
      tab === "overview" &&
        h(
          "div",
          null,
          h("div", { className: "cd-infos" }, info(e("detail_gender"), o.gender), info(e("detail_phone"), o.phone), info(e("detail_email"), o.email), info(e("detail_city"), o.city)),
          h(
            "div",
            { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12, marginTop: 16 } },
            h(StatCard, { label: e("detail_revenue"), value: fmtRp(f), tone: "green", icon: TrendingUp }),
            h(StatCard, { label: e("detail_outstanding"), value: fmtRp(u), tone: u > 0 ? "amber" : "gray", icon: Wallet }),
            h(StatCard, { label: e("detail_quotations"), value: String(l.length), tone: "blue", icon: FileText }),
            h(StatCard, { label: e("detail_invoices"), value: String(p.length), tone: "blue", icon: Receipt }),
          ),
        ),
      tab === "invoices" &&
        tbl(
          [e("col_invoice_no"), e("col_date"), e("col_total"), e("col_status")],
          p.map((c) => h(TableRow, { key: c.id }, h(TableCell, { style: { fontWeight: 600, ...nw } }, c.invNumber), h(TableCell, { style: nw }, fmtDate(c.date)), h(TableCell, { style: nw }, fmtRp(c.total)), h(TableCell, null, h(Badge, { tone: y(c.status) }, c.status)))),
          e("detail_no_invoice"),
        ),
      tab === "quotations" &&
        tbl(
          [e("col_quotation_no"), e("col_date"), e("col_subtotal")],
          l.map((c) => h(TableRow, { key: c.id }, h(TableCell, { style: { fontWeight: 600, ...nw } }, c.quoNumber), h(TableCell, { style: nw }, fmtDate(c.date)), h(TableCell, { style: nw }, fmtRp(c.subtotal)))),
          e("detail_no_quotation"),
        ),
      tab === "payments" &&
        tbl(
          [e("col_date"), e("col_invoice_no"), e("col_stage"), e("col_amount")],
          d.map((c, m) => h(TableRow, { key: m }, h(TableCell, { style: nw }, fmtDate(c.date)), h(TableCell, { style: { fontWeight: 600, ...nw } }, c.invNumber), h(TableCell, { style: nw }, c.label), h(TableCell, { style: { fontWeight: 700, color: BRAND.green, ...nw } }, fmtRp(c.amount)))),
          e("detail_no_payment"),
        ),
    ),
    h("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 16 } }, h(Button, { icon: X, variant: "secondary", onClick: t }, e("inv_close"))),
  );
}
function CustomerModal({ customer: o, onSave: a, onClose: t, t: r }) {
  const [n, e] = useState({
      name: "",
      gender: "Female",
      email: "",
      phone: "",
      city: "",
      ...o,
    }),
    l = (p) => (d) => e((f) => ({ ...f, [p]: d.target.value }));
  return React.createElement(
    Modal,
    { title: o.id ? r("cust_modal_edit") : r("cust_modal_add"), onClose: t, icon: Users, subtitle: o.id ? r("cust_modal_edit_sub") : r("cust_modal_add_sub") },
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0 16px",
        },
      },
      React.createElement(
        Field,
        { label: r("cust_field_name") },
        React.createElement("input", {
          style: inputStyle,
          value: n.name,
          onChange: l("name"),
        }),
      ),
      React.createElement(
        Field,
        { label: r("cust_field_gender") },
        React.createElement(
          UiSelect,
          { style: inputStyle, value: n.gender, onChange: l("gender") },
          React.createElement("option", null, "Female"),
          React.createElement("option", null, "Male"),
        ),
      ),
      React.createElement(
        Field,
        { label: r("cust_field_email") },
        React.createElement("input", {
          style: inputStyle,
          value: n.email,
          onChange: l("email"),
        }),
      ),
      React.createElement(
        Field,
        { label: r("cust_field_phone") },
        React.createElement(UiPhone, {
          style: inputStyle,
          value: n.phone,
          onChange: (v) => e((d) => ({ ...d, phone: v })),
        }),
      ),
      React.createElement(
        Field,
        { label: r("cust_field_city") },
        React.createElement("input", {
          style: inputStyle,
          value: n.city,
          onChange: l("city"),
        }),
      ),
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 6,
        },
      },
      React.createElement(
        Button,
        { icon: X, variant: "secondary", onClick: t },
        r("cancel"),
      ),
      React.createElement(
        Button,
        { icon: Save, onClick: () => a(n), disabled: !n.name },
        r("save"),
      ),
    ),
  );
}
function parseDescValue(o) {
  if (!o) return { selected: [], custom: "" };
  const a = o
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean),
    t = a.filter((n) => DESC_ITEMS_LIST.includes(n)),
    r = a.filter((n) => !DESC_ITEMS_LIST.includes(n)).join(", ");
  return { selected: t, custom: r };
}
function buildDescValue(o, a) {
  const t = [...o];
  return (a && a.trim() && t.push(a.trim()), t.join(", "));
}
function splitDescLines(o) {
  return (o || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
}
function ItemsEditor({ items: o, setItems: a, t, fixed: FX }) {
  const [r, n] = useState({}),
    [e, l] = useState({}),
    [p, d] = useState(null);
  function f(s, g) {
    a(o.map((i, h) => (h === s ? { ...i, ...g } : i)));
  }
  function v() {
    a([
      ...o,
      {
        id: uid(),
        eventDate: "",
        packageItem: "",
        description: "",
        qty: 1,
        unitPrice: 0,
        discount: 0,
      },
    ]);
  }
  function u(s) {
    a(o.filter((g, i) => i !== s));
  }
  function y(s) {
    return r[s.id] !== void 0
      ? r[s.id]
      : !!s.packageItem && !PACKAGE_ITEMS_LIST.includes(s.packageItem);
  }
  function c(s, g, i) {
    i === PACKAGE_ITEM_OTHER
      ? (n((h) => ({ ...h, [g.id]: !0 })), f(s, { packageItem: "" }))
      : (
          n((h) => ({ ...h, [g.id]: !1 })),
          f(s, {
            packageItem: i,
            ...(PACKAGE_PRICES[i] > 0 && (!(Number(g.unitPrice) > 0) || Number(g.unitPrice) === PACKAGE_PRICES[g.packageItem]) ? { unitPrice: PACKAGE_PRICES[i] } : {}),
          })
        );
  }
  const m = o.find((s) => s.id === p),
    k = o.findIndex((s) => s.id === p),
    C = m ? parseDescValue(m.description) : { selected: [], custom: "" };
  function P(s) {
    if (k < 0) return;
    const g = C.selected.includes(s)
      ? C.selected.filter((i) => i !== s)
      : [...C.selected, s];
    f(k, { description: buildDescValue(g, C.custom) });
  }
  function w(s) {
    k < 0 || f(k, { description: buildDescValue(C.selected, s) });
  }
  function B(s) {
    return s
      ? e[s.id] !== void 0
        ? e[s.id]
        : !!parseDescValue(s.description).custom
      : !1;
  }
  function I(s) {
    const g = B(s);
    if ((l((i) => ({ ...i, [s.id]: !g })), g)) {
      const i = o.findIndex((b) => b.id === s.id),
        { selected: h } = parseDescValue(s.description);
      f(i, { description: buildDescValue(h, "") });
    }
  }
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      {
        className: "ui-scroll",
        style: {
          overflow: "auto",
          maxHeight: 292,
          border: `1px solid ${BRAND.line}`,
          borderRadius: 8,
        },
      },
      React.createElement(
        Table,
        null,
        React.createElement(
          TableHeader,
          null,
          React.createElement(
            TableRow,
            null,
            React.createElement(TableHead, { style: { width: 36 } }, t("item_no")),
            React.createElement(
              TableHead,
              { style: { width: 130 } },
              t("item_eventdate"),
            ),
            React.createElement(
              TableHead,
              { style: { minWidth: 165 } },
              t("item_package"),
            ),
            React.createElement(
              TableHead,
              { style: { minWidth: 175 } },
              t("item_desc"),
            ),
            React.createElement(TableHead, { style: { width: 84, minWidth: 84 } }, t("item_qty")),
            React.createElement(
              TableHead,
              { style: { width: 140, minWidth: 140 } },
              t("item_unitprice"),
            ),
            React.createElement(
              TableHead,
              { style: { width: 124, minWidth: 124 } },
              t("item_discount"),
            ),
            React.createElement(
              TableHead,
              { style: { width: 120 } },
              t("item_subtotal"),
            ),
            !FX && React.createElement(TableHead, { style: { width: 34 } }),
          ),
        ),
        React.createElement(
          TableBody,
          null,
          o.length === 0 &&
            React.createElement(
              TableRow,
              null,
              React.createElement(
                TableCell,
                {
                  colSpan: FX ? 8 : 9,
                  style: {
                    textAlign: "center",
                    color: BRAND.inkSoft,
                    padding: 18,
                  },
                },
                t("item_empty"),
              ),
            ),
          o.map((s, g) => {
            const i = y(s),
              { selected: h } = parseDescValue(s.description);
            return React.createElement(
              TableRow,
              { key: s.id },
              React.createElement(
                TableCell,
                { style: { color: BRAND.inkSoft } },
                g + 1,
              ),
              React.createElement(
                TableCell,
                null,
                React.createElement(UiDate, {
                  style: { ...inputStyle, padding: "6px 8px" },
                  value: s.eventDate,
                  onChange: (b) => f(g, { eventDate: b.target.value }),
                }),
              ),
              React.createElement(
                TableCell,
                null,
                React.createElement(
                  UiSelect,
                  {
                    style: { ...inputStyle, padding: "6px 8px" },
                    value: i ? PACKAGE_ITEM_OTHER : s.packageItem,
                    onChange: (b) => c(g, s, b.target.value),
                  },
                  React.createElement("option", { value: "" }, t("item_pick")),
                  PACKAGE_ITEMS_LIST.map((b) =>
                    React.createElement("option", { key: b, value: b }, b),
                  ),
                  React.createElement(
                    "option",
                    { value: PACKAGE_ITEM_OTHER },
                    t("item_custom"),
                  ),
                ),
                i &&
                  React.createElement("input", {
                    style: { ...inputStyle, padding: "6px 8px", marginTop: 6 },
                    placeholder: t("item_pkg_custom_placeholder"),
                    value: s.packageItem,
                    onChange: (b) => f(g, { packageItem: b.target.value }),
                  }),
              ),
              React.createElement(
                TableCell,
                null,
                React.createElement(UiDescPick, {
                  options: DESC_ITEMS_LIST,
                  value: s.description,
                  onChange: (v) => f(g, { description: v }),
                  placeholder: t("item_pick_desc"),
                  customLabel: t("item_custom"),
                  customPlaceholder: t("item_desc_custom_placeholder"),
                }),
              ),
              React.createElement(
                TableCell,
                null,
                React.createElement("input", {
                  type: "number",
                  min: 0,
                  style: { ...inputStyle, padding: "6px 8px" },
                  value: s.qty,
                  onChange: (b) => f(g, { qty: b.target.value }),
                }),
              ),
              React.createElement(
                TableCell,
                null,
                React.createElement(CurrencyInput, {
                  style: { ...inputStyle, padding: "6px 8px" },
                  value: s.unitPrice,
                  onChange: (b) => f(g, { unitPrice: b }),
                }),
              ),
              React.createElement(
                TableCell,
                null,
                React.createElement(CurrencyInput, {
                  style: { ...inputStyle, padding: "6px 8px" },
                  value: s.discount,
                  onChange: (b) => f(g, { discount: b }),
                }),
              ),
              React.createElement(
                TableCell,
                { style: { fontWeight: 600, whiteSpace: "nowrap" } },
                fmtRp(lineTotal(s)),
              ),
              !FX &&
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(IconBtn, {
                    icon: Trash2,
                    tone: "danger",
                    title: t("delete"),
                    onClick: () => u(g),
                  }),
                ),
            );
          }),
        ),
      ),
    ),
    !FX &&
      React.createElement(
        Button,
        {
          size: "sm",
          variant: "secondary",
          icon: Plus,
          onClick: v,
          style: { marginTop: 10 },
        },
        t("item_add"),
      ),
  );
}
function CustomerPicker({ customers: o, value: a, onChange: t, t: r }) {
  return React.createElement(
    UiSelect,
    { style: inputStyle, value: a, onChange: (n) => t(n.target.value) },
    React.createElement(
      "option",
      { value: "" },
      r ? r("pick_customer_placeholder") : "\u2014 Pilih customer \u2014",
    ),
    o.map((n) =>
      React.createElement("option", { key: n.id, value: n.id }, n.name),
    ),
  );
}
function CustomerInfoPanel({ customer: o }) {
  return o
    ? React.createElement(
        "div",
        {
          style: {
            background: BRAND.blueFaint,
            border: `1px solid ${BRAND.line}`,
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 14,
            fontSize: 13,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "4px 16px",
          },
        },
        React.createElement(
          "div",
          { style: { color: BRAND.ink, fontWeight: 600 } },
          o.name,
        ),
        React.createElement(
          "div",
          { style: { color: BRAND.inkSoft } },
          o.phone,
        ),
        React.createElement(
          "div",
          { style: { color: BRAND.inkSoft } },
          o.email,
        ),
        React.createElement("div", { style: { color: BRAND.inkSoft } }, o.city),
      )
    : null;
}
function blankDoc() {
  return {
    customerId: "",
    customerSnap: { name: "", address: "", phone: "", email: "" },
    items: [],
  };
}
function QuotationsPage({ ctx: o }) {
  const {
      quotations: a,
      setQuotations: t,
      customers: r,
      invoices: n,
      setInvoices: e,
      setTab: l,
      setPrintTarget: p,
      t: d,
      showToast: hh,
    } = o,
    [f, v] = useState(""),
    [u, y] = useState({ key: "date", dir: "desc" }),
    [c, m] = useState(null),
    [k, C] = useState(null),
    P = a.map((i) => ({
      ...i,
      subtotal: docSubtotal(i.items),
      dp: docSubtotal(i.items) * 0.3,
    })),
    w = sortRows(
      P.filter((i) =>
        JSON.stringify(i).toLowerCase().includes(f.toLowerCase()),
      ),
      u,
    );
  function B() {
    m({
      ...blankDoc(),
      quoNumber: nextNumber(a, "quoNumber", "QUO"),
      date: todayStr(),
    });
  }
  function I(i) {
    const S = !i.id;
    (t((h) =>
      i.id
        ? h.map((b) => (b.id === i.id ? i : b))
        : [...h, { ...i, id: uid() }],
    ),
      m(null),
      hh && hh(S ? "Quotation created ✓" : "Quotation updated ✓"));
  }
  function s(i) {
    (t((h) => h.filter((b) => b.id !== i)),
      C(null),
      hh && hh("Quotation deleted"));
  }
  function g(i) {
    const h = nextNumber(n, "invNumber", "INV"),
      b = i.items.map((T) => ({ ...T, id: uid() })),
      S = docSubtotal(b),
      E = {
        id: uid(),
        invNumber: h,
        date: todayStr(),
        customerId: i.customerId,
        customerSnap: i.customerSnap,
        items: b,
        paymentPlan: "2x",
        payments: generatePayments("2x", S, { date: todayStr(), items: b }),
        notes: "",
        lastUpdated: todayStr(),
        sourceQuotationId: i.id,
      };
    (e((T) => [...T, E]), l("invoices"), hh && hh("Converted to invoice ✓"));
  }
  return React.createElement(
    "div",
    null,
    React.createElement(PageHeader, {
      title: d("quo_title"),
      subtitle: d("quo_subtitle"),
      action: React.createElement(
        Button,
        { icon: Plus, onClick: B },
        d("quo_create"),
      ),
      search: React.createElement(SearchBox, {
        value: f,
        onChange: v,
        placeholder: d("search_placeholder"),
      }),
    }),
    React.createElement(
      Card,
      { style: { padding: 0, overflowX: "auto" } },
      w.length === 0
        ? React.createElement(EmptyState, { text: d("quo_empty") })
        : React.createElement(
            Table,
            null,
            React.createElement(
              TableHeader,
              null,
              React.createElement(
                TableRow,
                null,
                React.createElement(Th, {
                  label: d("quo_number"),
                  sortKey: "quoNumber",
                  sort: u,
                  setSort: y,
                }),
                React.createElement(TableHead, null, d("quo_col_customer")),
                React.createElement(Th, {
                  label: d("quo_date"),
                  sortKey: "date",
                  sort: u,
                  setSort: y,
                }),
                React.createElement(Th, {
                  label: d("quo_subtotal"),
                  sortKey: "subtotal",
                  sort: u,
                  setSort: y,
                }),
                React.createElement(TableHead, null, d("quo_col_dp")),
                React.createElement(TableHead, { style: { width: 170 } }),
              ),
            ),
            React.createElement(
              TableBody,
              null,
              w.map((i) =>
                React.createElement(
                  TableRow,
                  { key: i.id },
                  React.createElement(
                    TableCell,
                    { style: { fontWeight: 600 } },
                    i.quoNumber,
                  ),
                  React.createElement(TableCell, null, i.customerSnap?.name),
                  React.createElement(TableCell, null, fmtDate(i.date)),
                  React.createElement(TableCell, null, fmtRp(i.subtotal)),
                  React.createElement(TableCell, null, fmtRp(i.dp)),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(
                      "div",
                      {
                        style: {
                          display: "flex",
                          gap: 6,
                          justifyContent: "flex-end",
                        },
                      },
                      React.createElement(PrintMenu, {
                        onExportPdf: () =>
                          p({ type: "quotation", data: i, autoPrint: !0 }),
                        onWhatsApp: () => sendQuotationWhatsApp(i),
                        t: d,
                      }),
                      React.createElement(IconBtn, {
                        icon: Pencil,
                        title: d("edit"),
                        onClick: () => m(i),
                      }),
                      React.createElement(IconBtn, {
                        icon: Receipt,
                        title: d("quo_convert"),
                        onClick: () => g(i),
                      }),
                      React.createElement(IconBtn, {
                        icon: Trash2,
                        tone: "danger",
                        title: d("delete"),
                        onClick: () => C(i),
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
    ),
    c &&
      React.createElement(QuotationModal, {
        doc: c,
        customers: r,
        onSave: I,
        onClose: () => m(null),
        t: d,
      }),
    k &&
      React.createElement(ConfirmModal, {
        message: `${d("quo_delete_confirm_prefix")} "${k.quoNumber}" ${d("quo_delete_confirm_suffix")}`,
        onConfirm: () => s(k.id),
        onCancel: () => C(null),
        t: d,
      }),
  );
}
function QuotationModal({ doc: o, customers: a, onSave: t, onClose: r, t: n }) {
  const [e, l] = useState(o),
    [p, d] = useState(o.items || []),
    f = docSubtotal(p),
    v = f * 0.3,
    u = a.find((c) => c.id === e.customerId);
  function y(c) {
    const m = a.find((k) => k.id === c);
    l((k) => ({
      ...k,
      customerId: c,
      customerSnap: m
        ? { name: m.name, address: m.city, phone: m.phone, email: m.email }
        : { name: "", address: "", phone: "", email: "" },
    }));
  }
  return React.createElement(
    Modal,
    {
      title: o.id ? n("quo_modal_edit") : n("quo_modal_create"),
      onClose: r,
      width: 1080,
      icon: FileText,
    },
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0 16px",
        },
      },
      React.createElement(
        Field,
        { label: n("quo_number") },
        React.createElement("input", {
          style: inputStyle,
          value: e.quoNumber,
          readOnly: !0,
          "aria-readonly": "true",
        }),
        React.createElement("div", { className: "ui-help" }, n("quo_number_auto")),
      ),
      React.createElement(
        Field,
        { label: n("quo_date") },
        React.createElement(UiDate, {
          style: inputStyle,
          value: e.date,
          onChange: (c) => l((m) => ({ ...m, date: c.target.value })),
        }),
      ),
    ),
    React.createElement(
      Field,
      { label: n("quo_pick_customer"), full: !0 },
      React.createElement(CustomerPicker, {
        customers: a,
        value: e.customerId,
        onChange: y,
        t: n,
      }),
    ),
    a.length === 0 &&
      React.createElement(
        "div",
        {
          style: {
            fontSize: 12.5,
            color: BRAND.red,
            marginTop: -8,
            marginBottom: 14,
          },
        },
        n("quo_no_customer_warning"),
      ),
    React.createElement(CustomerInfoPanel, { customer: u }),
    React.createElement(
      Field,
      { label: n("quo_items"), full: !0 },
      React.createElement(ItemsEditor, { items: p, setItems: d, t: n }),
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "flex-end",
          gap: 24,
          padding: "12px 4px",
          borderTop: `1px solid ${BRAND.line}`,
          marginTop: 10,
        },
      },
      React.createElement(
        "div",
        { style: { textAlign: "right" } },
        React.createElement(
          "div",
          { style: { fontSize: 12, color: BRAND.inkSoft } },
          n("quo_subtotal"),
        ),
        React.createElement(
          "div",
          { style: { fontSize: 16, fontWeight: 700 } },
          fmtRp(f),
        ),
      ),
      React.createElement(
        "div",
        { style: { textAlign: "right" } },
        React.createElement(
          "div",
          { style: { fontSize: 12, color: BRAND.inkSoft } },
          n("quo_dp"),
        ),
        React.createElement(
          "div",
          { style: { fontSize: 16, fontWeight: 700, color: BRAND.blue } },
          fmtRp(v),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 14,
        },
      },
      React.createElement(
        Button,
        { icon: X, variant: "secondary", onClick: r },
        n("cancel"),
      ),
      React.createElement(
        Button,
        { icon: Save,
          onClick: () => t({ ...e, items: p }),
          disabled: !e.customerId || p.length === 0,
        },
        n("save"),
      ),
    ),
  );
}
function InvoicesPage({ ctx: o }) {
  const {
      invoices: a,
      setInvoices: t,
      customers: r,
      quotations: n,
      setPrintTarget: e,
      setTab: l,
      setSelectedInvoiceId: p,
      t: d,
      showToast: hh,
    } = o,
    [f, v] = useState(""),
    [u, y] = useState({ key: "date", dir: "desc" }),
    [c, m] = useState(null),
    [k, C] = useState(null),
    P = a.map((i) => ({
      ...i,
      total: docSubtotal(i.items),
      status: currentStatus(i),
      nd: nextDue(i),
      dueKey: nextDue(i)?.due || "9999-12-31",
    })),
    w = sortRows(
      P.filter((i) =>
        JSON.stringify(i).toLowerCase().includes(f.toLowerCase()),
      ),
      u,
    );
  function B() {
    m({
      ...blankDoc(),
      invNumber: nextNumber(a, "invNumber", "INV"),
      date: todayStr(),
      paymentPlan: "2x",
      payments: [],
      notes: "",
    });
  }
  function I(i) {
    const S = !i.id;
    (t((h) =>
      i.id
        ? h.map((b) => (b.id === i.id ? { ...i, lastUpdated: todayStr() } : b))
        : [...h, { ...i, id: uid(), lastUpdated: todayStr() }],
    ),
      m(null),
      hh && hh(S ? "Invoice created ✓" : "Invoice saved ✓"));
  }
  function s(i) {
    (t((h) => h.filter((b) => b.id !== i)),
      C(null),
      hh && hh("Invoice deleted"));
  }
  const g = (i) =>
    i === "Paid Full" ? "green" : i === "Belum Bayar" ? "gray" : "amber";
  return React.createElement(
    "div",
    null,
    React.createElement(PageHeader, {
      title: d("inv_title"),
      subtitle: d("inv_subtitle"),
      action: React.createElement(
        Button,
        { icon: Plus, onClick: B },
        d("inv_create"),
      ),
      search: React.createElement(SearchBox, {
        value: f,
        onChange: v,
        placeholder: d("search_placeholder"),
      }),
    }),
    React.createElement(
      Card,
      { style: { padding: 0, overflowX: "auto" } },
      w.length === 0
        ? React.createElement(EmptyState, { text: d("inv_empty") })
        : React.createElement(
            Table,
            null,
            React.createElement(
              TableHeader,
              null,
              React.createElement(
                TableRow,
                null,
                React.createElement(Th, {
                  label: d("inv_number"),
                  sortKey: "invNumber",
                  sort: u,
                  setSort: y,
                }),
                React.createElement(TableHead, null, d("quo_col_customer")),
                React.createElement(Th, {
                  label: d("col_total"),
                  sortKey: "total",
                  sort: u,
                  setSort: y,
                }),
                React.createElement(TableHead, null, d("inv_col_status")),
                React.createElement(Th, {
                  label: d("inv_col_due"),
                  sortKey: "dueKey",
                  sort: u,
                  setSort: y,
                }),
                React.createElement(Th, {
                  label: d("inv_col_updated"),
                  sortKey: "lastUpdated",
                  sort: u,
                  setSort: y,
                }),
                React.createElement(TableHead, { style: { width: 200 } }),
              ),
            ),
            React.createElement(
              TableBody,
              null,
              w.map((i) =>
                React.createElement(
                  TableRow,
                  { key: i.id },
                  React.createElement(
                    TableCell,
                    { style: { fontWeight: 600 } },
                    i.invNumber,
                  ),
                  React.createElement(TableCell, null, i.customerSnap?.name),
                  React.createElement(TableCell, null, fmtRp(i.total)),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(
                      Badge,
                      { tone: g(i.status) },
                      i.status === "Belum Bayar"
                        ? d("status_unpaid")
                        : i.status,
                    ),
                  ),
                  React.createElement(
                    TableCell,
                    { style: { whiteSpace: "nowrap" } },
                    i.nd
                      ? React.createElement(
                          "span",
                          { style: { color: i.nd.overdue ? BRAND.red : BRAND.ink, fontWeight: i.nd.overdue ? 600 : 400 }, title: `${i.nd.label} \u00b7 ${fmtRp(i.nd.amount)}` },
                          i.nd.due ? fmtDate(i.nd.due) : "\u2014",
                          React.createElement("span", { style: { color: BRAND.inkSoft, fontWeight: 400, marginLeft: 6, fontSize: 12 } }, `${i.nd.idx + 1}/${i.nd.n}`),
                        )
                      : React.createElement("span", { style: { color: BRAND.inkSoft } }, "\u2014"),
                  ),
                  React.createElement(TableCell, null, fmtDate(i.lastUpdated)),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(
                      "div",
                      {
                        style: {
                          display: "flex",
                          gap: 6,
                          justifyContent: "flex-end",
                        },
                      },
                      React.createElement(IconBtn, {
                        icon: Eye,
                        title: d("orders_open"),
                        onClick: () => {
                          (p(i.id), l("orders"));
                        },
                      }),
                      React.createElement(PrintMenu, {
                        onExportPdf: () =>
                          e({ type: "invoice", data: i, autoPrint: !0 }),
                        onWhatsApp: () => sendInvoiceWhatsApp(i),
                        t: d,
                      }),
                      React.createElement(IconBtn, {
                        icon: Pencil,
                        title: d("edit"),
                        onClick: () => m(i),
                      }),
                      React.createElement(IconBtn, {
                        icon: Trash2,
                        tone: "danger",
                        title: d("delete"),
                        onClick: () => C(i),
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
    ),
    c &&
      React.createElement(InvoiceModal, {
        doc: c,
        customers: r,
        quotations: n,
        onSave: I,
        onClose: () => m(null),
        t: d,
        toast: hh,
      }),
    k &&
      React.createElement(ConfirmModal, {
        message: `${d("inv_delete_confirm_prefix")} "${k.invNumber}" ${d("inv_delete_confirm_mid")}`,
        onConfirm: () => s(k.id),
        onCancel: () => C(null),
        t: d,
      }),
  );
}
function PrintMenu({ onExportPdf: o, onWhatsApp: a, t }) {
  const [r, n] = useState(!1);
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(IconBtn, {
      icon: Printer,
      title: t ? t("print_menu_title") : "Cetak / kirim",
      onClick: () => n(!0),
    }),
    r &&
      React.createElement(
        Modal,
        { title: t ? t("print_menu_title") : "Cetak / kirim", onClose: () => n(!1), width: 420, icon: Printer },
        React.createElement(
          "div",
          { style: { display: "grid", gap: 8 } },
          React.createElement(
            "button",
            { className: "dlg-opt", onClick: () => { n(!1); o(); } },
            React.createElement(Printer, { size: 17 }),
            t ? t("print_menu_export") : "Export PDF",
          ),
          a &&
            React.createElement(
              "button",
              { className: "dlg-opt", onClick: () => { n(!1); a(); } },
              React.createElement("img", { src: WA_ICON_DATA_URI, alt: "", style: { width: 18, height: 18 } }),
              t ? t("print_menu_whatsapp") : "Kirim via WhatsApp",
            ),
        ),
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "flex-end", marginTop: 20 } },
          React.createElement(Button, { icon: X, variant: "secondary", onClick: () => n(!1) }, t ? t("cancel") : "Batal"),
        ),
      ),
  );
}
const sheetItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  textAlign: "left",
  padding: "14px 22px",
  fontSize: 14,
  border: "none",
  background: BRAND.surface,
  cursor: "pointer",
  color: BRAND.ink,
};
function QuoItemsModal({ q: q, onClose: n, t: e }) {
  const d = q.items || [];
  return React.createElement(
    Modal,
    { title: q.quoNumber, onClose: n, width: 1000, icon: FileText, subtitle: `${q.customerSnap?.name || ""} · ${fmtDate(q.date)}` },
    React.createElement(
      "div",
      { className: "ui-scroll", style: { border: `1px solid ${BRAND.line}`, borderRadius: 10, overflow: "auto", maxHeight: 340 } },
      React.createElement(
        Table,
        { paginate: false },
        React.createElement(
          TableHeader,
          null,
          React.createElement(TableRow, null, ["item_no", "item_eventdate", "item_package", "item_desc", "item_qty", "item_unitprice", "item_discount", "item_subtotal"].map((x) => React.createElement(TableHead, { key: x }, e(x)))),
        ),
        React.createElement(
          TableBody,
          null,
          d.map((s, g) =>
            React.createElement(
              TableRow,
              { key: s.id || g },
              React.createElement(TableCell, { style: { whiteSpace: "nowrap" } }, g + 1),
              React.createElement(TableCell, { style: { whiteSpace: "nowrap" } }, s.eventDate ? fmtDate(s.eventDate) : "—"),
              React.createElement(TableCell, { style: { fontWeight: 600, whiteSpace: "nowrap" } }, s.packageItem),
              React.createElement(TableCell, { style: { minWidth: 200 } }, splitDescLines(s.description).join(", ") || "—"),
              React.createElement(TableCell, { style: { whiteSpace: "nowrap" } }, s.qty),
              React.createElement(TableCell, { style: { whiteSpace: "nowrap" } }, fmtRp(s.unitPrice)),
              React.createElement(TableCell, { style: { whiteSpace: "nowrap" } }, fmtRp(s.discount || 0)),
              React.createElement(TableCell, { style: { whiteSpace: "nowrap" } }, fmtRp(lineTotal(s))),
            ),
          ),
        ),
      ),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 } },
      React.createElement("div", { style: { fontSize: 13, color: BRAND.inkSoft } }, e("inv_total_label"), ": ", React.createElement("b", { style: { color: BRAND.ink } }, fmtRp(docSubtotal(d)))),
      React.createElement(Button, { icon: X, variant: "secondary", onClick: n }, e("inv_close")),
    ),
  );
}
function evSumRow(h, text, dates, filled, onOpen, e) {
  return h(
    "div",
    { className: "inv-sum-itemsrow" },
    h("span", { className: "inv-sum-items", style: { margin: 0 } }, text),
    h("button", { type: "button", className: "inv-link", onClick: onOpen }, `${e("ev_manage")}${filled ? ` ${filled}/${dates}` : ""}`, h(ChevronRight, { size: 14 })),
  );
}
function NewInvoiceModal({ doc: o, quotations: t, onSave: r, onClose: n, t: e }) {
  const h = React.createElement,
    [qid, setQid] = useState(""),
    [date, setDate] = useState(o.date),
    [plan, setPlan] = useState("2x"),
    [notes, setNotes] = useState(""),
    [showNotes, setShowNotes] = useState(false),
    [view, setView] = useState(false),
    [evInfo, setEvInfo] = useState({}),
    [evOpen, setEvOpen] = useState(false),
    q = (t || []).find((x) => x.id === qid),
    items = q ? q.items || [] : [],
    total = docSubtotal(items),
    evDates = [...new Set(items.map((x) => x.eventDate).filter(Boolean))].sort(),
    evFilled = evDates.filter((k) => evInfo[k] && (evInfo[k].time || evInfo[k].location)).length,
    [dueOv, setDueOv] = useState({}),
    pays = useMemo(() => generatePayments(plan, total, { date, items }).map((x, i) => (dueOv[i] ? { ...x, dueDate: dueOv[i] } : x)), [plan, total, date, qid, dueOv]),
    list = sortRows((t || []).map((x) => ({ ...x, subtotal: docSubtotal(x.items) })), { key: "date", dir: "desc" }),
    names = items.map((x) => x.packageItem).filter(Boolean),
    sumTxt = names.slice(0, 2).join(", ") + (names.length > 2 ? ` ${e("inv_and_more")} ${names.length - 2} ${e("inv_others")}` : "");
  function save() {
    r({
      ...o,
      date,
      customerId: q.customerId,
      customerSnap: q.customerSnap,
      items: items.map((x) => ({ ...x, id: uid() })),
      paymentPlan: plan,
      payments: pays,
      notes,
      sourceQuotationId: q.id,
      eventInfo: evInfo,
    });
  }
  return h(
    Modal,
    { title: e("inv_modal_create"), onClose: n, width: 520, icon: Receipt, subtitle: e("inv_new_sub") },
    h(
      Field,
      { label: e("inv_pick_quo"), full: !0 },
      h(
        UiSelect,
        { style: inputStyle, value: qid, onChange: (s) => (setQid(s.target.value), setDueOv({}), setEvInfo({})) },
        h("option", { value: "", disabled: !0 }, e("inv_pick_quo_ph")),
        list.map((x) => h("option", { key: x.id, value: x.id }, `${x.quoNumber} — ${x.customerSnap?.name || ""} — ${fmtRp(x.subtotal)}`)),
      ),
      (t || []).length === 0 && h("div", { className: "ui-help" }, e("inv_no_quo")),
    ),
    q &&
      h(
        "div",
        { className: "inv-sum" },
        h("div", { className: "inv-sum-top" }, h("b", null, q.customerSnap?.name), q.customerSnap?.address && h("span", null, q.customerSnap.address)),
        evSumRow(h, `${items.length} ${e("inv_items_unit")} · ${sumTxt}`, evDates.length, evFilled, () => setEvOpen(!0), e),
        h(
          "div",
          { className: "inv-sum-bot" },
          h("button", { type: "button", className: "inv-link", onClick: () => setView(true) }, e("inv_view_items"), h(ChevronRight, { size: 14 })),
          h("div", null, h("span", { className: "inv-sum-lbl" }, e("inv_total_label")), " ", h("b", null, fmtRp(total))),
        ),
      ),
    h(
      "div",
      { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" } },
      h(Field, { label: e("inv_date") }, h(UiDate, { style: inputStyle, value: date, onChange: (s) => setDate(s.target.value) })),
      h(Field, { label: e("inv_number") }, h("input", { style: { ...inputStyle, background: "var(--c-grayBg)" }, value: o.invNumber, readOnly: !0 })),
    ),
    q &&
      h(
        Field,
        { label: e("inv_installments"), full: !0 },
        h("div", { className: "ui-seg", role: "group" }, ["2x", "3x", "4x", "5x"].map((x) => h("button", { key: x, type: "button", className: plan === x ? "on" : "", onClick: () => setPlan(x), "aria-pressed": plan === x }, x))),
        h(
          "div",
          { className: "inv-terms" + (pays.length > 2 ? " more" : "") },
          pays.map((s, i) =>
            h(
              "div",
              { key: s.id || i, className: "inv-term inv-term-due" },
              h("div", null, h("b", null, s.label), h("small", null, Number(s.percent).toFixed(0), "%")),
              h("span", null, fmtRp(s.amount)),
              h(UiDate, { style: { ...inputStyle, padding: "4px 8px", fontSize: 12.5, minHeight: 30 }, value: s.dueDate || "", onChange: (v) => setDueOv((m) => ({ ...m, [i]: v.target.value })) }),
            ),
          ),
        ),
      ),
    showNotes
      ? h(Field, { label: e("inv_notes"), full: !0 }, h("textarea", { style: { ...inputStyle, minHeight: 56 }, value: notes, onChange: (s) => setNotes(s.target.value), autoFocus: !0 }))
      : h("button", { type: "button", className: "inv-link", style: { marginBottom: 14 }, onClick: () => setShowNotes(!0) }, h(Plus, { size: 14 }), e("inv_add_notes")),
    h(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 } },
      h(Button, { icon: X, variant: "secondary", onClick: n }, e("cancel")),
      h(Button, { icon: Save, onClick: save, disabled: !q }, e("inv_create_btn")),
    ),
    view && q && h(QuoItemsModal, { q, onClose: () => setView(!1), t: e }),
    evOpen && h(EventInfoListModal, { dates: evDates, items, value: evInfo, onSave: (v) => (setEvInfo(v), setEvOpen(!1)), onClose: () => setEvOpen(!1), t: e }),
  );
}
function InvoiceModal(props) {
  if (!props.doc.id) return React.createElement(NewInvoiceModal, props);
  return React.createElement(InvoiceEditModal, props);
}
function ItemsEditModal({ items: o, onSave: a, onClose: n, t: e }) {
  const [d, f] = useState(o);
  return React.createElement(
    Modal,
    { title: e("quo_items"), onClose: n, width: 1080, icon: FileText },
    React.createElement(ItemsEditor, { items: d, setItems: f, t: e, fixed: !0 }),
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 } },
      React.createElement("div", { style: { fontSize: 13, color: BRAND.inkSoft } }, e("inv_total_label"), ": ", React.createElement("b", { style: { color: BRAND.ink } }, fmtRp(docSubtotal(d)))),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 8 } },
        React.createElement(Button, { icon: X, variant: "secondary", onClick: n }, e("cancel")),
        React.createElement(Button, { icon: Save, onClick: () => a(d), disabled: d.length === 0 }, e("inv_save_items")),
      ),
    ),
  );
}
function InvoiceEditModal({ doc: o, onSave: r, onClose: n, t: e, toast: tt }) {
  const h = React.createElement,
    [l, p] = useState(o),
    [d, f] = useState(o.items || []),
    [plan, setPlan] = useState(o.paymentPlan || "2x"),
    [pays, setPays] = useState(() =>
      o.payments && o.payments.length
        ? o.payments.map((x, i) => ({ ...x, dueDate: paymentDue(o, i) || null }))
        : generatePayments(o.paymentPlan || "2x", docSubtotal(o.items || []), { date: o.date, items: o.items }),
    ),
    [showNotes, setShowNotes] = useState(!!o.notes),
    [edit, setEdit] = useState(false),
    [evOpen, setEvOpen] = useState(false),
    total = docSubtotal(d),
    evDates = [...new Set(d.map((x) => x.eventDate).filter(Boolean))].sort(),
    evFilled = evDates.filter((k) => (l.eventInfo || {})[k] && ((l.eventInfo || {})[k].time || (l.eventInfo || {})[k].location)).length,
    anyPaid = pays.some((x) => x.paid),
    names = d.map((x) => x.packageItem).filter(Boolean),
    sumTxt = names.slice(0, 2).join(", ") + (names.length > 2 ? ` ${e("inv_and_more")} ${names.length - 2} ${e("inv_others")}` : "");
  useEffect(() => {
    setPays((s) => (!s || s.length === 0 ? generatePayments(plan, total, { date: l.date, items: d }) : s.map((g) => ({ ...g, amount: Math.round((total * Number(g.percent)) / 100) }))));
  }, [total]);
  function changePlan(x) {
    if (anyPaid) return;
    setPlan(x);
    setPays(generatePayments(x, total, { date: l.date, items: d }));
  }
  function setDue(i, v) {
    setPays((s) => s.map((g, k) => (k === i ? { ...g, dueDate: v } : g)));
  }
  function toggle(i) {
    const g = pays[i];
    if (!g) return;
    setPays((s) => s.map((x, k) => (k === i ? { ...x, paid: !x.paid, paidDate: x.paid ? null : todayStr() } : x)));
    tt && tt(e(g.paid ? "inv_toast_unpaid" : "inv_toast_paid").replace("{label}", g.label));
  }
  return h(
    Modal,
    { title: e("inv_modal_edit"), onClose: n, width: 520, icon: Receipt, subtitle: e("inv_edit_sub") },
    h(
      "div",
      { className: "inv-sum", style: { marginTop: 0 } },
      h("div", { className: "inv-sum-top" }, h("b", null, l.customerSnap?.name), l.customerSnap?.address && h("span", null, l.customerSnap.address)),
      evSumRow(h, `${d.length} ${e("inv_items_unit")}${sumTxt ? " · " + sumTxt : ""}`, evDates.length, evFilled, () => setEvOpen(!0), e),
      h(
        "div",
        { className: "inv-sum-bot" },
        h("button", { type: "button", className: "inv-link", onClick: () => setEdit(!0) }, e("inv_edit_items"), h(ChevronRight, { size: 14 })),
        h("div", null, h("span", { className: "inv-sum-lbl" }, e("inv_total_label")), " ", h("b", null, fmtRp(total))),
      ),
    ),
    h(
      "div",
      { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" } },
      h(Field, { label: e("inv_date") }, h(UiDate, { style: inputStyle, value: l.date, onChange: (s) => p((g) => ({ ...g, date: s.target.value })) })),
      h(Field, { label: e("inv_number") }, h("input", { style: inputStyle, value: l.invNumber, onChange: (s) => p((g) => ({ ...g, invNumber: s.target.value })) })),
    ),
    h(
      Field,
      { label: e("inv_installments"), full: !0 },
      h(
        "div",
        { className: "ui-seg", role: "group", style: anyPaid ? { opacity: 0.55 } : void 0 },
        ["2x", "3x", "4x", "5x"].map((x) => h("button", { key: x, type: "button", disabled: anyPaid, className: plan === x ? "on" : "", onClick: () => changePlan(x), "aria-pressed": plan === x }, x)),
      ),
      anyPaid && h("div", { className: "ui-help" }, e("inv_plan_locked")),
      h(
        "div",
        { className: "inv-terms" + (pays.length > 3 ? " more" : "") },
        pays.map((s, i) =>
          h(
            "div",
            { key: s.id || i, className: "inv-term inv-term-pay inv-term-due" },
            h("div", null, h("b", null, s.label), h("small", null, Number(s.percent).toFixed(0), "%")),
            h("span", null, fmtRp(s.amount)),
            h(UiDate, { style: { ...inputStyle, padding: "4px 8px", fontSize: 12.5, minHeight: 30 }, value: s.dueDate || "", onChange: (v) => setDue(i, v.target.value) }),
            h(
              "button",
              { type: "button", className: "inv-paid" + (s.paid ? " on" : ""), onClick: () => toggle(i), "aria-pressed": !!s.paid },
              s.paid && h(Check, { size: 12, strokeWidth: 3 }),
              s.paid ? e("inv_paid") : e("inv_unpaid"),
            ),
          ),
        ),
      ),
    ),
    showNotes
      ? h(Field, { label: e("inv_notes"), full: !0 }, h("textarea", { style: { ...inputStyle, minHeight: 56 }, value: l.notes || "", onChange: (s) => p((g) => ({ ...g, notes: s.target.value })) }))
      : h("button", { type: "button", className: "inv-link", style: { marginBottom: 14 }, onClick: () => setShowNotes(!0) }, h(Plus, { size: 14 }), e("inv_add_notes")),
    h(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 } },
      h(Button, { icon: X, variant: "secondary", onClick: n }, e("cancel")),
      h(Button, { icon: Save, onClick: () => r({ ...l, items: d, paymentPlan: plan, payments: pays }), disabled: d.length === 0 }, e("save")),
    ),
    evOpen && h(EventInfoListModal, { dates: evDates, items: d, value: l.eventInfo || {}, onSave: (v) => (p((g) => ({ ...g, eventInfo: v })), setEvOpen(!1)), onClose: () => setEvOpen(!1), t: e }),
    edit && h(ItemsEditModal, { items: d, onSave: (x) => (f(x), setEdit(!1)), onClose: () => setEdit(!1), t: e }),
  );
}
function OrderDetailModal({ inv: o, onClose: n, t: e }) {
  const h = React.createElement,
    items = o.items || [],
    paid = isFullyPaid(o);
  return h(
    Modal,
    { title: o.invNumber, onClose: n, width: 1000, icon: ClipboardList, subtitle: `${o.customerSnap?.name || ""} · ${paid ? e("status_paid_full") : e("status_not_paid")}` },
    h("div", { className: "ord-sec-title" }, e("quo_items")),
    h(
      "div",
      { className: "ui-scroll", style: { border: `1px solid ${BRAND.line}`, borderRadius: 10, overflow: "auto", maxHeight: 340 } },
      h(
        Table,
        { paginate: !1 },
        h(
          TableHeader,
          null,
          h(TableRow, null, ["item_no", "od_col_execdate", "item_package", "item_desc", "item_qty"].map((x) => h(TableHead, { key: x }, e(x)))),
        ),
        h(
          TableBody,
          null,
          items.map((l, i) =>
            h(
              TableRow,
              { key: l.id || i },
              h(TableCell, { style: { color: BRAND.inkSoft } }, i + 1),
              h(TableCell, { style: { whiteSpace: "nowrap" } }, l.eventDate ? fmtDate(l.eventDate) : "—"),
              h(TableCell, { style: { fontWeight: 600, whiteSpace: "nowrap" } }, l.packageItem),
              h(TableCell, { style: { lineHeight: 1.5, minWidth: 220 } }, splitDescLines(l.description).map((b, S) => h("div", { key: S }, "• ", b))),
              h(TableCell, { style: { whiteSpace: "nowrap" } }, l.qty),
            ),
          ),
          items.length === 0 && h(TableRow, null, h(TableCell, { colSpan: 5, style: { textAlign: "center", color: BRAND.inkSoft, padding: 18 } }, e("od_no_items"))),
        ),
      ),
    ),
    h("div", { className: "ord-sec-title", style: { marginTop: 20 } }, e("orders_col_note")),
    h("div", { className: "ord-note" + (o.notes ? "" : " empty") }, o.notes || e("orders_note_empty")),
    h("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 16 } }, h(Button, { icon: X, variant: "secondary", onClick: n }, e("inv_close"))),
  );
}
function OrderNoteModal({ inv: o, onSave: r, onClose: n, t: e }) {
  const h = React.createElement,
    [v, setV] = useState(o.notes || "");
  return h(
    Modal,
    { title: e("orders_note_title"), onClose: n, width: 480, icon: StickyNote, subtitle: `${o.invNumber} \u00b7 ${o.customerSnap?.name || ""}` },
    h("textarea", { style: { ...inputStyle, minHeight: 110, resize: "vertical" }, value: v, placeholder: e("orders_note_ph"), autoFocus: !0, onChange: (x) => setV(x.target.value) }),
    h(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 } },
      h(Button, { icon: X, variant: "secondary", onClick: n }, e("cancel")),
      h(Button, { icon: Save, onClick: () => r(v.trim()) }, e("save")),
    ),
  );
}
function OrdersPage({ ctx: o }) {
  const {
      invoices: a,
      setInvoices: t,
      selectedInvoiceId: sel,
      setSelectedInvoiceId: n,
      showToast: toast,
      t: e,
    } = o,
    h = React.createElement,
    [l, p] = useState(""),
    [d, f] = useState({ key: "date", dir: "desc" }),
    [openId, setOpenId] = useState(null),
    [noteId, setNoteId] = useState(null),
    v = a.map((c) => {
      const ev = (c.items || []).map((x) => x.eventDate).filter(Boolean).sort(),
        names = (c.items || []).map((x) => x.packageItem).filter(Boolean);
      return {
        ...c,
        total: docSubtotal(c.items),
        status: isFullyPaid(c) ? "Paid in Full" : "Not Yet Paid",
        eventKey: ev[0] || "9999-12-31",
        eventFirst: ev[0] || "",
        eventMore: Math.max(0, new Set(ev).size - 1),
        itemsTxt: names.slice(0, 2).join(", ") + (names.length > 2 ? ` +${names.length - 2}` : ""),
      };
    }),
    u = sortRows(
      v.filter((c) => JSON.stringify(c).toLowerCase().includes(l.toLowerCase())),
      d,
    ),
    openInv = a.find((c) => c.id === openId),
    noteInv = a.find((c) => c.id === noteId);
  useEffect(() => {
    if (sel) {
      setOpenId(sel);
      n(null);
    }
  }, [sel]);
  function y(c, m) {
    const cur = a.find((k) => k.id === c);
    setNoteId(null);
    if (!cur || (cur.notes || "") === m) return;
    t((k) => k.map((C) => (C.id === c ? { ...C, notes: m } : C)));
    toast && toast(e("orders_note_saved"));
  }
  return h(
    "div",
    null,
    h(PageHeader, {
      title: e("orders_title"),
      subtitle: e("orders_subtitle"),
      search: h(SearchBox, { value: l, onChange: p, placeholder: e("search_placeholder") }),
    }),
    h(
      Card,
      { style: { padding: 0, overflowX: "auto" } },
      u.length === 0
        ? h(EmptyState, { text: e("orders_empty") })
        : h(
            Table,
            null,
            h(
              TableHeader,
              null,
              h(
                TableRow,
                null,
                h(Th, { label: e("inv_number"), sortKey: "invNumber", sort: d, setSort: f }),
                h(TableHead, null, e("quo_col_customer")),
                h(Th, { label: e("orders_col_event"), sortKey: "eventKey", sort: d, setSort: f }),
                h(TableHead, null, e("orders_col_items")),
                h(TableHead, null, e("col_status")),
                h(TableHead, { style: { minWidth: 200 } }, e("orders_col_note")),
                h(TableHead, { style: { width: 100 } }),
              ),
            ),
            h(
              TableBody,
              null,
              u.map((c) =>
                h(
                  TableRow,
                  { key: c.id },
                  h(TableCell, { style: { fontWeight: 600 } }, c.invNumber),
                  h(TableCell, null, c.customerSnap?.name),
                  h(
                    TableCell,
                    { style: { whiteSpace: "nowrap" } },
                    c.eventFirst ? fmtDate(c.eventFirst) : "—",
                    c.eventMore > 0 && h("span", { style: { color: BRAND.inkSoft, marginLeft: 6, fontSize: 12 } }, `+${c.eventMore}`),
                  ),
                  h(TableCell, { style: { maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, title: c.itemsTxt }, c.itemsTxt || "—"),
                  h(TableCell, null, h(Badge, { tone: c.status === "Paid in Full" ? "green" : "amber" }, c.status === "Paid in Full" ? e("status_paid_full") : e("status_not_paid"))),
                  h(TableCell, { style: { maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: c.notes ? BRAND.ink : BRAND.inkSoft }, title: c.notes || "" }, c.notes || "\u2014"),
                  h(
                    TableCell,
                    null,
                    h(
                      "div",
                      { style: { display: "flex", gap: 6, justifyContent: "flex-end" } },
                      h(IconBtn, { icon: Eye, title: e("orders_detail"), onClick: () => setOpenId(c.id) }),
                      h(IconBtn, { icon: StickyNote, title: e("orders_note_btn"), onClick: () => setNoteId(c.id) }),
                    ),
                  ),
                ),
              ),
            ),
          ),
    ),
    openInv && h(OrderDetailModal, { inv: openInv, onClose: () => setOpenId(null), t: e }),
    noteInv && h(OrderNoteModal, { inv: noteInv, onSave: (v) => y(noteInv.id, v), onClose: () => setNoteId(null), t: e }),
  );
}
const WEEKDAY_LABELS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  WEEKDAY_LABELS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function EventInfoListModal({ dates: ds, items: items, value: val, onSave: r, onClose: n, t: e }) {
  const h = React.createElement,
    [d, setD] = useState(() => ({ ...(val || {}) })),
    upd = (k, f, v) => setD((x) => ({ ...x, [k]: { ...(x[k] || {}), [f]: v } }));
  return h(
    Modal,
    { title: e("ev_manage_title"), onClose: n, width: 560, icon: Calendar, subtitle: e("ev_manage_sub") },
    ds.length === 0 && h("div", { className: "ev-box", style: { padding: 16, fontSize: 13.5, lineHeight: 1.6, color: BRAND.inkSoft } }, e("ev_no_dates")),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 12, maxHeight: "min(52vh, 440px)", overflowY: "auto", paddingRight: 2 } },
      ds.map((k) => {
        const it = d[k] || {},
          pk = items.filter((x) => x.eventDate === k).map((x) => x.packageItem).filter(Boolean).join(", ");
        return h(
          "div",
          { key: k, className: "ev-box", style: { padding: 14 } },
          h("div", { style: { fontWeight: 600, fontSize: 13.5 } }, fmtDate(k)),
          pk && h("div", { className: "ev-sub", style: { marginBottom: 10 } }, pk),
          h(
            "div",
            { style: { display: "grid", gridTemplateColumns: "130px 1fr", gap: "0 10px" } },
            h(Field, { label: e("ev_time") }, h("input", { type: "time", style: inputStyle, value: it.time || "", onChange: (x) => upd(k, "time", x.target.value) })),
            h(Field, { label: e("ev_location") }, h("input", { style: inputStyle, value: it.location || "", placeholder: e("ev_loc_ph"), onChange: (x) => upd(k, "location", x.target.value) })),
          ),
          h("input", { style: { ...inputStyle, marginTop: -4 }, value: it.note || "", placeholder: e("ev_note"), onChange: (x) => upd(k, "note", x.target.value) }),
        );
      }),
    ),
    h(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 } },
      h(Button, { icon: X, variant: "secondary", onClick: n }, ds.length === 0 ? e("inv_close") : e("cancel")),
      ds.length > 0 && h(
        Button,
        {
          icon: Save,
          onClick: () => {
            const out = {};
            Object.keys(d).forEach((k) => {
              const v = d[k] || {};
              (v.time || v.location || v.note) && (out[k] = { time: v.time || "", location: (v.location || "").trim(), note: (v.note || "").trim() });
            });
            r(out);
          },
        },
        e("ev_save_btn"),
      ),
    ),
  );
}
function EventInfoModal({ inv: o, date: dt, onSave: r, onClose: n, t: e }) {
  const h = React.createElement,
    cur = (o.eventInfo || {})[dt] || {},
    [time, setTime] = useState(cur.time || ""),
    [loc, setLoc] = useState(cur.location || ""),
    [note, setNote] = useState(cur.note || "");
  return h(
    Modal,
    { title: e("ev_edit_title"), onClose: n, width: 480, icon: Calendar, subtitle: `${o.customerSnap?.name || ""} · ${fmtDate(dt)}` },
    h(Field, { label: e("ev_time"), full: !0 }, h("input", { type: "time", style: { ...inputStyle, width: 160 }, value: time, onChange: (x) => setTime(x.target.value) })),
    h(Field, { label: e("ev_location"), full: !0 }, h("input", { style: inputStyle, value: loc, placeholder: e("ev_loc_ph"), onChange: (x) => setLoc(x.target.value) })),
    h(Field, { label: e("ev_note"), full: !0 }, h("textarea", { style: { ...inputStyle, minHeight: 80, resize: "vertical" }, value: note, placeholder: e("ev_note_ph"), onChange: (x) => setNote(x.target.value) })),
    h(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 } },
      h(Button, { icon: X, variant: "secondary", onClick: n }, e("cancel")),
      h(Button, { icon: Save, onClick: () => r({ time, location: loc.trim(), note: note.trim() }) }, e("save")),
    ),
  );
}
function EventDetailModal({ inv: o, date: dt, onEdit: edit, onOrder: order, onClose: n, t: e }) {
  const h = React.createElement,
    info = (o.eventInfo || {})[dt] || {},
    items = (o.items || []).filter((x) => x.eventDate === dt),
    st = currentStatus(o),
    empty = h("span", { className: "ev-empty" }, e("ev_empty")),
    row = (label, val) => h("div", { className: "ev-row" }, h("span", { className: "ev-k" }, label), h("div", { className: "ev-v" }, val));
  return h(
    Modal,
    { title: o.customerSnap?.name || "—", onClose: n, width: 560, icon: Calendar, subtitle: `${fmtDate(dt)}${info.time ? " · " + info.time : ""}` },
    h("div", { className: "ord-sec-title" }, e("ev_edit_title")),
    h(
      "div",
      { className: "ev-box" },
      row(e("ev_time"), info.time || empty),
      row(e("ev_location"), info.location || empty),
      row(e("ev_client"), h("div", null, h("div", null, o.customerSnap?.name), (o.customerSnap?.phone || o.customerSnap?.address) && h("div", { className: "ev-sub" }, [o.customerSnap.phone, o.customerSnap.address].filter(Boolean).join(" · ")))),
      row(e("ev_invoice"), h("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 } }, o.invNumber, h(Badge, { tone: st === "Paid Full" ? "green" : st === "Belum Bayar" ? "gray" : "amber" }, st === "Belum Bayar" ? e("status_unpaid") : st))),
    ),
    h("div", { className: "ord-sec-title", style: { marginTop: 18 } }, e("ev_services")),
    h(
      "div",
      { className: "ev-box" },
      items.map((x, i) =>
        h(
          "div",
          { key: x.id || i, className: "ev-svc" },
          h("b", null, x.packageItem, x.qty > 1 ? ` ×${x.qty}` : ""),
          splitDescLines(x.description).length > 0 && h("div", { className: "ev-sub" }, splitDescLines(x.description).join(", ")),
        ),
      ),
    ),
    info.note && h("div", { className: "ord-sec-title", style: { marginTop: 18 } }, e("ev_note")),
    info.note && h("div", { className: "ord-note" }, info.note),
    h(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 20, flexWrap: "wrap" } },
      h("button", { type: "button", className: "inv-link", onClick: order }, e("ev_view_order"), h(ChevronRight, { size: 14 })),
      h(
        "div",
        { style: { display: "flex", gap: 8 } },
        h(Button, { icon: X, variant: "secondary", onClick: n }, e("inv_close")),
        h(Button, { icon: Pencil, onClick: edit }, e("ev_edit")),
      ),
    ),
  );
}
function CalDayModal({ date: o, events: ev, onPick: pick, onClose: n, t: e }) {
  const h = React.createElement;
  return h(
    Modal,
    { title: fmtDate(o), onClose: n, width: 520, icon: Calendar, subtitle: `${ev.length} event` },
    ev.length > 1 &&
      h(
        "div",
        { style: { fontSize: 12.5, color: BRAND.amber, background: BRAND.amberBg, borderRadius: 8, padding: "8px 10px", marginBottom: 12 } },
        e("cal_clash_warning"),
        " ",
        ev.length,
        " ",
        e("cal_clash_warning_suffix"),
      ),
    h(
      "div",
      { className: "cal-daylist" },
      ev.map((g, i) =>
        h(
          "button",
          { key: i, type: "button", className: "cal-dayrow", onClick: () => pick(g.invoiceId) },
          h("span", { className: "cal-daymain" }, h("b", null, g.customer), h("small", null, [g.time, g.location].filter(Boolean).join(" · ") || g.invNumber, " — ", g.packageItem)),
          h(Badge, { tone: g.status === "Paid Full" ? "green" : g.status === "Belum Bayar" ? "gray" : "amber" }, g.status === "Belum Bayar" ? e("status_unpaid") : g.status),
          h(ChevronRight, { size: 15 }),
        ),
      ),
    ),
    h("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 16 } }, h(Button, { icon: X, variant: "secondary", onClick: n }, e("inv_close"))),
  );
}
function CalendarPage({ ctx: o }) {
  const { invoices: a, setInvoices: setInv, showToast: toast, t: n, lang: e } = o,
    h = React.createElement,
    now = new Date(),
    [p, d] = useState({ y: now.getFullYear(), m: now.getMonth() }),
    [dayKey, setDayKey] = useState(null),
    [detail, setDetail] = useState(null),
    [editEv, setEditEv] = useState(false),
    [orderId, setOrderId] = useState(null),
    [fStatus, setFStatus] = useState("all"),
    [fCust, setFCust] = useState(""),
    [q, setQ] = useState(""),
    [rowH, setRowH] = useState(110),
    gridRef = useRef(null),
    u = e === "en" ? WEEKDAY_LABELS_EN : WEEKDAY_LABELS_ID,
    loc = e === "en" ? "en-US" : "id-ID",
    custList = useMemo(() => [...new Set(a.filter((i) => (i.items || []).some((x) => x.eventDate)).map((i) => i.customerSnap?.name).filter(Boolean))].sort((x, y) => x.localeCompare(y)), [a]),
    c = useMemo(() => {
      const g = {},
        needle = q.trim().toLowerCase(),
        stOf = (st) => (st === "Paid Full" ? "paid" : st === "Belum Bayar" ? "unpaid" : "partial");
      a.forEach((i) => {
        if (fCust && i.customerSnap?.name !== fCust) return;
        if (fStatus !== "all" && stOf(currentStatus(i)) !== fStatus) return;
        const hh = {};
        (i.items || []).forEach((b) => {
          b.eventDate && ((hh[b.eventDate] = hh[b.eventDate] || []), b.packageItem && hh[b.eventDate].push(b.packageItem));
        });
        Object.keys(hh).forEach((b) => {
          const inf = (i.eventInfo || {})[b] || {},
            ent = { invoiceId: i.id, date: b, invNumber: i.invNumber, customer: i.customerSnap?.name, packageItem: hh[b].join(", "), status: currentStatus(i), time: inf.time || "", location: inf.location || "" };
          if (needle && !`${ent.customer} ${ent.invNumber} ${ent.packageItem} ${ent.location}`.toLowerCase().includes(needle)) return;
          (g[b] = g[b] || []).push(ent);
        });
      });
      Object.keys(g).forEach((k) => g[k].sort((x, y) => (x.time || "99:99").localeCompare(y.time || "99:99")));
      return g;
    }, [a, q, fStatus, fCust]),
    first = new Date(p.y, p.m, 1),
    lead = first.getDay(),
    dim = new Date(p.y, p.m + 1, 0).getDate(),
    weeks = Math.ceil((lead + dim) / 7),
    ymd = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`,
    cells = Array.from({ length: weeks * 7 }, (_, i) => {
      const x = new Date(p.y, p.m, 1 - lead + i);
      return { key: ymd(x), day: x.getDate(), inMonth: x.getMonth() === p.m };
    }),
    title = first.toLocaleDateString(loc, { month: "long", year: "numeric" }),
    rangeTxt = `${fmtDate(ymd(first))} – ${fmtDate(ymd(new Date(p.y, p.m + 1, 0)))}`,
    fits = Math.max(1, Math.floor((rowH - 37) / 25)),
    fitsMore = Math.max(1, Math.floor((rowH - 37 - 19) / 25)),
    shown = (cnt) => (window.innerWidth <= 700 ? 6 : cnt <= fits ? cnt : fitsMore),
    todayK = todayStr(),
    touchX = useRef(null),
    tone = (st) => (st === "Paid Full" ? "g" : st === "Belum Bayar" ? "n" : "a");
  function go(g) {
    const i = new Date(p.y, p.m + g, 1);
    d({ y: i.getFullYear(), m: i.getMonth() });
  }
  function onTS(g) {
    touchX.current = g.touches[0].clientX;
  }
  function onTE(g) {
    if (touchX.current === null) return;
    const i = g.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    Math.abs(i) > 40 && go(i < 0 ? 1 : -1);
  }
  const calRef = useRef(null);
  // Tinggi kalender menyesuaikan sisa layar (sampai dasar area konten), min 440px.
  const measureRows = () => {
    const g = gridRef.current;
    if (g) {
      const r = Math.floor(g.clientHeight / weeks);
      setRowH((x) => (Math.abs(x - r) > 1 ? r : x));
    }
  };
  const fitCal = () => {
    const el = calRef.current;
    if (!el || window.innerWidth <= 700) return el && ((el.style.height = ""), measureRows());
    let sp = el.parentElement;
    while (sp && sp !== document.body) {
      const oy = getComputedStyle(sp).overflowY;
      if (oy === "auto" || oy === "scroll") break;
      sp = sp.parentElement;
    }
    if (!sp || sp === document.body) return;
    const bottom = sp.getBoundingClientRect().bottom;
    let hgt = Math.max(440, Math.floor(bottom - el.getBoundingClientRect().top - 8));
    el.style.height = hgt + "px";
    const over = sp.scrollHeight - sp.clientHeight;
    over > 0 && (el.style.height = Math.max(440, hgt - over) + "px");
    measureRows();
  };
  React.useLayoutEffect(fitCal);
  useEffect(() => {
    window.addEventListener("resize", fitCal);
    return () => window.removeEventListener("resize", fitCal);
  }, []);
  const detailInv = detail && a.find((x) => x.id === detail.id),
    orderInv = orderId && a.find((x) => x.id === orderId);
  function saveEv(v) {
    setInv((arr) => arr.map((i) => (i.id === detail.id ? { ...i, eventInfo: { ...(i.eventInfo || {}), [detail.date]: v } } : i)));
    setEditEv(false);
    toast && toast(n("ev_saved"));
  }
  return h(
    "div",
    null,
    h(PageHeader, { title: n("cal_title"), subtitle: n("cal_subtitle") }),
    h("style", null, CAL_CSS),
    h(
      "div",
      { className: "cal-bar" },
      h(
        "div",
        { className: "ui-seg", role: "group" },
        [["all", "cal_f_all"], ["paid", "cal_f_paid"], ["partial", "cal_f_partial"], ["unpaid", "cal_f_unpaid"]].map(([k, l]) => h("button", { key: k, type: "button", className: fStatus === k ? "on" : "", onClick: () => setFStatus(k), "aria-pressed": fStatus === k }, n(l))),
      ),
      h(
        "div",
        { className: "cal-bar-r" },
        h(
          UiSelect,
          { style: { ...inputStyle, width: 200 }, value: fCust, onChange: (x) => setFCust(x.target.value) },
          h("option", { value: "" }, n("cal_all_customers")),
          custList.map((x) => h("option", { key: x, value: x }, x)),
        ),
        h("div", { style: { width: 240 } }, h(SearchBox, { value: q, onChange: setQ, placeholder: n("cal_search") })),
      ),
    ),
    h(
      "div",
      { className: "cal", ref: calRef, onTouchStart: onTS, onTouchEnd: onTE },
      h(
        "div",
        { className: "cal-head" },
        h(
          "div",
          { className: "cal-title" },
          h("div", { className: "cal-badge" }, h("span", null, now.toLocaleDateString(loc, { month: "short" }).replace(".", "")), h("b", null, now.getDate())),
          h("div", null, h("div", { className: "cal-month" }, title), h("div", { className: "cal-range" }, rangeTxt)),
        ),
        h(
          "div",
          { className: "cal-nav" },
          h("button", { type: "button", onClick: () => go(-1), "aria-label": n("cal_prev"), title: n("cal_prev") }, h(ChevronLeft, { size: 16 })),
          h("button", { type: "button", onClick: () => d({ y: now.getFullYear(), m: now.getMonth() }) }, n("cal_today")),
          h("button", { type: "button", onClick: () => go(1), "aria-label": n("cal_next"), title: n("cal_next") }, h(ChevronRight, { size: 16 })),
        ),
      ),
      h("div", { className: "cal-wk" }, u.map((g) => h("div", { key: g }, g))),
      h(
        "div",
        { className: "cal-grid", ref: gridRef, style: { gridTemplateRows: `repeat(${weeks}, minmax(0, 1fr))` } },
        cells.map((x) => {
          const ev = c[x.key] || [];
          return h(
            "div",
            { key: x.key, className: "cal-cell" + (x.inMonth ? "" : " out") },
            h("span", { className: "cal-d" + (x.key === todayK ? " today" : "") }, x.day),
            ev.slice(0, shown(ev.length)).map((g, i) =>
              h(
                "button",
                { key: i, type: "button", className: "cal-chip " + tone(g.status), onClick: () => setDetail({ id: g.invoiceId, date: x.key }), title: `${g.customer} — ${g.packageItem}${g.location ? " · " + g.location : ""}` },
                h("i", null),
                h("span", { className: "cal-ct" }, g.time && h("em", null, g.time), h("b", null, g.customer), " ", g.packageItem),
              ),
            ),
            ev.length > shown(ev.length) && h("button", { type: "button", className: "cal-more", onClick: () => setDayKey(x.key) }, `${ev.length - shown(ev.length)} ${n("cal_more")}`),
          );
        }),
      ),
    ),
    dayKey && h(CalDayModal, { date: dayKey, events: c[dayKey] || [], onPick: (id) => setDetail({ id, date: dayKey }), onClose: () => setDayKey(null), t: n }),
    detailInv && h(EventDetailModal, { inv: detailInv, date: detail.date, onEdit: () => setEditEv(!0), onOrder: () => setOrderId(detailInv.id), onClose: () => setDetail(null), t: n }),
    detailInv && editEv && h(EventInfoModal, { inv: detailInv, date: detail.date, onSave: saveEv, onClose: () => setEditEv(!1), t: n }),
    orderInv && h(OrderDetailModal, { inv: orderInv, onClose: () => setOrderId(null), t: n }),
  );
}
const CAL_CSS = `
  .cal { display:flex; flex-direction:column; height:calc(100dvh - 244px); min-height:440px; border:1px solid var(--c-line); border-radius:14px; background:var(--c-surface); overflow:hidden; }
  .cal-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:12px; }
  .cal-bar-r { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .cal-head { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 18px; border-bottom:1px solid var(--c-line); }
  .cal-title { display:flex; align-items:center; gap:12px; min-width:0; }
  .cal-badge { width:44px; border:1px solid var(--c-line); border-radius:10px; overflow:hidden; text-align:center; flex-shrink:0; background:var(--c-surface); }
  .cal-badge span { display:block; background:#2F65E0; color:#fff; font-size:10px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; padding:2px 0; }
  .cal-badge b { display:block; font-size:17px; line-height:26px; color:var(--c-ink); }
  .cal-month { font-size:15px; font-weight:600; color:var(--c-ink); text-transform:capitalize; }
  .cal-range { font-size:12.5px; color:var(--c-inkSoft); margin-top:1px; }
  .cal-nav { display:inline-flex; border:1px solid var(--c-line); border-radius:9px; overflow:hidden; flex-shrink:0; }
  .cal-nav button { height:34px; min-width:38px; padding:0 12px; border:none; background:var(--c-surface); color:var(--c-ink); font:inherit; font-size:13.5px; font-weight:500; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; transition:background-color .15s; }
  .cal-nav button + button { border-left:1px solid var(--c-line); }
  .cal-nav button:hover { background:var(--c-grayBg); }
  .cal-wk { display:grid; grid-template-columns:repeat(7, minmax(0,1fr)); border-bottom:1px solid var(--c-line); }
  .cal-wk div { padding:9px 0; text-align:center; font-size:12.5px; color:var(--c-inkSoft); font-weight:500; }
  .cal-grid { display:grid; grid-template-columns:repeat(7, minmax(0,1fr)); flex:1; min-height:0; }
  .cal-cell { display:flex; flex-direction:column; gap:3px; padding:5px 6px; border-right:1px solid var(--c-line); border-bottom:1px solid var(--c-line); min-height:0; overflow:hidden; }
  .cal-cell:nth-child(7n) { border-right:none; }
  .cal-cell.out { background:var(--c-grayBg); }
  .cal-cell.out .cal-d { color:var(--c-inkSoft); }
  .cal-d { align-self:flex-start; min-width:24px; height:24px; padding:0 6px; border-radius:7px; display:inline-flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:500; color:var(--c-ink); flex-shrink:0; }
  .cal-d.today { background:var(--c-ink); color:var(--c-bg); font-weight:600; }
  .cal-chip { display:flex; align-items:center; gap:5px; width:100%; min-width:0; height:22px; padding:0 6px; border:1px solid transparent; border-radius:6px; font:inherit; font-size:11.5px; text-align:left; cursor:pointer; flex-shrink:0; }
  .cal-chip i { width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .cal-ct { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .cal-ct b { font-weight:600; }
  .cal-ct em { font-style:normal; font-weight:700; margin-right:4px; opacity:.85; }
  .cal-chip.g { background:var(--c-greenBg,#DCFCE7); color:var(--c-green,#15803D); border-color:rgba(22,163,74,.25); }
  .cal-chip.a { background:var(--c-amberBg,#FEF3C7); color:var(--c-amber,#B45309); border-color:rgba(217,119,6,.25); }
  .cal-chip.n { background:var(--c-grayBg); color:var(--c-ink); border-color:var(--c-line); }
  .cal-chip:hover { filter:brightness(.96); }
  .cal-more { align-self:flex-start; border:none; background:none; padding:0 4px; font:inherit; font-size:11.5px; color:var(--c-inkSoft); cursor:pointer; }
  .cal-more:hover { color:var(--c-ink); text-decoration:underline; }
  .ev-box { border:1px solid var(--c-line); border-radius:10px; overflow:hidden; }
  .ev-row { display:grid; grid-template-columns:96px 1fr; gap:12px; padding:10px 14px; font-size:13.5px; color:var(--c-ink); }
  .ev-row + .ev-row, .ev-svc + .ev-svc { border-top:1px solid var(--c-line); }
  .ev-k { color:var(--c-inkSoft); }
  .ev-v { min-width:0; overflow-wrap:anywhere; }
  .ev-sub { font-size:12.5px; color:var(--c-inkSoft); margin-top:2px; }
  .ev-empty { color:var(--c-inkSoft); font-style:italic; }
  .ev-svc { padding:10px 14px; font-size:13.5px; color:var(--c-ink); }
  .cal-daylist { display:flex; flex-direction:column; border:1px solid var(--c-line); border-radius:10px; overflow-y:auto; max-height:min(56vh, 420px); }
  .cal-dayrow { display:flex; align-items:center; gap:10px; width:100%; padding:11px 14px; border:none; background:var(--c-surface); font:inherit; text-align:left; cursor:pointer; color:var(--c-ink); }
  .cal-dayrow + .cal-dayrow { border-top:1px solid var(--c-line); }
  .cal-dayrow:hover { background:var(--c-grayBg); }
  .cal-daymain { flex:1; min-width:0; display:flex; flex-direction:column; }
  .cal-daymain b { font-size:13.5px; font-weight:600; }
  .cal-daymain small { font-size:12px; color:var(--c-inkSoft); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  @media (max-width:700px) {
    .cal { height:auto; min-height:0; }
    .cal-grid { grid-template-rows:none !important; }
    .cal-cell { min-height:58px; flex-direction:row; flex-wrap:wrap; align-content:flex-start; gap:3px; padding:4px; }
    .cal-d { flex-basis:100%; }
    .cal-chip { width:10px; height:10px; padding:0; border-radius:50%; }
    .cal-chip i, .cal-ct { display:none; }
    .cal-chip.g { background:var(--c-green,#15803D); } .cal-chip.a { background:var(--c-amber,#B45309); } .cal-chip.n { background:var(--c-inkSoft); }
    .cal-more { font-size:10px; }
    .cal-range { display:none; }
  }
`;
function blankExpenseRow(o) {
  return {
    rid: uid(),
    itemName:
      o === "Project"
        ? PROJECT_ITEMS[0]
        : o === "Marketing"
          ? MARKETING_ITEMS[0]
          : "",
    customName: "",
    qty: 1,
    unitPrice: 0,
  };
}
function ExpensesPage({ ctx: o }) {
  const { expenses: a, setExpenses: t, invoices: r, t: n, showToast: TT } = o,
    [e, l] = useState("Project"),
    [p, d] = useState(todayStr()),
    [f, v] = useState(""),
    [u, y] = useState([blankExpenseRow("Project")]),
    [c, m] = useState(""),
    [k, C] = useState({ key: "date", dir: "desc" }),
    [P, w] = useState(null),
    [mo, setMo] = useState(!1);
  useEffect(() => {
    (y([blankExpenseRow(e)]), v(""));
  }, [e]);
  const B =
    e === "Project"
      ? PROJECT_ITEMS
      : e === "Marketing"
        ? MARKETING_ITEMS
        : null;
  function I(x, z) {
    y(u.map((_, N) => (N === x ? { ..._, ...z } : _)));
  }
  function s() {
    y([...u, blankExpenseRow(e)]);
  }
  function g(x) {
    y(u.filter((z, _) => _ !== x));
  }
  function i(x) {
    return Math.max(0, (Number(x.qty) || 0) * (Number(x.unitPrice) || 0));
  }
  function h() {
    if (e === "Project" && !f) return;
    const x = u
      .map((_) => ({
        ..._,
        itemName:
          _.itemName === "Others" ? _.customName || "Others" : _.itemName,
      }))
      .filter((_) => _.itemName);
    if (!x.length) return;
    const z = x.map((_) => ({
      id: uid(),
      date: p,
      category: e,
      invoiceId: e === "Project" ? f : "",
      itemName: _.itemName,
      qty: _.qty,
      unitPrice: _.unitPrice,
    }));
    (t((_) => [..._, ...z]),
      y([blankExpenseRow(e)]),
      TT && TT("Expense saved ✓"),
      setMo(!1));
  }
  const b = a.map((x) => ({
      ...x,
      total: lineTotal(x),
      invNo: r.find((z) => z.id === x.invoiceId)?.invNumber || "",
    })),
    S = sortRows(
      b
        .filter((x) => x.category === e)
        .filter((x) =>
          JSON.stringify(x).toLowerCase().includes(c.toLowerCase()),
        ),
      k,
    );
  function E(x) {
    (t((z) => z.filter((_) => _.id !== x)),
      w(null),
      TT && TT("Expense deleted"));
  }
  const T = u.reduce((x, z) => x + i(z), 0);
  return React.createElement(
    "div",
    null,
    React.createElement(PageHeader, {
      title: n("exp_title"),
      subtitle: n("exp_subtitle"),
      search: React.createElement(SearchBox, { value: c, onChange: m, placeholder: n("search_placeholder") }),
      action: React.createElement(Button, { icon: Plus, onClick: () => setMo(!0) }, n("exp_add_btn")),
    }),
    React.createElement(
      "div",
      { className: "ui-tabs", role: "tablist" },
      CATEGORIES.map((x) =>
        React.createElement("button", { key: x, type: "button", role: "tab", "aria-selected": e === x, className: "ui-tab" + (e === x ? " on" : ""), onClick: () => l(x) }, x, " expense"),
      ),
    ),
    mo &&
    React.createElement(
      Modal,
      { title: `${n("exp_input_title")} ${e} expense`, subtitle: e === "Project" ? n("exp_input_hint").replace(/^\(|\)$/g, "") : void 0, icon: Wallet, onClose: () => setMo(!1), width: 820 },
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns:
              e === "Project" ? "repeat(auto-fit, minmax(200px, 1fr))" : "1fr",
            gap: "0 14px",
          },
        },
        React.createElement(
          Field,
          { label: n(e === "Salary" ? "exp_field_month" : "exp_field_date") },
          e === "Salary"
            ? React.createElement("input", {
                type: "month",
                style: inputStyle,
                value: p.slice(0, 7),
                onChange: (x) =>
                  d(x.target.value ? `${x.target.value}-01` : todayStr()),
              })
            : React.createElement(UiDate, {
                style: inputStyle,
                value: p,
                onChange: (x) => d(x.target.value),
              }),
        ),
        e === "Project" &&
          React.createElement(
            Field,
            { label: n("exp_field_invoice") },
            React.createElement(
              UiSelect,
              {
                style: inputStyle,
                value: f,
                onChange: (x) => v(x.target.value),
              },
              React.createElement(
                "option",
                { value: "" },
                n("exp_pick_invoice"),
              ),
              r.map((x) =>
                React.createElement(
                  "option",
                  { key: x.id, value: x.id },
                  x.invNumber,
                  " \u2014 ",
                  x.customerSnap?.name,
                ),
              ),
            ),
          ),
      ),
      React.createElement(
        "div",
        {
          style: {
            overflowX: "auto",
            border: `1px solid ${BRAND.line}`,
            borderRadius: 8,
            marginTop: 6,
          },
        },
        React.createElement(
          Table,
          null,
          React.createElement(
            TableHeader,
            null,
            React.createElement(
              TableRow,
              null,
              React.createElement(TableHead, { style: { width: 36 } }, n("item_no")),
              React.createElement(
                TableHead,
                { style: { minWidth: 200 } },
                n(e === "Salary" ? "exp_field_name" : "exp_field_item"),
              ),
              e !== "Salary" &&
                React.createElement(
                  TableHead,
                  { style: { width: 80 } },
                  n("exp_field_qty"),
                ),
              React.createElement(
                TableHead,
                { style: { width: 140 } },
                n(e === "Salary" ? "exp_field_salary" : "exp_field_unitprice"),
              ),
              React.createElement(
                TableHead,
                { style: { width: 130 } },
                n("exp_field_total"),
              ),
              React.createElement(TableHead, { style: { width: 34 } }),
            ),
          ),
          React.createElement(
            TableBody,
            null,
            u.map((x, z) =>
              React.createElement(
                TableRow,
                { key: x.rid },
                React.createElement(
                  TableCell,
                  { style: { color: BRAND.inkSoft } },
                  z + 1,
                ),
                React.createElement(
                  TableCell,
                  null,
                  B
                    ? React.createElement(
                        "div",
                        { style: { display: "flex", gap: 6 } },
                        React.createElement(
                          UiSelect,
                          {
                            style: { ...inputStyle, padding: "6px 8px" },
                            value: x.itemName,
                            onChange: (_) => I(z, { itemName: _.target.value }),
                          },
                          B.map((_) =>
                            React.createElement(
                              "option",
                              { key: _, value: _ },
                              _,
                            ),
                          ),
                        ),
                        x.itemName === "Others" &&
                          React.createElement("input", {
                            style: { ...inputStyle, padding: "6px 8px" },
                            placeholder: n("exp_custom_placeholder"),
                            value: x.customName,
                            onChange: (_) =>
                              I(z, { customName: _.target.value }),
                          }),
                      )
                    : React.createElement("input", {
                        style: { ...inputStyle, padding: "6px 8px" },
                        placeholder: n(
                          e === "Salary"
                            ? "exp_salary_placeholder"
                            : "exp_custom_placeholder2",
                        ),
                        value: x.itemName,
                        onChange: (_) => I(z, { itemName: _.target.value }),
                      }),
                ),
                e !== "Salary" &&
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement("input", {
                      type: "number",
                      min: 0,
                      style: { ...inputStyle, padding: "6px 8px" },
                      value: x.qty,
                      onChange: (_) => I(z, { qty: _.target.value }),
                    }),
                  ),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(CurrencyInput, {
                    style: { ...inputStyle, padding: "6px 8px" },
                    value: x.unitPrice,
                    onChange: (_) => I(z, { unitPrice: _ }),
                  }),
                ),
                React.createElement(
                  TableCell,
                  { style: { fontWeight: 600 } },
                  fmtRp(i(x)),
                ),
                React.createElement(
                  TableCell,
                  null,
                  u.length > 1 &&
                    React.createElement(IconBtn, {
                      icon: Trash2,
                      tone: "danger",
                      title: n("delete"),
                      onClick: () => g(z),
                    }),
                ),
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          },
        },
        React.createElement(
          Button,
          { size: "sm", variant: "secondary", icon: Plus, onClick: s },
          n("exp_add_row"),
        ),
        React.createElement(
          "div",
          { style: { fontSize: 13, color: BRAND.inkSoft } },
          n("item_subtotal"),
          ": ",
          React.createElement("b", { style: { color: BRAND.ink } }, fmtRp(T)),
        ),
      ),
      React.createElement(
        "div",
        { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 } },
        React.createElement(Button, { variant: "secondary", icon: X, onClick: () => setMo(!1) }, n("cancel")),
        React.createElement(Button, { icon: Save, onClick: h, disabled: e === "Project" && !f }, n("exp_save_all")),
      ),
    ),
    React.createElement(
      Card,
      { style: { padding: 0, overflowX: "auto" } },
      S.length === 0
        ? React.createElement(EmptyState, {
            text: `${n("exp_empty_prefix")} ${e.toLowerCase()} ${n("exp_empty_suffix")}`,
          })
        : React.createElement(
            Table,
            null,
            React.createElement(
              TableHeader,
              null,
              React.createElement(
                TableRow,
                null,
                React.createElement(Th, {
                  label: n(e === "Salary" ? "exp_field_month" : "col_date"),
                  sortKey: "date",
                  sort: k,
                  setSort: C,
                }),
                e === "Project" &&
                  React.createElement(TableHead, null, n("exp_col_invoice")),
                React.createElement(
                  TableHead,
                  null,
                  n(e === "Salary" ? "exp_field_name" : "exp_field_item"),
                ),
                e !== "Salary" &&
                  React.createElement(Th, {
                    label: n("exp_field_qty"),
                    sortKey: "qty",
                    sort: k,
                    setSort: C,
                  }),
                React.createElement(Th, {
                  label: n(
                    e === "Salary" ? "exp_field_salary" : "exp_field_unitprice",
                  ),
                  sortKey: "unitPrice",
                  sort: k,
                  setSort: C,
                }),
                React.createElement(Th, {
                  label: n("exp_field_total"),
                  sortKey: "total",
                  sort: k,
                  setSort: C,
                }),
                React.createElement(TableHead, { style: { width: 40 } }),
              ),
            ),
            React.createElement(
              TableBody,
              null,
              S.map((x) =>
                React.createElement(
                  TableRow,
                  { key: x.id },
                  React.createElement(TableCell, null, fmtDate(x.date)),
                  e === "Project" && React.createElement(TableCell, null, x.invNo),
                  React.createElement(TableCell, null, x.itemName),
                  e !== "Salary" && React.createElement(TableCell, null, x.qty),
                  React.createElement(TableCell, null, fmtRp(x.unitPrice)),
                  React.createElement(
                    TableCell,
                    { style: { fontWeight: 600 } },
                    fmtRp(x.total),
                  ),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(IconBtn, {
                      icon: Trash2,
                      tone: "danger",
                      title: n("delete"),
                      onClick: () => w(x),
                    }),
                  ),
                ),
              ),
            ),
          ),
    ),
    P &&
      React.createElement(ConfirmModal, {
        message: n("exp_delete_confirm"),
        onConfirm: () => E(P.id),
        onCancel: () => w(null),
        t: n,
      }),
  );
}
function LedgerPage({ ctx: o }) {
  const { invoices: a, expenses: t, setInvoices: r, setExpenses: n, t: e } = o,
    [l, p] = useState(""),
    [d, f] = useState("All"),
    [v, u] = useState({ key: "date", dir: "asc" }),
    [y, c] = useState(null),
    m = useMemo(() => {
      const i = [];
      return (
        a.forEach((h) =>
          (h.payments || []).forEach((b) => {
            b.paid &&
              i.push({
                id: `${h.id}:${b.id}`,
                date: b.paidDate || h.date,
                invNo: h.invNumber,
                type: "Income",
                category: b.label,
                description: `Payment - ${b.label}`,
                amount: b.amount,
                invoiceId: h.id,
                paymentId: b.id,
              });
          }),
        ),
        i
      );
    }, [a]),
    k = useMemo(
      () =>
        t.map((i) => ({
          id: i.id,
          date: i.date,
          invNo:
            (i.invoiceId && a.find((h) => h.id === i.invoiceId)?.invNumber) ||
            "",
          type: "Expense",
          category: i.category,
          description: i.itemName,
          amount: lineTotal(i),
        })),
      [t, a],
    ),
    C = [...m, ...k].sort((i, h) =>
      i.date > h.date ? 1 : i.date < h.date ? -1 : 0,
    );
  let P = 0;
  const w = C.map(
    (i) => (
      (P += i.type === "Income" ? i.amount : -i.amount),
      { ...i, balance: P }
    ),
  );
  let B = d === "All" ? w : w.filter((i) => i.type === d);
  ((B = B.filter((i) =>
    JSON.stringify(i).toLowerCase().includes(l.toLowerCase()),
  )),
    (B = sortRows(B, v)));
  function I(i) {
    (i.type === "Income"
      ? r((h) =>
          h.map((b) =>
            b.id === i.invoiceId
              ? {
                  ...b,
                  payments: b.payments.map((S) =>
                    S.id === i.paymentId
                      ? { ...S, paid: !1, paidDate: null }
                      : S,
                  ),
                }
              : b,
          ),
        )
      : n((h) => h.filter((b) => b.id !== i.id)),
      c(null));
  }
  const s = m.reduce((i, h) => i + h.amount, 0),
    g = k.reduce((i, h) => i + h.amount, 0);
  return React.createElement(
    "div",
    null,
    React.createElement(PageHeader, {
      title: e("ledger_title"),
      subtitle: e("ledger_subtitle"),
    }),
    React.createElement("style", null, AN_CSS(BRAND)),
    React.createElement(
      "div",
      { className: "an-grid an-row3", style: { marginBottom: 24 } },
      (() => {
        const tx = window.__uiLang === "en" ? "transactions" : "transaksi";
        return [
          [e("ledger_total_income"), s, BRAND.green, `${m.length} ${tx}`],
          [e("ledger_total_expense"), g, BRAND.ink, `${k.length} ${tx}`],
          [e("ledger_balance"), s - g, s - g >= 0 ? BRAND.ink : BRAND.red, `${m.length + k.length} ${tx}`],
        ];
      })().map(([lb, val, col, foot]) =>
        React.createElement(
          "div",
          { className: "an-card", key: lb, style: { padding: "14px 16px" } },
          React.createElement("h3", null, lb),
          React.createElement("p", { className: "an-big", style: { color: col, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, fmtRp(val)),
          React.createElement("div", { className: "an-kpi-foot", style: { marginTop: 8 } }, React.createElement("span", null, foot)),
        ),
      ),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap", justifyContent: "flex-end" } },
      React.createElement("div", { style: { width: 240 } }, React.createElement(SearchBox, { value: l, onChange: p, placeholder: e("search_placeholder") })),
      React.createElement(
        "div",
        { style: { width: 180 } },
        React.createElement(
          UiSelect,
          { style: { ...inputStyle, height: 38 }, value: d, onChange: (i) => f(i.target.value) },
          React.createElement("option", { value: "All" }, e("ledger_all_types")),
          React.createElement("option", { value: "Income" }, e("ledger_income")),
          React.createElement("option", { value: "Expense" }, e("ledger_expense")),
        ),
      ),
    ),
    React.createElement(
      Card,
      { style: { padding: 0, overflowX: "auto" } },
      B.length === 0
        ? React.createElement(EmptyState, { text: e("ledger_empty") })
        : React.createElement(
            Table,
            { fit: !1 },
            React.createElement(
              TableHeader,
              null,
              React.createElement(
                TableRow,
                null,
                React.createElement(Th, {
                  label: e("col_date"),
                  sortKey: "date",
                  sort: v,
                  setSort: u,
                }),
                React.createElement(TableHead, null, e("ledger_col_invoice")),
                React.createElement(TableHead, null, e("ledger_col_type")),
                React.createElement(TableHead, null, e("ledger_col_category")),
                React.createElement(TableHead, null, e("ledger_col_desc")),
                React.createElement(TableHead, null, e("ledger_col_income")),
                React.createElement(TableHead, null, e("ledger_col_expense")),
                React.createElement(TableHead, null, e("ledger_col_balance")),
                React.createElement(TableHead, { style: { width: 40 } }),
              ),
            ),
            React.createElement(
              TableBody,
              null,
              B.map((i) =>
                React.createElement(
                  TableRow,
                  { key: i.id },
                  React.createElement(TableCell, null, fmtDate(i.date)),
                  React.createElement(TableCell, null, i.invNo || "-"),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(
                      Badge,
                      { tone: i.type === "Income" ? "green" : "red" },
                      i.type === "Income"
                        ? e("ledger_income")
                        : e("ledger_expense"),
                    ),
                  ),
                  React.createElement(TableCell, null, i.category),
                  React.createElement(TableCell, null, i.description),
                  React.createElement(
                    TableCell,
                    { style: { color: BRAND.green, fontWeight: 700 } },
                    i.type === "Income" ? fmtRp(i.amount) : "",
                  ),
                  React.createElement(
                    TableCell,
                    { style: { color: BRAND.red, fontWeight: 700 } },
                    i.type === "Expense" ? fmtRp(i.amount) : "",
                  ),
                  React.createElement(
                    TableCell,
                    { style: { fontWeight: 700 } },
                    fmtRp(i.balance),
                  ),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(IconBtn, {
                      icon: Trash2,
                      tone: "danger",
                      title: e("delete"),
                      onClick: () => c(i),
                    }),
                  ),
                ),
              ),
            ),
          ),
    ),
    y &&
      React.createElement(ConfirmModal, {
        message: e("ledger_delete_confirm"),
        onConfirm: () => I(y),
        onCancel: () => c(null),
        t: e,
      }),
  );
}
function marginTone(o) {
  return o >= 35 ? "green" : o >= 25 ? "amber" : "red";
}
function MarginPage({ ctx: o }) {
  const { invoices: a, expenses: t, t: r } = o,
    [n, e] = useState(""),
    [mf, setMf] = useState("all"),
    [l, p] = useState({ key: "profit", dir: "desc" }),
    d = a.map((m) => {
      const k = (m.payments || [])
          .filter((B) => B.paid)
          .reduce((B, I) => B + I.amount, 0),
        C = t
          .filter((B) => B.category === "Project" && B.invoiceId === m.id)
          .reduce((B, I) => B + lineTotal(I), 0),
        P = k - C,
        w = k > 0 ? (P / k) * 100 : 0;
      return {
        id: m.id,
        invNumber: m.invNumber,
        customer: m.customerSnap?.name,
        revenue: k,
        expense: C,
        profit: P,
        margin: w,
      };
    }),
    f = sortRows(
      d.filter((m) => (mf === "all" || marginTone(m.margin) === { good: "green", mid: "amber", low: "red" }[mf]) && JSON.stringify(m).toLowerCase().includes(n.toLowerCase())),
      l,
    ),
    v = d.reduce((m, k) => m + k.revenue, 0),
    u = d.reduce((m, k) => m + k.expense, 0),
    y = v - u,
    c = v > 0 ? (y / v) * 100 : 0;
  return React.createElement(
    "div",
    null,
    React.createElement(PageHeader, {
      title: r("margin_title"),
      subtitle: r("margin_subtitle"),
    }),
    React.createElement("style", null, AN_CSS(BRAND)),
    React.createElement(
      "div",
      { className: "an-grid an-row3", style: { marginBottom: 24 } },
      [
        [r("margin_total_revenue"), v, BRAND.ink, `${d.length} invoice`],
        [r("margin_total_expense"), u, BRAND.ink, `${d.length} invoice`],
        [r("margin_total_profit"), y, v > 0 ? BRAND[marginTone(c)] : y >= 0 ? BRAND.green : BRAND.red, v > 0 ? `Margin ${c.toFixed(1)}%` : "Margin —"],
      ].map(([lb, val, col, foot]) =>
        React.createElement(
          "div",
          { className: "an-card", key: lb, style: { padding: "14px 16px" } },
          React.createElement("h3", null, lb),
          React.createElement("p", { className: "an-big", style: { color: col, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, fmtRp(val)),
          React.createElement("div", { className: "an-kpi-foot", style: { marginTop: 8 } }, React.createElement("span", null, foot)),
        ),
      ),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap", justifyContent: "flex-end" } },
      React.createElement("div", { style: { width: 240 } }, React.createElement(SearchBox, { value: n, onChange: e, placeholder: r("search_placeholder") })),
      React.createElement(
        "div",
        { style: { width: 180 } },
        React.createElement(UiSelect, { style: { ...inputStyle, height: 38 }, value: mf, onChange: (x) => setMf(x.target.value) }, ["all", "good", "mid", "low"].map((k) => React.createElement("option", { key: k, value: k }, r("margin_f_" + k)))),
      ),
    ),
    React.createElement(
      Card,
      { style: { padding: 0, overflowX: "auto" } },
      f.length === 0
        ? React.createElement(EmptyState, { text: r("margin_empty") })
        : React.createElement(
            Table,
            { fit: !1 },
            React.createElement(
              TableHeader,
              null,
              React.createElement(
                TableRow,
                null,
                React.createElement(Th, {
                  label: r("inv_number"),
                  sortKey: "invNumber",
                  sort: l,
                  setSort: p,
                }),
                React.createElement(Th, {
                  label: r("quo_col_customer"),
                  sortKey: "customer",
                  sort: l,
                  setSort: p,
                }),
                React.createElement(Th, {
                  label: r("dash_revenue"),
                  sortKey: "revenue",
                  sort: l,
                  setSort: p,
                }),
                React.createElement(Th, {
                  label: r("margin_col_expense"),
                  sortKey: "expense",
                  sort: l,
                  setSort: p,
                }),
                React.createElement(Th, {
                  label: r("margin_col_profit"),
                  sortKey: "profit",
                  sort: l,
                  setSort: p,
                }),
                React.createElement(
                  TableHead,
                  { style: { minWidth: 130 } },
                  r("margin_col_margin"),
                ),
              ),
            ),
            React.createElement(
              TableBody,
              null,
              f.map((m) => {
                const k = marginTone(m.margin),
                  C = BRAND[k],
                  P = Math.max(0, Math.min(100, Math.abs(m.margin)));
                return React.createElement(
                  TableRow,
                  { key: m.id },
                  React.createElement(
                    TableCell,
                    { style: { fontWeight: 600 } },
                    m.invNumber,
                  ),
                  React.createElement(TableCell, null, m.customer),
                  React.createElement(
                    TableCell,
                    { style: { fontWeight: 600 } },
                    fmtRp(m.revenue),
                  ),
                  React.createElement(
                    TableCell,
                    { style: { fontWeight: 600 } },
                    fmtRp(m.expense),
                  ),
                  React.createElement(
                    TableCell,
                    {
                      style: {
                        fontWeight: 700,
                        color: m.profit >= 0 ? BRAND.green : BRAND.red,
                      },
                    },
                    fmtRp(m.profit),
                  ),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        },
                      },
                      React.createElement(
                        "div",
                        {
                          style: {
                            flex: 1,
                            height: 6,
                            borderRadius: 4,
                            background: BRAND.grayBg,
                            overflow: "hidden",
                            minWidth: 46,
                          },
                        },
                        React.createElement("div", {
                          style: {
                            width: `${P}%`,
                            height: "100%",
                            background: C,
                            borderRadius: 4,
                          },
                        }),
                      ),
                      React.createElement(
                        "span",
                        {
                          style: {
                            fontSize: 12,
                            fontWeight: 700,
                            color: C,
                            whiteSpace: "nowrap",
                          },
                        },
                        m.margin.toFixed(0),
                        "%",
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),
    ),
  );
}
function PackageModal({ pkg: o, all: all, onSave: r, onClose: n, t: e }) {
  const h = React.createElement,
    [name, setName] = useState(o.name || ""),
    [price, setPrice] = useState(o.price || 0),
    dup = all.some((x) => x.id !== o.id && x.name.trim().toLowerCase() === name.trim().toLowerCase()),
    ok = name.trim() && !dup;
  return h(
    Modal,
    { title: o.id ? e("pkg_modal_edit") : e("pkg_modal_add"), onClose: n, width: 480, icon: Package, subtitle: o.id ? e("pkg_modal_edit_sub") : e("pkg_modal_add_sub") },
    h(
      Field,
      { label: e("pkg_field_name"), full: !0 },
      h("input", { style: inputStyle, value: name, autoFocus: !0, onChange: (x) => setName(x.target.value), onKeyDown: (x) => x.key === "Enter" && ok && r({ ...o, name: name.trim(), price: Number(price) || 0 }) }),
      dup && h("div", { style: { fontSize: 12, color: BRAND.red, marginTop: 6 } }, e("pkg_dup")),
    ),
    h(
      Field,
      { label: e("pkg_field_price"), full: !0 },
      h(CurrencyInput, { style: inputStyle, value: price, onChange: (v) => setPrice(v) }),
      h("div", { className: "ui-help" }, e("pkg_price_hint")),
    ),
    h(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 } },
      h(Button, { icon: X, variant: "secondary", onClick: n }, e("cancel")),
      h(Button, { icon: Save, disabled: !ok, onClick: () => r({ ...o, name: name.trim(), price: Number(price) || 0 }) }, e("save")),
    ),
  );
}
function PackagesPage({ ctx: o }) {
  const { packages: pk, setPackages: setPk, can, showToast: toast, t: e } = o,
    h = React.createElement,
    [tab, setTab] = useState("catalog"),
    [q, setQ] = useState(""),
    [edit, setEdit] = useState(null),
    [del, setDel] = useState(null),
    canW = can("write:packages"),
    rows = [...(pk || [])].filter((x) => x.name.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
  function save(v) {
    const isNew = !v.id;
    setPk((arr) => (isNew ? [...arr, { ...v, id: uid() }] : arr.map((x) => (x.id === v.id ? v : x))));
    setEdit(null);
    toast && toast(e("pkg_saved"));
  }
  function remove(id) {
    setPk((arr) => arr.filter((x) => x.id !== id));
    setDel(null);
    toast && toast(e("pkg_deleted"));
  }
  return h(
    "div",
    null,
    h(PageHeader, {
      title: e("pkg_title"),
      subtitle: e("pkg_subtitle"),
      search: tab === "catalog" ? h(SearchBox, { value: q, onChange: setQ, placeholder: e("pkg_search") }) : null,
      action: tab === "catalog" && canW ? h(Button, { icon: Plus, onClick: () => setEdit({ name: "", price: 0 }) }, e("pkg_add")) : null,
    }),
    h(
      "div",
      { className: "ui-tabs", role: "tablist" },
      [["catalog", e("pkg_tab_catalog"), (pk || []).length], ["best", e("pkg_tab_best"), null]].map(([k, label, cnt]) =>
        h("button", { key: k, type: "button", role: "tab", "aria-selected": tab === k, className: "ui-tab" + (tab === k ? " on" : ""), onClick: () => setTab(k) }, label, cnt !== null && h("span", { className: "ui-tab-n" }, cnt)),
      ),
    ),
    tab === "best" && h(BestsellersPage, { ctx: o, embedded: !0 }),
    tab === "catalog" &&
      h(
        Card,
        { style: { padding: 0, overflowX: "auto" } },
        rows.length === 0
          ? h(EmptyState, { text: e("pkg_empty") })
          : h(
              Table,
              null,
              h(TableHeader, null, h(TableRow, null, h(TableHead, { style: { width: 56 } }, e("item_no")), h(TableHead, null, e("pkg_col_name")), h(TableHead, null, e("pkg_col_price")), canW && h(TableHead, { style: { width: 100 } }))),
              h(
                TableBody,
                null,
                rows.map((x, i) =>
                  h(
                    TableRow,
                    { key: x.id },
                    h(TableCell, { style: { color: BRAND.inkSoft } }, i + 1),
                    h(TableCell, { style: { fontWeight: 600 } }, x.name),
                    h(TableCell, { style: { whiteSpace: "nowrap" } }, Number(x.price) > 0 ? fmtRp(x.price) : "—"),
                    canW &&
                      h(
                        TableCell,
                        null,
                        h(
                          "div",
                          { style: { display: "flex", gap: 6, justifyContent: "flex-end" } },
                          h(IconBtn, { icon: Pencil, title: e("edit"), onClick: () => setEdit(x) }),
                          h(IconBtn, { icon: Trash2, title: e("delete"), tone: "danger", onClick: () => setDel(x) }),
                        ),
                      ),
                  ),
                ),
              ),
            ),
      ),
    edit && h(PackageModal, { pkg: edit, all: pk || [], onSave: save, onClose: () => setEdit(null), t: e }),
    del && h(ConfirmModal, { message: `${e("pkg_delete_prefix")} "${del.name}" ${e("pkg_delete_confirm")}`, onConfirm: () => remove(del.id), onCancel: () => setDel(null), t: e }),
  );
}
function BestsellersPage({ ctx: o, embedded: emb }) {
  const { invoices: a, t } = o,
    [r, n] = useState({ key: "revenue", dir: "desc" }),
    e = {};
  a.forEach((d) =>
    (d.items || []).forEach((f) => {
      const v = f.packageItem || "(Tanpa nama item)";
      ((e[v] = e[v] || { packageItem: v, qty: 0, orders: 0, revenue: 0 }),
        (e[v].qty += Number(f.qty) || 0),
        (e[v].orders += 1),
        (e[v].revenue += lineTotal(f)));
    }),
  );
  const l = sortRows(Object.values(e), r),
    p = Math.max(1, ...l.map((d) => d.revenue));
  return React.createElement(
    "div",
    null,
    !emb &&
      React.createElement(PageHeader, {
        title: t("best_title"),
        subtitle: t("best_subtitle"),
      }),
    React.createElement(
      Card,
      { style: { padding: 0, overflowX: "auto" } },
      l.length === 0
        ? React.createElement(EmptyState, { text: t("best_empty") })
        : React.createElement(
            Table,
            null,
            React.createElement(
              TableHeader,
              null,
              React.createElement(
                TableRow,
                null,
                React.createElement(TableHead, { style: { width: 40 } }, "#"),
                React.createElement(Th, {
                  label: t("best_col_package"),
                  sortKey: "packageItem",
                  sort: r,
                  setSort: n,
                }),
                React.createElement(Th, {
                  label: t("best_col_qty"),
                  sortKey: "qty",
                  sort: r,
                  setSort: n,
                }),
                React.createElement(Th, {
                  label: t("best_col_orders"),
                  sortKey: "orders",
                  sort: r,
                  setSort: n,
                }),
                React.createElement(Th, {
                  label: t("best_col_revenue"),
                  sortKey: "revenue",
                  sort: r,
                  setSort: n,
                }),
                React.createElement(
                  TableHead,
                  { style: { minWidth: 140 } },
                  t("best_col_share"),
                ),
              ),
            ),
            React.createElement(
              TableBody,
              null,
              l.map((d, f) =>
                React.createElement(
                  TableRow,
                  { key: d.packageItem },
                  React.createElement(
                    TableCell,
                    { style: { color: BRAND.inkSoft } },
                    f + 1,
                  ),
                  React.createElement(
                    TableCell,
                    { style: { fontWeight: 600 } },
                    d.packageItem,
                  ),
                  React.createElement(TableCell, null, d.qty),
                  React.createElement(TableCell, null, d.orders),
                  React.createElement(
                    TableCell,
                    { style: { fontWeight: 700 } },
                    fmtRp(d.revenue),
                  ),
                  React.createElement(
                    TableCell,
                    null,
                    React.createElement(
                      "div",
                      {
                        style: {
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          background: BRAND.grayBg,
                          overflow: "hidden",
                          minWidth: 90,
                        },
                      },
                      React.createElement("div", {
                        style: {
                          width: `${(d.revenue / p) * 100}%`,
                          height: "100%",
                          background: BRAND.blue,
                          borderRadius: 4,
                        },
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
    ),
  );
}
function WatermarkPattern() {
  const t = [];
  for (let r = 0; r < 7; r++) for (let n = 0; n < 5; n++) t.push({ r, c: n });
  return React.createElement(
    "div",
    {
      style: {
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      },
    },
    t.map(({ r, c: n }) =>
      React.createElement("img", {
        key: `${r}-${n}`,
        src: LOGO_DATA_URI,
        alt: "",
        "aria-hidden": "true",
        style: {
          position: "absolute",
          left: `${((n + 0.5) / 5) * 100}%`,
          top: `${((r + 0.5) / 7) * 100}%`,
          width: 95,
          height: "auto",
          transform: "translate(-50%, -50%) rotate(-25deg)",
          opacity: 0.045,
        },
      }),
    ),
  );
}
function PrintView({ target: o, onClose: a }) {
  const { type: t, data: r, autoPrint: n } = o,
    e = docSubtotal(r.items),
    l = e * 0.3,
    p = t === "invoice";
  return (
    useEffect(() => {
      if (n) {
        const d = setTimeout(() => window.print(), 400);
        return () => clearTimeout(d);
      }
    }, [n]),
    React.createElement(
      "div",
      {
        className: "print-light-scope",
        style: {
          background: "#EEF0F2",
          minHeight: "100%",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      },
      React.createElement(
        "style",
        null,
        `
        
        /* Print/PDF output always stays light, regardless of the app's dark
           mode setting -- business documents should stay ink-friendly and
           professional-looking no matter which theme is active on screen. */
        .print-light-scope {
          --c-onBlue: #FFFFFF;
          --c-bg: #FFFFFF; --c-surface: #FFFFFF; --c-ink: #1C1F22; --c-inkSoft: #6E7580;
          --c-blue: #1E3A5F; --c-blueDeep: #142942; --c-blueFaint: #EEF3F8; --c-blueTint: #DCE6F0;
          --c-line: #E5E8EC; --c-green: #1F7A4D; --c-greenBg: #E5F3EA; --c-amber: #8A5F1E;
          --c-amberBg: #FAF1DF; --c-red: #A32E2E; --c-redBg: #FBE9E9; --c-redBorder: #F0D0D0;
          --c-gray: #6B707A; --c-grayBg: #F3F4F6; --c-expenseBar: #D2D6DC;
          --c-overlay: rgba(15,20,26,0.45); --c-shadow: rgba(15,20,26,0.08);
          color-scheme: light;
        }
        @media print { .no-print { display: none !important; } .print-sheet { box-shadow: none !important; margin: 0 !important; } body { background: #fff !important; } }
        @media (max-width: 480px) {
          .items-table th, .items-table td { padding-left: 2px !important; padding-right: 2px !important; }
          .items-table .price-cell { font-size: 9.3px !important; }
          .items-table .item-cell .pkg-name { font-size: 11px !important; }
        }
        @media (max-width: 360px) {
          .items-table th, .items-table td { padding-left: 1px !important; padding-right: 1px !important; }
          .items-table .price-cell { font-size: 7.6px !important; }
          .items-table th.price-cell { font-size: 7.3px !important; letter-spacing: 0 !important; }
        }
      `,
      ),
      React.createElement(
        "div",
        {
          className: "no-print",
          style: {
            width: "100%",
            maxWidth: 760,
            marginBottom: 14,
            display: "flex",
            justifyContent: "space-between",
          },
        },
        React.createElement(
          Button,
          { variant: "ghost", onClick: a },
          "\u2190 Kembali",
        ),
        React.createElement(
          Button,
          { icon: Printer, onClick: () => window.print() },
          "Print / Save as PDF",
        ),
      ),
      React.createElement(
        "div",
        {
          className: "print-sheet",
          style: {
            width: "100%",
            maxWidth: 760,
            background: "#fff",
            borderRadius: 4,
            boxShadow:
              "0 12px 32px -12px rgba(9,9,11,0.16), 0 0 0 1px var(--c-line)",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
            color: BRAND.ink,
            position: "relative",
            overflow: "hidden",
          },
        },
        React.createElement(WatermarkPattern, null),
        React.createElement(
          "div",
          {
            style: {
              padding: "36px clamp(18px, 6vw, 52px) 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: `1px solid ${BRAND.line}`,
            },
          },
          React.createElement(
            "div",
            null,
            React.createElement("img", {
              src: LOGO_DATA_URI,
              alt: "Sum\xE9riapoto",
              style: { height: 30, width: "auto", display: "block" },
            }),
            React.createElement(
              "div",
              {
                style: {
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  color: BRAND.inkSoft,
                  textTransform: "uppercase",
                  marginTop: 6,
                },
              },
              "Photography & Videography",
            ),
          ),
          React.createElement(
            "div",
            { style: { textAlign: "right" } },
            React.createElement(
              "div",
              {
                style: {
                  fontSize: 17,
                  fontWeight: 600,
                  color: BRAND.ink,
                  letterSpacing: "0.06em",
                },
              },
              p ? "INVOICE" : "QUOTATION",
            ),
            React.createElement(
              "div",
              { style: { fontSize: 12.5, color: BRAND.inkSoft, marginTop: 5 } },
              p ? r.invNumber : r.quoNumber,
            ),
            React.createElement(
              "div",
              { style: { fontSize: 12, color: BRAND.inkSoft } },
              fmtDate(r.date),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              padding: "26px clamp(18px, 6vw, 52px) 0",
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
            },
          },
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              {
                style: {
                  fontSize: 10.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: BRAND.inkSoft,
                  marginBottom: 8,
                },
              },
              "Bill to",
            ),
            React.createElement(
              "div",
              { style: { fontSize: 14, fontWeight: 600 } },
              r.customerSnap?.name,
            ),
            React.createElement(
              "div",
              {
                style: {
                  fontSize: 12.5,
                  color: BRAND.inkSoft,
                  lineHeight: 1.8,
                  marginTop: 2,
                },
              },
              r.customerSnap?.address,
              React.createElement("br", null),
              r.customerSnap?.phone,
              React.createElement("br", null),
              r.customerSnap?.email,
            ),
          ),
          p &&
            React.createElement(
              "div",
              { style: { textAlign: "right" } },
              React.createElement(
                "div",
                {
                  style: {
                    fontSize: 10.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: BRAND.inkSoft,
                    marginBottom: 8,
                  },
                },
                "Status",
              ),
              React.createElement(
                "div",
                {
                  style: { fontSize: 13.5, fontWeight: 700, color: BRAND.blue },
                },
                currentStatus(r),
              ),
            ),
        ),
        React.createElement(
          "div",
          { style: { padding: "28px clamp(18px, 6vw, 52px) 0" } },
          React.createElement(
            "table",
            {
              className: "items-table",
              style: { width: "100%", fontSize: 12.5, tableLayout: "fixed" },
            },
            React.createElement(
              "colgroup",
              null,
              React.createElement("col", { style: { width: "4%" } }),
              React.createElement("col", { style: { width: "29%" } }),
              React.createElement("col", { style: { width: "6%" } }),
              React.createElement("col", { style: { width: "20%" } }),
              React.createElement("col", { style: { width: "17%" } }),
              React.createElement("col", { style: { width: "24%" } }),
            ),
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                { style: { borderBottom: `1px solid ${BRAND.line}` } },
                React.createElement(
                  "th",
                  {
                    style: {
                      textAlign: "left",
                      padding: "8px 4px",
                      fontSize: 9.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: BRAND.inkSoft,
                      fontWeight: 600,
                    },
                  },
                  "No.",
                ),
                React.createElement(
                  "th",
                  {
                    style: {
                      textAlign: "left",
                      padding: "8px 4px",
                      fontSize: 9.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: BRAND.inkSoft,
                      fontWeight: 600,
                    },
                  },
                  "Item",
                ),
                React.createElement(
                  "th",
                  {
                    style: {
                      textAlign: "center",
                      padding: "8px 4px",
                      fontSize: 9.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: BRAND.inkSoft,
                      fontWeight: 600,
                    },
                  },
                  "Qty",
                ),
                React.createElement(
                  "th",
                  {
                    className: "price-cell",
                    style: {
                      textAlign: "right",
                      padding: "8px 4px",
                      fontSize: 9.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: BRAND.inkSoft,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    },
                  },
                  "Unit price",
                ),
                React.createElement(
                  "th",
                  {
                    className: "price-cell",
                    style: {
                      textAlign: "right",
                      padding: "8px 4px",
                      fontSize: 9.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: BRAND.inkSoft,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    },
                  },
                  "Discount",
                ),
                React.createElement(
                  "th",
                  {
                    className: "price-cell",
                    style: {
                      textAlign: "right",
                      padding: "8px 4px",
                      fontSize: 9.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: BRAND.inkSoft,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    },
                  },
                  "Subtotal",
                ),
              ),
            ),
            React.createElement(
              "tbody",
              null,
              (r.items || []).map((d, f) =>
                React.createElement(
                  "tr",
                  {
                    key: d.id,
                    style: { borderBottom: `1px solid ${BRAND.line}` },
                  },
                  React.createElement(
                    "td",
                    {
                      style: {
                        padding: "9px 4px",
                        color: BRAND.inkSoft,
                        fontSize: 11.5,
                        verticalAlign: "top",
                      },
                    },
                    f + 1,
                  ),
                  React.createElement(
                    "td",
                    {
                      className: "item-cell",
                      style: {
                        padding: "9px 4px",
                        wordBreak: "break-word",
                        verticalAlign: "top",
                      },
                    },
                    React.createElement(
                      "div",
                      {
                        className: "pkg-name",
                        style: {
                          fontSize: 12,
                          fontWeight: 600,
                          color: BRAND.ink,
                        },
                      },
                      d.packageItem,
                    ),
                    d.description &&
                      React.createElement(
                        "div",
                        {
                          style: {
                            fontSize: 10.5,
                            color: BRAND.inkSoft,
                            marginTop: 2,
                            lineHeight: 1.5,
                          },
                        },
                        splitDescLines(d.description).map((b, S) =>
                          React.createElement("div", { key: S }, "• ", b),
                        ),
                      ),
                    d.eventDate &&
                      React.createElement(
                        "div",
                        {
                          style: {
                            fontSize: 10,
                            color: BRAND.inkSoft,
                            marginTop: 2,
                          },
                        },
                        fmtDate(d.eventDate),
                      ),
                  ),
                  React.createElement(
                    "td",
                    {
                      style: {
                        padding: "9px 4px",
                        textAlign: "center",
                        fontSize: 11.5,
                        verticalAlign: "top",
                      },
                    },
                    d.qty,
                  ),
                  React.createElement(
                    "td",
                    {
                      className: "price-cell",
                      style: {
                        padding: "9px 4px",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        fontSize: 11,
                        verticalAlign: "top",
                      },
                    },
                    fmtRp(d.unitPrice),
                  ),
                  React.createElement(
                    "td",
                    {
                      className: "price-cell",
                      style: {
                        padding: "9px 4px",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        fontSize: 11,
                        verticalAlign: "top",
                      },
                    },
                    fmtRp(d.discount),
                  ),
                  React.createElement(
                    "td",
                    {
                      className: "price-cell",
                      style: {
                        padding: "9px 4px",
                        textAlign: "right",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        fontSize: 11,
                        verticalAlign: "top",
                      },
                    },
                    fmtRp(lineTotal(d)),
                  ),
                ),
              ),
            ),
          ),
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 18,
              },
            },
            React.createElement(
              "div",
              { style: { width: 260 } },
              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    fontSize: 13,
                  },
                },
                React.createElement(
                  "span",
                  { style: { color: BRAND.inkSoft } },
                  "Subtotal",
                ),
                React.createElement(
                  "span",
                  { style: { fontWeight: 700 } },
                  fmtRp(e),
                ),
              ),
              !p &&
                React.createElement(
                  "div",
                  {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      fontSize: 13,
                      borderTop: `1px solid ${BRAND.line}`,
                    },
                  },
                  React.createElement(
                    "span",
                    { style: { color: BRAND.inkSoft } },
                    "Down payment (30%)",
                  ),
                  React.createElement(
                    "span",
                    { style: { fontWeight: 700, color: BRAND.blue } },
                    fmtRp(l),
                  ),
                ),
            ),
          ),
          p &&
            React.createElement(
              "div",
              { style: { marginTop: 26 } },
              React.createElement(
                "div",
                {
                  style: {
                    fontSize: 10.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: BRAND.inkSoft,
                    marginBottom: 10,
                  },
                },
                "Payment plan \u2014 ",
                r.paymentPlan,
              ),
              React.createElement(
                "table",
                { style: { width: "100%", fontSize: 12.5 } },
                React.createElement(
                  "tbody",
                  null,
                  (r.payments || []).map((d) =>
                    React.createElement(
                      "tr",
                      {
                        key: d.id,
                        style: { borderBottom: `1px solid ${BRAND.line}` },
                      },
                      React.createElement(
                        "td",
                        { style: { padding: "7px 6px" } },
                        d.label,
                      ),
                      React.createElement(
                        "td",
                        { style: { padding: "7px 6px", textAlign: "right" } },
                        Number(d.percent).toFixed(1),
                        "%",
                      ),
                      React.createElement(
                        "td",
                        {
                          style: {
                            padding: "7px 6px",
                            textAlign: "right",
                            fontWeight: 600,
                          },
                        },
                        fmtRp(d.amount),
                      ),
                      React.createElement(
                        "td",
                        { style: { padding: "7px 6px", textAlign: "right" } },
                        React.createElement(
                          "span",
                          {
                            style: {
                              fontSize: 10.5,
                              fontWeight: 700,
                              color: d.paid ? BRAND.green : BRAND.amber,
                            },
                          },
                          d.paid ? "LUNAS" : "PENDING",
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ),
        React.createElement(
          "div",
          {
            style: {
              padding: "28px clamp(18px, 6vw, 52px)",
              marginTop: 14,
              borderTop: `1px solid ${BRAND.line}`,
            },
          },
          React.createElement(
            "div",
            {
              style: {
                fontSize: 10.5,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: BRAND.inkSoft,
                marginBottom: 8,
              },
            },
            "Payment information",
          ),
          React.createElement(
            "div",
            { style: { fontSize: 12.5 } },
            "All payments are only through:",
          ),
          React.createElement(
            "div",
            {
              style: {
                fontSize: 14,
                fontWeight: 700,
                marginTop: 4,
                color: BRAND.blue,
              },
            },
            "BCA \u2014 8761141988",
          ),
          React.createElement(
            "div",
            { style: { fontSize: 12.5, color: BRAND.inkSoft } },
            "Mochamad Annas Afan",
          ),
          React.createElement(
            "div",
            { style: { fontSize: 12.5, marginTop: 20, color: BRAND.inkSoft } },
            "Thank you for your trust and cooperation. Cheers.",
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              padding: "16px clamp(18px, 6vw, 52px) 30px",
              borderTop: `1px solid ${BRAND.line}`,
              fontSize: 10.5,
              color: BRAND.inkSoft,
              lineHeight: 1.7,
              textAlign: "center",
            },
          },
          "Perumahan Taman Raya Citayam, Blok E4 No.02, Kecamatan Bojonggede, Bogor, Jawa Barat",
          React.createElement("br", null),
          "Phone 0813 4000 4073 \xB7 Instagram @Sumeriapoto",
        ),
      ),
    )
  );
}
function addWatermarks(o) {
  try {
    const a = o.internal.getNumberOfPages(),
      t = o.internal.pageSize.getWidth(),
      r = o.internal.pageSize.getHeight(),
      n = 5,
      e = 7,
      l = 95,
      p = l / LOGO_ASPECT;
    for (let d = 1; d <= a; d++) {
      (o.setPage(d),
        o.saveGraphicsState(),
        o.setGState(new o.GState({ opacity: 0.05 })));
      for (let f = 0; f < e; f++)
        for (let v = 0; v < n; v++) {
          const u = ((v + 0.5) / n) * t,
            y = ((f + 0.5) / e) * r;
          o.addImage(
            LOGO_DATA_URI,
            "PNG",
            u - l / 2,
            y - p / 2,
            l,
            p,
            void 0,
            "FAST",
            -25,
          );
        }
      o.restoreGraphicsState();
    }
  } catch (a) {
    console.error("watermark failed", a);
  }
}
function addPaidFullStamp(o) {
  try {
    const w = o.internal.pageSize.getWidth();
    (o.setPage(1),
      o.saveGraphicsState(),
      o.setGState(new o.GState({ opacity: 0.85 })));
    const cx = w - 98,
      cy = 120,
      rOuter = 46,
      rInner = 38;
    (o.setDrawColor(31, 122, 77),
      o.setLineWidth(2.4),
      o.circle(cx, cy, rOuter, "S"),
      o.setLineWidth(0.9),
      o.circle(cx, cy, rInner, "S"),
      o.setFont("helvetica", "bold"),
      o.setFontSize(13),
      o.setTextColor(31, 122, 77),
      o.text("PAID", cx, cy - 4, { align: "center", angle: -14 }),
      o.text("FULL", cx, cy + 12, { align: "center", angle: -14 }),
      o.setFontSize(6),
      o.text("SUMERIAPOTO", cx, cy + 25, { align: "center", angle: -14 }),
      o.restoreGraphicsState());
  } catch (a) {
    console.error("paid stamp failed", a);
  }
}
function buildInvoicePdf(o) {
  if (typeof window.jspdf > "u") throw new Error("jsPDF not loaded");
  const a = window.jspdf.jsPDF,
    t = new a({ unit: "pt", format: "a4" }),
    r = t.internal.pageSize.getWidth(),
    ph = t.internal.pageSize.getHeight(),
    n = 48;
  let e = 64;
  const l = 210,
    p = l / LOGO_ASPECT;
  try {
    t.addImage(LOGO_DATA_URI, "PNG", n, e - p, l, p);
  } catch (u) {
    console.error("logo embed failed", u);
  }
  const logoBottom = e;
  (t.setFont("helvetica", "normal"),
    t.setFontSize(8.5),
    t.setTextColor(120, 120, 120),
    t.text("PHOTOGRAPHY & VIDEOGRAPHY", n, logoBottom + 13),
    t.setFont("helvetica", "bold"),
    t.setFontSize(17),
    t.setTextColor(20, 20, 20),
    t.text("INVOICE", r - n, e - p + 16, { align: "right" }),
    t.setFont("helvetica", "normal"),
    t.setFontSize(10),
    t.setTextColor(100, 100, 100),
    t.text(o.invNumber || "", r - n, e - p + 33, { align: "right" }),
    t.text(fmtDatePdf(o.date), r - n, e - p + 47, { align: "right" }),
    (e = logoBottom + 13 + 22),
    t.setDrawColor(228, 231, 235),
    t.line(n, e, r - n, e),
    (e += 26),
    t.setFont("helvetica", "bold"),
    t.setFontSize(9.5),
    t.setTextColor(20, 20, 20),
    t.text("BILL TO", n, e),
    t.setTextColor(30, 58, 95),
    t.text("Status: " + currentStatus(o), r - n, e, { align: "right" }),
    (e += 16),
    t.setFont("helvetica", "normal"),
    t.setFontSize(10),
    t.setTextColor(30, 30, 30),
    t.text(String((o.customerSnap && o.customerSnap.name) || ""), n, e),
    (e += 14),
    t.setTextColor(110, 110, 110),
    t.setFontSize(9),
    t.text(String((o.customerSnap && o.customerSnap.address) || ""), n, e),
    (e += 13),
    t.text(String((o.customerSnap && o.customerSnap.phone) || ""), n, e),
    (e += 13),
    t.text(String((o.customerSnap && o.customerSnap.email) || ""), n, e),
    (e += 28));
  const d = [
    { label: "No", w: 22, align: "left" },
    { label: "Event Date", w: 62, align: "left" },
    { label: "Item", w: 108, align: "left" },
    { label: "Qty", w: 24, align: "center" },
    { label: "Price", w: 95, align: "right" },
    { label: "Disc", w: 78, align: "right" },
    { label: "Subtotal", w: 109, align: "right" },
  ];
  function f(u, y, c) {
    let m = n;
    (t.setFont("helvetica", y ? "bold" : "normal"),
      t.setFontSize(y ? 8.5 : 9),
      t.setTextColor(c[0], c[1], c[2]),
      d.forEach((k, C) => {
        const P = k.align === "right" ? m + k.w - 4 : m + 4,
          w = { align: k.align === "right" ? "right" : "left" };
        (C === 2 && (w.maxWidth = k.w - 6),
          t.text(String(u[C]), P, e, w),
          (m += k.w));
      }));
  }
  (t.setFillColor(244, 246, 248),
    t.rect(n, e - 12, r - n * 2, 18, "F"),
    f(
      d.map((u) => u.label),
      !0,
      [90, 90, 90],
    ),
    (e += 16),
    (o.items || []).forEach((u, y) => {
      (e > 740 && (t.addPage(), (e = 56)),
        f(
          [
            y + 1,
            fmtDatePdf(u.eventDate),
            "",
            u.qty,
            fmtRp(u.unitPrice),
            fmtRp(u.discount),
            fmtRp(lineTotal(u)),
          ],
          !1,
          [30, 30, 30],
        ));
      const ix = n + 88,
        iw = 102;
      (t.setFont("helvetica", "normal"),
        t.setFontSize(9),
        t.setTextColor(30, 30, 30));
      const nameLines = t.splitTextToSize(u.packageItem || "", iw);
      let iy = e;
      nameLines.forEach((ln, idx) => {
        (t.text(ln, ix, iy), idx < nameLines.length - 1 && (iy += 11));
      });
      let dy = iy + 10;
      const descArr = splitDescLines(u.description);
      if (descArr.length) {
        (t.setFont("helvetica", "normal"),
          t.setFontSize(7.5),
          t.setTextColor(122, 122, 122));
        descArr.forEach((dl) => {
          t.splitTextToSize("• " + dl, iw).forEach((wl) => {
            (e > 730 && (t.addPage(), (e = 56), (dy = e + 10)),
              t.text(wl, ix, dy),
              (dy += 9));
          });
        });
      }
      const sepY = Math.max(e + 6, dy - 3);
      (t.setDrawColor(232, 232, 232),
        t.line(n, sepY, r - n, sepY),
        (e = Math.max(Math.max(e + 20, iy + 16), dy + 6)));
    }),
    (e += 12));
  const v = docSubtotal(o.items);
  (t.setFont("helvetica", "bold"),
    t.setFontSize(11),
    t.setTextColor(20, 20, 20),
    t.text("Subtotal: " + fmtRp(v), r - n, e, { align: "right" }),
    (e += 28),
    e > 700 && (t.addPage(), (e = 56)),
    t.setFont("helvetica", "bold"),
    t.setFontSize(9),
    t.setTextColor(90, 90, 90),
    t.text("PAYMENT PLAN \u2014 " + (o.paymentPlan || ""), n, e),
    (e += 16),
    (o.payments || []).forEach((u) => {
      (e > 740 && (t.addPage(), (e = 56)),
        t.setFont("helvetica", "normal"),
        t.setFontSize(9.5),
        t.setTextColor(30, 30, 30),
        t.text(u.label, n, e),
        t.text(Number(u.percent).toFixed(1) + "%", n + 170, e),
        t.text(fmtRp(u.amount), n + 240, e),
        u.paid
          ? (t.setFont("helvetica", "bold"),
            t.setFontSize(9.5),
            (() => {
              const pw = t.getTextWidth("PAID") + 16,
                ph2 = 15,
                px = r - n - pw,
                py = e - 11;
              (t.setFillColor(209, 237, 222),
                t.roundedRect(px, py, pw, ph2, 7, 7, "F"),
                t.setTextColor(13, 92, 58),
                t.text("PAID", r - n - 8, e, { align: "right" }));
            })())
          : (t.setFont("helvetica", "bold"),
            t.setFontSize(9),
            t.setTextColor(165, 165, 165),
            t.text("PENDING", r - n, e, { align: "right" })),
        (e += 16));
    }),
    (e += 18),
    e > 700 && (t.addPage(), (e = 56)),
    t.setFont("helvetica", "bold"),
    t.setFontSize(9),
    t.setTextColor(90, 90, 90),
    t.text("PAYMENT INFORMATION", n, e),
    (e += 14),
    t.setFont("helvetica", "normal"),
    t.setFontSize(9.5),
    t.setTextColor(30, 30, 30),
    t.text("All payments are only through:", n, e),
    (e += 12));
  const bx = n,
    by = e,
    bw = 168,
    bh = 32;
  (t.setFillColor(230, 237, 246),
    t.roundedRect(bx, by, bw, bh, 6, 6, "F"),
    t.setDrawColor(150, 176, 210),
    t.setLineWidth(1.5),
    t.roundedRect(bx, by, bw, bh, 6, 6, "S"),
    t.setFillColor(30, 58, 95),
    t.roundedRect(bx, by + 5, 4, bh - 10, 2, 2, "F"),
    t.setFont("helvetica", "bold"),
    t.setFontSize(12),
    t.setTextColor(30, 58, 95),
    t.text("BCA — 8761141988", bx + 13, by + 14),
    t.setFont("helvetica", "bold"),
    t.setFontSize(7.5),
    t.setTextColor(100, 100, 100),
    t.text("a.n. Mochamad Annas Afan", bx + 13, by + 25),
    (e = by + bh + 20));
  const cx = r / 2,
    fy = ph - 38;
  (t.setFontSize(8),
    t.setTextColor(140, 140, 140),
    t.text(
      "Perumahan Taman Raya Citayam, Blok E4 No.02, Kecamatan Bojonggede, Bogor, Jawa Barat",
      cx,
      fy,
      { align: "center" },
    ),
    t.text("Phone 0813 4000 4073   |   Instagram @Sumeriapoto", cx, fy + 13, {
      align: "center",
    }),
    isFullyPaid(o) && addPaidFullStamp(t),
    addWatermarks(t));
  return t;
}
function downloadInvoicePdf(o) {
  const a = buildInvoicePdf(o),
    r =
      "Invoice-" + (o.invNumber || "Sumeriapoto").split("/").join("-") + ".pdf";
  return (a.save(r), r);
}
function sendInvoiceWhatsApp(o) {
  try {
    downloadInvoicePdf(o);
  } catch (n) {
    (console.error("PDF generation failed", n),
      alert(
        "PDF belum bisa dibuat karena butuh koneksi internet aktif. WhatsApp tetap akan dibuka, tapi lampirkan invoice secara manual ya.",
      ));
  }
  const a = (o.customerSnap && o.customerSnap.name) || "",
    t = waPhone(o.customerSnap && o.customerSnap.phone),
    r =
      "#" +
      o.invNumber +
      `
Halo Kak ` +
      a +
      `, Terima kasih ya, pembayarannya sudah kami terima. Terlampir kami kirimkan invoice sebagai dokumen atas pembayaran yang sudah dilakukan \u{1F60A}

Cheers,
Tim Sumeriapoto`;
  window.open(
    "https://wa.me/" + t + "?text=" + encodeURIComponent(r),
    "_blank",
  );
}
function buildQuotationPdf(o) {
  if (typeof window.jspdf > "u") throw new Error("jsPDF not loaded");
  const a = window.jspdf.jsPDF,
    t = new a({ unit: "pt", format: "a4" }),
    r = t.internal.pageSize.getWidth(),
    ph = t.internal.pageSize.getHeight(),
    n = 48;
  let e = 64;
  const l = 210,
    p = l / LOGO_ASPECT;
  try {
    t.addImage(LOGO_DATA_URI, "PNG", n, e - p, l, p);
  } catch (y) {
    console.error("logo embed failed", y);
  }
  const logoBottom = e;
  (t.setFont("helvetica", "normal"),
    t.setFontSize(8.5),
    t.setTextColor(120, 120, 120),
    t.text("PHOTOGRAPHY & VIDEOGRAPHY", n, logoBottom + 13),
    t.setFont("helvetica", "bold"),
    t.setFontSize(17),
    t.setTextColor(20, 20, 20),
    t.text("QUOTATION", r - n, e - p + 16, { align: "right" }),
    t.setFont("helvetica", "normal"),
    t.setFontSize(10),
    t.setTextColor(100, 100, 100),
    t.text(o.quoNumber || "", r - n, e - p + 33, { align: "right" }),
    t.text(fmtDatePdf(o.date), r - n, e - p + 47, { align: "right" }),
    (e = logoBottom + 13 + 22),
    t.setDrawColor(228, 231, 235),
    t.line(n, e, r - n, e),
    (e += 26),
    t.setFont("helvetica", "bold"),
    t.setFontSize(9.5),
    t.setTextColor(20, 20, 20),
    t.text("BILL TO", n, e),
    (e += 16),
    t.setFont("helvetica", "normal"),
    t.setFontSize(10),
    t.setTextColor(30, 30, 30),
    t.text(String((o.customerSnap && o.customerSnap.name) || ""), n, e),
    (e += 14),
    t.setTextColor(110, 110, 110),
    t.setFontSize(9),
    t.text(String((o.customerSnap && o.customerSnap.address) || ""), n, e),
    (e += 13),
    t.text(String((o.customerSnap && o.customerSnap.phone) || ""), n, e),
    (e += 13),
    t.text(String((o.customerSnap && o.customerSnap.email) || ""), n, e),
    (e += 28));
  const d = [
    { label: "No", w: 22, align: "left" },
    { label: "Event Date", w: 62, align: "left" },
    { label: "Item", w: 108, align: "left" },
    { label: "Qty", w: 24, align: "center" },
    { label: "Price", w: 95, align: "right" },
    { label: "Disc", w: 78, align: "right" },
    { label: "Subtotal", w: 109, align: "right" },
  ];
  function f(y, c, m) {
    let k = n;
    (t.setFont("helvetica", c ? "bold" : "normal"),
      t.setFontSize(c ? 8.5 : 9),
      t.setTextColor(m[0], m[1], m[2]),
      d.forEach((C, P) => {
        const w = C.align === "right" ? k + C.w - 4 : k + 4,
          B = { align: C.align === "right" ? "right" : "left" };
        (P === 2 && (B.maxWidth = C.w - 6),
          t.text(String(y[P]), w, e, B),
          (k += C.w));
      }));
  }
  (t.setFillColor(244, 246, 248),
    t.rect(n, e - 12, r - n * 2, 18, "F"),
    f(
      d.map((y) => y.label),
      !0,
      [90, 90, 90],
    ),
    (e += 16),
    (o.items || []).forEach((y, c) => {
      (e > 740 && (t.addPage(), (e = 56)),
        f(
          [
            c + 1,
            fmtDatePdf(y.eventDate),
            "",
            y.qty,
            fmtRp(y.unitPrice),
            fmtRp(y.discount),
            fmtRp(lineTotal(y)),
          ],
          !1,
          [30, 30, 30],
        ));
      const ix = n + 88,
        iw = 102;
      (t.setFont("helvetica", "normal"),
        t.setFontSize(9),
        t.setTextColor(30, 30, 30));
      const nameLines = t.splitTextToSize(y.packageItem || "", iw);
      let iy = e;
      nameLines.forEach((ln, idx) => {
        (t.text(ln, ix, iy), idx < nameLines.length - 1 && (iy += 11));
      });
      let dy = iy + 10;
      const descArr = splitDescLines(y.description);
      if (descArr.length) {
        (t.setFont("helvetica", "normal"),
          t.setFontSize(7.5),
          t.setTextColor(122, 122, 122));
        descArr.forEach((dl) => {
          t.splitTextToSize("• " + dl, iw).forEach((wl) => {
            (e > 730 && (t.addPage(), (e = 56), (dy = e + 10)),
              t.text(wl, ix, dy),
              (dy += 9));
          });
        });
      }
      const sepY = Math.max(e + 6, dy - 3);
      (t.setDrawColor(232, 232, 232),
        t.line(n, sepY, r - n, sepY),
        (e = Math.max(Math.max(e + 20, iy + 16), dy + 6)));
    }),
    (e += 12));
  const v = docSubtotal(o.items),
    u = v * 0.3;
  (t.setFont("helvetica", "bold"),
    t.setFontSize(11),
    t.setTextColor(20, 20, 20),
    t.text("Subtotal: " + fmtRp(v), r - n, e, { align: "right" }),
    (e += 16),
    t.setTextColor(30, 58, 95),
    t.text("Down payment (30%): " + fmtRp(u), r - n, e, { align: "right" }),
    (e += 30),
    e > 700 && (t.addPage(), (e = 56)),
    t.setFont("helvetica", "bold"),
    t.setFontSize(9),
    t.setTextColor(90, 90, 90),
    t.text("PAYMENT INFORMATION", n, e),
    (e += 14),
    t.setFont("helvetica", "normal"),
    t.setFontSize(9.5),
    t.setTextColor(30, 30, 30),
    t.text("All payments are only through:", n, e),
    (e += 12));
  const bx = n,
    by = e,
    bw = 168,
    bh = 32;
  (t.setFillColor(230, 237, 246),
    t.roundedRect(bx, by, bw, bh, 6, 6, "F"),
    t.setDrawColor(150, 176, 210),
    t.setLineWidth(1.5),
    t.roundedRect(bx, by, bw, bh, 6, 6, "S"),
    t.setFillColor(30, 58, 95),
    t.roundedRect(bx, by + 5, 4, bh - 10, 2, 2, "F"),
    t.setFont("helvetica", "bold"),
    t.setFontSize(12),
    t.setTextColor(30, 58, 95),
    t.text("BCA — 8761141988", bx + 13, by + 14),
    t.setFont("helvetica", "bold"),
    t.setFontSize(7.5),
    t.setTextColor(100, 100, 100),
    t.text("a.n. Mochamad Annas Afan", bx + 13, by + 25),
    (e = by + bh + 20));
  const cx = r / 2,
    fy = ph - 38;
  (t.setFontSize(8),
    t.setTextColor(140, 140, 140),
    t.text(
      "Perumahan Taman Raya Citayam, Blok E4 No.02, Kecamatan Bojonggede, Bogor, Jawa Barat",
      cx,
      fy,
      { align: "center" },
    ),
    t.text("Phone 0813 4000 4073   |   Instagram @Sumeriapoto", cx, fy + 13, {
      align: "center",
    }),
    addWatermarks(t));
  return t;
}
function downloadQuotationPdf(o) {
  const a = buildQuotationPdf(o),
    r =
      "Quotation-" +
      (o.quoNumber || "Sumeriapoto").split("/").join("-") +
      ".pdf";
  return (a.save(r), r);
}
function sendQuotationWhatsApp(o) {
  try {
    downloadQuotationPdf(o);
  } catch (r) {
    (console.error("PDF generation failed", r),
      alert(
        "PDF belum bisa dibuat karena butuh koneksi internet aktif. WhatsApp tetap akan dibuka, tapi lampirkan quotation secara manual ya.",
      ));
  }
  const a = waPhone(o.customerSnap && o.customerSnap.phone),
    t = buildQuotationWaMessage(o);
  window.open(
    "https://wa.me/" + a + "?text=" + encodeURIComponent(t),
    "_blank",
  );
}
const __root = ReactDOM.createRoot(document.getElementById("root"));
__root.render(React.createElement(App, null));
