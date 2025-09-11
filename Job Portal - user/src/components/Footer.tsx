"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Don't show footer on auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">SERVICES</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Emergency Relief
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Healthcare
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Education
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">ABOUT</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-primary">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Annual Reports
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Transparency
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">SUPPORT</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Orphan Care
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Clean Water
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">CONTACT</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">0332354</li>
              <li className="text-sm text-gray-600">0332354</li>
            </ul>
          </div>

          {/* Donate */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">DONATE</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Partnership
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2024 Al Khidmat. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="text-gray-400 hover:text-primary">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-primary">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-primary">
              <Facebook className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
