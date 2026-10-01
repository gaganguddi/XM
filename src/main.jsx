import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Calculator, ShieldAlert, TrendingUp, Target, WalletCards } from "lucide-react";
import "./styles.css";

const fmt = (n, digits = 2) =>
  Number.isFinite(n)
    ? n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })
    : "—";

function App() {
  const [balance, setBalance] = useState(80.01);
  const [riskPct, setRiskPct] = useState(1);
  const [leverage, setLeverage] = useState(20);
  const [entry, setEntry] = useState(1.10000);
  const [stop, setStop] = useState(1.09800);
  const [target, setTarget] = useState(1.10400);
  const [pipSize, setPipSize] = useState(0.0001);
  const [pipValue, setPipValue] = useState(10);
  const [contractSize, setContractSize] = useState(100000);

  const result = useMemo(() => {
    const b = Number(balance);
    const r = Number(riskPct);
    const lev = Number(leverage);
    const e = Number(entry);
    const s = Number(stop);
    const t = Number(target);
    const ps = Number(pipSize);
    const pv = Number(pipValue);
    const cs = Number(contractSize);

    if ([b, r, lev, e, s, t, ps, pv, cs].some((x) => !Number.isFinite(x) || x <= 0)) return null;

    const riskAmount = b * r / 100;
    const slPips = Math.abs(e - s) / ps;
    const tpPips = Math.abs(t - e) / ps;
    const lots = slPips > 0 ? riskAmount / (slPips * pv) : 0;
    const units = lots * cs;
    // Approximation for USD-quoted forex pairs such as EURUSD/GBPUSD.
    const margin = (units * e) / lev;
    const rewardAmount = tpPips * pv * lots;
    const rr = slPips > 0 ? tpPips / slPips : 0;
    const maxExposure = b * lev;

    return { riskAmount, slPips, tpPips, lots, units, margin, rewardAmount, rr, maxExposure };
  }, [balance, riskPct, leverage, entry, stop, target, pipSize, pipValue, contractSize]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><div className="brandIcon"><Calculator size={20}/></div><div><h1>Trading Risk Calculator</h1><p>Position sizing for your XM account</p></div></div>
        <div className="badge">USD Account</div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <span className="eyebrow">RISK FIRST</span>
            <h2>Plan the trade before you place it.</h2>
            <p>Enter your account and trade setup to calculate risk-based lot size, stop-loss distance, target reward, margin and risk/reward.</p>
          </div>
          <div className="heroCard"><WalletCards size={22}/><span>Starting balance<br/><strong>${fmt(Number(balance))}</strong></span></div>
        </section>

        <div className="grid">
          <section className="card">
            <div className="cardTitle"><WalletCards size={18}/><h3>Account settings</h3></div>
            <Field label="Account balance ($)" value={balance} set={setBalance} step="0.01" />
            <Field label="Risk per trade (%)" value={riskPct} set={setRiskPct} step="0.1" min="0.1" max="5" />
            <div className="row">
              <Field label="Leverage (1:X)" value={leverage} set={setLeverage} step="1" />
              <Field label="Contract size" value={contractSize} set={setContractSize} step="1000" />
            </div>
          </section>

          <section className="card">
            <div className="cardTitle"><TrendingUp size={18}/><h3>Trade setup</h3></div>
            <div className="row">
              <Field label="Entry price" value={entry} set={setEntry} step="0.00001" />
              <Field label="Stop-loss price" value={stop} set={setStop} step="0.00001" />
            </div>
            <Field label="Take-profit price" value={target} set={setTarget} step="0.00001" />
            <div className="row">
              <Field label="Pip size" value={pipSize} set={setPipSize} step="0.00001" />
              <Field label="Pip value / 1.00 lot ($)" value={pipValue} set={setPipValue} step="0.01" />
            </div>
            <p className="hint">For many USD-quoted major forex pairs, 1.00 standard lot is approximately $10 per pip. Verify your instrument's contract specifications in XM.</p>
          </section>
        </div>

        <section className="results">
          <div className="resultHead"><div><span className="eyebrow">CALCULATED PLAN</span><h3>Suggested position size</h3></div><Target size={22}/></div>
          <div className="mainResult">
            <div><span>Lot size</span><strong>{result ? fmt(result.lots, 3) : "—"}</strong><small>standard lots</small></div>
            <div><span>Risk amount</span><strong>${result ? fmt(result.riskAmount) : "—"}</strong><small>{riskPct}% of balance</small></div>
            <div><span>Stop distance</span><strong>{result ? fmt(result.slPips, 1) : "—"}</strong><small>pips</small></div>
          </div>
          <div className="metricGrid">
            <Metric label="Potential reward" value={result ? `$${fmt(result.rewardAmount)}` : "—"} />
            <Metric label="Risk / Reward" value={result ? `1 : ${fmt(result.rr, 2)}` : "—"} />
            <Metric label="Approx. margin" value={result ? `$${fmt(result.margin)}` : "—"} />
            <Metric label="Max theoretical exposure" value={result ? `$${fmt(result.maxExposure)}` : "—"} />
          </div>
        </section>

        <section className="warning">
          <ShieldAlert size={20}/>
          <div><strong>Important</strong><p>This is a planning calculator, not a profit guarantee or trading signal. Margin is an approximation for USD-quoted forex pairs. XM's actual margin, pip value, spreads, swaps and contract specifications can differ by instrument and account.</p></div>
        </section>
      </main>
      <footer>Built for disciplined position sizing • Always verify the final order details in XM before submitting.</footer>
    </div>
  );
}

function Field({ label, value, set, step, min, max }) {
  return <label className="field"><span>{label}</span><input type="number" value={value} step={step} min={min} max={max} onChange={e => set(e.target.value)} /></label>
}

function Metric({ label, value }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>
}

createRoot(document.getElementById("root")).render(<App />);
