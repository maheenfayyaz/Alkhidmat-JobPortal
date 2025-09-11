import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthRedirect } from "@/components/AuthRedirect";
import Profile from "@/components/pages/Profile";

export default function ProfilePage() {
  return (
    <AuthRedirect requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Profile />
        </main>
        <Footer />
      </div>
    </AuthRedirect>
  );
}
