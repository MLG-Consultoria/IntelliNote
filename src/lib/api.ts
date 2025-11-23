// src/lib/api.ts
const PROD_URL = import.meta.env.VITE_API_URL || "https://global-solution-2-java-qxwy.onrender.com";
const LOCAL_URL = "http://localhost:8080";
const ISALIVE_TIMEOUT = 3000;
const REQUEST_TIMEOUT = 15000;

let chosenBaseUrl: string | null = null;

function timeout(ms: number) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

/**
 * Consider server "alive" if we receive any HTTP response (2xx/3xx/4xx).
 * Treat 5xx as problem (return false) to avoid using a broken backend.
 */
async function isAlive(url: string): Promise<boolean> {
  try {
    const res = await Promise.race([fetch(url + "/q/health/ready"), timeout(ISALIVE_TIMEOUT)]);
    if (res instanceof Response) {
      const status = res.status;
      return status < 500;
    }
    return false;
  } catch {
    return false;
  }
}

export async function getBaseUrl(): Promise<string> {
  if (chosenBaseUrl) return chosenBaseUrl;
  chosenBaseUrl = (await isAlive(PROD_URL)) ? PROD_URL : LOCAL_URL;
  console.debug("[getBaseUrl] chosenBaseUrl:", chosenBaseUrl);
  return chosenBaseUrl!;
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
  if (!skipAuth && token) headers["Authorization"] = `Bearer ${token}`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    console.debug("[apiFetch] ->", { url: base + path, options: { ...options, headers } });
    const res = await fetch(base + path, {...options, headers, signal: controller.signal});
    clearTimeout(id);

    if (!res.ok) {
      const ct = res.headers.get("content-type") || "";
      let body: any = null;
      try { body = ct.includes("application/json") ? await res.json() : await res.text(); } catch (e) { body = await res.text().catch(() => null); }
      console.error(`[apiFetch] ${res.status} ${res.statusText} ->`, body);

      // IMPORTANT: não limpamos token aqui. A decisão de logout (limpar sessão) deve
      // ser feita pela UI/fluxo de navegação, que pode mostrar uma mensagem ao usuário
      // ou redirecionar para a tela de login. Remover token automaticamente cria
      // logout inesperado quando uma requisição falha (ex: ao abrir EditarNota).
      if (res.status === 401) {
        console.warn("[apiFetch] received 401 Unauthorized — not clearing local session automatically.");
      }

      const msg = body?.error || (typeof body === "string" ? body : JSON.stringify(body)) || res.statusText || `HTTP ${res.status}`;
      const err: any = new Error(msg);
      err.status = res.status;
      err.body = body;
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
