"use client";

import { cn } from "@/lib/utils";

const requirements = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
  { label: "One special character", test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];

export function PasswordStrength({ password }) {
  const strength = requirements.filter((r) => r.test(password)).length;
  
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const colors = [
    "",
    "bg-destructive",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-400",
    "bg-emerald-500",
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              strength >= level ? colors[strength] : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="space-y-1.5">
        {requirements.map((req, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              req.test(password)
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center",
                req.test(password)
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-muted-foreground/30"
              )}
            >
              {req.test(password) && (
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
}
