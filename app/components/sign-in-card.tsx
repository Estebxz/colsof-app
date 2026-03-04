"use client";

import { UseIcon } from "@hooks/use-icons";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { LoginUserProps } from "@type/types";
import { Badge } from "@ui/badges";
import { HomeLogo } from "@ui/home-logo";
import { Button } from "./ui/button";

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function normalizeRole(role: LoginUserProps["rol"]) {
  const r = String(role || "")
    .trim()
    .toLowerCase();

  if (r === "admin" || r === "administrador") return "admin";
  if (r === "gestor") return "gestor";
  if (r === "tecnico" || r === "técnico") return "tecnico";

  return r;
}

const supportMessage = encodeURIComponent("Hola, encontré un error en la aplicacion colsof.app...");
const supportWhatsapp = `https://wa.me/573124670836?text=${supportMessage}`;

export default function SignInCard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const isAlertVisible = useMemo(() => Boolean(alertMessage), [alertMessage]);

  useEffect(() => {
    try {
      const rememberedEmail = window.localStorage.getItem("rememberedEmail");
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRemember(true);
      }
    } catch {
      // ignore
    }
  }, []);

  function showAlert(message: string) {
    setAlertMessage(message);
  }
  function hideAlert() {
    setAlertMessage(null);
  }
  function clearEmailError() {
    if (emailError) setEmailError(false);
  }
  function clearPasswordError() {
    if (passwordError) setPasswordError(false);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const emailValue = email.trim();
    const passwordValue = password.trim();

    setEmailError(false);
    setPasswordError(false);

    if (!emailValue || !passwordValue) {
      if (!emailValue) setEmailError(true);
      if (!passwordValue) setPasswordError(true);
      showAlert("Completa el correo y la contraseña para continuar.");
      return;
    }

    if (!validateEmail(emailValue)) {
      setEmailError(true);
      showAlert("El correo no tiene un formato válido.");
      return;
    }

    hideAlert();
    setSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        data?: LoginUserProps;
      } | null;

      if (!response.ok) {
        showAlert((data && data.error) || "Error en la autenticación");
        return;
      }

      const user = data?.data;
      if (!user) {
        showAlert("Respuesta inválida del servidor");
        return;
      }

      const userData = {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        loginTime: new Date().toISOString(),
      };

      try {
        window.localStorage.setItem("usuario", JSON.stringify(userData));

        if (remember) {
          window.localStorage.setItem("rememberedEmail", emailValue);
        } else {
          window.localStorage.removeItem("rememberedEmail");
        }
      } catch {
        // ignore
      }

      const rol = normalizeRole(user.rol);
      if (rol === "admin" || rol === "gestor" || rol === "tecnico") {
        router.push("/dashboard");
        return;
      }

      showAlert("Rol de usuario no reconocido: " + user.rol);
    } catch (err) {
      console.error("Error en login:", err);
      showAlert("Error al conectar con el servidor. Intenta más tarde.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card w-full max-w-md">
      <HomeLogo />
      <div className="mb-10">
        <h1 className="font-bold text-2xl">Bienvenido</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para iniciar sesión.
        </p>
      </div>
      {isAlertVisible && (
        <div
          className="alert show"
          id="alertBox"
          role="alert"
          aria-live="polite"
          onClick={hideAlert}
        >
          <UseIcon name="alert-circle" className="size-6 shrink-0" />
          <div className="alert-content">
            <h2>Error de autenticación</h2>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}

      <form
        className="form"
        id="loginForm"
        noValidate
        aria-label="Formulario de inicio de sesión"
        onSubmit={onSubmit}
      >
        <div className={`input-group${emailError ? " error" : ""}`}>
          <label htmlFor="email" className="input-label">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="usuario@colsof.com.co"
            autoComplete="email"
            required
            value={email}
            aria-invalid={emailError ? "true" : "false"}
            onChange={(e) => {
              setEmail(e.target.value);
              clearEmailError();
              hideAlert();
            }}
            onFocus={clearEmailError}
          />
        </div>

        <div className={`input-group${passwordError ? " error" : ""}`}>
          <label htmlFor="password" className="input-label">
            Contraseña
          </label>
          <div className="input-with-icon">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Ingrese su contraseña"
              autoComplete="current-password"
              required
              value={password}
              aria-invalid={passwordError ? "true" : "false"}
              onChange={(e) => {
                setPassword(e.target.value);
                clearPasswordError();
                hideAlert();
              }}
              onFocus={clearPasswordError}
            />

            <Button
              variant="ghost"
              className="toggle"
              size="icon"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              onClick={() => setShowPassword((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowPassword((v) => !v);
                }
              }}
            >
              <UseIcon name="eye-rounded" />
            </Button>
          </div>
        </div>

        <div className="options">
          <label className="remember">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Recordar credenciales</span>
          </label>
          <a className="text-blue-600 font-medium" href="#">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button variant="info" disabled={submitting} size="lg">
          {submitting ? "Ingresando..." : "Ingresar"}
        </Button>

        <div className="support">
          <p>¿No puedes acceder a tu cuenta?</p>
          <a href={supportWhatsapp} target="_blank" rel="noopener noreferrer">
            <Badge variant="secondary" size="lg" className="bg-white">
              <UseIcon name="whatsapp" className="size-4" />
              Contactar Soporte
            </Badge>
          </a>
        </div>
      </form>
    </section>
  );
}
