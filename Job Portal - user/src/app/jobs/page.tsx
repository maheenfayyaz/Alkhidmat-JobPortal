import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthRedirect } from "@/components/AuthRedirect";
import Jobs from "@/components/pages/Jobs";

export default function JobsPage() {
  return (
    <AuthRedirect requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Jobs />
        </main>
        <Footer />
      </div>
    </AuthRedirect>
  );
}
