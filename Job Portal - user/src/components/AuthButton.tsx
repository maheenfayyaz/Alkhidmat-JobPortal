"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

interface AuthButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  requireAuth?: boolean;
  loginMessage?: string;
}

export function AuthButton({
  href,
  children,
  className,
  variant = "default",
  requireAuth = true,
  loginMessage = "Please login to continue",
}: AuthButtonProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (requireAuth && !isAuthenticated) {
      // Show login prompt or redirect to login
      if (confirm(loginMessage + "\n\nRedirect to login page?")) {
        router.push("/login");
      }
      return;
    }

    // Navigate to the target href
    router.push(href);
  };

  return (
    <Button onClick={handleClick} className={className} variant={variant}>
      {children}
    </Button>
  );
}
