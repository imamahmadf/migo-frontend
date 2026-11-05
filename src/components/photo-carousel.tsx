"use client";

import { useEffect, useState } from "react";
import type { GalleryPhoto } from "@/content/photo";

export function PhotoCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = photos.length;
  const current = photos[index] ?? photos[0];

  useEffect(() => {
    if (count < 2 || paused) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (!current) return null;

  function show(target: number) {
    setIndex(((target % count) + count) % count);
  }

  return (
    <div
      className="mt-10"
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeri foto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          {photos.map((photo, slide) => (
            <article key={photo.id} className="grid w-full min-w-full shrink-0 lg:grid-cols-2" aria-hidden={photo.id !== current.id}>
              <img src={photo.image} alt={photo.title} className="h-72 w-full object-cover sm:h-96 lg:h-full" />
              <div className="flex flex-col justify-center px-6 py-8 sm:px-10">
                <p className="text-xs font-semibold tracking-[0.16em] text-[#e30b29] uppercase">
                  {String(slide + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{photo.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">{photo.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {count > 1 ? (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Pilih foto">
            {photos.map((photo, dot) => (
              <button
                key={photo.id}
                type="button"
                role="tab"
                aria-selected={dot === index}
                aria-label={photo.title}
                onClick={() => show(dot)}
                className={dot === index ? "h-2.5 w-7 rounded-full bg-[#e30b29]" : "h-2.5 w-2.5 rounded-full bg-slate-300"}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => show(index - 1)}
              aria-label="Foto sebelumnya"
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors hover:border-[#e30b29] hover:text-[#e30b29]"
            >
              <Arrow direction="left" />
            </button>
            <button
              type="button"
              onClick={() => show(index + 1)}
              aria-label="Foto berikutnya"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#e30b29] text-white transition-colors hover:bg-[#c10d22]"
            >
              <Arrow direction="right" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {direction === "left" ? <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" /> : <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}
