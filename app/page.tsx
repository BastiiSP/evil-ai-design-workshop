"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { NetworkLines } from "@/components/NetworkLines";
import { QrCode } from "@/components/QrCode";

export default function LandingPage() {
  const [playUrl, setPlayUrl] = useState("");

  useEffect(() => {
    setPlayUrl(`${window.location.origin}/play`);
  }, []);

  return (
    <main className="stage relative min-h-screen flex flex-col items-center justify-center px-8 py-12 text-center">
      <NetworkLines intensity={0.22} />

      <div className="relative flex flex-col items-center gap-8 max-w-lg">
        <BrandLogo size="md" className="items-center" />

        <h1 className="text-5xl font-extrabold leading-tight mt-4">
          Evil AI Design
          <br />
          <span className="text-3xl font-light text-[var(--color-fg-muted)]">
            Workshop
          </span>
        </h1>

        <p className="text-lg text-[var(--color-fg-muted)] leading-relaxed">
          Scanne den QR-Code oder öffne den Link auf deinem Smartphone,
          um beim Workshop mitzumachen.
        </p>

        {playUrl && <QrCode value={playUrl} size={240} />}

        <a
          href="/play"
          className="mt-2 inline-block px-8 py-4 rounded-xl bg-[var(--color-brand-turquoise)] text-black font-bold text-lg hover:opacity-90"
        >
          Direkt teilnehmen →
        </a>

        <div className="flex gap-6 text-xs uppercase tracking-widest text-[var(--color-fg-muted)] mt-4">
          <a href="/presenter" className="hover:text-white">
            Presenter
          </a>
          <a href="/admin" className="hover:text-white">
            Admin
          </a>
        </div>
      </div>
    </main>
  );
}
