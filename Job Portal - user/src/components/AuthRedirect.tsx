"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AuthRedirectProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  redirectAuthenticatedTo?: string;
}

export function AuthRedirect({
  children,
  requireAuth = true,
  redirectTo = "/login",
  redirectAuthenticatedTo = "/",
}: AuthRedirectProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        router.push(redirectAuthenticatedTo);
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    requireAuth,
    redirectTo,
    redirectAuthenticatedTo,
    router,
  ]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, don't render anything (redirect is happening)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If auth is not required but user is authenticated, don't render anything (redirect is happening)
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  // Render children if conditions are met
  return <>{children}</>;
}
