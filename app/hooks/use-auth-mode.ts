import { useState } from "react";

type Mode = "sign-in" | "sign-up";

export function useAuthMode(initial: Mode = "sign-in") {
  const [mode, setMode] = useState<Mode>(initial);

  return {
    mode,
    isSignIn: mode === "sign-in",
    goToSignIn: () => setMode("sign-in"),
    goToSignUp: () => setMode("sign-up"),
  };
}