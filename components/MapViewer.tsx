"use client";
import { Maximize, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";

// Poora nakshe ko is chaudai (CSS px) par rakhte hain; screen par zoom isi par hota hai
const IMG_W = 3000;
const CONTENT_H = Math.round((IMG_W * 4967) / 7021); // image ka aspect ratio

type Labels = {
  alt: string; loadingHd: string; zoomIn: string; zoomOut: string; fit: string; region: string;
};

function Controls({ fit, labels }: { fit: number; labels: Labels }) {
  const { zoomIn, zoomOut, centerView } = useControls();
  const btn =
    "flex size-11 items-center justify-center rounded-full bg-navy text-gold shadow-lg active:scale-95";
  return (
    <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2">
      <button type="button" className={btn} aria-label={labels.zoomIn} onClick={() => zoomIn()}>
        <Plus size={20} />
      </button>
      <button type="button" className={btn} aria-label={labels.zoomOut} onClick={() => zoomOut()}>
        <Minus size={20} />
      </button>
      <button type="button" className={btn} aria-label={labels.fit} onClick={() => centerView(fit)}>
        <Maximize size={18} />
      </button>
    </div>
  );
}

export default function MapViewer({
  previewSrc, fullSrc, labels,
}: { previewSrc: string; fullSrc: string; labels: Labels }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const hdRef = useRef<HTMLImageElement>(null);
  const [fit, setFit] = useState<number | null>(null); // poora nakshe screen mein fit hone ka scale
  const [hd, setHd] = useState(false);

  // Box ki chaudai-ucchai napo, aur uske hisaab se "fit" scale nikalo
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      const f = Math.min(el.clientWidth / IMG_W, el.clientHeight / CONTENT_H);
      setFit((prev) => (prev !== null && Math.abs(prev - f) / prev < 0.02 ? prev : f));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Agar HD image cache se pehle hi aa chuki ho to onLoad nahi chalega, isliye yahan check
  useEffect(() => {
    if (hdRef.current?.complete && hdRef.current.naturalWidth > 0) setHd(true);
  }, [fit]);

  return (
    <div
      ref={boxRef}
      role="region"
      aria-label={labels.region}
      className="relative h-[70svh] min-h-80 w-full overflow-hidden rounded-2xl border-4 border-gold bg-navy/10 shadow-lg"
    >
      {fit === null ? (
        <div className="size-full animate-pulse" />
      ) : (
        <TransformWrapper
          key={fit}
          initialScale={fit}
          minScale={fit}
          maxScale={2.5}
          centerOnInit
          limitToBounds
        >
          <Controls fit={fit} labels={labels} />
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%", touchAction: "none" }}
            contentStyle={{ width: IMG_W, height: CONTENT_H }}
          >
            <div style={{ position: "relative", width: IMG_W, height: CONTENT_H }}>
              {/* Neeche halki preview (turant), upar poori saaf image (load hote hi) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt={labels.alt}
                draggable={false}
                className="absolute inset-0 size-full select-none"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={hdRef}
                src={fullSrc}
                alt=""
                aria-hidden="true"
                draggable={false}
                onLoad={() => setHd(true)}
                className={`absolute inset-0 size-full select-none transition-opacity duration-500 ${
                  hd ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      )}

      {!hd && (
        <p
          role="status"
          className="absolute left-3 top-3 z-10 rounded-full bg-navy/90 px-3 py-1 text-xs font-medium text-white"
        >
          {labels.loadingHd}
        </p>
      )}
    </div>
  );
}