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
  TargetIcon = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
      React.createElement("circle", { cx: "12", cy: "12", r: "5" }),
      React.createElement("circle", { cx: "12", cy: "12", r: "1" }),
    ),
  ),
  KeyRound = makeIcon(
    React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: "8", cy: "15", r: "4" }),
      React.createElement("path", { d: "m10.8 12.2 8.2-8.2M16 7l3 3M14 9l2 2" }),
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
  LOGO_WHITE_DATA_URI =
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
      nav_targets: "Target",
      nav_packages: "Package Item",
      pkg_title: "Package Item",
      pkg_subtitle: "Katalog paket beserta harga default, dan laporan penjualan per paket.",
      pkg_tab_catalog: "Katalog",
      pkg_add_to_catalog: "Tambah ke katalog",
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
      profile_sub: "Kelola nama dan password akunmu.",
      logout_title: "Keluar dari akun?",
      logout_msg: "Kamu akan keluar dari PayHub dan perlu login lagi untuk melanjutkan.",
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
      cust_col_pic: "PIC",
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
      bulk_selected: "{n} dipilih",
      bulk_select_all: "Pilih semua ({n})",
      bulk_clear: "Batal",
      bulk_delete: "Hapus",
      bulk_check_all: "Pilih semua baris",
      bulk_check_row: "Pilih baris ini",
      bulk_confirm: "{what}{extra} akan dihapus permanen.",
      bulk_done: "{n} data dihapus",
      bulk_what_customers: "{n} customer",
      bulk_what_quotations: "{n} quotation",
      bulk_what_invoices: "{n} invoice",
      bulk_what_expenses: "{n} pengeluaran",
      bulk_what_packages: "{n} package item",
      bulk_extra_invoices: " beserta data pembayaran dan pengeluaran Project terkait",
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
      nav_targets: "Target",
      nav_packages: "Package Item",
      pkg_title: "Package Item",
      pkg_subtitle: "Package catalog with default prices, plus sales reports per package.",
      pkg_tab_catalog: "Catalog",
      pkg_add_to_catalog: "Add to catalog",
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
      profile_sub: "Manage your name and account password.",
      logout_title: "Log out of your account?",
      logout_msg: "You will be signed out of PayHub and need to sign in again to continue.",
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
      cust_col_pic: "PIC",
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
      bulk_selected: "{n} selected",
      bulk_select_all: "Select all ({n})",
      bulk_clear: "Clear",
      bulk_delete: "Delete",
      bulk_check_all: "Select all rows",
      bulk_check_row: "Select this row",
      bulk_confirm: "{what}{extra} will be permanently deleted.",
      bulk_done: "{n} items deleted",
      bulk_what_customers: "{n} customers",
      bulk_what_quotations: "{n} quotations",
      bulk_what_invoices: "{n} invoices",
      bulk_what_expenses: "{n} expenses",
      bulk_what_packages: "{n} package items",
      bulk_extra_invoices: ", their payment data and linked Project expenses",
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
    { key: "targets", label: "Target", icon: TargetIcon, perm: "targets:manage" },
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
          // Server ikut menghapus record turunan (pengeluaran Project saat invoice dihapus): muat ulang tampilan terkait.
          if (res.cascaded) hk.current.onCascade && hk.current.onCascade();
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
  return [t, set, n, reload];
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
        const me = await apiFetch("/api/me");
        applyPrefs(await Prefs.pull());
        a(me);
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
        Prefs.push({ theme: B ? "dark" : "light" }),
        B
      );
    });
  }
  function c(w) {
    (p(w), storage.set("payhub_lang", w, !1).catch(() => {}), Prefs.push({ lang: w }));
  }
  const m = makeT(l);
  window.__uiLang = l;
  function applyPrefs(pf) {
    if (pf.lang === "id" || pf.lang === "en") p(pf.lang);
    if (pf.theme === "dark" || pf.theme === "light") r(pf.theme === "dark");
  }
  function k(w) {
    Prefs.pull().then((pf) => {
      applyPrefs(pf);
      a(w);
    });
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
              updateMe: (patch) => a((m) => (m ? { ...m, user: { ...m.user, ...patch } } : m)),
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
  updateMe,
}) {
  const [askOut, setAskOut] = useState(!1);
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
    expReload = useRef(null),
    [c, m, k] = useCollection("payhub_invoices", [], { ...collHooks("invoices"), onCascade: () => expReload.current && expReload.current().catch(() => {}) }),
    [C, P, w, reloadExpenses] = useCollection("payhub_expenses", [], collHooks("expenses")),
    [PK, setPK, pkLoaded] = useCollection("payhub_packages", [], collHooks("packages")),
    B = ((expReload.current = can("read:expenses") ? reloadExpenses : null), f && y && k && w),
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
    // Dropdown paket mengikuti katalog apa adanya (termasuk kosong) setelah katalog selesai dimuat.
    if (pkLoaded) {
      PACKAGE_ITEMS_LIST.length = 0;
      Object.keys(PACKAGE_PRICES).forEach((k) => delete PACKAGE_PRICES[k]);
      PK.forEach((x) => {
        PACKAGE_ITEMS_LIST.push(x.name);
        PACKAGE_PRICES[x.name] = Number(x.price) || 0;
      });
    }
  }, [PK, pkLoaded]);
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
      onLogout: () => setAskOut(!0),
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
        onLogout: () => setAskOut(!0),
      }),
    askOut &&
      React.createElement(ConfirmModal, { title: l("logout_title"), message: l("logout_msg"), confirmLabel: l("logout"), confirmIcon: LogOut, onConfirm: () => { setAskOut(!1); a(); }, onCancel: () => setAskOut(!1), t: l }),
    React.createElement(
      "main",
      {
        className: "main-content",
        style: {
          flex: 1,
          minWidth: 0,
          padding: "28px 32px 32px",
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
        { title: "Profile", subtitle: l("profile_sub"), onClose: () => setPR(!1), width: 460, icon: UserCircle },
        React.createElement(AvatarEditor, {
          me: ME,
          name: o,
          role: ROLE_LABEL[ME.user.role] || ME.user.role,
          showToast,
          updateMe,
        }),
        React.createElement(AccountPanel, { me: ME, showToast }),
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
                src: e ? LOGO_WHITE_DATA_URI : LOGO_DATA_URI,
                alt: "Sum\xE9riapoto",
                style: {
                  height: 22,
                  width: "auto",
                  display: "block",
                },
              }),
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
      return React.createElement(a.can("analytics:finance") ? AnalyticsPage : CustomerAnalyticsPage, { ctx: a });
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
    case "targets":
      return a.can("targets:manage")
        ? React.createElement(TargetsPage, { ctx: a })
        : React.createElement(HomePage, { ctx: a });
    case "packages":
    case "bestsellers":
      return React.createElement(PackagesPage, { ctx: a });
    default:
      return React.createElement(a.can("analytics:finance") ? AnalyticsPage : CustomerAnalyticsPage, { ctx: a });
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
      className: "icon-btn",
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
/* ---------- Pilih banyak data (checkbox) + hapus massal ---------- */
function useSelection(rows, enabled = !0) {
  const [ids, setIds] = useState(() => new Set());
  const last = useRef(null);
  const order = rows.map((r) => r.id);
  const picked = enabled ? order.filter((id) => ids.has(id)) : [];
  const pickedSet = new Set(picked);
  const all = order.length > 0 && picked.length === order.length;
  return {
    enabled,
    count: picked.length,
    total: order.length,
    picked,
    all,
    some: picked.length > 0 && !all,
    has: (id) => pickedSet.has(id),
    // shift+klik = pilih rentang dari baris yang terakhir diklik
    toggle(id, range) {
      setIds((s) => {
        const n = new Set(s),
          on = !n.has(id),
          from = range && last.current != null ? order.indexOf(last.current) : -1,
          to = order.indexOf(id);
        if (from >= 0 && to >= 0) order.slice(Math.min(from, to), Math.max(from, to) + 1).forEach((x) => (on ? n.add(x) : n.delete(x)));
        else on ? n.add(id) : n.delete(id);
        return n;
      });
      last.current = id;
    },
    toggleAll() {
      setIds(all ? new Set() : new Set(order));
      last.current = null;
    },
    selectAll() {
      setIds(new Set(order));
    },
    clear() {
      setIds(new Set());
      last.current = null;
    },
  };
}
function SelBox({ checked: c, indeterminate: ind, disabled: dis, onToggle: tg, label: lb }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!ind && !c;
  }, [ind, c]);
  return React.createElement("input", {
    ref,
    type: "checkbox",
    className: "ui-cb",
    checked: !!c,
    disabled: !!dis,
    "aria-label": lb,
    style: dis ? { visibility: "hidden" } : void 0,
    onChange: () => {},
    onClick: (e) => {
      e.stopPropagation();
      tg(e.shiftKey);
    },
  });
}
function SelHead({ sel, t }) {
  return sel.enabled
    ? React.createElement(TableHead, { className: "sel-th", style: { width: 44 } }, React.createElement(SelBox, { checked: sel.all, indeterminate: sel.some, onToggle: () => sel.toggleAll(), label: t("bulk_check_all") }))
    : null;
}
// disabled = baris yang tidak boleh dihapus (kotak disembunyikan, tapi tetap ada supaya paginasi tabel tidak berubah)
function SelCell({ sel, id, t, disabled }) {
  return sel.enabled
    ? React.createElement(TableCell, { className: "sel-td" }, React.createElement(SelBox, { checked: sel.has(id), disabled, onToggle: (range) => sel.toggle(id, range), label: t("bulk_check_row") }))
    : null;
}
function BulkActions({ sel, t, kind, extra, onDelete, toast }) {
  const h = React.createElement,
    [ask, setAsk] = useState(!1),
    fill = (k, n, w, x) => t(k).replace("{n}", n).replace("{what}", w || "").replace("{extra}", x || "");
  useEffect(() => {
    if (!sel.count) setAsk(!1);
  }, [sel.count]);
  useEffect(() => {
    if (!sel.count || ask) return;
    const k = (ev) => ev.key === "Escape" && !ev.defaultPrevented && !document.querySelector(".modal-overlay") && sel.clear();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [sel.count, ask]);
  if (!sel.enabled || !sel.count) return null;
  const ghost = { border: "none", background: "transparent", color: "inherit", opacity: 0.85, font: "inherit", fontSize: 13, cursor: "pointer", padding: "6px 8px", borderRadius: 8 };
  return h(
    React.Fragment,
    null,
    h(
      "div",
      { role: "toolbar", "aria-label": fill("bulk_selected", sel.count), style: { position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", zIndex: 60, display: "flex", alignItems: "center", gap: 6, padding: "9px 10px 9px 16px", borderRadius: 14, background: "var(--c-blue)", color: "var(--c-onBlue)", boxShadow: "0 18px 40px -14px rgba(9,9,11,.45)", maxWidth: "calc(100vw - 24px)", flexWrap: "wrap", justifyContent: "center" } },
      h("b", { style: { fontSize: 13.5, fontWeight: 600, marginRight: 6, whiteSpace: "nowrap" } }, fill("bulk_selected", sel.count)),
      !sel.all && h("button", { type: "button", style: ghost, onClick: () => sel.selectAll() }, fill("bulk_select_all", sel.total)),
      h("button", { type: "button", style: ghost, onClick: () => sel.clear() }, t("bulk_clear")),
      h(
        "button",
        { type: "button", onClick: () => setAsk(!0), style: { display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "var(--c-red)", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "8px 12px", borderRadius: 10 } },
        h(Trash2, { size: 14 }),
        t("bulk_delete"),
      ),
    ),
    ask &&
      h(ConfirmModal, {
        message: fill("bulk_confirm", sel.count, fill("bulk_what_" + kind, sel.count), extra ? t("bulk_extra_" + kind) : ""),
        onConfirm: () => {
          const ids = sel.picked;
          onDelete(ids);
          sel.clear();
          setAsk(!1);
          toast && toast(fill("bulk_done", ids.length));
        },
        onCancel: () => setAsk(!1),
        t,
      }),
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
function ConfirmModal({ title: o, message: a, onConfirm: t, onCancel: r, t: n, confirmLabel: cl, confirmIcon: ci, tone: tn = "danger" }) {
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
        React.createElement(DlgIcon, { icon: ci || AlertTriangle, tone: tn }),
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
          React.createElement(Button, { icon: ci || Trash2, variant: "primary", onClick: t }, cl || e("delete")),
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
      `.ph-logo-light{display:block}.ph-logo-dark{display:none}[data-theme="dark"] .ph-logo-light{display:none}[data-theme="dark"] .ph-logo-dark{display:block}
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
        className: "ph-logo-light",
        style: { height: 22, width: "auto" },
      }),
      React.createElement("img", {
        src: LOGO_WHITE_DATA_URI,
        alt: "Sum\xE9riapoto",
        className: "ph-logo-dark",
        style: { height: 22, width: "auto" },
      }),
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
      a
        .map((I) => ({ ...I, picName: (I.pic && I.pic.name) || "" }))
        .filter((I) => JSON.stringify(I).toLowerCase().includes(l.toLowerCase())),
      d,
    ),
    P = a.find((I) => I.id === r);
  function w(I) {
    const S = !I.id;
    // PIC = user yang menginput. Server menetapkannya dari created_by; di sini hanya agar langsung tampil sebelum sinkron.
    const { picName: _pn, ...clean } = I;
    (t((s) =>
      I.id
        ? s.map((g) => (g.id === I.id ? clean : g))
        : [...s, { ...clean, id: uid(), pic: o.me && o.me.user ? { id: o.me.user.id, name: o.me.user.name } : null }],
    ),
      u(null),
      h && h(S ? "Customer added ✓" : "Customer updated ✓"));
  }
  function B(I) {
    (t((s) => s.filter((g) => g.id !== I)),
      c(null),
      h && h("Customer deleted"));
  }
  const sel = useSelection(C, o.can ? o.can("write:customers") : !0);
  return React.createElement(
    "div",
    null,
    React.createElement(BulkActions, { sel, t: e, kind: "customers", extra: !1, toast: h, onDelete: (ids) => t((z) => { const g = new Set(ids); return z.filter((x) => !g.has(x.id)); }) }),
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
                React.createElement(SelHead, { sel, t: e }),
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
                React.createElement(Th, {
                  label: e("cust_col_pic"),
                  sortKey: "picName",
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
                  { key: I.id, "data-sel": sel.has(I.id) ? "" : void 0 },
                  React.createElement(SelCell, { sel, id: I.id, t: e }),
                  React.createElement(TableCell, { style: { color: BRAND.inkSoft } }, idx + 1),
                  React.createElement(TableCell, { style: { fontWeight: 600 } }, I.name),
                  React.createElement(TableCell, null, I.gender),
                  React.createElement(TableCell, null, I.email),
                  React.createElement(TableCell, null, I.phone),
                  React.createElement(TableCell, null, I.city),
                  React.createElement(TableCell, { style: { color: I.picName ? BRAND.ink : BRAND.inkSoft } }, I.picName || "\u2014"),
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
    info = (k, val) => h("div", { className: "cd-info" }, h("span", null, k), h("b", null, val || "—")),
    stat = (label, value, tone, Ic) => h("div", { className: "cd-stat " + tone }, h("span", { className: "cd-stat-ic" }, h(Ic, { size: 16 })), h("span", { className: "cd-stat-l" }, label), h("b", { className: "cd-stat-v" }, value));
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
          h("div", { className: "cd-infos" }, info(e("detail_gender"), o.gender), info(e("detail_phone"), o.phone), info(e("detail_email"), o.email), info(e("detail_city"), o.city), h("div", { className: "cd-info cd-pic" }, h("span", null, e("cust_col_pic")), h("b", null, (o.pic && o.pic.name) || "—"))),
          h(
            "div",
            { className: "cd-stats" },
            stat(e("detail_revenue"), fmtRp(f), "green", TrendingUp),
            stat(e("detail_outstanding"), fmtRp(u), u > 0 ? "amber" : "gray", Wallet),
            stat(e("detail_quotations"), String(l.length), "blue", FileText),
            stat(e("detail_invoices"), String(p.length), "blue", Receipt),
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
/* Revisi quotation diteruskan ke invoice yang dibuat darinya (invoice.sourceQuotationId).
   Yang disalin: item dan customer. Cicilan yang belum dibayar dihitung ulang dari total baru (proporsional ke persen
   masing-masing); cicilan yang sudah dibayar tidak diubah. Invoice yang sudah lunas dilewati karena dokumen itu sudah selesai. */
function quotationSyncKey(q) {
  return JSON.stringify([(q.items || []).map(({ id, ...rest }) => rest), q.customerId || "", q.customerSnap || null]);
}
function repriceInvoicePayments(inv, total, items) {
  const ps = inv.payments || [];
  if (ps.length === 0) return generatePayments(inv.paymentPlan || "2x", total, { date: inv.date, items });
  const paidSum = ps.filter((p) => p.paid).reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const unpaid = ps.filter((p) => !p.paid);
  const pctSum = unpaid.reduce((s, p) => s + (Number(p.percent) || 0), 0) || 1;
  const rest = Math.max(0, total - paidSum);
  const amounts = unpaid.map((p) => Math.round((rest * (Number(p.percent) || 0)) / pctSum));
  if (amounts.length) amounts[amounts.length - 1] += rest - amounts.reduce((s, x) => s + x, 0);
  let k = 0;
  return ps.map((p) => (p.paid ? p : { ...p, amount: amounts[k++] }));
}
function syncInvoicesFromQuotation(q, invoices) {
  const linked = (invoices || []).filter((inv) => inv.sourceQuotationId === q.id);
  const done = linked.filter((inv) => isFullyPaid(inv));
  const target = new Map();
  linked.filter((inv) => !isFullyPaid(inv)).forEach((inv) => {
    const items = (q.items || []).map((x) => ({ ...x, id: uid() }));
    target.set(inv.id, {
      ...inv,
      customerId: q.customerId,
      customerSnap: q.customerSnap,
      items,
      payments: repriceInvoicePayments(inv, docSubtotal(items), items),
      lastUpdated: todayStr(),
    });
  });
  return { apply: (list) => list.map((inv) => target.get(inv.id) || inv), updated: target.size, skipped: done.length };
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
    // Quotation yang direvisi: teruskan perubahan item/customer ke invoice turunannya.
    const prev = S ? null : a.find((b) => b.id === i.id);
    const sync = prev && quotationSyncKey(prev) !== quotationSyncKey(i) ? syncInvoicesFromQuotation(i, n) : null;
    (t((h) =>
      i.id
        ? h.map((b) => (b.id === i.id ? i : b))
        : [...h, { ...i, id: uid() }],
    ),
      sync && sync.updated > 0 && e(sync.apply),
      m(null),
      hh &&
        hh(
          S
            ? "Quotation created ✓"
            : "Quotation updated ✓" +
                (sync && sync.updated ? ` · ${sync.updated} invoice ikut diperbarui` : "") +
                (sync && sync.skipped ? ` · ${sync.skipped} invoice lunas tidak diubah` : ""),
        ));
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
  const sel = useSelection(w, o.can ? o.can("write:quotations") : !0);
  return React.createElement(
    "div",
    null,
    React.createElement(BulkActions, { sel, t: d, kind: "quotations", extra: !1, toast: hh, onDelete: (ids) => t((z) => { const g = new Set(ids); return z.filter((x) => !g.has(x.id)); }) }),
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
                React.createElement(SelHead, { sel, t: d }),
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
                  { key: i.id, "data-sel": sel.has(i.id) ? "" : void 0 },
                  React.createElement(SelCell, { sel, id: i.id, t: d }),
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
  const sel = useSelection(w, o.can ? o.can("write:invoices") : !0);
  return React.createElement(
    "div",
    null,
    React.createElement(BulkActions, { sel, t: d, kind: "invoices", extra: !0, toast: hh, onDelete: (ids) => t((z) => { const g = new Set(ids); return z.filter((x) => !g.has(x.id)); }) }),
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
                React.createElement(SelHead, { sel, t: d }),
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
                  { key: i.id, "data-sel": sel.has(i.id) ? "" : void 0 },
                  React.createElement(SelCell, { sel, id: i.id, t: d }),
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
    // PIC diambil dari Customer Data (customer.pic), dicocokkan lewat customerId, cadangannya nama customer.
    custs = o.customers || [],
    normName = (x) => String(x || "").trim().toLowerCase(),
    custById = new Map(custs.map((x) => [x.id, x])),
    custByName = new Map(custs.map((x) => [normName(x.name), x])),
    v = a.map((c) => {
      const ev = (c.items || []).map((x) => x.eventDate).filter(Boolean).sort(),
        names = (c.items || []).map((x) => x.packageItem).filter(Boolean),
        cu = custById.get(c.customerId) || custByName.get(normName(c.customerSnap && c.customerSnap.name));
      return {
        ...c,
        picName: (cu && cu.pic && cu.pic.name) || "",
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
                h(TableHead, null, e("cust_col_pic")),
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
                  h(TableCell, { style: { whiteSpace: "nowrap", color: c.picName ? BRAND.ink : BRAND.inkSoft } }, c.picName || "\u2014"),
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
/** Jam event ala Google Calendar: "9am", "4:15pm" (en) atau "09.00" (id). Teks non-jam dikembalikan apa adanya. */
function fmtEvTime(tm, lang) {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(tm || ""));
  if (!m) return String(tm || "");
  const H = Number(m[1]), M = Number(m[2]);
  if (lang === "en") return (H % 12 || 12) + (M ? ":" + String(M).padStart(2, "0") : "") + (H >= 12 ? "pm" : "am");
  return String(H).padStart(2, "0") + "." + String(M).padStart(2, "0");
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
    fits = Math.max(1, Math.floor((rowH - 38) / 22)),
    fitsMore = Math.max(1, Math.floor((rowH - 38 - 18) / 22)),
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
            h("span", { className: "cal-d" + (x.key === todayK ? " today" : "") }, x.day === 1 ? `${x.day} ${new Date(x.key + "T00:00:00").toLocaleDateString(loc, { month: "short" }).replace(".", "")}` : x.day),
            ev.slice(0, shown(ev.length)).map((g, i) =>
              h(
                "button",
                { key: i, type: "button", className: "cal-chip " + tone(g.status) + (g.time ? " timed" : " allday"), onClick: () => setDetail({ id: g.invoiceId, date: x.key }), title: `${g.time ? fmtEvTime(g.time, e) + " " : ""}${g.customer} — ${g.packageItem}${g.location ? " · " + g.location : ""}` },
                h("i", null),
                h("span", { className: "cal-ct" }, g.time && h("em", null, fmtEvTime(g.time, e)), h("b", null, g.customer), g.packageItem && h("span", { className: "cal-pk" }, " " + g.packageItem)),
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
  .cal-wk div { padding:9px 0; text-align:center; font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:var(--c-inkSoft); font-weight:500; }
  .cal-grid { display:grid; grid-template-columns:repeat(7, minmax(0,1fr)); flex:1; min-height:0; }
  .cal-cell { display:flex; flex-direction:column; gap:2px; padding:4px 5px; border-right:1px solid var(--c-line); border-bottom:1px solid var(--c-line); min-height:0; overflow:hidden; }
  .cal-cell:nth-child(7n) { border-right:none; }
  .cal-cell.out { background:var(--c-grayBg); }
  .cal-cell.out .cal-d { color:var(--c-inkSoft); }
  .cal-d { align-self:center; min-width:26px; height:26px; padding:0 7px; border-radius:13px; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:500; color:var(--c-ink); flex-shrink:0; }
  .cal-d.today { background:#2F65E0; color:#fff; font-weight:600; }
  /* Gaya Google Calendar: event berjam = titik + jam + judul (tanpa latar); tanpa jam = batang berwarna penuh (all-day). */
  .cal-chip { display:flex; align-items:center; gap:6px; width:100%; min-width:0; height:20px; padding:0 5px; border:none; border-radius:4px; background:transparent; color:var(--c-ink); font:inherit; font-size:11.5px; text-align:left; cursor:pointer; flex-shrink:0; }
  .cal-chip i { width:8px; height:8px; border-radius:50%; background:var(--ev); flex-shrink:0; }
  .cal-chip.g { --ev:#16A34A; } .cal-chip.a { --ev:#F59E0B; } .cal-chip.n { --ev:#2F65E0; }
  .cal-ct { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .cal-ct b { font-weight:600; }
  .cal-ct em { font-style:normal; font-weight:500; margin-right:4px; color:var(--c-inkSoft); }
  .cal-pk { font-weight:400; color:var(--c-inkSoft); }
  .cal-chip.timed:hover { background:var(--c-grayBg); }
  .cal-chip.allday { background:var(--ev); color:#fff; }
  .cal-chip.allday i { display:none; }
  .cal-chip.allday .cal-pk { color:rgba(255,255,255,.85); }
  .cal-chip.allday:hover { filter:brightness(.93); }
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
    .cal-chip { background:var(--ev); }
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
    [orphanAsk, setOrphanAsk] = useState(!1),
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
  // Pengeluaran Project yatim: terhubung ke invoice yang sudah tidak ada (data lama sebelum penghapusan otomatis dibuat).
  const orphanIds = new Set(r.map((x) => x.id)),
    orphans = a.filter((x) => x.category === "Project" && x.invoiceId && !orphanIds.has(x.invoiceId)),
    idLang = o.lang !== "en";
  const sel = useSelection(S, o.can ? o.can("write:expenses") : !0);
  return React.createElement(
    "div",
    null,
    React.createElement(BulkActions, { sel, t: n, kind: "expenses", extra: !1, toast: TT, onDelete: (ids) => t((z) => { const g = new Set(ids); return z.filter((x) => !g.has(x.id)); }) }),
    React.createElement(PageHeader, {
      title: n("exp_title"),
      subtitle: n("exp_subtitle"),
      search: React.createElement(SearchBox, { value: c, onChange: m, placeholder: n("search_placeholder") }),
      action: React.createElement(Button, { icon: Plus, onClick: () => setMo(!0) }, n("exp_add_btn")),
    }),
    orphans.length > 0 &&
      React.createElement(
        "div",
        { role: "status", style: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "12px 14px", margin: "0 0 14px", border: `1px solid ${BRAND.line}`, borderRadius: 12, background: BRAND.grayBg, fontSize: 13.5 } },
        React.createElement(AlertTriangle, { size: 17, color: BRAND.red }),
        React.createElement(
          "span",
          { style: { flex: 1, minWidth: 220 } },
          idLang
            ? `${orphans.length} pengeluaran Project tidak punya invoice lagi (invoice-nya sudah dihapus).`
            : `${orphans.length} Project expense(s) no longer have an invoice (the invoice was deleted).`,
        ),
        React.createElement(Button, { variant: "secondary", icon: Trash2, onClick: () => setOrphanAsk(!0) }, idLang ? "Hapus" : "Delete"),
      ),
    orphanAsk &&
      React.createElement(ConfirmModal, {
        message: idLang
          ? `${orphans.length} pengeluaran Project senilai ${fmtRp(orphans.reduce((x, z) => x + lineTotal(z), 0))} akan dihapus permanen.`
          : `${orphans.length} Project expense(s) worth ${fmtRp(orphans.reduce((x, z) => x + lineTotal(z), 0))} will be permanently deleted.`,
        onConfirm: () => {
          const gone = new Set(orphans.map((x) => x.id));
          t((z) => z.filter((x) => !gone.has(x.id)));
          setOrphanAsk(!1);
          TT && TT(idLang ? "Pengeluaran dihapus" : "Expenses deleted");
        },
        onCancel: () => setOrphanAsk(!1),
        t: n,
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
                React.createElement(SelHead, { sel, t: n }),
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
                  { key: x.id, "data-sel": sel.has(x.id) ? "" : void 0 },
                  React.createElement(SelCell, { sel, id: x.id, t: n }),
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
      { className: "an-grid an-row3", style: { marginBottom: 16 } },
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
            null,
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
      { className: "an-grid an-row3", style: { marginBottom: 16 } },
      [
        [r("margin_total_revenue"), v, BRAND.ink, `${d.length} invoice`],
        [r("margin_total_expense"), u, BRAND.ink, `${d.length} invoice`],
        [r("margin_total_profit") + (v > 0 ? ` · Margin ${c.toFixed(1)}%` : ""), y, v > 0 ? BRAND[marginTone(c)] : y >= 0 ? BRAND.green : BRAND.red, v > 0 ? `Margin ${c.toFixed(1)}%` : "Margin —"],
      ].map(([lb, val, col, foot]) =>
        React.createElement(
          "div",
          { className: "an-card", key: lb, style: { padding: "14px 16px" } },
          React.createElement("h3", null, lb),
          React.createElement("p", { className: "an-big", style: { color: col, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, fmtRp(val)),
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
            null,
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
  const { packages: pk, setPackages: setPk, invoices: inv, can, showToast: toast, t: e } = o,
    h = React.createElement,
    [q, setQ] = useState(""),
    [sort, setSort] = useState({ key: "revenue", dir: "desc" }),
    [edit, setEdit] = useState(null),
    [del, setDel] = useState(null),
    canW = can("write:packages"),
    stats = useMemo(() => {
      const m = {};
      (inv || []).forEach((d) =>
        (d.items || []).forEach((f) => {
          const k = f.packageItem || "";
          if (!k) return;
          const r = (m[k] = m[k] || { qty: 0, orders: 0, revenue: 0 });
          r.qty += Number(f.qty) || 0;
          r.orders += 1;
          r.revenue += lineTotal(f);
        }),
      );
      return m;
    }, [inv]),
    base = [
      ...(pk || []).map((x) => ({ ...x, cat: !0 })),
      ...Object.keys(stats).filter((k) => !(pk || []).some((x) => x.name === k)).map((k) => ({ id: "x-" + k, name: k, price: 0, cat: !1 })),
    ].map((x) => ({ ...x, qty: stats[x.name]?.qty || 0, orders: stats[x.name]?.orders || 0, revenue: stats[x.name]?.revenue || 0 })),
    rows = sortRows(
      base.filter((x) => x.name.toLowerCase().includes(q.trim().toLowerCase())),
      sort,
    ),
    maxRev = Math.max(1, ...base.map((x) => x.revenue));
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
  const sel = useSelection(rows.filter((x) => x.cat), canW);
  return h(
    "div",
    null,
    h(BulkActions, { sel, t: e, kind: "packages", extra: !1, toast: toast, onDelete: (ids) => setPk((z) => { const g = new Set(ids); return z.filter((x) => !g.has(x.id)); }) }),
    h(PageHeader, {
      title: e("pkg_title"),
      subtitle: e("pkg_subtitle"),
      search: h(SearchBox, { value: q, onChange: setQ, placeholder: e("pkg_search") }),
      action: canW ? h(Button, { icon: Plus, onClick: () => setEdit({ name: "", price: 0 }) }, e("pkg_add")) : null,
    }),
    h(
      Card,
      { style: { padding: 0, overflowX: "auto" } },
      rows.length === 0
        ? h(EmptyState, { text: e("pkg_empty") })
        : h(
            Table,
            null,
            h(
              TableHeader,
              null,
              h(
                TableRow,
                null,
                h(SelHead, { sel, t: e }),
                h(TableHead, { style: { width: 56 } }, e("item_no")),
                h(Th, { label: e("pkg_col_name"), sortKey: "name", sort, setSort }),
                h(Th, { label: e("pkg_col_price"), sortKey: "price", sort, setSort }),
                h(Th, { label: e("best_col_qty"), sortKey: "qty", sort, setSort }),
                h(Th, { label: e("best_col_orders"), sortKey: "orders", sort, setSort }),
                h(Th, { label: e("best_col_revenue"), sortKey: "revenue", sort, setSort }),
                h(TableHead, { style: { minWidth: 120 } }, e("best_col_share")),
                canW && h(TableHead, { style: { width: 100 } }),
              ),
            ),
            h(
              TableBody,
              null,
              rows.map((x, i) =>
                h(
                  TableRow,
                  { key: x.id, "data-sel": sel.has(x.id) ? "" : void 0 },
                  h(SelCell, { sel, id: x.id, t: e, disabled: !x.cat }),
                  h(TableCell, { style: { color: BRAND.inkSoft } }, i + 1),
                  h(TableCell, { style: { fontWeight: 600 } }, x.name),
                  h(TableCell, { style: { whiteSpace: "nowrap" } }, Number(x.price) > 0 ? fmtRp(x.price) : "—"),
                  h(TableCell, null, x.qty),
                  h(TableCell, null, x.orders),
                  h(TableCell, { style: { fontWeight: 600, whiteSpace: "nowrap" } }, fmtRp(x.revenue)),
                  h(
                    TableCell,
                    null,
                    h(
                      "div",
                      { style: { height: 8, borderRadius: 4, background: BRAND.grayBg, overflow: "hidden", minWidth: 90 } },
                      h("div", { style: { width: `${(x.revenue / maxRev) * 100}%`, height: "100%", background: BRAND.blue, borderRadius: 4 } }),
                    ),
                  ),
                  canW &&
                    h(
                      TableCell,
                      null,
                      h(
                        "div",
                        { style: { display: "flex", gap: 6, justifyContent: "flex-end" } },
                        x.cat
                          ? [
                              h(IconBtn, { key: "e", icon: Pencil, title: e("edit"), onClick: () => setEdit(x) }),
                              h(IconBtn, { key: "d", icon: Trash2, title: e("delete"), tone: "danger", onClick: () => setDel(x) }),
                            ]
                          : h(IconBtn, { icon: Pencil, title: e("edit"), onClick: () => setEdit({ name: x.name, price: 0 }) }),
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
    // Print / Save as PDF bawaan browser memakai document.title sebagai nama file -> samakan dengan format unduhan PDF.
    useEffect(() => {
      const prev = document.title;
      document.title = pdfFileName(p ? r.invNumber : r.quoNumber, r).replace(/\.pdf$/, "");
      return () => {
        document.title = prev;
      };
    }, [p, r.invNumber, r.quoNumber]),
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
              padding: "30px clamp(18px, 6vw, 52px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: `1px solid ${BRAND.line}`,
            },
          },
          React.createElement(
            "div",
            { style: { alignSelf: "center" } },
            React.createElement("img", {
              src: LOGO_DATA_URI,
              alt: "Sum\xE9riapoto",
              style: { height: 36, width: "auto", display: "block" },
            }),
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
          React.createElement("b", { style: { fontWeight: 600, color: BRAND.ink } }, "Royal Tajur Residence"),
          React.createElement("br", null),
          "Jl. Raya Tajur No. 170, Pakuan, Bogor Selatan \xB7 Cluster Avebury 9 No. 17 \xB7 Bogor, Jawa Barat",
          React.createElement("br", null),
          "WhatsApp 0851 3939 8639 \xB7 0813 4000 4073 \xB7 Instagram @Sumeriapoto",
          React.createElement("br", null),
          React.createElement("span", { style: { fontSize: 9.5, letterSpacing: "0.03em", color: BRAND.inkSoft, opacity: 0.75, display: "inline-block", marginTop: 8 } }, "Created by Sumeriapoto Payhub"),
        ),
      ),
    )
  );
}
// Nama file PDF: "INV001_Ambon" / "QUO001_Ambon" (nomor tanpa tahun + nama customer).
function pdfFileName(num, o) {
  const parts = String(num || "").split("/"),
    code = parts.length >= 2 ? parts[0] + parts[1] : parts.join(""),
    cust = String((o.customerSnap && o.customerSnap.name) || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  return (code || "Sumeriapoto") + (cust ? "_" + cust : "") + ".pdf";
}
function downloadInvoicePdf(o) {
  const a = buildInvoicePdf(o),
    r = pdfFileName(o.invNumber, o);
  return (a.save(r), r);
}
function buildInvoiceWaMessage(o) {
  const name = (o.customerSnap && o.customerSnap.name) || "",
    head = "#" + o.invNumber + "\nHalo Kak " + name + ", ";
  if (isFullyPaid(o))
    return (
      head +
      "Terima kasih ya, pembayarannya sudah kami terima. Terlampir kami kirimkan invoice sebagai dokumen atas pembayaran yang sudah dilakukan \u{1F60A}\n\nCheers,\nTim Sumeriapoto"
    );
  // Belum lunas: rincian item + total + sisa + termin berikutnya + rekening (setara pesan quotation).
  const items = o.items || [],
    list = items.map((l) => `* ${quotationItemLabel(l)}: ${fmtRp(lineTotal(l))}`).join("\n"),
    total = docSubtotal(items),
    paid = (o.payments || []).filter((p) => p.paid).reduce((x, p) => x + (Number(p.amount) || 0), 0),
    idx = (o.payments || []).findIndex((p) => !p.paid),
    next = idx >= 0 ? o.payments[idx] : null;
  return (
    head +
    "berikut invoice untuk pesanan Kakak. Terlampir dokumennya ya.\n\n*Details Item,*\n" +
    list +
    `\n\n*Total : ${fmtRp(total)}*` +
    (paid > 0 ? `\nSudah dibayar: ${fmtRp(paid)}` : "") +
    `\nSisa pembayaran: *${fmtRp(Math.max(0, total - paid))}*` +
    (next ? `\n\nTahap berikutnya: *${next.label}* ${fmtRp(next.amount)}, jatuh tempo ${fmtDate(paymentDue(o, idx))}` : "") +
    "\nPembayaran hanya dilakukan melalui rekening *BCA 8761141988* an. Mochamad Annas Afan\n\nThanks for choosing us! Looking forward to working with you \u{1F90D}"
  );
}
/* Kirim dokumen ke WhatsApp. SEMUA langkah sebelum share/open berjalan sinkron di dalam klik, karena browser
   (terutama Safari) memblokir window.open / navigator.share bila dipanggil setelah await (izin klik sudah hangus).
   1) Web Share API + file PDF (khusus HP/tablet; di desktop menu Share tidak punya WhatsApp/nomor tujuan): PDF terlampir langsung, nomor tujuan dipilih di WhatsApp.
   2) Cadangan: unduh PDF + buka wa.me ke nomor customer dengan teks; PDF dilampirkan manual. */
function sendDocWhatsApp(kind, o) {
  const inv = kind === "invoice",
    text = inv ? buildInvoiceWaMessage(o) : buildQuotationWaMessage(o),
    phone = waPhone(o.customerSnap && o.customerSnap.phone),
    name = pdfFileName(inv ? o.invNumber : o.quoNumber, o),
    waUrl = "https://wa.me/" + phone + "?text=" + encodeURIComponent(text),
    openWa = () => {
      /* popup diblokir -> pindah tab ini ke WhatsApp supaya tetap terbuka */
      if (!window.open(waUrl, "_blank")) window.location.href = waUrl;
    },
    mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));
  let pdf = null,
    file = null;
  try {
    pdf = inv ? buildInvoicePdf(o) : buildQuotationPdf(o);
    file = new File([pdf.output("blob")], name, { type: "application/pdf" });
  } catch (err) {
    console.error("PDF generation failed", err);
    alert("PDF belum bisa dibuat karena butuh koneksi internet aktif. WhatsApp tetap akan dibuka, tapi lampirkan dokumennya secara manual ya.");
    openWa();
    return;
  }
  const fallback = () => {
    pdf.save(name);
    openWa();
  };
  if (mobile && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], text }).catch((err) => {
      if (err && err.name === "AbortError") return; /* user menutup menu Share */
      console.error("share failed, fallback ke unduh + wa.me", err);
      fallback();
    });
    return;
  }
  fallback();
}
function sendInvoiceWhatsApp(o) {
  sendDocWhatsApp("invoice", o);
}
function downloadQuotationPdf(o) {
  const a = buildQuotationPdf(o),
    r = pdfFileName(o.quoNumber, o);
  return (a.save(r), r);
}
function sendQuotationWhatsApp(o) {
  sendDocWhatsApp("quotation", o);
}
const __root = ReactDOM.createRoot(document.getElementById("root"));
__root.render(React.createElement(App, null));
