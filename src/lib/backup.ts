import * as storage from "@/lib/storage";

export function downloadBackup(): void {
  if (typeof window === "undefined") return;
  const json = storage.exportAllData();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pulse-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBackup(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") {
        resolve({ success: false, message: "Failed to read file" });
        return;
      }
      const success = storage.importAllData(text);
      resolve({
        success,
        message: success ? "Data imported successfully" : "Invalid backup file format",
      });
    };
    reader.onerror = () => resolve({ success: false, message: "Failed to read file" });
    reader.readAsText(file);
  });
}
