interface UserDBRecord {
  name: string;
  email: string;
  password: string; 
}

interface SessionUser {
  name: string;
  email: string;
}

const DB_KEY = 'notesai_db_users';
const SESSION_KEY = 'notesai_session_user';

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
};