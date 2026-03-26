"use client";

import { useAuthMode } from "@hooks/use-auth-mode";
import { AuthPanel } from "@shared/auth-panel";
import SignInCard from "@shared/sign-in-card";
import SignUpCard from "@shared/sign-up-card";
import Footer from "@layout/footer";

export default function SignInPage() {
  const { isSignIn, goToSignIn, goToSignUp } = useAuthMode();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col md:flex-row">
        <AuthPanel
          isActive={isSignIn}
          align="left"
          onNavigate={goToSignUp}
          navigateLabel="¿No tienes cuenta?"
        >
          <SignInCard />
        </AuthPanel>

        <AuthPanel
          isActive={!isSignIn}
          align="right"
          onNavigate={goToSignIn}
          navigateLabel="Volver"
        >
          <SignUpCard />
        </AuthPanel>
      </div>

      <Footer />
    </div>
  );
}