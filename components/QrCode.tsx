"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QrCode({
  value,
  size = 240,
  className = "",
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: "#0a0a0a", light: "#f5f5f5" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className={`bg-white/5 rounded-xl ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <img
      src={dataUrl}
      alt="QR-Code"
      width={size}
      height={size}
      className={`rounded-xl ${className}`}
    />
  );
}
