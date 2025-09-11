"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function AccountSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Successfully Created</h1>
          <p className="text-gray-600 text-lg">
            redirecting you to homepage
          </p>
        </div>
      </div>
    </div>
  );
}
