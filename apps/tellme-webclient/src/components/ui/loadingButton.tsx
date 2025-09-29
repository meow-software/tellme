"use client";

import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils"; 

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  children,
  isLoading = false,
  loadingText = "Loading...",
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        `w-full h-12 font-medium rounded-full flex items-center justify-center gap-2 transition-colors text-white
        ${disabled || isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"}`,
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin w-5 h-5" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
