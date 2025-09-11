import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientOnly } from "@/components/client-only";
import { NavigationPrefetcher } from "@/components/navigation-prefetcher";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Al Khidmat Job Portal",
  description: "Find meaningful career opportunities with Al Khidmat",
  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      
      </head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            <Providers>
              <TooltipProvider>
                <NavigationPrefetcher />
                {children}
                <ClientOnly>
                  <Toaster />
                  <Sonner />
                </ClientOnly>
              </TooltipProvider>
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
