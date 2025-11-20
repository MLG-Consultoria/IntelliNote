// --- Tipos de Dados ---
interface UserDBRecord {
  name: string;
  email: string;
  password: string; 
}

interface SessionUser {
  name: string;
  email: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  userEmail: string;
}

export interface Reminder {
  id: number;
  date: string;
  title: string;
  content: string;
  noteId: string;
  userEmail: string;
}

// --- Chaves do LocalStorage ---
const DB_KEY = 'notesai_db_users';
const SESSION_KEY = 'notesai_session_user';
const NOTES_KEY = 'notesai_db_notes';
const REMINDERS_KEY = 'notesai_reminders';


// --- Funções Auxiliares (privadas) ---
// --- Função para os Usuários ---
const getUsersDatabase = (): UserDBRecord[] => {
  const db = localStorage.getItem(DB_KEY);
  return db ? JSON.parse(db) : [];
};

const saveUsersDatabase = (users: UserDBRecord[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
};


export const storage = {

  register: (name: string, email: string, password: string): void => {
    const users = getUsersDatabase();

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('Este email já está cadastrado.');
    }

    users.push({ name, email, password });
    saveUsersDatabase(users);
  },

  login: (email: string, password: string): SessionUser => {
    const users = getUsersDatabase();

    const user = users.find(user => user.email === email);

    if (user && user.password === password) {
      const sessionUser: SessionUser = {
        name: user.name,
        email: user.email,
      };
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    }

    throw new Error('Email ou senha inválidos.');
  },

  logout: (): void => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): SessionUser | null => {
    const userSession = localStorage.getItem(SESSION_KEY);
    if (userSession) {
      return JSON.parse(userSession);
    }
    return null;
  },


  // --- Funções para as Notas ---
  saveNote: (note: Omit<Note, 'id' | 'createdAt' | 'userEmail'>): string => { // Retorna string agora
    const currentUser = storage.getCurrentUser();
    if (!currentUser) throw new Error("Usuário não logado.");

    const notesStr = localStorage.getItem(NOTES_KEY);
    const notes: Note[] = notesStr ? JSON.parse(notesStr) : [];

    const newId = crypto.randomUUID();

    const newNote: Note = {
      ...note,
      id: newId,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      userEmail: currentUser.email
    };

    notes.push(newNote);
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return newId;
  },

  getUserNotes: (): Note[] => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return [];

    const notesStr = localStorage.getItem(NOTES_KEY);
    const notes: Note[] = notesStr ? JSON.parse(notesStr) : [];
    return notes.filter(n => n.userEmail === currentUser.email);
  },

  deleteNote: (noteId: string): void => {
    const notesStr = localStorage.getItem(NOTES_KEY);
    let notes: Note[] = notesStr ? JSON.parse(notesStr) : [];
    
    notes = notes.filter(n => n.id !== noteId);
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },


  // --- Funções para Lembretes/Calendário ---
  addReminder: (title: string, content: string, date: string, noteId: string): void => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) throw new Error("Usuário não logado.");

    const remindersStr = localStorage.getItem(REMINDERS_KEY);
    const reminders: Reminder[] = remindersStr ? JSON.parse(remindersStr) : [];

    const newReminder: Reminder = {
      id: Date.now(),
      date: date,
      title: title,     // Salva titulo
      content: content, // Salva conteudo
      noteId: noteId,   // Salva o ID da nota original
      userEmail: currentUser.email
    };

    reminders.push(newReminder);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  },

  getReminders: (): Reminder[] => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) return [];

    const remindersStr = localStorage.getItem(REMINDERS_KEY);
    const reminders: Reminder[] = remindersStr ? JSON.parse(remindersStr) : [];

    return reminders.filter(r => r.userEmail === currentUser.email);
  },

  deleteReminder: (id: number): void => {
    const remindersStr = localStorage.getItem(REMINDERS_KEY);
    let reminders: Reminder[] = remindersStr ? JSON.parse(remindersStr) : [];
    
    reminders = reminders.filter(r => r.id !== id);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  }
};
