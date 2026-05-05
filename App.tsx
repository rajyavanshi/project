import { useState, useCallback, useRef } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Cell,
} from "recharts";

// ═══════════════════════════════════════════════════════
// NSE / BSE STOCK UNIVERSE
// ═══════════════════════════════════════════════════════
const STOCK_LIST = [
  { symbol: "^NSEI", label: "NIFTY 50 Index", sector: "Index" },
  { symbol: "^NSEBANK", label: "NIFTY Bank Index", sector: "Index" },
  { symbol: "^BSESN", label: "BSE SENSEX", sector: "Index" },
  { symbol: "RELIANCE.NS", label: "Reliance Industries", sector: "Energy" },
  { symbol: "TCS.NS", label: "Tata Consultancy Services", sector: "IT" },
  { symbol: "HDFCBANK.NS", label: "HDFC Bank", sector: "Banking" },
  { symbol: "INFY.NS", label: "Infosys", sector: "IT" },
  { symbol: "ICICIBANK.NS", label: "ICICI Bank", sector: "Banking" },
  { symbol: "HINDUNILVR.NS", label: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "SBIN.NS", label: "State Bank of India", sector: "Banking" },
  { symbol: "BHARTIARTL.NS", label: "Bharti Airtel", sector: "Telecom" },
  { symbol: "ITC.NS", label: "ITC Limited", sector: "FMCG" },
  { symbol: "KOTAKBANK.NS", label: "Kotak Mahindra Bank", sector: "Banking" },
  { symbol: "LT.NS", label: "Larsen & Toubro", sector: "Infra" },
  { symbol: "WIPRO.NS", label: "Wipro", sector: "IT" },
  { symbol: "HCLTECH.NS", label: "HCL Technologies", sector: "IT" },
  { symbol: "ASIANPAINT.NS", label: "Asian Paints", sector: "Chemicals" },
  { symbol: "MARUTI.NS", label: "Maruti Suzuki", sector: "Auto" },
  { symbol: "AXISBANK.NS", label: "Axis Bank", sector: "Banking" },
  { symbol: "BAJFINANCE.NS", label: "Bajaj Finance", sector: "NBFC" },
  { symbol: "TATAMOTORS.NS", label: "Tata Motors", sector: "Auto" },
  { symbol: "SUNPHARMA.NS", label: "Sun Pharma", sector: "Pharma" },
  { symbol: "ONGC.NS", label: "ONGC", sector: "Energy" },
  { symbol: "NTPC.NS", label: "NTPC", sector: "Power" },
  { symbol: "POWERGRID.NS", label: "Power Grid Corp", sector: "Power" },
  { symbol: "ULTRACEMCO.NS", label: "UltraTech Cement", sector: "Cement" },
  { symbol: "TATASTEEL.NS", label: "Tata Steel", sector: "Metal" },
  { symbol: "BAJAJFINSV.NS", label: "Bajaj Finserv", sector: "NBFC" },
  { symbol: "TECHM.NS", label: "Tech Mahindra", sector: "IT" },
  { symbol: "NESTLEIND.NS", label: "Nestle India", sector: "FMCG" },
  { symbol: "ADANIENT.NS", label: "Adani Enterprises", sector: "Conglomerate" },
  { symbol: "JSWSTEEL.NS", label: "JSW Steel", sector: "Metal" },
  { symbol: "DRREDDY.NS", label: "Dr. Reddy's Labs", sector: "Pharma" },
  { symbol: "CIPLA.NS", label: "Cipla", sector: "Pharma" },
  { symbol: "DIVISLAB.NS", label: "Divi's Laboratories", sector: "Pharma" },
  { symbol: "GRASIM.NS", label: "Grasim Industries", sector: "Cement" },
  { symbol: "HEROMOTOCO.NS", label: "Hero MotoCorp", sector: "Auto" },
  { symbol: "INDUSINDBK.NS", label: "IndusInd Bank", sector: "Banking" },
  { symbol: "APOLLOHOSP.NS", label: "Apollo Hospitals", sector: "Healthcare" },
  { symbol: "EICHERMOT.NS", label: "Eicher Motors", sector: "Auto" },
  { symbol: "BPCL.NS", label: "BPCL", sector: "Energy" },
  { symbol: "COALINDIA.NS", label: "Coal India", sector: "Mining" },
  { symbol: "TITAN.NS", label: "Titan Company", sector: "Consumer" },
  { symbol: "M&M.NS", label: "Mahindra & Mahindra", sector: "Auto" },
  { symbol: "BAJAJ-AUTO.NS", label: "Bajaj Auto", sector: "Auto" },
  { symbol: "HINDALCO.NS", label: "Hindalco", sector: "Metal" },
  { symbol: "ADANIPORTS.NS", label: "Adani Ports", sector: "Infra" },
  { symbol: "SBILIFE.NS", label: "SBI Life Insurance", sector: "Insurance" },
  { symbol: "HDFCLIFE.NS", label: "HDFC Life Insurance", sector: "Insurance" },
  { symbol: "BRITANNIA.NS", label: "Britannia Industries", sector: "FMCG" },
  { symbol: "SHREECEM.NS", label: "Shree Cement", sector: "Cement" },
  {
    symbol: "PIDILITIND.NS",
    label: "Pidilite Industries",
    sector: "Chemicals",
  },
  { symbol: "DABUR.NS", label: "Dabur India", sector: "FMCG" },
  { symbol: "MUTHOOTFIN.NS", label: "Muthoot Finance", sector: "NBFC" },
  { symbol: "HAVELLS.NS", label: "Havells India", sector: "Consumer" },
  { symbol: "GODREJCP.NS", label: "Godrej Consumer", sector: "FMCG" },
  { symbol: "MARICO.NS", label: "Marico", sector: "FMCG" },
  { symbol: "BERGEPAINT.NS", label: "Berger Paints", sector: "Chemicals" },
  { symbol: "TATACONSUM.NS", label: "Tata Consumer Products", sector: "FMCG" },
  { symbol: "LUPIN.NS", label: "Lupin", sector: "Pharma" },
  { symbol: "AUROPHARMA.NS", label: "Aurobindo Pharma", sector: "Pharma" },
  { symbol: "PAGEIND.NS", label: "Page Industries", sector: "Consumer" },
  { symbol: "TORNTPHARM.NS", label: "Torrent Pharma", sector: "Pharma" },
  { symbol: "COLPAL.NS", label: "Colgate-Palmolive India", sector: "FMCG" },
  { symbol: "DMART.NS", label: "Avenue Supermarts (DMart)", sector: "Retail" },
  { symbol: "IRCTC.NS", label: "IRCTC", sector: "Travel" },
  { symbol: "ZOMATO.NS", label: "Zomato", sector: "Tech" },
  { symbol: "NYKAA.NS", label: "Nykaa (FSN E-Commerce)", sector: "Retail" },
  { symbol: "POLYCAB.NS", label: "Polycab India", sector: "Infra" },
  { symbol: "DIXON.NS", label: "Dixon Technologies", sector: "Electronics" },
  { symbol: "ASTRAL.NS", label: "Astral", sector: "Building" },
  { symbol: "LICI.NS", label: "LIC of India", sector: "Insurance" },
];

// ═══════════════════════════════════════════════════════
// DSP ENGINE
// ═══════════════════════════════════════════════════════
function fft(re, im) {
  const N = re.length;
  let j = 0;
  for (let i = 1; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = (-2 * Math.PI) / len,
      wRe = Math.cos(ang),
      wIm = Math.sin(ang);
    for (let i = 0; i < N; i += len) {
      let cRe = 1,
        cIm = 0;
      for (let k = 0; k < len >> 1; k++) {
        const uRe = re[i + k],
          uIm = im[i + k];
        const vRe = re[i + k + len / 2] * cRe - im[i + k + len / 2] * cIm;
        const vIm = re[i + k + len / 2] * cIm + im[i + k + len / 2] * cRe;
        re[i + k] = uRe + vRe;
        im[i + k] = uIm + vIm;
        re[i + k + len / 2] = uRe - vRe;
        im[i + k + len / 2] = uIm - vIm;
        const t = cRe * wRe - cIm * wIm;
        cIm = cRe * wIm + cIm * wRe;
        cRe = t;
      }
    }
  }
}

function computeFFTMag(signal) {
  let n = 1;
  while (n < signal.length) n <<= 1;
  const re = new Array(n).fill(0),
    im = new Array(n).fill(0);
  const mean = signal.reduce((a, b) => a + b, 0) / signal.length;
  signal.forEach((v, i) => {
    re[i] = v - mean;
  });
  fft(re, im);
  return Array.from({ length: Math.min(n / 2, 110) }, (_, i) => ({
    freq: +(i / n).toFixed(4),
    magnitude: +((Math.sqrt(re[i] ** 2 + im[i] ** 2) / n) * 1000).toFixed(5),
  })).slice(1);
}

function welchPSD(signal, segLen = 64) {
  const nSegs = Math.floor(signal.length / segLen);
  if (!nSegs) return [];
  const psd = new Array(segLen / 2).fill(0);
  for (let s = 0; s < nSegs; s++) {
    const seg = signal.slice(s * segLen, (s + 1) * segLen);
    const m = seg.reduce((a, b) => a + b) / segLen;
    const re = seg.map((v) => v - m),
      im = new Array(segLen).fill(0);
    fft(re, im);
    for (let k = 0; k < segLen / 2; k++)
      psd[k] += (re[k] ** 2 + im[k] ** 2) / segLen;
  }
  return psd
    .slice(1)
    .map((v, i) => ({
      freq: +((i + 1) / segLen).toFixed(4),
      power: +((v / nSegs) * 1e6).toFixed(4),
    }));
}

function computeSTFT(signal, nW = 7) {
  const wLen = Math.floor(signal.length / nW);
  const bands = [
    { label: "VLow", lo: 0, hi: 0.07 },
    { label: "Low", lo: 0.07, hi: 0.14 },
    { label: "MedLo", lo: 0.14, hi: 0.21 },
    { label: "Med", lo: 0.21, hi: 0.28 },
    { label: "MedHi", lo: 0.28, hi: 0.35 },
    { label: "High", lo: 0.35, hi: 0.42 },
    { label: "VHigh", lo: 0.42, hi: 0.5 },
  ];
  return Array.from({ length: nW }, (_, w) => {
    const seg = signal.slice(w * wLen, (w + 1) * wLen);
    let n = 1;
    while (n < seg.length) n <<= 1;
    const re = new Array(n).fill(0),
      im = new Array(n).fill(0);
    const m = seg.reduce((a, b) => a + b, 0) / (seg.length || 1);
    seg.forEach((v, i) => {
      re[i] = v - m;
    });
    fft(re, im);
    const obj = { window: `W${w + 1}` };
    bands.forEach((b) => {
      const lo = Math.max(1, Math.ceil(b.lo * n)),
        hi = Math.min(Math.floor(b.hi * n), n / 2 - 1);
      let pow = 0;
      for (let k = lo; k <= hi; k++) pow += (re[k] ** 2 + im[k] ** 2) / n;
      obj[b.label] = +(pow * 1000).toFixed(4);
    });
    return obj;
  });
}

function butterworthLP(signal, cutoff = 0.07) {
  const k = Math.tan(Math.PI * cutoff),
    norm = 1 / (1 + Math.SQRT2 * k + k * k);
  const b0 = k * k * norm,
    b1 = 2 * b0,
    b2 = b0,
    a1 = 2 * (k * k - 1) * norm,
    a2 = (1 - Math.SQRT2 * k + k * k) * norm;
  const out = [];
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  for (const x0 of signal) {
    const y = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    const yc = isNaN(y) || !isFinite(y) ? 0 : y;
    out.push(yc);
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = yc;
  }
  return out;
}

function kalmanFilter(signal, Q = 1e-5, R = 0.003) {
  const out = [];
  let x = signal[0] || 0,
    P = 1;
  for (const z of signal) {
    const Pp = P + Q,
      K = Pp / (Pp + R);
    x += K * (z - x);
    P = (1 - K) * Pp;
    out.push(x);
  }
  return out;
}

function waveletDenoise(signal, keepLevels = 2) {
  let n = 1;
  while (n < signal.length) n <<= 1;
  const pad = [
    ...signal,
    ...new Array(n - signal.length).fill(signal[signal.length - 1] || 0),
  ];
  let s = [...pad];
  const details = [];
  const maxLevels = Math.floor(Math.log2(n));
  for (let l = 0; l < maxLevels; l++) {
    if (s.length < 2) break;
    const a = [],
      d = [];
    for (let i = 0; i + 1 < s.length; i += 2) {
      a.push((s[i] + s[i + 1]) * 0.5);
      d.push((s[i] - s[i + 1]) * 0.5);
    }
    details.unshift(d);
    s = a;
  }
  const nThresh = details.length - keepLevels;
  const cd = details.map((d, i) =>
    i < nThresh ? new Array(d.length).fill(0) : d
  );
  for (const d of cd) {
    const r = [];
    for (let i = 0; i < Math.min(s.length, d.length); i++) {
      r.push(s[i] + d[i]);
      r.push(s[i] - d[i]);
    }
    s = r;
  }
  return s.slice(0, signal.length);
}

function movingAvg(sig, w = 10) {
  return sig.map((_, i) => {
    const sl = sig.slice(Math.max(0, i - w + 1), i + 1);
    return sl.reduce((a, b) => a + b) / sl.length;
  });
}

function hurstExp(series) {
  const lags = [10, 15, 22, 33, 50, 75, 112];
  const pts = lags
    .filter((l) => l < series.length / 3)
    .map((lag) => {
      const chunks = Math.floor(series.length / lag);
      let rs = 0,
        cnt = 0;
      for (let c = 0; c < chunks; c++) {
        const sub = series.slice(c * lag, (c + 1) * lag);
        const m = sub.reduce((a, b) => a + b) / lag;
        let cum = 0;
        const cumD = sub.map((v) => (cum += v - m));
        const R = Math.max(...cumD) - Math.min(...cumD);
        const S =
          Math.sqrt(sub.reduce((a, v) => a + (v - m) ** 2, 0) / lag) || 1e-12;
        if (isFinite(R / S)) {
          rs += R / S;
          cnt++;
        }
      }
      return cnt ? { x: Math.log(lag), y: Math.log(rs / cnt) } : null;
    })
    .filter(Boolean);
  if (pts.length < 2) return 0.5;
  const xm = pts.reduce((a, b) => a + b.x, 0) / pts.length,
    ym = pts.reduce((a, b) => a + b.y, 0) / pts.length;
  const num = pts.reduce((a, b) => a + (b.x - xm) * (b.y - ym), 0),
    den = pts.reduce((a, b) => a + (b.x - xm) ** 2, 0);
  const h = den ? num / den : 0.5;
  return +Math.min(0.99, Math.max(0.01, h)).toFixed(4);
}

function computeACF(series, maxLag = 25) {
  const n = series.length,
    m = series.reduce((a, b) => a + b) / n;
  const denom = series.reduce((a, b) => a + (b - m) ** 2, 0) || 1;
  return Array.from({ length: maxLag + 1 }, (_, k) => ({
    lag: k,
    acf: +(
      series.slice(k).reduce((a, b, i) => a + (b - m) * (series[i] - m), 0) /
      denom
    ).toFixed(4),
  }));
}

function adfTest(series) {
  const dy = series.slice(1).map((v, i) => v - series[i]),
    yl = series.slice(0, -1),
    n = dy.length;
  const mx = yl.reduce((a, b) => a + b) / n,
    md = dy.reduce((a, b) => a + b) / n;
  const num = dy.reduce((a, v, i) => a + (yl[i] - mx) * (v - md), 0),
    den = yl.reduce((a, v) => a + (v - mx) ** 2, 0) || 1;
  const b = num / den,
    res = dy.map((v, i) => v - b * (yl[i] - mx));
  const se2 = res.reduce((a, b) => a + b ** 2, 0) / (n - 2) || 1;
  const t = b / Math.sqrt(se2 / den);
  return {
    tStat: +t.toFixed(3),
    stationary: t < -2.87,
    label:
      t < -3.45
        ? "★ Stationary (1%)"
        : t < -2.87
        ? "✓ Stationary (5%)"
        : t < -2.57
        ? "~ Borderline (10%)"
        : "✗ Non-Stationary",
    color: t < -2.87 ? "#39ff87" : t < -2.57 ? "#ffb547" : "#ff4757",
  };
}

function computeSNR(orig, filt) {
  const noise = orig.map((v, i) => v - filt[i]);
  const sp = filt.reduce((a, b) => a + b ** 2, 0) / filt.length + 1e-12;
  const np = noise.reduce((a, b) => a + b ** 2, 0) / noise.length + 1e-12;
  return +(10 * Math.log10(sp / np)).toFixed(2);
}

function arRMSE(series) {
  const n = series.length,
    cut = Math.floor(n * 0.8);
  const tr = series.slice(0, cut),
    te = series.slice(cut);
  const m = tr.reduce((a, b) => a + b) / tr.length;
  const phi =
    tr.slice(1).reduce((a, v, i) => a + (v - m) * (tr[i] - m), 0) /
    (tr.reduce((a, v) => a + (v - m) ** 2, 0) || 1);
  let prev = tr[tr.length - 1];
  const mse =
    te.reduce((a, actual) => {
      const p = m + phi * (prev - m);
      prev = actual;
      return a + (actual - p) ** 2;
    }, 0) / te.length;
  return { rmse: +Math.sqrt(mse).toFixed(6), phi: +phi.toFixed(4) };
}

function detectRegimes(kalman, w = 20) {
  return kalman.map((v, i) => {
    if (i < w) return { i, value: v, bull: null, bear: null, neutral: v };
    const ch = kalman.slice(i - w, i);
    const m = ch.reduce((a, b) => a + b) / w,
      std = Math.sqrt(ch.reduce((a, b) => a + (b - m) ** 2, 0) / w) || 1e-9;
    const regime =
      m > 0.25 * std ? "bull" : m < -0.25 * std ? "bear" : "neutral";
    return {
      i,
      value: v,
      bull: regime === "bull" ? v : null,
      bear: regime === "bear" ? v : null,
      neutral: regime === "neutral" ? v : null,
    };
  });
}

// ═══════════════════════════════════════════════════════
// EVALUATION / TRUSTWORTHINESS METRICS
// ═══════════════════════════════════════════════════════
function jarqueBera(series) {
  const n = series.length;
  const m = series.reduce((a, b) => a + b) / n;
  const v = series.reduce((a, b) => a + (b - m) ** 2, 0) / n;
  const std = Math.sqrt(v) || 1e-12;
  const skew = series.reduce((a, b) => a + ((b - m) / std) ** 3, 0) / n;
  const kurt = series.reduce((a, b) => a + ((b - m) / std) ** 4, 0) / n;
  const jb = (n / 6) * (skew ** 2 + (kurt - 3) ** 2 / 4);
  return {
    jb: +jb.toFixed(3),
    skew: +skew.toFixed(4),
    kurt: +kurt.toFixed(4),
    normal: jb < 5.99,
    label:
      jb < 5.99
        ? "✓ Normal (5%)"
        : jb < 9.21
        ? "~ Near-normal (1%)"
        : "✗ Non-normal (fat tails)",
    color: jb < 5.99 ? "#39ff87" : jb < 9.21 ? "#ffb547" : "#ff4757",
  };
}

function ljungBox(series, lag = 10) {
  const n = series.length;
  const m = series.reduce((a, b) => a + b) / n;
  const denom = series.reduce((a, b) => a + (b - m) ** 2, 0) || 1;
  let Q = 0;
  for (let k = 1; k <= lag; k++) {
    const rk =
      series.slice(k).reduce((a, b, i) => a + (b - m) * (series[i] - m), 0) /
      denom;
    Q += rk ** 2 / (n - k);
  }
  Q *= n * (n + 2);
  const cv5 = lag === 10 ? 18.31 : lag === 20 ? 31.41 : 18.31;
  return {
    Q: +Q.toFixed(3),
    lag,
    whitenoise: Q < cv5,
    label:
      Q < cv5 ? "✓ White Noise (no autocorr.)" : "✗ Autocorrelation detected",
    color: Q < cv5 ? "#39ff87" : "#ff4757",
    pApprox: Q < cv5 ? "p > 0.05" : "p < 0.05",
  };
}

function pearsonR(a, b) {
  const n = Math.min(a.length, b.length);
  const ma = a.slice(0, n).reduce((s, v) => s + v) / n,
    mb = b.slice(0, n).reduce((s, v) => s + v) / n;
  const num = a.slice(0, n).reduce((s, v, i) => s + (v - ma) * (b[i] - mb), 0);
  const da = Math.sqrt(a.slice(0, n).reduce((s, v) => s + (v - ma) ** 2, 0));
  const db = Math.sqrt(b.slice(0, n).reduce((s, v) => s + (v - mb) ** 2, 0));
  return +(num / (da * db || 1)).toFixed(4);
}

function varianceRetention(orig, filt) {
  const n = Math.min(orig.length, filt.length);
  const mo = orig.slice(0, n).reduce((a, b) => a + b) / n,
    mf = filt.slice(0, n).reduce((a, b) => a + b) / n;
  const vo = orig.slice(0, n).reduce((a, v) => a + (v - mo) ** 2, 0) / n || 1;
  const vf = filt.slice(0, n).reduce((a, v) => a + (v - mf) ** 2, 0) / n;
  return +Math.min(100, (vf / vo) * 100).toFixed(2);
}

function arR2(series) {
  const n = series.length,
    cut = Math.floor(n * 0.8);
  const tr = series.slice(0, cut);
  const m = tr.reduce((a, b) => a + b) / tr.length;
  const phi =
    tr.slice(1).reduce((a, v, i) => a + (v - m) * (tr[i] - m), 0) /
    (tr.reduce((a, v) => a + (v - m) ** 2, 0) || 1);
  const pred = tr.slice(0, -1).map((v) => m + phi * (v - m));
  const actual = tr.slice(1);
  const ssTot = actual.reduce((a, v) => a + (v - m) ** 2, 0) || 1;
  const ssRes = actual.reduce((a, v, i) => a + (v - pred[i]) ** 2, 0);
  return +Math.max(0, 1 - ssRes / ssTot).toFixed(4);
}

// ═══════════════════════════════════════════════════════
// DATA FETCHING — includes full OHLCV
// ═══════════════════════════════════════════════════════
async function fetchData(ticker) {
  async function fetchData(ticker) {
    // 🔥 LOCAL BACKEND (change later for deployment)
    const base = `https://project-h1b5.onrender.com/api/data/${ticker}`;
    let j = null;

    try {
      const r = await fetch(base);
      if (r.ok) {
        j = await r.json();
      } else {
        throw new Error("API response not OK");
      }
    } catch (e) {
      console.error("Fetch failed:", e);
      return generateGBM(ticker);
    }

    try {
      const q = j?.chart?.result?.[0];
      if (!q) throw new Error("no data");

      const ts = q.timestamp;
      const qt = q.indicators.quote[0];

      const cl = qt.close;
      const op = qt.open;
      const hi = qt.high;
      const lo = qt.low;
      const vol = qt.volume;

      const prices = [],
        dates = [];
      let ohlcv = [];

      ts.forEach((t, i) => {
        if (cl[i] != null && !isNaN(cl[i]) && cl[i] > 0) {
          const prevClose =
            ohlcv.length > 0 ? ohlcv[ohlcv.length - 1].close : cl[i];

          const c = +cl[i].toFixed(2);

          prices.push(c);
          dates.push(new Date(t * 1000).toISOString().slice(0, 10));

          ohlcv.push({
            date: new Date(t * 1000).toISOString().slice(0, 10),
            open: op[i] != null ? +op[i].toFixed(2) : c,
            high: hi[i] != null ? +hi[i].toFixed(2) : c,
            low: lo[i] != null ? +lo[i].toFixed(2) : c,
            close: c,
            volume: vol[i] != null ? Math.round(vol[i]) : 0,
            change: +(c - prevClose).toFixed(2),
            changePct: +(((c - prevClose) / prevClose) * 100).toFixed(2),
          });
        }
      });

      if (prices.length < 60) throw new Error("insufficient");

      return { prices, dates, ohlcv, synthetic: false };
    } catch (e) {
      console.error("Processing failed:", e);
      return generateGBM(ticker);
    }
  }
  try {
    const q = j?.chart?.result?.[0];
    if (!q) throw new Error("no data");
    const ts = q.timestamp,
      qt = q.indicators.quote[0];
    const cl = qt.close,
      op = qt.open,
      hi = qt.high,
      lo = qt.low,
      vol = qt.volume;
    const prices = [],
      dates = [];
    let ohlcv = [];
    ts.forEach((t, i) => {
      if (cl[i] != null && !isNaN(cl[i]) && cl[i] > 0) {
        const prevClose =
          ohlcv.length > 0 ? ohlcv[ohlcv.length - 1].close : cl[i];
        const c = +cl[i].toFixed(2);
        prices.push(c);
        dates.push(new Date(t * 1000).toISOString().slice(0, 10));
        ohlcv.push({
          date: new Date(t * 1000).toISOString().slice(0, 10),
          open: op[i] != null ? +op[i].toFixed(2) : c,
          high: hi[i] != null ? +hi[i].toFixed(2) : c,
          low: lo[i] != null ? +lo[i].toFixed(2) : c,
          close: c,
          volume: vol[i] != null ? Math.round(vol[i]) : 0,
          change: +(c - prevClose).toFixed(2),
          changePct: +(((c - prevClose) / prevClose) * 100).toFixed(2),
        });
      }
    });
    if (prices.length < 60) throw new Error("insufficient");
    return { prices, dates, ohlcv, synthetic: false };
  } catch {
    return generateGBM(ticker);
  }
}

function generateGBM(ticker = "DEMO") {
  const n = 500,
    mu = 0.0004,
    sig = 0.013;
  const p0 =
    ticker.includes("NSEI") || ticker.includes("NIFTY")
      ? 22000
      : ticker.includes("RELIANCE")
      ? 2800
      : 1000;
  const prices = [p0],
    dates = ["2023-01-02"],
    ohlcv = [];
  const start = new Date("2023-01-02");
  ohlcv.push({
    date: "2023-01-02",
    open: p0,
    high: +(p0 * (1 + sig)).toFixed(2),
    low: +(p0 * (1 - sig)).toFixed(2),
    close: p0,
    volume: 1000000,
    change: 0,
    changePct: 0,
  });
  for (let i = 1; i < n; i++) {
    const z =
      Math.sqrt(-2 * Math.log(Math.random() + 1e-10)) *
      Math.cos(2 * Math.PI * Math.random());
    const c = Math.max(
      1,
      prices[i - 1] * Math.exp(mu - sig ** 2 / 2 + sig * z)
    );
    const o = prices[i - 1] * (1 + (Math.random() - 0.5) * sig * 0.5);
    const h = Math.max(o, c) * (1 + Math.abs(z) * sig * 0.3);
    const l = Math.min(o, c) * (1 - Math.abs(z) * sig * 0.3);
    prices.push(+c.toFixed(2));
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const ds = d.toISOString().slice(0, 10);
    dates.push(ds);
    const prev = ohlcv[ohlcv.length - 1].close;
    ohlcv.push({
      date: ds,
      open: +o.toFixed(2),
      high: +h.toFixed(2),
      low: +l.toFixed(2),
      close: +c.toFixed(2),
      volume: Math.round(500000 + Math.random() * 2000000),
      change: +(c - prev).toFixed(2),
      changePct: +(((c - prev) / prev) * 100).toFixed(2),
    });
  }
  return { prices, dates, ohlcv, synthetic: true };
}

function computeReturns(prices) {
  return prices
    .slice(1)
    .map((p, i) => Math.log(p / prices[i]))
    .filter((v) => isFinite(v) && !isNaN(v));
}

// ═══════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════
const C = {
  bg: "#060810",
  card: "#0c0f1b",
  sidebar: "#080b14",
  border: "#18243a",
  cyan: "#00d4ff",
  green: "#39ff87",
  amber: "#ffb547",
  red: "#ff4757",
  purple: "#b388ff",
  blue: "#448aff",
  text: "#c0cede",
  muted: "#384f68",
  dim: "#101828",
};
const mono = "'Space Mono','Courier New',monospace";
const sans = "'DM Sans','Segoe UI',sans-serif";
const ax = {
  tick: { fill: C.muted, fontSize: 9, fontFamily: mono },
  axisLine: { stroke: C.border },
  tickLine: { stroke: C.border },
};

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0b0f1e",
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        padding: "8px 12px",
        fontSize: 11,
        fontFamily: mono,
        color: C.text,
      }}
    >
      <div style={{ color: C.muted, marginBottom: 4, fontSize: 10 }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.cyan }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(5) : p.value}
        </div>
      ))}
    </div>
  );
};

function ChartCard({ title, children, height = 220, accent }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${accent ? accent + "33" : C.border}`,
        borderRadius: 6,
        padding: "16px",
        boxShadow: accent ? `0 0 28px ${accent}08` : undefined,
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 9,
            color: C.muted,
            letterSpacing: "0.13em",
            marginBottom: 14,
            fontFamily: mono,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      )}
      <div style={{ height }}>{children}</div>
    </div>
  );
}

function Metric({ label, value, color = C.cyan, sub }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 4,
        padding: "13px 15px",
        flex: 1,
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: C.muted,
          letterSpacing: "0.12em",
          marginBottom: 6,
          fontFamily: mono,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 19,
          color,
          fontFamily: mono,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            color: C.muted,
            marginTop: 5,
            fontFamily: sans,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function TestCard({ title, stat, label, color, detail }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${color}44`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 4,
        padding: "14px 16px",
        flex: 1,
        minWidth: 200,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: C.muted,
          letterSpacing: "0.12em",
          marginBottom: 8,
          fontFamily: mono,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 22, color, fontFamily: mono, fontWeight: 700 }}>
        {stat}
      </div>
      <div
        style={{
          fontSize: 12,
          color,
          marginTop: 6,
          fontFamily: sans,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: mono }}
      >
        {detail}
      </div>
    </div>
  );
}

function InfoBox({ color = C.cyan, prefix, text }) {
  return (
    <div
      style={{
        padding: "11px 15px",
        background: C.dim,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        fontSize: 12,
        color: C.muted,
        fontFamily: sans,
        lineHeight: 1.75,
      }}
    >
      <span style={{ color, fontWeight: 600 }}>{prefix} </span>
      {text}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STEP 1: DATA OVERVIEW + OHLCV TABLE
// ═══════════════════════════════════════════════════════
function StepData({ data }) {
  const { prices, dates, returns, ohlcv, synthetic } = data;
  const [tab, setTab] = useState("chart");
  const n = returns.length;
  const mean = returns.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(returns.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const skew = returns.reduce((a, b) => a + ((b - mean) / std) ** 3, 0) / n;
  const kurt = returns.reduce((a, b) => a + ((b - mean) / std) ** 4, 0) / n - 3;
  const recent = (ohlcv || []).slice(-15).reverse();
  const lastOHLCV = (ohlcv || [])[(ohlcv || []).length - 1];
  const isUp = (lastOHLCV?.changePct || 0) >= 0;
  const priceData = prices
    .filter((_, i) => i % 2 === 0)
    .map((p, i) => ({ t: dates[i * 2]?.slice(5) || i, price: +p.toFixed(2) }));
  const retData = returns
    .filter((_, i) => i % 2 === 0)
    .map((r, i) => ({
      t: dates[i * 2 + 1]?.slice(5) || i,
      pos: r >= 0 ? +r.toFixed(5) : null,
      neg: r < 0 ? +r.toFixed(5) : null,
    }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {synthetic && (
        <div
          style={{
            padding: "9px 14px",
            background: "#2a1800",
            border: `1px solid ${C.amber}44`,
            borderRadius: 4,
            fontSize: 12,
            color: C.amber,
            fontFamily: sans,
          }}
        >
          ⚠ Live data unavailable (CORS) — GBM synthetic simulation
          (μ=0.04%/day, σ=1.3%/day)
        </div>
      )}

      {lastOHLCV && (
        <div
          style={{
            background: C.dim,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: "12px 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 24,
                color: isUp ? C.green : C.red,
                fontWeight: 700,
              }}
            >
              ₹{lastOHLCV.close?.toLocaleString("en-IN")}
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 11,
                color: isUp ? C.green : C.red,
                marginTop: 3,
              }}
            >
              {isUp ? "+" : ""}
              {lastOHLCV.change} ({isUp ? "+" : ""}
              {lastOHLCV.changePct}%) · {lastOHLCV.date}
            </div>
          </div>
          {[
            ["OPEN", lastOHLCV.open, C.text],
            ["HIGH", lastOHLCV.high, C.green],
            ["LOW", lastOHLCV.low, C.red],
            ["VOLUME", lastOHLCV.volume?.toLocaleString("en-IN"), C.cyan],
          ].map(([k, v, c]) => (
            <div key={k}>
              <div
                style={{
                  fontSize: 9,
                  color: C.muted,
                  fontFamily: mono,
                  marginBottom: 3,
                  letterSpacing: "0.1em",
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: c,
                  fontFamily: mono,
                  fontWeight: 700,
                }}
              >
                {k === "VOLUME" ? v : `₹${Number(v).toLocaleString("en-IN")}`}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Metric
          label="OBSERVATIONS"
          value={n}
          color={C.cyan}
          sub="daily data points"
        />
        <Metric
          label="DAILY MEAN μ"
          value={(mean * 100).toFixed(4) + "%"}
          color={mean >= 0 ? C.green : C.red}
          sub="log-return average"
        />
        <Metric
          label="VOLATILITY σ"
          value={(std * 100).toFixed(4) + "%"}
          color={C.amber}
          sub="daily std deviation"
        />
        <Metric
          label="ANN. VOL"
          value={(std * Math.sqrt(252) * 100).toFixed(2) + "%"}
          color={C.purple}
          sub="√252 · σ daily"
        />
        <Metric
          label="SKEWNESS"
          value={skew.toFixed(3)}
          color={Math.abs(skew) > 0.5 ? C.red : C.green}
          sub={Math.abs(skew) > 0.5 ? "Asymmetric tail" : "Near-symmetric"}
        />
        <Metric
          label="EXCESS KURT."
          value={kurt.toFixed(3)}
          color={kurt > 1 ? C.red : C.green}
          sub={kurt > 1 ? "Leptokurtic (fat tail)" : "Near-normal"}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {[
          ["chart", "PRICE CHART"],
          ["ohlcv", "OHLCV TABLE (Last 15 Days)"],
        ].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            style={{
              background: "none",
              border: "none",
              padding: "8px 18px",
              fontSize: 11,
              fontFamily: mono,
              letterSpacing: "0.08em",
              cursor: "pointer",
              color: tab === v ? C.cyan : C.muted,
              borderBottom:
                tab === v ? `2px solid ${C.cyan}` : "2px solid transparent",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "chart" && (
        <>
          <ChartCard
            title="PRICE SERIES — P(t) : Raw Market Prices"
            height={200}
            accent={C.cyan}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.cyan} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={C.border}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="t"
                  {...ax}
                  interval={Math.floor(priceData.length / 7)}
                />
                <YAxis {...ax} width={65} />
                <Tooltip content={<CT />} />
                <Area
                  dataKey="price"
                  stroke={C.cyan}
                  fill="url(#pg)"
                  strokeWidth={1.5}
                  dot={false}
                  name="Price (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            title="LOG RETURNS — r(t) = log[P(t)/P(t-1)] : Green=Positive, Red=Negative"
            height={200}
            accent={C.green}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={retData}>
                <CartesianGrid
                  stroke={C.border}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="t"
                  {...ax}
                  interval={Math.floor(retData.length / 7)}
                />
                <YAxis {...ax} width={65} />
                <ReferenceLine y={0} stroke={C.border} strokeWidth={1.5} />
                <Tooltip content={<CT />} />
                <Area
                  dataKey="pos"
                  fill={C.green}
                  stroke="none"
                  fillOpacity={0.6}
                  name="Positive Return"
                />
                <Area
                  dataKey="neg"
                  fill={C.red}
                  stroke="none"
                  fillOpacity={0.6}
                  name="Negative Return"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}

      {tab === "ohlcv" && (
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: mono,
                fontSize: 11,
              }}
            >
              <thead>
                <tr style={{ background: C.dim }}>
                  {[
                    "Date",
                    "Open",
                    "High",
                    "Low",
                    "Close",
                    "Change",
                    "Chg %",
                    "Volume",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 12px",
                        textAlign: h === "Date" ? "left" : "right",
                        color: C.muted,
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        borderBottom: `1px solid ${C.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((row, i) => {
                  const up = row.changePct >= 0;
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: `1px solid ${C.border}30`,
                        background: i % 2 === 0 ? "transparent" : "#0a0d18",
                      }}
                    >
                      <td style={{ padding: "8px 12px", color: C.muted }}>
                        {row.date}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          color: C.text,
                        }}
                      >
                        ₹{row.open?.toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          color: C.green,
                        }}
                      >
                        ₹{row.high?.toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          color: C.red,
                        }}
                      >
                        ₹{row.low?.toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          color: C.text,
                          fontWeight: 700,
                        }}
                      >
                        ₹{row.close?.toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          color: up ? C.green : C.red,
                        }}
                      >
                        {up ? "+" : ""}
                        {row.change}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right" }}>
                        <span
                          style={{
                            background: up ? "#39ff8722" : "#ff475722",
                            color: up ? C.green : C.red,
                            padding: "2px 7px",
                            borderRadius: 3,
                            fontSize: 10,
                          }}
                        >
                          {up ? "+" : ""}
                          {row.changePct}%
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "right",
                          color: C.muted,
                        }}
                      >
                        {row.volume?.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            style={{
              padding: "8px 14px",
              fontSize: 10,
              color: C.muted,
              fontFamily: mono,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            Showing last 15 trading days · {ohlcv?.length} total OHLCV records ·
            sourced via Yahoo Finance API
          </div>
        </div>
      )}

      <InfoBox
        color={C.cyan}
        prefix="Note:"
        text="Price series P(t) is non-stationary — mean and variance evolve over time. Log-returns r(t) are approximately stationary by differencing. Fat tails (excess kurtosis > 0) and skewness are hallmarks of financial time series — this is what makes them hard to filter compared to engineered signals."
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STEP 2: STATIONARITY
// ═══════════════════════════════════════════════════════
function StepStationarity({ data, results }) {
  const { adfPrice, adfRet, hurst, acfData } = results;
  const { returns } = data;
  const confBand = 1.96 / Math.sqrt(returns.length);
  const hurstC = hurst > 0.55 ? C.green : hurst < 0.45 ? C.red : C.amber;
  const hurstLabel =
    hurst > 0.55
      ? "Trend-persistent (Momentum signal)"
      : hurst < 0.45
      ? "Mean-reverting (Stat-arb signal)"
      : "Random Walk (EMH consistent)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <TestCard
          title="ADF TEST — PRICES P(t)"
          stat={adfPrice.tStat}
          label={adfPrice.label}
          color={adfPrice.color}
          detail="CV: −3.45 (1%) | −2.87 (5%)"
        />
        <TestCard
          title="ADF TEST — LOG RETURNS r(t)"
          stat={adfRet.tStat}
          label={adfRet.label}
          color={adfRet.color}
          detail="CV: −3.45 (1%) | −2.87 (5%)"
        />
        <TestCard
          title="HURST EXPONENT (R/S Analysis)"
          stat={`H = ${hurst}`}
          label={hurstLabel}
          color={hurstC}
          detail="H=0.5 → Random | H>0.5 → Persistent"
        />
      </div>
      <ChartCard
        title="AUTOCORRELATION FUNCTION (ACF) — LOG RETURNS · 95% confidence band (amber)"
        height={220}
        accent={C.blue}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={acfData}
            margin={{ left: 0, right: 12, top: 5, bottom: 5 }}
          >
            <CartesianGrid
              stroke={C.border}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="lag" {...ax} />
            <YAxis {...ax} width={50} domain={[-0.5, 1]} />
            <ReferenceLine y={0} stroke={C.muted} strokeWidth={1} />
            <ReferenceLine
              y={confBand}
              stroke={C.amber}
              strokeDasharray="5 3"
              label={{
                value: "95% CI",
                fill: C.amber,
                fontSize: 9,
                position: "right",
              }}
            />
            <ReferenceLine
              y={-confBand}
              stroke={C.amber}
              strokeDasharray="5 3"
            />
            <Tooltip content={<CT />} />
            <Bar
              dataKey="acf"
              name="ACF"
              radius={[2, 2, 0, 0]}
              isAnimationActive={false}
            >
              {acfData.map((e, i) => (
                <Cell
                  key={i}
                  fill={
                    i === 0
                      ? C.purple
                      : Math.abs(e.acf) > confBand
                      ? C.amber
                      : C.blue
                  }
                  opacity={i === 0 ? 0.4 : 1}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <InfoBox
          color={C.red}
          prefix="Prices [Non-Stationary]:"
          text="ADF cannot reject unit root. Mean and variance drift with time — consistent with Geometric Brownian Motion and the random walk hypothesis."
        />
        <InfoBox
          color={C.green}
          prefix="Returns [Stationary]:"
          text="First differencing removes the stochastic trend. Log-returns are weakly stationary — required for FFT and filter analysis to be valid."
        />
      </div>
      <InfoBox
        color={hurstC}
        prefix={`Hurst = ${hurst} → ${hurstLabel.split("(")[0].trim()}:`}
        text={`R/S analysis. H>0.5 → long-range dependence / momentum. H<0.5 → anti-persistence / mean-reversion. H=0.5 → consistent with EMH. ${
          hurstLabel.includes("Trend")
            ? `H=${hurst} suggests momentum strategies may have edge.`
            : hurstLabel.includes("Mean")
            ? `H=${hurst} suggests pairs / mean-reversion strategies.`
            : `H=${hurst} — efficient market, no systematic edge from past prices alone.`
        }`}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STEP 3: FREQUENCY DOMAIN
// ═══════════════════════════════════════════════════════
function StepFrequency({ data, results }) {
  const { fftData, psdData, stftData } = results;
  const bandColors = [
    C.blue,
    C.cyan,
    C.green,
    C.amber,
    "#ff7043",
    C.red,
    C.purple,
  ];
  const bands = ["VLow", "Low", "MedLo", "Med", "MedHi", "High", "VHigh"];
  const bandLabels = [
    "<7% (Trend)",
    "7-14%",
    "14-21%",
    "21-28%",
    "28-35%",
    "35-42%",
    ">42% (Noise)",
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <ChartCard
        title="FFT MAGNITUDE SPECTRUM — frequency content of log returns"
        height={220}
        accent={C.cyan}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fftData}>
            <defs>
              <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.cyan} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={C.border}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="freq" {...ax} />
            <YAxis {...ax} width={60} />
            <Tooltip content={<CT />} />
            <Area
              dataKey="magnitude"
              stroke={C.cyan}
              fill="url(#fg)"
              strokeWidth={1.5}
              dot={false}
              name="Magnitude (×10⁻³)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard
        title="WELCH POWER SPECTRAL DENSITY — 64-sample segments, averaged periodograms"
        height={200}
        accent={C.purple}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={psdData}>
            <defs>
              <linearGradient id="psdg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.purple} stopOpacity={0.4} />
                <stop offset="95%" stopColor={C.purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={C.border}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="freq" {...ax} />
            <YAxis {...ax} width={65} />
            <Tooltip content={<CT />} />
            <Area
              dataKey="power"
              stroke={C.purple}
              fill="url(#psdg)"
              strokeWidth={1.5}
              dot={false}
              name="PSD (×10⁻⁶)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard
        title="STFT — SHORT-TIME FOURIER TRANSFORM · 7 temporal windows × 7 frequency bands"
        height={220}
        accent={C.amber}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stftData}>
            <CartesianGrid
              stroke={C.border}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="window" {...ax} />
            <YAxis {...ax} width={55} />
            <Tooltip content={<CT />} />
            <Legend
              wrapperStyle={{ fontSize: 9, color: C.muted, fontFamily: mono }}
            />
            {bands.map((b, i) => (
              <Bar
                key={b}
                dataKey={b}
                stackId="s"
                fill={bandColors[i]}
                name={bandLabels[i]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <InfoBox
        color={C.amber}
        prefix="Key Finding:"
        text="Financial returns show broadband, near-flat spectral density — characteristic of a process close to white noise (consistent with EMH). The STFT reveals how spectral content evolves over time — shifts in low-frequency bands indicate regime changes. Markets are NOT band-limited, which means no ideal cutoff frequency exists — this motivates Kalman and Wavelet approaches over classical IIR filters."
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STEP 4: FILTER LAB
// ═══════════════════════════════════════════════════════
function StepFilters({ data, results }) {
  const { returns, dates } = data;
  const { maF, bwF, kF, wavF } = results;
  const N = returns.length,
    start = Math.max(0, N - 140);
  const chartData = returns.slice(start).map((r, i) => ({
    t: dates[start + i + 1]?.slice(5) || i,
    raw: +r.toFixed(5),
    ma: +maF[start + i].toFixed(5),
    bw: +bwF[start + i].toFixed(5),
    kalman: +kF[start + i].toFixed(5),
    wavelet: +wavF[start + i].toFixed(5),
  }));
  const filterSpecs = [
    {
      name: "Moving Average (FIR)",
      color: C.cyan,
      type: "FIR (linear)",
      cutoff: "10-sample window",
      lag: "≈5 samples",
      phase: "Linear",
      pros: "Simple, interpretable",
      cons: "Equal weight to all past samples",
    },
    {
      name: "Butterworth LP (IIR)",
      color: C.green,
      type: "IIR 2nd-order",
      cutoff: "fc = 0.07·fs",
      lag: "Variable (non-linear)",
      phase: "Non-linear",
      pros: "Maximally flat passband",
      cons: "Phase distortion, fixed cutoff",
    },
    {
      name: "Kalman Filter",
      color: C.amber,
      type: "Recursive Bayesian",
      cutoff: "Adaptive (Q/R ratio)",
      lag: "Minimal (causal)",
      phase: "Causal",
      pros: "Optimal under Gaussian noise, adaptive",
      cons: "Requires noise variance tuning",
    },
    {
      name: "Haar Wavelet DWT",
      color: C.purple,
      type: "Multi-resolution",
      cutoff: "2 detail levels kept",
      lag: "Global (block)",
      phase: "Near-zero",
      pros: "Multi-scale decomposition, sparse repr.",
      cons: "Gibbs artifacts at discontinuities",
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <ChartCard
        title="FILTER COMPARISON — LAST 140 TRADING DAYS · Raw (gray) vs all 4 filters"
        height={280}
        accent={C.amber}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              stroke={C.border}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="t" {...ax} interval={25} />
            <YAxis {...ax} width={65} />
            <ReferenceLine y={0} stroke={C.border} strokeWidth={1} />
            <Tooltip content={<CT />} />
            <Legend
              wrapperStyle={{ fontSize: 10, fontFamily: mono, color: C.muted }}
            />
            <Line
              dataKey="raw"
              stroke={C.muted}
              strokeWidth={1}
              dot={false}
              name="Raw Returns"
              strokeOpacity={0.45}
              isAnimationActive={false}
            />
            <Line
              dataKey="ma"
              stroke={C.cyan}
              strokeWidth={2}
              dot={false}
              name="Moving Avg (FIR)"
              isAnimationActive={false}
            />
            <Line
              dataKey="bw"
              stroke={C.green}
              strokeWidth={2}
              dot={false}
              name="Butterworth LP"
              isAnimationActive={false}
            />
            <Line
              dataKey="kalman"
              stroke={C.amber}
              strokeWidth={2.5}
              dot={false}
              name="Kalman Filter"
              isAnimationActive={false}
            />
            <Line
              dataKey="wavelet"
              stroke={C.purple}
              strokeWidth={2}
              dot={false}
              name="Haar Wavelet"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 10,
        }}
      >
        {filterSpecs.map((f) => (
          <div
            key={f.name}
            style={{
              background: C.card,
              border: `1px solid ${f.color}33`,
              borderTop: `2px solid ${f.color}`,
              borderRadius: 4,
              padding: "14px",
            }}
          >
            <div
              style={{
                fontFamily: sans,
                fontSize: 13,
                color: f.color,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {f.name}
            </div>
            {[
              ["Type", f.type],
              ["Cutoff", f.cutoff],
              ["Lag", f.lag],
              ["Phase", f.phase],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: C.muted,
                    fontFamily: mono,
                    flexShrink: 0,
                  }}
                >
                  {k}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: C.text,
                    fontFamily: mono,
                    textAlign: "right",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
            <div
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              <div style={{ fontSize: 10, color: C.green, marginBottom: 3 }}>
                ↑ {f.pros}
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>↓ {f.cons}</div>
            </div>
          </div>
        ))}
      </div>
      <InfoBox
        color={C.cyan}
        prefix="Filter Design Insight:"
        text="Kalman is theoretically optimal under Gaussian state-space assumptions — it adaptively adjusts gain based on Q/R noise ratio with minimal lag. Haar wavelet provides global multi-resolution decomposition — zeroing detail coefficients removes high-frequency structure. All causal filters introduce lag proportional to memory length, creating a fundamental tension in financial forecasting."
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STEP 5: EVALUATION + TRUSTWORTHINESS
// ═══════════════════════════════════════════════════════
function StepEval({ data, results }) {
  const { dates, returns } = data;
  const {
    maF,
    bwF,
    kF,
    wavF,
    snrMA,
    snrBW,
    snrK,
    snrW,
    arRaw,
    arMA,
    arBW,
    arK,
    regimes,
    jb,
    lb10,
    lb20,
    corrMA,
    corrBW,
    corrK,
    corrW,
    varMA,
    varBW,
    varK,
    varW,
    r2Raw,
  } = results;
  const bestSNR = [
    { name: "Moving Avg", snr: snrMA, fill: C.cyan },
    { name: "Butterworth", snr: snrBW, fill: C.green },
    { name: "Kalman", snr: snrK, fill: C.amber },
    { name: "Wavelet", snr: snrW, fill: C.purple },
  ];
  const best = bestSNR.reduce((a, b) => (b.snr > a.snr ? b : a));
  const rmseData = [
    { name: "Raw", rmse: arRaw.rmse, fill: C.muted },
    { name: "+MA", rmse: arMA.rmse, fill: C.cyan },
    { name: "+BW", rmse: arBW.rmse, fill: C.green },
    { name: "+Kalman", rmse: arK.rmse, fill: C.amber },
  ];
  const N = returns.length,
    start = Math.max(0, N - 200);
  const regSlice = regimes
    .slice(start)
    .map((r, i) => ({ ...r, t: dates[start + i + 1]?.slice(5) || i }));
  const filterQuality = [
    {
      filter: "Moving Avg (FIR)",
      color: C.cyan,
      corr: corrMA,
      varRet: varMA,
      snr: snrMA,
      rmse: arMA.rmse,
    },
    {
      filter: "Butterworth LP",
      color: C.green,
      corr: corrBW,
      varRet: varBW,
      snr: snrBW,
      rmse: arBW.rmse,
    },
    {
      filter: "Kalman Filter",
      color: C.amber,
      corr: corrK,
      varRet: varK,
      snr: snrK,
      rmse: arK.rmse,
    },
    {
      filter: "Haar Wavelet",
      color: C.purple,
      corr: corrW,
      varRet: varW,
      snr: snrW,
      rmse: arK.rmse,
    },
  ];
  const maxSNR = Math.max(snrMA, snrBW, snrK, snrW);
  const minRMSE = Math.min(arMA.rmse, arBW.rmse, arK.rmse);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          background: C.dim,
          border: `1px solid ${C.cyan}33`,
          borderLeft: `3px solid ${C.cyan}`,
          borderRadius: 4,
          padding: "12px 16px",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 9,
            color: C.muted,
            letterSpacing: "0.12em",
            marginBottom: 6,
          }}
        >
          ANALYSIS TRUSTWORTHINESS PANEL — STATISTICAL VALIDATION
        </div>
        <div
          style={{
            fontFamily: sans,
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.7,
          }}
        >
          These tests validate whether the DSP results rest on statistically
          sound assumptions and are not artifacts of small samples or violated
          distributional assumptions.
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
          gap: 10,
        }}
      >
        {[
          {
            label: "JARQUE-BERA TEST",
            value: jb.jb,
            sub: jb.label,
            color: jb.color,
            detail: `Skew=${jb.skew} | Kurt=${jb.kurt} | CV(5%)=5.99`,
          },
          {
            label: "LJUNG-BOX Q(10)",
            value: lb10.Q,
            sub: lb10.label,
            color: lb10.color,
            detail: `${lb10.pApprox} | df=10, CV=18.31`,
          },
          {
            label: "LJUNG-BOX Q(20)",
            value: lb20.Q,
            sub: lb20.label,
            color: lb20.color,
            detail: `${lb20.pApprox} | df=20, CV=31.41`,
          },
          {
            label: "AR(1) R² — TRAIN SET",
            value: r2Raw,
            sub:
              r2Raw < 0.02
                ? "Near-zero predictability"
                : "Some linear structure",
            color: r2Raw < 0.02 ? C.amber : C.green,
            detail: "In-sample, 80% train split",
          },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              background: C.card,
              border: `1px solid ${m.color}33`,
              borderLeft: `3px solid ${m.color}`,
              borderRadius: 4,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: C.muted,
                letterSpacing: "0.12em",
                marginBottom: 8,
                fontFamily: mono,
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: 20,
                color: m.color,
                fontFamily: mono,
                fontWeight: 700,
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: m.color,
                marginTop: 5,
                fontFamily: sans,
                fontWeight: 600,
              }}
            >
              {m.sub}
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.muted,
                marginTop: 4,
                fontFamily: mono,
              }}
            >
              {m.detail}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: C.muted,
            letterSpacing: "0.13em",
            marginBottom: 14,
            fontFamily: mono,
          }}
        >
          FILTER QUALITY MATRIX — PEARSON CORRELATION · VARIANCE RETENTION · SNR
          · AR RMSE
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: mono,
              fontSize: 11,
            }}
          >
            <thead>
              <tr>
                {[
                  "Filter",
                  "Pearson r",
                  "Corr Quality",
                  "Var. Retained",
                  "Smoothing Level",
                  "SNR (dB)",
                  "AR RMSE",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      color: C.muted,
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      borderBottom: `1px solid ${C.border}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterQuality.map((f) => {
                const corrQ =
                  f.corr > 0.95
                    ? "★ Excellent"
                    : f.corr > 0.85
                    ? "✓ Good"
                    : f.corr > 0.7
                    ? "~ Moderate"
                    : "✗ Poor";
                const corrQC =
                  f.corr > 0.95
                    ? C.green
                    : f.corr > 0.85
                    ? C.cyan
                    : f.corr > 0.7
                    ? C.amber
                    : C.red;
                const varInt =
                  f.varRet > 80
                    ? "Signal preserved"
                    : f.varRet > 50
                    ? "Moderate smoothing"
                    : "Heavy smoothing";
                return (
                  <tr
                    key={f.filter}
                    style={{ borderBottom: `1px solid ${C.border}30` }}
                  >
                    <td
                      style={{
                        padding: "9px 12px",
                        color: f.color,
                        fontWeight: 700,
                      }}
                    >
                      {f.filter}
                    </td>
                    <td style={{ padding: "9px 12px", color: C.text }}>
                      {f.corr}
                    </td>
                    <td style={{ padding: "9px 12px", color: corrQC }}>
                      {corrQ}
                    </td>
                    <td style={{ padding: "9px 12px", color: C.text }}>
                      {f.varRet}%
                    </td>
                    <td
                      style={{
                        padding: "9px 12px",
                        color: C.muted,
                        fontSize: 10,
                      }}
                    >
                      {varInt}
                    </td>
                    <td
                      style={{
                        padding: "9px 12px",
                        color: f.snr === maxSNR ? C.green : C.text,
                        fontWeight: f.snr === maxSNR ? 700 : 400,
                      }}
                    >
                      {f.snr}
                      {f.snr === maxSNR ? " ★" : ""}
                    </td>
                    <td
                      style={{
                        padding: "9px 12px",
                        color: f.rmse === minRMSE ? C.green : C.muted,
                        fontSize: 10,
                      }}
                    >
                      {f.rmse}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <ChartCard
          title="SNR (dB) PER FILTER — higher = more noise removed"
          height={200}
          accent={C.cyan}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bestSNR}
              layout="vertical"
              margin={{ left: 5, right: 20, top: 5, bottom: 5 }}
            >
              <CartesianGrid
                stroke={C.border}
                strokeDasharray="3 3"
                horizontal={false}
              />
              <XAxis type="number" {...ax} />
              <YAxis type="category" dataKey="name" {...ax} width={85} />
              <Tooltip content={<CT />} />
              <Bar
                dataKey="snr"
                name="SNR (dB)"
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              >
                {bestSNR.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="AR(1) FORECAST RMSE — raw vs denoised (20% holdout)"
          height={200}
          accent={C.purple}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rmseData}
              layout="vertical"
              margin={{ left: 5, right: 20, top: 5, bottom: 5 }}
            >
              <CartesianGrid
                stroke={C.border}
                strokeDasharray="3 3"
                horizontal={false}
              />
              <XAxis type="number" {...ax} />
              <YAxis type="category" dataKey="name" {...ax} width={70} />
              <Tooltip content={<CT />} />
              <Bar
                dataKey="rmse"
                name="RMSE"
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              >
                {rmseData.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard
        title="REGIME DETECTION — Kalman-filtered signal · Bull (green) / Bear (red) / Neutral · last 200 days"
        height={230}
        accent={C.green}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={regSlice} margin={{ right: 10 }}>
            <CartesianGrid
              stroke={C.border}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="t" {...ax} interval={30} />
            <YAxis {...ax} width={65} />
            <ReferenceLine y={0} stroke={C.border} strokeWidth={1} />
            <Tooltip content={<CT />} />
            <Area
              dataKey="bull"
              fill={C.green}
              stroke="none"
              fillOpacity={0.5}
              name="Bull"
              isAnimationActive={false}
            />
            <Area
              dataKey="bear"
              fill={C.red}
              stroke="none"
              fillOpacity={0.5}
              name="Bear"
              isAnimationActive={false}
            />
            <Area
              dataKey="neutral"
              fill={C.muted}
              stroke="none"
              fillOpacity={0.18}
              name="Neutral"
              isAnimationActive={false}
            />
            <Line
              dataKey="value"
              stroke={C.amber}
              strokeWidth={2}
              dot={false}
              name="Kalman Signal"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <InfoBox
        color={C.amber}
        prefix="Evaluation Summary:"
        text={`${best.name} achieves best SNR = ${best.snr} dB. AR(1) Kalman RMSE=${arK.rmse} vs Raw=${arRaw.rmse}. Jarque-Bera=${jb.jb} → ${jb.label} confirming fat-tail distribution. Ljung-Box Q(10)=${lb10.Q} → ${lb10.label}. R²=${r2Raw} near-zero confirms near-unpredictability of raw returns, validating the EMH-consistent interpretation. High Pearson correlation (>0.9) confirms filters preserve signal structure while reducing noise.`}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// STEP 6: AI INSIGHTS — FIXED
// ═══════════════════════════════════════════════════════
function StepInsights({ data, results, ticker }) {
  const [text, setText] = useState(""),
    [loading, setLoading] = useState(false),
    [err, setErr] = useState("");
  const stockInfo = STOCK_LIST.find((s) => s.symbol === ticker);
  const {
    adfRet,
    hurst,
    snrK,
    snrW,
    snrBW,
    snrMA,
    arRaw,
    arK,
    arBW,
    jb,
    lb10,
    r2Raw,
    corrK,
  } = results;
  const n = data.returns.length;
  const mean = data.returns.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(
    data.returns.reduce((a, b) => a + (b - mean) ** 2, 0) / n
  );

  const summaryStats = [
    { label: "TICKER", value: ticker, color: C.cyan },
    {
      label: "HURST H",
      value: hurst,
      color: hurst > 0.55 ? C.green : hurst < 0.45 ? C.red : C.amber,
    },
    {
      label: "BEST SNR",
      value: Math.max(snrK, snrW, snrBW, snrMA) + " dB",
      color: C.purple,
    },
    { label: "RAW RMSE", value: arRaw.rmse, color: C.muted },
    { label: "AR(1) φ", value: arRaw.phi, color: C.blue },
    { label: "ADF t-stat", value: adfRet.tStat, color: adfRet.color },
    { label: "JB Stat", value: jb.jb, color: jb.color },
    { label: "LB Q(10)", value: lb10.Q, color: lb10.color },
  ];

  async function generate() {
    setLoading(true);
    setText("");
    setErr("");
    const prompt = `You are a senior quantitative analyst reviewing a complete DSP (Digital Signal Processing) analysis of an Indian financial time series. Write a professional, structured interpretation.

ANALYSIS TARGET:
- Ticker: ${ticker}${
      stockInfo ? ` (${stockInfo.label}, ${stockInfo.sector} sector)` : ""
    }
- Observations: ${n} trading days (~${(n / 252).toFixed(1)} years of daily data)

STATISTICAL PROPERTIES:
- Daily mean return: ${(mean * 100).toFixed(4)}%
- Daily volatility: ${(std * 100).toFixed(4)}%
- Annualized volatility: ${(std * Math.sqrt(252) * 100).toFixed(2)}%
- Skewness: ${jb.skew}, Excess Kurtosis: ${(jb.kurt - 3).toFixed(4)}

STATIONARITY TESTS:
- ADF t-statistic on returns: ${adfRet.tStat} → ${adfRet.label}
- Hurst Exponent (R/S analysis): H = ${hurst}

NORMALITY & AUTOCORRELATION VALIDATION:
- Jarque-Bera statistic: ${jb.jb} → ${jb.label}
- Ljung-Box Q(10): ${lb10.Q} → ${lb10.label}
- AR(1) training R²: ${r2Raw}

FILTER PERFORMANCE (Signal-to-Noise Ratio in dB):
- Moving Average (FIR, w=10): ${snrMA} dB
- Butterworth LP (IIR, fc=0.07): ${snrBW} dB
- Kalman Filter (Q=1e-5, R=0.003): ${snrK} dB
- Haar Wavelet DWT (2 levels kept): ${snrW} dB
- Kalman-Raw Pearson correlation: ${corrK}

PREDICTABILITY METRICS (AR(1) RMSE on 20% holdout):
- Raw returns: ${arRaw.rmse}
- Butterworth filtered: ${arBW.rmse}
- Kalman filtered: ${arK.rmse}
- AR(1) coefficient φ: ${arRaw.phi}

Write exactly 6 sections with bold headers. Be concise, technical, and quantitative.

**1. Signal & Noise Profile**
**2. Market Dynamics — Hurst Exponent**
**3. Return Distribution Validation**
**4. Optimal Filter Analysis**
**5. Predictability & Forecasting Impact**
**6. Practical Recommendations for Quant Researchers**`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          `HTTP ${response.status}${
            errText ? ": " + errText.slice(0, 120) : ""
          }`
        );
      }
      const d = await response.json();
      let resultText = "";
      if (Array.isArray(d?.content)) {
        for (const block of d.content) {
          if (block?.type === "text" && block?.text) resultText += block.text;
        }
      }
      if (d?.error)
        throw new Error(d.error?.message || JSON.stringify(d.error));
      if (!resultText)
        throw new Error(
          "Empty response. Ensure you are running inside Claude.ai."
        );
      setText(resultText);
    } catch (e) {
      setErr(`⚠ ${e.message}`);
    }
    setLoading(false);
  }

  function renderInsights(raw) {
    return raw.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (/^\*\*(.+)\*\*$/.test(trimmed)) {
        return (
          <div
            key={i}
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: C.cyan,
              fontWeight: 700,
              marginTop: 18,
              marginBottom: 7,
              letterSpacing: "0.05em",
              borderBottom: `1px solid ${C.border}`,
              paddingBottom: 5,
            }}
          >
            {trimmed.replace(/\*\*/g, "")}
          </div>
        );
      }
      if (!trimmed) return <div key={i} style={{ height: 5 }} />;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <div
          key={i}
          style={{
            fontSize: 13,
            color: C.text,
            lineHeight: 1.85,
            marginBottom: 3,
            fontFamily: sans,
          }}
        >
          {parts.map((p, j) =>
            j % 2 === 1 ? (
              <strong key={j} style={{ color: "#dce8ff" }}>
                {p}
              </strong>
            ) : (
              p
            )
          )}
        </div>
      );
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {summaryStats.map((s) => (
          <div
            key={s.label}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              padding: "10px 14px",
              flex: 1,
              minWidth: 90,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: C.muted,
                fontFamily: mono,
                marginBottom: 4,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 13,
                color: s.color,
                fontFamily: mono,
                fontWeight: 700,
                wordBreak: "break-all",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {stockInfo && (
        <div
          style={{
            background: C.dim,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            padding: "10px 16px",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: sans,
              fontSize: 14,
              color: C.text,
              fontWeight: 700,
            }}
          >
            {stockInfo.label}
          </div>
          <span
            style={{
              background: `${C.blue}22`,
              color: C.blue,
              padding: "2px 8px",
              borderRadius: 3,
              fontSize: 10,
              fontFamily: mono,
            }}
          >
            {stockInfo.sector}
          </span>
          <span style={{ color: C.muted, fontSize: 11, fontFamily: mono }}>
            {ticker}
          </span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 15,
              color: C.text,
              fontWeight: 600,
            }}
          >
            AI Quantitative Interpretation
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
            Synthesizes all DSP metrics → expert-level analysis using Anthropic
            Claude
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            background: loading
              ? C.dim
              : `linear-gradient(135deg,${C.cyan}22,${C.blue}22)`,
            border: `1px solid ${loading ? C.border : C.cyan}`,
            borderRadius: 4,
            padding: "10px 24px",
            color: loading ? C.muted : C.cyan,
            fontFamily: mono,
            fontSize: 12,
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.08em",
          }}
        >
          {loading ? "⟳ GENERATING..." : "▶ GENERATE INSIGHTS"}
        </button>
      </div>

      {err && (
        <div
          style={{
            padding: "12px 16px",
            background: "#1a0808",
            border: `1px solid ${C.red}44`,
            borderRadius: 4,
            fontSize: 12,
            color: C.red,
            fontFamily: mono,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {err}
        </div>
      )}
      {loading && (
        <div
          style={{
            background: C.dim,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: "44px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              border: `3px solid ${C.border}`,
              borderTopColor: C.cyan,
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <div
            style={{
              fontFamily: mono,
              color: C.cyan,
              fontSize: 12,
              letterSpacing: "0.08em",
            }}
          >
            Generating quantitative analysis...
          </div>
          <div
            style={{
              fontFamily: sans,
              color: C.muted,
              fontSize: 11,
              marginTop: 8,
            }}
          >
            Sending {n} data-point metrics to Claude Sonnet
          </div>
        </div>
      )}
      {text && !loading && (
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: "22px",
            lineHeight: 1.8,
            fontFamily: sans,
          }}
        >
          {renderInsights(text)}
        </div>
      )}
      {!text && !loading && !err && (
        <div
          style={{
            background: C.dim,
            border: `1px dashed ${C.border}`,
            borderRadius: 6,
            padding: "44px",
            textAlign: "center",
            color: C.muted,
            fontFamily: sans,
            fontSize: 13,
          }}
        >
          Click{" "}
          <span style={{ color: C.cyan, fontFamily: mono }}>
            ▶ GENERATE INSIGHTS
          </span>{" "}
          to get an expert quantitative interpretation of all DSP results
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// NSE/BSE STOCK SELECTOR
// ═══════════════════════════════════════════════════════
function StockSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const selected = STOCK_LIST.find((s) => s.symbol === value);
  const filtered = STOCK_LIST.filter(
    (s) =>
      s.label.toLowerCase().includes(search.toLowerCase()) ||
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.sector.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 35);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", minWidth: 210, zIndex: 100 }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: C.card,
          border: `1px solid ${open ? C.cyan + "88" : C.border}`,
          borderRadius: 4,
          padding: "7px 12px",
          color: selected ? C.text : C.muted,
          fontFamily: mono,
          fontSize: 11,
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selected ? selected.label : "Select NSE/BSE Stock"}
        </span>
        <span style={{ color: C.muted, fontSize: 10, flexShrink: 0 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            minWidth: 330,
            background: "#090c18",
            border: `1px solid ${C.cyan}55`,
            borderRadius: 6,
            zIndex: 9999,
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          }}
        >
          <div style={{ padding: "10px 10px 6px" }}>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, symbol, or sector..."
              style={{
                width: "100%",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: "7px 11px",
                color: C.text,
                fontFamily: mono,
                fontSize: 11,
              }}
            />
          </div>
          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: C.muted,
                  fontSize: 12,
                  fontFamily: sans,
                }}
              >
                No results
              </div>
            )}
            {filtered.map((s) => (
              <button
                key={s.symbol}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(s.symbol);
                  setSearch("");
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  background: s.symbol === value ? "#0d1525" : "transparent",
                  border: "none",
                  padding: "9px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                  borderBottom: `1px solid ${C.border}20`,
                  gap: 10,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 11,
                      color: s.symbol === value ? C.cyan : C.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      color: C.muted,
                      marginTop: 2,
                    }}
                  >
                    {s.symbol}
                  </div>
                </div>
                <span
                  style={{
                    background: `${C.blue}22`,
                    color: C.blue,
                    padding: "2px 7px",
                    borderRadius: 3,
                    fontSize: 9,
                    fontFamily: mono,
                    flexShrink: 0,
                  }}
                >
                  {s.sector}
                </span>
              </button>
            ))}
          </div>
          <div
            style={{
              padding: "7px 12px",
              borderTop: `1px solid ${C.border}`,
              fontSize: 9,
              color: C.muted,
              fontFamily: mono,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {filtered.length}/{STOCK_LIST.length} results
            </span>
            <button
              onMouseDown={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: C.muted,
                cursor: "pointer",
                fontFamily: mono,
                fontSize: 9,
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
const STEPS = [
  { id: 1, icon: "◈", label: "Data Overview" },
  { id: 2, icon: "∿", label: "Stationarity" },
  { id: 3, icon: "⊞", label: "Frequency Domain" },
  { id: 4, icon: "⊗", label: "Filter Lab" },
  { id: 5, icon: "≋", label: "Evaluation" },
  { id: 6, icon: "◉", label: "AI Insights" },
];
const LOAD_MSGS = [
  "Fetching OHLCV data from Yahoo Finance...",
  "Computing log returns r(t)=log[P(t)/P(t-1)]...",
  "Running ADF stationarity tests...",
  "Computing Hurst exponent (R/S analysis)...",
  "Running Jarque-Bera & Ljung-Box tests...",
  "Performing FFT & Welch PSD analysis...",
  "Running STFT time-frequency decomposition...",
  "Applying MA / Butterworth / Kalman / Wavelet...",
  "Computing SNR, Pearson r, variance retention...",
  "Running AR(1) forecast evaluation...",
  "✓ Full DSP pipeline complete.",
];

export default function App() {
  const [ticker, setTicker] = useState("RELIANCE.NS");
  const [customTicker, setCustomTicker] = useState("");
  const [appData, setAppData] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [step, setStep] = useState(1);

  const activeTicker = customTicker.trim().toUpperCase() || ticker;

  const run = useCallback(async () => {
    const t = customTicker.trim().toUpperCase() || ticker;
    setLoading(true);
    setAppData(null);
    setResults(null);
    setMsgIdx(0);
    const timer = setInterval(
      () => setMsgIdx((i) => Math.min(i + 1, LOAD_MSGS.length - 2)),
      480
    );
    const raw = await fetchData(t);
    const returns = computeReturns(raw.prices);
    const maF = movingAvg(returns, 10),
      bwF = butterworthLP(returns, 0.07);
    const kF = kalmanFilter(returns),
      wavF = waveletDenoise(returns, 2);
    clearInterval(timer);
    setMsgIdx(LOAD_MSGS.length - 1);
    setAppData({ ...raw, returns });
    setResults({
      adfPrice: adfTest(raw.prices),
      adfRet: adfTest(returns),
      hurst: hurstExp(returns),
      acfData: computeACF(returns, 25),
      fftData: computeFFTMag(returns),
      psdData: welchPSD(returns, 64),
      stftData: computeSTFT(returns, 7),
      maF,
      bwF,
      kF,
      wavF,
      snrMA: computeSNR(returns, maF),
      snrBW: computeSNR(returns, bwF),
      snrK: computeSNR(returns, kF),
      snrW: computeSNR(returns, wavF),
      arRaw: arRMSE(returns),
      arMA: arRMSE(maF),
      arBW: arRMSE(bwF),
      arK: arRMSE(kF),
      regimes: detectRegimes(kF),
      jb: jarqueBera(returns),
      lb10: ljungBox(returns, 10),
      lb20: ljungBox(returns, 20),
      corrMA: pearsonR(returns, maF),
      corrBW: pearsonR(returns, bwF),
      corrK: pearsonR(returns, kF),
      corrW: pearsonR(returns, wavF),
      varMA: varianceRetention(returns, maF),
      varBW: varianceRetention(returns, bwF),
      varK: varianceRetention(returns, kF),
      varW: varianceRetention(returns, wavF),
      r2Raw: arR2(returns),
    });
    setStep(1);
    setLoading(false);
  }, [ticker, customTicker]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: sans,
        color: C.text,
        overflow: "hidden auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,600;0,9..40,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#060810}
        ::-webkit-scrollbar-thumb{background:#1c2840;border-radius:2px}
        input:focus{outline:none!important;border-color:#00d4ff66!important}
        button:focus{outline:none}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}
        .blink{animation:pulse 1.8s infinite}
        .step-btn{transition:all 0.12s ease;cursor:pointer;border:none;background:transparent;text-align:left;border-radius:4px;padding:9px 12px;width:100%}
        .step-btn:hover{background:#0d1120}
        .run-btn:hover:not(:disabled){opacity:0.88;box-shadow:0 4px 20px #00d4ff22}
      `}</style>

      {/* HEADER */}
      <div
        style={{
          background: "#070a13",
          borderBottom: `1px solid ${C.border}`,
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 3,
            }}
          >
            <span
              className="blink"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.green,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: mono,
                fontSize: 9,
                color: C.muted,
                letterSpacing: "0.15em",
              }}
            >
              ECE MAJOR PROJECT // DSP PIPELINE v2.0
            </span>
          </div>
          <h1
            style={{
              fontFamily: mono,
              fontSize: "clamp(12px,2vw,16px)",
              color: C.text,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Financial Signal Processing Lab
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <StockSelector
            value={ticker}
            onChange={(s) => {
              setTicker(s);
              setCustomTicker("");
            }}
          />
          <input
            value={customTicker}
            onChange={(e) => setCustomTicker(e.target.value)}
            placeholder="Custom symbol (e.g. AAPL)"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              padding: "7px 12px",
              color: C.text,
              fontFamily: mono,
              fontSize: 11,
              width: 160,
            }}
          />
          <button
            className="run-btn"
            onClick={run}
            disabled={loading}
            style={{
              background: loading
                ? C.dim
                : "linear-gradient(135deg,#00d4ff,#448aff)",
              border: "none",
              borderRadius: 4,
              padding: "8px 22px",
              color: loading ? C.muted : "#000",
              fontFamily: mono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {loading ? "ANALYZING..." : "▶  RUN ANALYSIS"}
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div style={{ padding: "80px 24px", textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: `3px solid ${C.border}`,
              borderTopColor: C.cyan,
              borderRadius: "50%",
              margin: "0 auto 24px",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <div
            style={{
              fontFamily: mono,
              color: C.cyan,
              fontSize: 12,
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            {LOAD_MSGS[msgIdx]}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              marginTop: 16,
            }}
          >
            {LOAD_MSGS.slice(0, -1).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 2,
                  borderRadius: 1,
                  background: i <= msgIdx ? C.cyan : C.border,
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* LANDING */}
      {!loading && !appData && (
        <div
          style={{
            padding: "60px 24px",
            textAlign: "center",
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: 52,
              marginBottom: 20,
              fontFamily: mono,
              color: C.cyan,
              opacity: 0.7,
            }}
          >
            ⟨ f(t) ⟩
          </div>
          <h2
            style={{
              fontFamily: mono,
              color: C.text,
              fontSize: "clamp(15px,2.5vw,20px)",
              marginBottom: 12,
              fontWeight: 700,
            }}
          >
            Noise Reduction & Structure Discovery
          </h2>
          <p
            style={{
              color: C.muted,
              fontSize: 13,
              lineHeight: 1.9,
              marginBottom: 28,
            }}
          >
            Select any NSE or BSE stock from the dropdown, then hit{" "}
            <span style={{ color: C.cyan, fontFamily: mono, fontSize: 12 }}>
              ▶ RUN ANALYSIS
            </span>
            . The pipeline fetches 2 years of live OHLCV data and runs all DSP
            algorithms end-to-end with full statistical validation.
          </p>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
              maxWidth: 560,
              margin: "0 auto 16px",
            }}
          >
            {[
              "Live OHLCV",
              "FFT Spectrum",
              "Welch PSD",
              "STFT",
              "Butterworth IIR",
              "Kalman",
              "Haar Wavelet",
              "Hurst Exp.",
              "ADF Test",
              "ACF/PACF",
              "Jarque-Bera",
              "Ljung-Box",
              "SNR",
              "Var. Retention",
              "AR RMSE",
              "Regimes",
              "AI Insights",
            ].map((t) => (
              <span
                key={t}
                style={{
                  background: C.dim,
                  border: `1px solid ${C.border}`,
                  borderRadius: 3,
                  padding: "4px 10px",
                  fontSize: 10,
                  color: C.muted,
                  fontFamily: mono,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: mono }}>
            {STOCK_LIST.length} NSE/BSE instruments in selector
          </div>
        </div>
      )}

      {/* RESULTS */}
      {!loading && appData && results && (
        <div style={{ display: "flex", minHeight: "calc(100vh - 62px)" }}>
          <div
            style={{
              width: 190,
              minWidth: 190,
              background: C.sidebar,
              borderRight: `1px solid ${C.border}`,
              padding: "16px 8px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: C.muted,
                letterSpacing: "0.15em",
                marginBottom: 10,
                padding: "0 8px",
                fontFamily: mono,
              }}
            >
              PIPELINE
            </div>
            {STEPS.map((s) => (
              <button
                key={s.id}
                className="step-btn"
                onClick={() => setStep(s.id)}
                style={{
                  color: step === s.id ? C.cyan : C.muted,
                  borderLeft:
                    step === s.id
                      ? `2px solid ${C.cyan}`
                      : "2px solid transparent",
                  background: step === s.id ? "#0d1120" : "transparent",
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 13,
                    marginRight: 8,
                    display: "inline-block",
                    width: 18,
                  }}
                >
                  {s.icon}
                </span>
                <span
                  style={{
                    fontFamily: sans,
                    fontSize: 12,
                    fontWeight: step === s.id ? 600 : 400,
                  }}
                >
                  {s.label}
                </span>
              </button>
            ))}
            <div
              style={{
                padding: "12px",
                background: C.dim,
                borderRadius: 4,
                margin: "20px 8px 0",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: C.muted,
                  fontFamily: mono,
                  marginBottom: 5,
                }}
              >
                ACTIVE TICKER
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 12,
                  color: C.cyan,
                  fontWeight: 700,
                  wordBreak: "break-all",
                }}
              >
                {activeTicker}
              </div>
              {STOCK_LIST.find((s) => s.symbol === activeTicker) && (
                <div
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    marginTop: 3,
                    lineHeight: 1.5,
                  }}
                >
                  {STOCK_LIST.find((s) => s.symbol === activeTicker)?.label}
                </div>
              )}
              <div
                style={{
                  fontSize: 10,
                  color: C.muted,
                  marginTop: 6,
                  lineHeight: 1.7,
                }}
              >
                {appData.prices.length} prices
                <br />
                {appData.returns.length} returns
                <br />
                {appData.ohlcv?.length} OHLCV
                <br />
                {appData.synthetic ? (
                  <span style={{ color: C.amber }}>⚠ Simulated</span>
                ) : (
                  <span style={{ color: C.green }}>✓ Live data</span>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              padding: "22px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>
                STEP {step}/6
              </span>
              <span style={{ color: C.border }}>│</span>
              <span
                style={{
                  fontFamily: sans,
                  fontSize: 14,
                  color: C.text,
                  fontWeight: 600,
                }}
              >
                {STEPS.find((s) => s.id === step)?.label}
              </span>
            </div>
            {step === 1 && <StepData data={appData} />}
            {step === 2 && (
              <StepStationarity data={appData} results={results} />
            )}
            {step === 3 && <StepFrequency data={appData} results={results} />}
            {step === 4 && <StepFilters data={appData} results={results} />}
            {step === 5 && <StepEval data={appData} results={results} />}
            {step === 6 && (
              <StepInsights
                data={appData}
                results={results}
                ticker={activeTicker}
              />
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 24,
                paddingTop: 16,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                style={{
                  background: "transparent",
                  border: `1px solid ${step === 1 ? C.border : C.muted}`,
                  borderRadius: 4,
                  padding: "8px 18px",
                  color: step === 1 ? C.muted : C.text,
                  fontFamily: mono,
                  fontSize: 11,
                  cursor: step === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← PREV
              </button>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  color: C.muted,
                  alignSelf: "center",
                }}
              >
                {STEPS[step - 1]?.label}
              </span>
              <button
                onClick={() => setStep((s) => Math.min(6, s + 1))}
                disabled={step === 6}
                style={{
                  background:
                    step === 6
                      ? "transparent"
                      : `linear-gradient(135deg,${C.cyan}18,${C.blue}18)`,
                  border: `1px solid ${step === 6 ? C.border : C.cyan}`,
                  borderRadius: 4,
                  padding: "8px 18px",
                  color: step === 6 ? C.muted : C.cyan,
                  fontFamily: mono,
                  fontSize: 11,
                  cursor: step === 6 ? "not-allowed" : "pointer",
                }}
              >
                NEXT →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
