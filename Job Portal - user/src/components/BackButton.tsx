"use client"

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "ghost";
  children?: React.ReactNode;
  fallbackPath?: string;
}

export function BackButton({
  className = "",
  variant = "ghost",
  children = "Back",
  fallbackPath = "/"
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    console.log('BackButton clicked!');
    console.log('Attempting to navigate back...');

    // Simple navigation back
    router.back();
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center text-gray-600 hover:text-primary transition-colors font-medium ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {children}
    </button>
  );
}
