// src/services/GeminiService.ts
import { apiFetch } from "../lib/api";

/**
 * Serviço para chamar os endpoints /ai/upskilling e /ai/reskilling.
 * Garante que mensagens de erro sejam strings legíveis (não "[object Object]").
 */

function normalizeError(err: any): string {
  if (!err) return "Erro desconhecido";
  if (err instanceof Error) return err.message || String(err);
  if (typeof err === "object") {
    if (err.message) return String(err.message);
    if (err.error) return String(err.error);
    if (err.body) {
      try { return typeof err.body === "string" ? err.body : JSON.stringify(err.body); }
      catch { return String(err.body); }
    }
    try { return JSON.stringify(err); } catch { return String(err); }
  }
  return String(err);
}

export const GeminiService = {
  analyzeUpskilling: async (skills: string, brief = false): Promise<string> => {
    if (!skills || !skills.trim()) throw new Error("Campo 'skills' é obrigatório.");

    const payload = {
      skills: skills.trim(),
      brief: brief === true
    };

    try {
      const res: any = await apiFetch("/ai/upskilling", {
        method: "POST",
        noAuth: true,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (res && typeof res === "object" && res.text) return String(res.text);
      if (typeof res === "string") return res;
      return JSON.stringify(res);
    } catch (err: any) {
      const msg = normalizeError(err);
      throw new Error(msg);
    }
  },

  analyzeReskilling: async (profession: string, skills: string, brief = false): Promise<string> => {
    if (!profession || !profession.trim()) throw new Error("Campo 'profession' é obrigatório.");
    if (!skills || !skills.trim()) throw new Error("Campo 'skills' é obrigatório.");

    const payload = {
      profession: profession.trim(),
      skills: skills.trim(),
      brief: brief === true
    };

    try {
      const res: any = await apiFetch("/ai/reskilling", {
        method: "POST",
        noAuth: true,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (res && typeof res === "object" && res.text) return String(res.text);
      if (typeof res === "string") return res;
      return JSON.stringify(res);
    } catch (err: any) {
      const msg = normalizeError(err);
      throw new Error(msg);
    }
  }
};
