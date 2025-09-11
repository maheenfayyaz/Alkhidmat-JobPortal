"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  console.log("Header user:", user);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchInput, setSearchInput] = useState("");

  const isActive = (path: string) => pathname === path;

  // Load profile image from localStorage
  useEffect(() => {
    const loadProfileImage = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("profileData");
        if (stored) {
          try {
            const profileData = JSON.parse(stored);
            setProfileImage(profileData.image);
          } catch (error) {
            console.error("Error loading profile image:", error);
          }
        }
      }
    };

    loadProfileImage();

    // Listen for localStorage changes
    const handleStorageChange = () => {
      loadProfileImage();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle navigation clicks with immediate response
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setIsProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    setIsProfileOpen(false);
    router.push("/login");
  };

  // Don't show header on auth pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          prefetch={true}
          onClick={handleNavClick}
          className="flex items-center space-x-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <img src="/logo.png" alt="logo" />
          </div>
          <span className="text-xl font-semibold text-gray-900">
            Al Khidmat
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            prefetch={true}
            onClick={handleNavClick}
            className={`text-sm font-medium transition-colors cursor-pointer select-none ${
              isActive("/")
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            prefetch={true}
            onClick={handleNavClick}
            className={`text-sm font-medium transition-colors cursor-pointer select-none ${
              isActive("/about")
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            prefetch={true}
            onClick={handleNavClick}
            className={`text-sm font-medium transition-colors cursor-pointer select-none ${
              isActive("/contact")
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Contact Us
          </Link>
          <Link
            href="/jobs"
            prefetch={true}
            onClick={handleNavClick}
            className={`text-sm font-medium transition-colors cursor-pointer select-none ${
              isActive("/jobs")
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Jobs
          </Link>
          {user && (
            <Link
              href="/my-applications"
              prefetch={true}
              onClick={handleNavClick}
              className={`ml-6 text-sm font-medium transition-colors cursor-pointer select-none ${
                isActive("/my-applications")
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              My Applications
            </Link>
          )}
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex relative max-w-md flex-1 mx-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 bg-gray-50 border-0 focus:bg-white"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (searchInput.trim()) {
                  router.push(`/jobs?search=${encodeURIComponent(searchInput.trim())}`);
                }
              }
            }}
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
          ) : isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer select-none"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    prefetch={true}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer select-none"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleSignOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login" prefetch={true}>
                <Button variant="outline" className="text-sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup" prefetch={true}>
                <Button className="bg-primary hover:bg-primary/90 text-sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden mt-4 flex items-center justify-center space-x-6">
        <Link
          href="/"
          prefetch={true}
          onClick={handleNavClick}
          className={`text-sm font-medium cursor-pointer select-none ${
            isActive("/") ? "text-primary" : "text-gray-600"
          }`}
        >
          Home
        </Link>
        <Link
          href="/about"
          prefetch={true}
          onClick={handleNavClick}
          className={`text-sm font-medium cursor-pointer select-none ${
            isActive("/about") ? "text-primary" : "text-gray-600"
          }`}
        >
          About
        </Link>
        <Link
          href="/contact"
          prefetch={true}
          onClick={handleNavClick}
          className={`text-sm font-medium cursor-pointer select-none ${
            isActive("/contact") ? "text-primary" : "text-gray-600"
          }`}
        >
          Contact Us
        </Link>
        <Link
          href="/jobs"
          prefetch={true}
          onClick={handleNavClick}
          className={`text-sm font-medium cursor-pointer select-none ${
            isActive("/jobs") ? "text-primary" : "text-gray-600"
          }`}
        >
          Jobs
        </Link>
      </nav>
    </header>
  );
}
