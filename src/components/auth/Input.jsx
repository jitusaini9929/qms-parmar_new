"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export function Input({
  className,
  type,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      <input
        type={isPassword && showPassword ? "text" : type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-11 w-full min-w-0 rounded-lg border bg-transparent px-4 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          isPassword && "pr-12",
          className
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}

export function FloatingLabelInput({
  label,
  id,
  type = "text",
  className,
  error,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const hasValue = value.length > 0;

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "peer h-12 w-full rounded-lg border border-input bg-background px-4 pt-4 pb-2 text-sm shadow-xs transition-all outline-none",
          "focus:border-primary focus:ring-[3px] focus:ring-primary/20",
          error && "border-destructive focus:border-destructive focus:ring-destructive/20",
          (focused || hasValue) && "pt-6"
        )}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-4 transition-all duration-200 pointer-events-none text-sm text-muted-foreground",
          "peer-focus:-top-1.5 peer-focus:text-xs peer-focus:text-primary",
          "peer-[:not(.peer-focus)]-top-3.5",
          (focused || hasValue) && "-top-1.5 text-xs",
          error && "peer-focus:text-destructive text-destructive"
        )}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
