"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
      setError("Invalid authentication data");
      setIsLoading(false);
      return;
    }

    const autoLogin = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/auth/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        const userData = {
          email: data.user.email,
          name: data.user.fullname || data.user.email.split('@')[0],
          profileImage: data.user.profileImage,
          isAuthenticated: true,
        };

        setUser(userData);
        localStorage.setItem("token", token);

        // Redirect to home after success
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (err) {
        console.error("Auto-login error:", err);
        setError("Login failed. Please log in manually.");
        // Fallback redirect to login
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
  }, [searchParams, setUser, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Logging you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Successfully Created</h1>
          {error ? (
            <p className="text-red-600 text-lg mb-4">{error}</p>
          ) : (
            <p className="text-gray-600 text-lg">
              Logging you in and redirecting to home...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
