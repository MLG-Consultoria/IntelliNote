// src/lib/api.ts
const PROD_URL = import.meta.env.VITE_API_URL || "https://global-solution-2-java-qxwy.onrender.com";
const LOCAL_URL = "http://localhost:8080";
const ISALIVE_TIMEOUT = 3000;
const REQUEST_TIMEOUT = 15000;

let chosenBaseUrl: string | null = null;

function timeout(ms: number) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

async function safeFetch(input: RequestInfo, init?: RequestInit, ms = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(input, { ...(init || {}), signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function isAlive(url: string): Promise<boolean> {
  try {
    const res = await Promise.race([safeFetch(url + "/q/health/ready", undefined, ISALIVE_TIMEOUT), timeout(ISALIVE_TIMEOUT)]) as Response;
    if (!(res instanceof Response)) return false;
    if (res.status >= 500) return false;

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return false;

    const json = await res.json().catch(() => null);
    if (!json || json.status !== "UP") return false;

    if (Array.isArray(json.checks)) {
      for (const c of json.checks) {
        if (c.status && c.status !== "UP") return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Escolhe a base URL. Prioriza PROD apenas se o health estiver realmente OK
 * e um teste leve ao endpoint retornar 200 (ou pelo menos não devolver erro de driver).
 */
export async function getBaseUrl(): Promise<string> {
  if (chosenBaseUrl) return chosenBaseUrl;

  // tenta PROD primeiro (apenas se saudável)
  if (await isAlive(PROD_URL)) {
    try {
      // faz um teste leve: endpoint que não altera estado (deve existir no PROD)
      const testRes = await safeFetch(PROD_URL + "/auth/register-debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ping: true }),
      }, 3000);

      // se o teste não respondeu 200 (ok), cai pra local
      if (!testRes.ok) {
        const ct = testRes.headers.get("content-type") || "";
        const body = ct.includes("application/json") ? await testRes.json().catch(() => null) : await testRes.text().catch(() => null);
        const msg = typeof body === "string" ? body : (body && (body.error || JSON.stringify(body)));
        // se apontar para driver/DB problem, então fallback
        if (msg && /driver|No suitable driver|jdbc/i.test(msg)) {
          console.warn("[getBaseUrl] PROD test endpoint returned driver/db error; falling back to LOCAL");
          chosenBaseUrl = LOCAL_URL;
          return LOCAL_URL; // CORREÇÃO DE TIPAGEM
        }
        // se não for driver, também não escolha PROD (safety): fallback
        chosenBaseUrl = LOCAL_URL;
        return LOCAL_URL; // CORREÇÃO DE TIPAGEM
      }

      // se passou no teste -> usa PROD
      chosenBaseUrl = PROD_URL;
      return PROD_URL; // CORREÇÃO DE TIPAGEM
    } catch (e) {
      // erro ao testar -> fallback local
      chosenBaseUrl = LOCAL_URL;
      return LOCAL_URL; // CORREÇÃO DE TIPAGEM
    }
  }

  // default: local
  chosenBaseUrl = LOCAL_URL;
  return LOCAL_URL; // CORREÇÃO DE TIPAGEM
}

export function getTokenFromStorage(): string | null {
  return localStorage.getItem("token");
}

/**
 * apiFetch(path, options)
 * options: RequestInit plus optional boolean `noAuth` to avoid adding Authorization header.
 */
export async function apiFetch(path: string, options: RequestInit & { noAuth?: boolean } = {}) {
  const base = await getBaseUrl();
  const token = getTokenFromStorage();
  const skipAuth = Boolean((options as any).noAuth);

  const headers: Record<string,string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string,string> || {}),
  };
  // TS-safe null check
  if (!skipAuth && token != null) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    console.debug("[apiFetch] ->", { url: base + path, options: { ...options, headers } });
    const res = await fetch(base + path, {...options, headers, signal: controller.signal});
    clearTimeout(id);

    if (!res.ok) {
      const ct = res.headers.get("content-type") || "";
      let body: any = null;
      let text: string | null = null;
      
      // Tenta parsear JSON se o Content-Type indicar
      if (ct.includes("application/json")) {
        try {
          body = await res.json();
        } catch {
          // Se falhar ao parsear JSON, tenta obter como texto
          text = await res.text().catch(() => null);
        }
      } else {
        // Se não for JSON, obtém como texto
        text = await res.text().catch(() => null);
      }
      
      // Determina a mensagem de erro (msg) de forma mais clara
      // Prioriza body.error se for um objeto, senão usa o texto ou o status HTTP.
      const msg = (body && typeof body === 'object' && body.error) 
        ? body.error 
        : ((typeof body === 'object' && JSON.stringify(body)) || text || res.statusText || `HTTP ${res.status}`);
        
      console.error(`[apiFetch] ${res.status} ${res.statusText} ->`, body || text);

      if (res.status === 401) {
        console.warn("[apiFetch] received 401 Unauthorized — not clearing local session automatically.");
      }

      const err: any = new Error(msg);
      err.status = res.status;
      err.body = body || text; // Anexa o objeto ou o texto
      throw err;
    }

    if (res.status === 204) return null;
    const contentType = res.headers.get("content-type") || "";
    const parsed = contentType.includes("application/json") ? await res.json() : await res.text();
    console.debug("[apiFetch] parsed:", parsed);
    return parsed;
  } catch (err) {
    clearTimeout(id);
    console.error("[apiFetch] failed:", err);
    throw err;
  }
}