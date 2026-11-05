"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

type HealthResponse = {
  success: boolean;
  service: string;
  database: {
    connected: boolean;
    message: string;
  };
};

type Status =
  | { state: "loading" }
  | { state: "offline" }
  | { state: "online"; databaseConnected: boolean; databaseMessage: string };

export function ConnectionStatus() {
  const [requestId, setRequestId] = useState(0);
  const [status, setStatus] = useState<Status>({ state: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${apiUrl}/api/health`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          setStatus({ state: "offline" });
          return;
        }

        const data = (await response.json()) as HealthResponse;
        setStatus({
          state: "online",
          databaseConnected: data.database.connected,
          databaseMessage: data.database.message,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setStatus({ state: "offline" });
      });

    return () => controller.abort();
  }, [requestId]);

  const apiLabel =
    status.state === "loading" ? "Memeriksa..." : status.state === "online" ? "Berjalan" : "Tidak terjangkau";
  const databaseLabel =
    status.state === "loading"
      ? "Memeriksa..."
      : status.state === "offline"
        ? "Menunggu API"
        : status.databaseConnected
          ? "Terhubung"
          : "Belum terhubung";

  return (
    <section className="rounded-3xl border border-line bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Status koneksi</h2>
          <p className="mt-1 text-sm text-muted">
            Frontend memanggil <code className="font-mono text-xs">{apiUrl}/api/health</code>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus({ state: "loading" });
            setRequestId((current) => current + 1);
          }}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-brand/40 hover:bg-paper"
        >
          Periksa lagi
        </button>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-paper px-4 py-3">
          <dt className="text-sm text-muted">Express API</dt>
          <dd className="mt-1 font-medium">{apiLabel}</dd>
        </div>
        <div className="rounded-xl bg-paper px-4 py-3">
          <dt className="text-sm text-muted">MySQL</dt>
          <dd className="mt-1 font-medium">{databaseLabel}</dd>
          {status.state === "online" ? (
            <p className="mt-1 text-sm text-muted">{status.databaseMessage}</p>
          ) : null}
        </div>
      </dl>
    </section>
  );
}
