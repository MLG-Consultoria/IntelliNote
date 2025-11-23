// src/lib/storage.ts
import { fetchNotesFromApi, createNoteApi, deleteNoteApi, fetchNoteUpdate } from "./backend";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface Reminder {
  id: number;
  title: string;
  content: string;
  date: string;
  noteId: string;
}

// ---------- AUTH ----------
export function saveSession(token: string, user: any) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getCurrentUser() {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export function isLogged() {
  return !!getToken();
}

export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------- NOTES ----------

// Mantém função SÍNCRONA para compatibilidade com componentes que já usam sync.
export function getUserNotes(): Note[] {
  const user = getCurrentUser();
  if (!user) return [];
  // tenta retornar cache local (sempre rápido)
  const cached = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");
  return cached;
}

/**
 * Atualiza cache local a partir do backend (opcional, chamável de lugares que suportem async)
 * Uso: await refreshUserNotesFromApi();
 */
export async function refreshUserNotesFromApi(): Promise<Note[]> {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    const raw = await fetchNotesFromApi();
    const mapped: Note[] = (raw || []).map((n: any) => ({
      id: String(n.id ?? n.ID_NOTE ?? n.id_note ?? n.idNote),
      title: n.title ?? n.TITLE ?? "",
      content: n.content ?? n.CONTENT ?? "",
      tags: Array.isArray(n.tags)
        ? n.tags.map((t: any) => (typeof t === "string" ? t : t.nome ?? t.name ?? String(t)))
        : [],
      createdAt: n.createdAt ?? n.created_at ?? (n.CREATED_AT ? new Date(n.CREATED_AT).toLocaleString("pt-BR") : new Date().toLocaleString("pt-BR"))
    }));
    localStorage.setItem(`notes_${user.userId}`, JSON.stringify(mapped));
    return mapped;
  } catch (err) {
    console.warn("Falha ao buscar notas do backend, mantendo cache local:", err);
    return JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");
  }
}

/**
 * Salva nota:
 * - se o usuário estiver logado tenta enviar para API (createNoteApi)
 * - em caso de erro, lança a exceção (para UI tratar)
 * - se não estiver logado, salva localmente (demo/offline)
 */
export async function saveNote(note: { title: string; content: string; tags: string[]; }): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error("Not logged");

  // offline/demo fallback
  if (!isLogged()) {
    const notes = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");
    const id = crypto.randomUUID();
    const newNote: Note = { id, ...note, createdAt: new Date().toLocaleString("pt-BR") };
    notes.unshift(newNote);
    localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notes));
    return id;
  }

  // online: enviar para backend
  try {
    const res = await createNoteApi(note);
    // API retorna { id: <Long> } conforme backend Java
    const id = String(res?.id ?? res);
    // atualizar cache local presumivelmente
    const notes: Note[] = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");
    notes.unshift({ id, ...note, createdAt: new Date().toLocaleString("pt-BR") });
    localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notes));
    return id;
  } catch (err: any) {
    console.error("Erro ao criar nota via API:", err);
    // repassa mensagem legível para o componente
    const detail = err?.body?.error ?? err?.message ?? JSON.stringify(err);
    throw new Error(detail);
  }
}

export async function updateNote(id: string, note: { title: string; content: string; tags: string[]; }) {
  const user = getCurrentUser();
  if (!user) throw new Error("Not logged");

  const token = getToken();
  const notesLocal: Note[] = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");

  // 🔹 Se não estiver logado -> update apenas no localStorage
  if (!token) {
    const idx = notesLocal.findIndex(n => n.id === id);
    if (idx !== -1) {
      notesLocal[idx] = { ...notesLocal[idx], ...note };
      localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notesLocal));
    }
    return;
  }

  // 🔹 Se estiver logado -> Update na API + local
  try {
    await fetchNoteUpdate(id, note); // em backend.ts
    const idx = notesLocal.findIndex(n => n.id === id);
    if (idx !== -1) {
      notesLocal[idx] = { ...notesLocal[idx], ...note };
      localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notesLocal));
    }
  } catch (err) {
    console.error("Erro ao atualizar nota:", err);
    throw err;
  }
}

/**
 * Deleta nota:
 * - se estiver logado tenta deletar no backend, caso contrário apenas remove local
 */
export async function deleteNote(id: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;
  // se offline apenas atualiza cache local
  if (!isLogged()) {
    const notes = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]").filter((n: any) => n.id !== id);
    localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notes));
    return;
  }

  // online: tentar deletar no backend e atualizar cache
  try {
    await deleteNoteApi(Number(id));
    const notes = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]").filter((n: any) => n.id !== id);
    localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notes));
  } catch (err) {
    console.warn("Erro ao deletar nota via API, removendo localmente:", err);
    const notes = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]").filter((n: any) => n.id !== id);
    localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notes));
  }
}

// ---------- REMINDERS ----------
export function getReminders(): Reminder[] {
  const user = getCurrentUser();
  if (!user) return [];
  return JSON.parse(localStorage.getItem(`reminders_${user.userId}`) || "[]");
}

export function addReminder(title: string, content: string, date: string, noteId: string) {
  const user = getCurrentUser();
  if (!user) return;
  const reminders = getReminders();
  const id = Date.now();
  reminders.push({ id, title, content, date, noteId });
  localStorage.setItem(`reminders_${user.userId}`, JSON.stringify(reminders));
}

export function deleteReminder(id: number) {
  const user = getCurrentUser();
  if (!user) return;
  const reminders = getReminders().filter((r) => r.id !== id);
  localStorage.setItem(`reminders_${user.userId}`, JSON.stringify(reminders));
}
