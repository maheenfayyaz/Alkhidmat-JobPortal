import Login from "@/components/pages/Login";
import { AuthRedirect } from "@/components/AuthRedirect";

export default function LoginPage() {
  return (
    <AuthRedirect requireAuth={false}>
      <Login />
    </AuthRedirect>
  );
}
