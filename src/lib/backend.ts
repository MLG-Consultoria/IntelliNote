// src/lib/backend.ts
import { apiFetch } from "./api";

/**
 * NOTE: o backend Java expõe:
 * POST /notes  -> aceita { title, content, tags: string[] } e retorna { id: Long }
 * GET /notes   -> retorna lista de notes (ajuste mapeamento conforme seu JSON)
 * PUT /notes/{id}
 * DELETE /notes/{id}
 * GET /tags
 * POST /tags   -> aceita { nome }
 */

/* ---------- NOTES ---------- */
export async function fetchNoteUpdate(id: string | number, payload: { title: string; content: string; tags: string[] }) {
  return apiFetch(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function fetchNotesFromApi(): Promise<any[]> {
  // retorna o JSON bruto; convert no frontend/storage se precisar
  return await apiFetch("/notes");
}

export async function fetchNoteByIdApi(id: number | string): Promise<any> {
  return await apiFetch(`/notes/${id}`);
}

export async function createNoteApi(payload: { title: string; content: string; tags: string[]; }) {
  return await apiFetch("/notes", {
    method: "POST",
    body: JSON.stringify({
      title: payload.title,
      content: payload.content,
      tags: payload.tags
    })
  });
}

export async function updateNoteApi(id: number | string, payload: { title: string; content: string; tags: string[]; }) {
  return await apiFetch(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function deleteNoteApi(id: number | string) {
  return await apiFetch(`/notes/${id}`, { method: "DELETE" });
}

/* ---------- TAGS ---------- */

export async function listTagsApi(): Promise<any[]> {
  return await apiFetch("/tags");
}

export async function createTagApi(nome: string) {
  return await apiFetch("/tags", {
    method: "POST",
    body: JSON.stringify({ nome })
  });
}
