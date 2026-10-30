"use client";

import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  avatarUrl?: string;
}

export function QRCodeModal({ isOpen, onClose, url, title, avatarUrl }: QRCodeModalProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen || !url) return;
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: {
        dark: "#09090b",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((res) => setDataUrl(res))
      .catch((err) => console.error("QR Code generation error", err));
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `mylink-qr-${title.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 p-6 text-zinc-100 shadow-2xl relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={title}
              className="w-14 h-14 rounded-full border-2 border-indigo-500 shadow-lg object-cover mb-2"
            />
          )}
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-[240px] truncate">{url}</p>
        </div>

        {/* QR Frame */}
        <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6">
          {dataUrl ? (
            <img src={dataUrl} alt="MyLink QR Code" className="w-52 h-52 object-contain" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-zinc-400 text-xs">
              QR 코드 생성 중...
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2">
          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-[0.98]"
          >
            <span>📥</span>
            <span>QR 코드 이미지 다운로드 (.PNG)</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center justify-center gap-2 transition"
          >
            <span>{copied ? "✅" : "🔗"}</span>
            <span>{copied ? "링크가 복사되었습니다!" : "프로필 URL 복사"}</span>
          </button>
        </div>

        <p className="text-[11px] text-zinc-500 mt-4 text-center">
          스마트폰 카메라로 스캔하면 바로 프로필로 이동합니다.
        </p>
      </div>
    </div>
  );
}
