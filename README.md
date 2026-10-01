# XM Trading Risk Calculator (React)

A small React/Vite calculator for risk-based position sizing.

## Run
```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## What it calculates
- Risk amount from account balance and risk %
- Stop-loss distance in pips
- Position size in standard lots
- Potential reward
- Risk/reward ratio
- Approximate margin using leverage
- Maximum theoretical exposure

## Important
The margin calculation is an approximation intended for USD-quoted forex pairs. Verify XM's instrument contract size, pip value, margin rules, spread and other trading conditions before placing an order.
