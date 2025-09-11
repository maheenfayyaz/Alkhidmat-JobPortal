import SignUp from "@/components/pages/SignUp";
import { AuthRedirect } from "@/components/AuthRedirect";

export default function SignUpPage() {
  return (
    <AuthRedirect requireAuth={false}>
      <SignUp />
    </AuthRedirect>
  );
}
