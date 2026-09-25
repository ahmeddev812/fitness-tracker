"use client";

import { useRef, useState } from "react";
import { useFitnessData, useFitnessActions } from "@/hooks/useFitnessData";
import { toLocalDate, formatDisplayDate } from "@/lib/dates";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { Camera, Plus, Trash2 } from "lucide-react";
import { m } from "framer-motion";

function resizeImage(file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Invalid image"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function PhotosTab() {
  const { progressPhotos } = useFitnessData();
  const { addProgressPhoto, deleteProgressPhoto } = useFitnessActions();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = [...progressPhotos].sort((a, b) => b.date.localeCompare(a.date));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Please select an image file", "error");
      return;
    }
    setBusy(true);
    try {
      const base64 = await resizeImage(file, 800, 0.75);
      addProgressPhoto({ date: toLocalDate(new Date()), base64 });
      toast("Photo added", "success");
    } catch {
      toast("Failed to process image", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProgressPhoto(deleteId);
      toast("Photo deleted", "success");
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="gradient" onClick={() => inputRef.current?.click()} disabled={busy}>
          <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
          {busy ? "Processing…" : "Add Photo"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          aria-label="Upload progress photo"
        />
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<Camera className="h-8 w-8 text-primary" aria-hidden="true" />}
          title="No progress photos yet"
          description="Add a photo to visually track your transformation over time."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((photo, i) => (
            <m.div
              key={photo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.04 }}
            >
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.base64}
                  alt={`Progress photo from ${formatDisplayDate(photo.date)}`}
                  className="aspect-square w-full object-cover"
                />
                <div className="flex items-center justify-between gap-2 border-t border-border/60 px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDisplayDate(photo.date)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeleteId(photo.id)}
                    aria-label="Delete photo"
                    className="rounded-lg p-1.5 text-muted-foreground opacity-70 transition-all hover:bg-destructive/10 hover:text-destructive hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Photo?"
        description="This progress photo will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
