export interface AuthUser {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

const USERS_KEY = "fitness_users";
const CURRENT_USER_KEY = "fitness_current_user";

function isServer(): boolean {
  return typeof window === "undefined";
}

function hashPassword(password: string, email: string): string {
  try {
    return btoa(`${password}::${email}`);
  } catch {
    return password;
  }
}

function getUsers(): AuthUser[] {
  if (isServer()) return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: AuthUser[]): void {
  if (isServer()) return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function signupUser(
  name: string,
  email: string,
  password: string
): { success: boolean; message: string } {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();

  if (users.some((u) => u.email === normalizedEmail)) {
    return { success: false, message: "An account with this email already exists." };
  }

  const newUser: AuthUser = {
    email: normalizedEmail,
    name: name.trim(),
    passwordHash: hashPassword(password, normalizedEmail),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return { success: true, message: "Account created successfully." };
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; message: string } {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, message: "No account found with this email." };
  }

  if (user.passwordHash !== hashPassword(password, normalizedEmail)) {
    return { success: false, message: "Incorrect password." };
  }

  setCurrentUser(user);
  return { success: true, message: "Logged in successfully." };
}

export function logoutUser(): void {
  if (isServer()) return;
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    // ignore
  }
}

export function setCurrentUser(user: AuthUser): void {
  if (isServer()) return;
  try {
    const { passwordHash, ...safe } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...safe, passwordHash }));
  } catch {
    // ignore
  }
}

export function getCurrentUser(): AuthUser | null {
  if (isServer()) return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "email" in parsed && "name" in parsed) {
      return parsed as AuthUser;
    }
    return null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
