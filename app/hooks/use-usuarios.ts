"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  UseUsuariosResult,
  UsuariosFilters,
  UsuariosMeta,
  Usuario,
} from "@type/user";

export function useUsuarios({
  page = 1,
  pageSize = 25,
  rol = null,
  estado = null,
  q = null,
}: {
  page?: number;
  pageSize?: number;
} & UsuariosFilters = {}): UseUsuariosResult {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [meta, setMeta] = useState<UsuariosMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const qNormalized = useMemo(() => {
    if (!q) return null;
    const v = q.trim();
    return v.length > 0 ? v : null;
  }, [q]);

  const totalPages = useMemo(() => {
    if (!meta?.total) return null;
    return Math.max(1, Math.ceil(meta.total / pageSize));
  }, [meta?.total, pageSize]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      if (rol) params.set("rol", rol);
      if (estado) params.set("estado", estado);
      if (qNormalized) params.set("q", qNormalized);

      const res = await fetch(`/api/usuarios?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const json = (await res.json().catch(() => null)) as {
        data?: Usuario[];
        meta?: UsuariosMeta;
        error?: string;
      } | null;

      if (!res.ok) {
        setError(json?.error || "Error al cargar usuarios");
        return;
      }

      if (!json?.data) {
        setError("Respuesta inválida del servidor");
        return;
      }

      setUsuarios(json.data);
      setMeta(json.meta || null);
    } catch (err) {
      console.error("/api/usuarios error", err);
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, [estado, page, pageSize, qNormalized, rol]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { usuarios, meta, totalPages, loading, error, refresh };
}
