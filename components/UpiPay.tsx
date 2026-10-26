"use client";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

type Props = {
  upiId: string;
  payee: string;
  labels: {
    upiId: string; payee: string; copy: string; copied: string;
    amount: string; payNow: string; scanQr: string; note: string;
  };
};

const QUICK = [101, 251, 501, 1100];

export default function UpiPay({ upiId, payee, labels }: Props) {
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const valid = /^\d{1,7}(\.\d{1,2})?$/.test(amount) && Number(amount) > 0;
  const link =
    `upi://pay?pa=${encodeURIComponent(upiId)}` +
    `&pn=${encodeURIComponent(payee)}` +
    `&cu=INR&tn=${encodeURIComponent("Donation")}` +
    (valid ? `&am=${amount}` : "");

  async function copyId() {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ਸਿਰਫ਼ HTTPS ਜਾਂ localhost 'ਤੇ ਚੱਲਦਾ ਹੈ */
    }
  }

  return (
    <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-navy/60">{labels.payee}</p>
        <p className="font-bold">{payee}</p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-cream p-3">
        <div>
          <p className="text-xs text-navy/60">{labels.upiId}</p>
          <p className="font-mono font-bold">{upiId}</p>
        </div>
        <button onClick={copyId} className="flex items-center gap-1 rounded-full bg-navy px-3 py-2 text-sm text-gold active:scale-95">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? labels.copied : labels.copy}
        </button>
      </div>

      <div>
        <label htmlFor="amt" className="text-sm font-medium">{labels.amount}</label>
        <input
          id="amt"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="501"
          className="mt-1 w-full rounded-xl border-2 border-navy/20 p-3 text-lg outline-none focus:border-saffron"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button key={q} onClick={() => setAmount(String(q))}
              className="rounded-full border border-saffron px-4 py-1.5 text-sm font-medium active:scale-95">
              ₹{q}
            </button>
          ))}
        </div>
      </div>

      <a href={link} className="block rounded-xl bg-saffron py-3 text-center text-lg font-bold text-navy active:scale-95">
        {labels.payNow}
      </a>

      <div className="text-center">
        <p className="mb-2 text-sm text-navy/60">{labels.scanQr}</p>
        <div className="inline-block rounded-xl border-4 border-gold bg-white p-3">
          <QRCodeSVG value={link} size={180} />
        </div>
      </div>

      <p className="text-center text-xs text-navy/60">{labels.note}</p>
    </div>
  );
}