"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

export default function SignUp() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
        confirmButtonColor: '#3B82F6'
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Too Short',
        text: 'Password must be at least 8 characters long.',
        confirmButtonColor: '#3B82F6'
      });
      setIsSubmitting(false);
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Uppercase Letter',
        text: 'Password must contain at least one uppercase letter.',
        confirmButtonColor: '#3B82F6'
      });
      setIsSubmitting(false);
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Lowercase Letter',
        text: 'Password must contain at least one lowercase letter.',
        confirmButtonColor: '#3B82F6'
      });
      setIsSubmitting(false);
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Number',
        text: 'Password must contain at least one number.',
        confirmButtonColor: '#3B82F6'
      });
      setIsSubmitting(false);
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Name',
        text: 'Name must only contain letters and spaces.',
        confirmButtonColor: '#3B82F6'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors && Array.isArray(errorData.errors)) {
          throw new Error(errorData.errors.join(", "));
        }
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();

      // Auto-login after successful registration
      const loginResult = await login(formData.email, formData.password);

      if (loginResult.success) {
        // Show success message and navigate
        await Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Your account has been successfully created. Redirecting to dashboard...',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          confirmButtonColor: '#3B82F6'
        });
        router.push("/account-success");
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Account Created',
          text: 'Account created but login failed. Please try logging in manually.',
          confirmButtonColor: '#3B82F6'
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error instanceof Error ? error.message : "An error occurred during sign up. Please try again.",
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your password must be at least 8 characters, contain one capital letter, and one special character.
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full h-12 bg-gray-50 border-0 focus:bg-white"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>
            </div>

            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                console.log("Google signup clicked");
                // Handle Google signup here
              }}
              className="w-full h-12 mb-6 border-gray-200 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
