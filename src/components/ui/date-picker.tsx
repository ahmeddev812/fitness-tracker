import { forwardRef, type InputHTMLAttributes } from "react";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker({ label, error, hint, id, required, className = "", ...props }, ref) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : `date-${Math.random().toString(36).slice(2)}`);
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type="date"
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={[error && errorId, hint && !error && hintId].filter(Boolean).join(" ") || undefined}
          className={[
            "text-foreground bg-card",
            "flex h-10 w-full rounded-lg border px-3 py-2 text-sm",
            "[color-scheme:light] dark:[color-scheme:dark]",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
            "dark:[&::-webkit-calendar-picker-indicator]:invert",
            "dark:[&::-webkit-calendar-picker-indicator]:opacity-60",
            "dark:[&::-webkit-calendar-picker-indicator]:hover:opacity-100",
            error
              ? "border-destructive focus:ring-destructive"
              : "border-input",
            className,
          ].join(" ")}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);