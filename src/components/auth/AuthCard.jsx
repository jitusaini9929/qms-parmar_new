"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function AuthCard({ className, children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full", className)}
      {...props}
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-2xl blur-xl opacity-50" />
        <div className="relative bg-card rounded-2xl border border-border/50 shadow-xl shadow-black/5">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function AuthHeader({ title, description, icon: Icon }) {
  return (
    <div className="text-center space-y-2 pb-6">
      {Icon && (
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/60" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-3 text-muted-foreground">or</span>
      </div>
    </div>
  );
}
