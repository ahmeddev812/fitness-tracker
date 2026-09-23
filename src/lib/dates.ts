const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function isValidDateKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const [yearStr, monthStr, dayStr] = key.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function parseDateKey(key: string): Date | null {
  if (!isValidDateKey(key)) return null;
  const [yearStr, monthStr, dayStr] = key.split("-");
  return new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));
}

export function formatDisplayDate(key: string): string {
  const date = parseDateKey(key);
  if (!date) return key;
  const dayName = SHORT_DAYS[date.getDay()];
  const day = date.getDate();
  const month = SHORT_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

export function formatRelativeDay(key: string): string {
  const today = todayKey();
  if (key === today) return "Today";
  const yesterday = toDateKey(new Date(Date.now() - 86400000));
  if (key === yesterday) return "Yesterday";
  return formatDisplayDate(key);
}

export function getLastNDays(n: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    keys.push(toDateKey(d));
  }
  return keys;
}

export function compareDateKeys(a: string, b: string): number {
  return a.localeCompare(b);
}

export function toLocalDate(date: Date): string {
  return toDateKey(date);
}

export function addDays(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  if (!date) return dateKey;
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function subtractDays(dateKey: string, days: number): string {
  return addDays(dateKey, -days);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}