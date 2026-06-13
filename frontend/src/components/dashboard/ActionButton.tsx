"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "danger" | "secondary";
  className?: string;
  disabled?: boolean;
}

export default function ActionButton({
  children, onClick, type = "button", variant = "primary", className = "", disabled = false,
}: Props) {
  const variants = {
    primary: "bg-primary text-foreground hover:bg-primary-light",
    danger: "bg-error text-foreground hover:bg-error/90",
    secondary: "bg-card text-text border border-border hover:bg-surface",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
