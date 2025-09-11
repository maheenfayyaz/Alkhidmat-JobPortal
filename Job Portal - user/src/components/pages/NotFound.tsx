"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page not found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
