// src/lib/storage.ts
import { fetchNotesFromApi, createNoteApi, deleteNoteApi, fetchNoteUpdate } from "./backend";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  isTrashed?: boolean;
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

// ---------- NOTES (PRINCIPAL) ----------

export function getUserNotes(): Note[] {
  const user = getCurrentUser();
  if (!user) return [];
  // Retorna notas do cache local que NÃO estão na lixeira (segurança extra)
  const cached: Note[] = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");
  return cached;
}

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

export async function saveNote(note: { title: string; content: string; tags: string[]; }): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error("Not logged");

  if (!isLogged()) {
    const notes = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");
    const id = crypto.randomUUID();
    const newNote: Note = { id, ...note, createdAt: new Date().toLocaleString("pt-BR") };
    notes.unshift(newNote);
    localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notes));
    return id;
  }

  try {
    const res = await createNoteApi(note);
    const id = String(res?.id ?? res);
    const notes: Note[] = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");
    notes.unshift({ id, ...note, createdAt: new Date().toLocaleString("pt-BR") });
    localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notes));
    return id;
  } catch (err: any) {
    console.error("Erro ao criar nota via API:", err);
    const detail = err?.body?.error ?? err?.message ?? JSON.stringify(err);
    throw new Error(detail);
  }
}

export async function updateNote(id: string, note: { title: string; content: string; tags: string[]; }) {
  const user = getCurrentUser();
  if (!user) throw new Error("Not logged");

  const token = getToken();
  const notesLocal: Note[] = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");

  if (!token) {
    const idx = notesLocal.findIndex(n => n.id === id);
    if (idx !== -1) {
      notesLocal[idx] = { ...notesLocal[idx], ...note };
      localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notesLocal));
    }
    return;
  }

  try {
    await fetchNoteUpdate(id, note);
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

// Função DELETE original (Hard Delete direto) - usada internamente ou se quiser deletar sem lixeira
export async function deleteNote(id: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;
  
  // Atualiza local imediatamente para UI rápida
  const notes = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]").filter((n: any) => n.id !== id);
  localStorage.setItem(`notes_${user.userId}`, JSON.stringify(notes));

  if (isLogged()) {
    try {
      await deleteNoteApi(Number(id));
    } catch (err) {
      console.warn("Erro ao deletar nota via API:", err);
    }
  }
}

// ---------- LIXEIRA (ADAPTADO) ----------

// 1. Pegar notas da lixeira (Somente local)
export function getTrashNotes(): Note[] {
    const user = getCurrentUser();
    if (!user) return [];
    // Usa uma chave DIFERENTE para não misturar com a API (`trash_notes_...`)
    return JSON.parse(localStorage.getItem(`trash_notes_${user.userId}`) || "[]");
}

// 2. Mover para a Lixeira
// Lógica: Salva no "trash_notes" local e DELETA da API (pois API não tem lixeira)
export async function moveToTrash(id: string): Promise<void> {
    const user = getCurrentUser();
    if (!user) return;

    // Pega as notas atuais
    const liveNotes: Note[] = JSON.parse(localStorage.getItem(`notes_${user.userId}`) || "[]");
    const noteToTrash = liveNotes.find(n => n.id === id);

    if (noteToTrash) {
        // Salva na lixeira local
        const trashNotes = getTrashNotes();
        trashNotes.push({ ...noteToTrash, isTrashed: true });
        localStorage.setItem(`trash_notes_${user.userId}`, JSON.stringify(trashNotes));

        // Remove da lista local e da API
        await deleteNote(id); 
    }
}

// 3. Restaurar da Lixeira
// Lógica: Cria uma NOVA nota na API com os dados da lixeira e remove da lixeira local
export async function restoreFromTrash(id: string): Promise<void> {
    const user = getCurrentUser();
    if (!user) return;

    const trashNotes = getTrashNotes();
    const noteToRestore = trashNotes.find(n => n.id === id);

    if (noteToRestore) {
        // Cria novamente na API (vai ganhar um novo ID)
        await saveNote({
            title: noteToRestore.title,
            content: noteToRestore.content,
            tags: noteToRestore.tags
        });

        // Remove da lixeira
        const newTrashList = trashNotes.filter(n => n.id !== id);
        localStorage.setItem(`trash_notes_${user.userId}`, JSON.stringify(newTrashList));
    }
}

// 4. Deletar Permanentemente (Remove apenas do local storage da lixeira)
export function deletePermanently(id: string): void {
    const user = getCurrentUser();
    if (!user) return;

    const trashNotes = getTrashNotes().filter(n => n.id !== id);
    localStorage.setItem(`trash_notes_${user.userId}`, JSON.stringify(trashNotes));
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