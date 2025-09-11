import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthRedirect } from "@/components/AuthRedirect";
import Index from "@/components/pages/Index";

export default function HomePage() {
  return (
    <AuthRedirect requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Index />
        </main>
        <Footer />
      </div>
    </AuthRedirect>
  );
}
