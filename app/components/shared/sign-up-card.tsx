"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { UseIcon } from "@hooks/use-icons";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { cn } from "@lib/utils";
import { notifyError, notifySuccess } from "@lib/notify";
import { createUserFormSchema } from "@schemas/create";

import styles from "./sign-in-card.module.css";

const DEFAULT_FORM = {
  nombre: "",
  email: "",
  contrasena: "",
  confirmContrasena: "",
  rol: "Tecnico" as const,
  state: "Activo" as const,
};

export default function SignUpCard() {
  const router = useRouter();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    nombre: false,
    email: false,
    contrasena: false,
    confirmContrasena: false,
  });

  const isAlertVisible = useMemo(() => Boolean(alertMessage), [alertMessage]);

  const setField =
    <K extends keyof typeof form>(k: K) =>
    (v: (typeof form)[K]) =>
      setForm((prev) => ({ ...prev, [k]: v }));

  const clearFieldError = useCallback((k: keyof typeof fieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [k]: false }));
  }, []);

  const hideAlert = useCallback(() => setAlertMessage(null), []);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (submitting) return;

      hideAlert();
      setFieldErrors({
        nombre: false,
        email: false,
        contrasena: false,
        confirmContrasena: false,
      });

      const parsed = createUserFormSchema.safeParse({
        nombre: form.nombre,
        email: form.email,
        contrasena: form.contrasena,
        confirmContrasena: form.confirmContrasena,
        rol: form.rol,
        state: form.state,
      });

      if (!parsed.success) {
        const nextErrors = {
          nombre: false,
          email: false,
          contrasena: false,
          confirmContrasena: false,
        };

        for (const issue of parsed.error.issues) {
          const key = issue.path?.[0];
          if (key === "nombre") nextErrors.nombre = true;
          if (key === "email") nextErrors.email = true;
          if (key === "contrasena") nextErrors.contrasena = true;
          if (key === "confirmContrasena") nextErrors.confirmContrasena = true;
        }

        setFieldErrors(nextErrors);
        setAlertMessage(parsed.error.issues[0]?.message ?? "Datos inválidos");
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: parsed.data.nombre,
            email: parsed.data.email,
            contrasena: parsed.data.contrasena,
          }),
        });

        const json = (await res.json().catch(() => null)) as {
          ok?: boolean;
          field?: "nombre" | "email";
          error?: string;
        } | null;

        if (!res.ok) {
          if (res.status === 409) {
            if (json?.field === "email") {
              setFieldErrors((prev) => ({ ...prev, email: true }));
            } else if (json?.field === "nombre") {
              setFieldErrors((prev) => ({ ...prev, nombre: true }));
            }
            setAlertMessage(json?.error || "Conflicto al crear usuario");
          } else {
            setAlertMessage(json?.error || "No se pudo crear el usuario");
          }
          return;
        }

        notifySuccess("Usuario creado", {
          description: `${parsed.data.nombre} (Tecnico)`,
        });

        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: parsed.data.email,
            password: parsed.data.contrasena,
          }),
        });

        const loginJson = (await loginRes.json().catch(() => null)) as {
          error?: string;
          data?: {
            id: string | number;
            nombre: string;
            apellido?: string | null;
            email: string;
            rol: string;
          };
        } | null;

        if (!loginRes.ok || !loginJson?.data) {
          setAlertMessage(
            loginJson?.error ||
              "Usuario creado, pero no se pudo iniciar sesión automáticamente.",
          );
          setForm(DEFAULT_FORM);
          return;
        }

        try {
          window.localStorage.setItem(
            "usuario",
            JSON.stringify({
              id: loginJson.data.id,
              nombre: loginJson.data.nombre,
              apellido: loginJson.data.apellido,
              email: loginJson.data.email,
              rol: loginJson.data.rol,
              loginTime: new Date().toISOString(),
            }),
          );
        } catch {
          // ignore
        }

        setForm(DEFAULT_FORM);
        router.push("/dashboard");
      } catch (err) {
        console.error("POST /api/usuarios error", err);
        notifyError("Error al crear usuario");
      } finally {
        setSubmitting(false);
      }
    },
    [form, hideAlert, router, submitting],
  );

  return (
    <section className={styles.card}>
      <div className="mb-10">
        <h1 className="font-bold text-2xl">Crear usuario</h1>
        <p className="text-sm text-muted-foreground">
          Completa los datos para registrar un nuevo usuario.
        </p>
      </div>

      {isAlertVisible && (
        <div
          className={cn(styles.alert, styles.alertShow)}
          role="alert"
          aria-live="polite"
          onClick={hideAlert}
        >
          <UseIcon name="alert-circle" className={styles.alertIcon} />
          <div className={styles.alertContent}>
            <h2>Error</h2>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}

      <form className={styles.form} noValidate onSubmit={onSubmit}>
        <div
          className={cn(
            styles.inputGroup,
            fieldErrors.email && styles.inputGroupError,
          )}
        >
          <label className={styles.inputLabel}>Correo</label>
          <Input
            type="email"
            placeholder="usuario@colsof.com.co"
            autoComplete="email"
            required
            value={form.email}
            aria-invalid={fieldErrors.email ? "true" : "false"}
            onChange={(e) => {
              setField("email")(e.target.value);
              clearFieldError("email");
              hideAlert();
            }}
            onFocus={() => clearFieldError("email")}
          />
        </div>

        <div
          className={cn(
            styles.inputGroup,
            fieldErrors.nombre && styles.inputGroupError,
          )}
        >
          <label className={styles.inputLabel}>Nombre de usuario</label>
          <Input
            type="text"
            placeholder="Ej: juan.perez"
            autoComplete="username"
            required
            value={form.nombre}
            aria-invalid={fieldErrors.nombre ? "true" : "false"}
            onChange={(e) => {
              setField("nombre")(e.target.value);
              clearFieldError("nombre");
              hideAlert();
            }}
            onFocus={() => clearFieldError("nombre")}
          />
        </div>

        <div
          className={cn(
            styles.inputGroup,
            fieldErrors.contrasena && styles.inputGroupError,
          )}
        >
          <label className={styles.inputLabel}>Contraseña</label>
          <div className={styles.inputWithIcon}>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Ingrese la contraseña"
              autoComplete="new-password"
              required
              value={form.contrasena}
              aria-invalid={fieldErrors.contrasena ? "true" : "false"}
              onChange={(e) => {
                setField("contrasena")(e.target.value);
                clearFieldError("contrasena");
                hideAlert();
              }}
              onFocus={() => clearFieldError("contrasena")}
            />
            <Button
              type="button"
              variant="ghost"
              className={styles.toggle}
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
              <UseIcon name={showPassword ? "eye-off" : "eye-rounded"} />
            </Button>
          </div>
        </div>

        <div
          className={cn(
            styles.inputGroup,
            fieldErrors.confirmContrasena && styles.inputGroupError,
          )}
        >
          <label className={styles.inputLabel}>Confirmar contraseña</label>
          <div className={styles.inputWithIcon}>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirme la contraseña"
              autoComplete="new-password"
              required
              value={form.confirmContrasena}
              aria-invalid={fieldErrors.confirmContrasena ? "true" : "false"}
              onChange={(e) => {
                setField("confirmContrasena")(e.target.value);
                clearFieldError("confirmContrasena");
                hideAlert();
              }}
              onFocus={() => clearFieldError("confirmContrasena")}
            />
            <Button
              type="button"
              variant="ghost"
              className={styles.toggle}
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
              <UseIcon name={showPassword ? "eye-off" : "eye-rounded"} />
            </Button>
          </div>
        </div>

        <Button type="submit" variant="info" disabled={submitting} size="lg">
          {submitting ? "Creando..." : "Crear usuario"}
        </Button>
      </form>
    </section>
  );
}
