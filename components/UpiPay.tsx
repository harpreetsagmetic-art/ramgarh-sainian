"use client";
import { Check, Copy, Download, Smartphone } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";

type Labels = {
  upiId: string; payee: string; copy: string; copied: string; amount: string;
  amountHint: string; scanQr: string; note: string; saveQr: string; howTitle: string;
  step1: string; step2: string; step3: string; orAnother: string; orId: string;
  safety: string; openApp: string;
};

type Props = {
  upiId: string;
  payee: string;          // screen par dikhne wala naam (Punjabi/English)
  upiName: string;        // UPI link ke liye, sirf English
  showAppButton?: boolean;
  labels: Labels;
};

const QUICK = [101, 251, 501, 1100];

// encodeURIComponent: space ko %20 banata hai (URLSearchParams '+' banata hai, jo UPI apps galat padh sakte hain)
function buildLink(upiId: string, name: string, amount?: string) {
  const parts = [
    `pa=${encodeURIComponent(upiId)}`,
    `pn=${encodeURIComponent(name)}`,
    "cu=INR",
    `tn=${encodeURIComponent("Donation")}`,
  ];
  if (amount) parts.push(`am=${amount}`);
  return `upi://pay?${parts.join("&")}`;
}

export default function UpiPay({ upiId, payee, upiName, showAppButton = false, labels }: Props) {
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const valid = /^\d{1,7}(\.\d{1,2})?$/.test(amount) && Number(amount) > 0;
  const amt = valid ? Number(amount).toFixed(2) : undefined; // "501.00"
  const qrLink = buildLink(upiId, upiName, amt);
  const openLink = buildLink(upiId, upiName); // bina amount ke

  async function copyId() {
    try {
      await navigator.clipboard.writeText(upiId);
    } catch {
      // clipboard sirf HTTPS/localhost par chalta hai: purana tareeka
      const ta = document.createElement("textarea");
      ta.value = upiId;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // QR + naam + UPI ID ek saaf image banakar phone mein save/share karwana
  async function saveQr() {
    const qr = qrRef.current;
    if (!qr) return;

    const pad = 40;
    const w = qr.width + pad * 2;
    const h = qr.height + pad * 2 + 110;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(qr, pad, pad);
    ctx.fillStyle = "#1D2951";
    ctx.textAlign = "center";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(upiName, w / 2, qr.height + pad + 55);
    ctx.font = "24px sans-serif";
    ctx.fillText(amt ? `${upiId}  |  Rs. ${amt}` : upiId, w / 2, qr.height + pad + 95);

    const blob: Blob | null = await new Promise((r) => c.toBlob(r, "image/png"));
    if (!blob) return;
    const file = new File([blob], "donation-upi-qr.png", { type: "image/png" });

    // Phone par: share sheet se "Save image" / gallery mein
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: upiName });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return; // user ne band kiya
      }
    }

    // Baaki jagah: seedha download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donation-upi-qr.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-navy/60">{labels.payee}</p>
        <p className="font-bold">{payee}</p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-cream p-3">
        <div className="min-w-0">
          <p className="text-xs text-navy/60">{labels.upiId}</p>
          <p className="break-all font-mono font-bold">{upiId}</p>
        </div>
        <button
          type="button"
          onClick={copyId}
          className="flex shrink-0 items-center gap-1 rounded-full bg-navy px-3 py-2 text-sm text-gold active:scale-95"
        >
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
          onChange={(e) => setAmount(e.target.value.trim())}
          placeholder="501"
          className="mt-1 w-full rounded-xl border-2 border-navy/20 p-3 text-lg outline-none focus:border-saffron"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              type="button"
              key={q}
              onClick={() => setAmount(String(q))}
              className="rounded-full border border-saffron px-4 py-1.5 text-sm font-medium active:scale-95"
            >
              ₹{q}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-navy/60">{labels.amountHint}</p>
      </div>

      {/* QR */}
      <div className="text-center">
        <div className="inline-block rounded-xl border-4 border-gold bg-white p-3">
          <QRCodeCanvas
            ref={qrRef}
            value={qrLink}
            size={512}
            level="M"
            style={{ width: 210, height: 210 }}
          />
        </div>
        {amt && <p className="mt-2 text-lg font-bold text-saffron">₹{amt}</p>}
        <p className="mt-1 text-sm text-navy/60">{labels.orAnother}</p>
      </div>

      <button
        type="button"
        onClick={saveQr}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-saffron py-3 text-lg font-bold text-navy active:scale-95"
      >
        <Download size={20} /> {labels.saveQr}
      </button>

      {showAppButton && (
        <a
          href={openLink}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-navy py-3 font-bold text-navy active:scale-95"
        >
          <Smartphone size={18} /> {labels.openApp}
        </a>
      )}

      {/* Kaise karein */}
      <div className="rounded-xl bg-cream p-4">
        <h3 className="font-bold">{labels.howTitle}</h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-navy/80">
          <li>{labels.step1}</li>
          <li>{labels.step2}</li>
          <li>{labels.step3}</li>
        </ol>
        <p className="mt-3 text-sm text-navy/70">{labels.orId}</p>
      </div>

      <p className="text-center text-xs font-medium text-navy/70">{labels.safety}</p>
      <p className="text-center text-xs text-navy/60">{labels.note}</p>
    </div>
  );
}