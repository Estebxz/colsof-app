"use client";

import { useCallback, useState } from "react";
import { createUserFormSchema } from "@schemas/create";
import { notifySuccess } from "@lib/notify";
import { AvatarInitials } from "@ui/avatar";
import { DropdownSelect } from "@ui/dropdown-menu";
import { Badge } from "@ui/badges";
import { Role, StateUser } from "@type/user";
import { UseIcon } from "@/app/hooks/use-icons";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Separator } from "@ui/separator";
import styles from "./user-create-card.module.css";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "Gestor", label: "Gestor" },
  { value: "Tecnico", label: "Tecnico" },
  { value: "Administrador", label: "Administrador" },
];

const STATE_OPTIONS: { value: StateUser; label: string }[] = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

const DEFAULT_FORM = {
  nombre: "",
  email: "",
  contrasena: "",
  confirmContrasena: "",
  rol: null as Role | null,
  state: "Activo" as StateUser,
};

export default function UserCreateCard() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showPasswords, setShowPasswords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    nombre?: string;
    email?: string;
    contrasena?: string;
    confirmContrasena?: string;
    rol?: string;
    state?: string;
  }>({});

  const { nombre, email, contrasena, confirmContrasena, rol, state } = form;

  const setField =
    <K extends keyof typeof form>(k: K) =>
    (v: (typeof form)[K]) =>
      setForm((prev) => ({ ...prev, [k]: v }));

  const clearError = (k: keyof typeof fieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [k]: undefined }));

  const hasPassword = contrasena.trim().length > 0;
  const hasConfirm = confirmContrasena.trim().length > 0;
  const passwordsMatch =
    hasPassword && hasConfirm && contrasena === confirmContrasena;
  const passwordsMismatch =
    hasPassword && hasConfirm && contrasena !== confirmContrasena;

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (submitting) return;

      setFieldErrors({});

      const parsed = createUserFormSchema.safeParse({
        nombre,
        email,
        contrasena,
        confirmContrasena,
        rol,
        state,
      });

      if (!parsed.success) {
        const nextErrors: typeof fieldErrors = {};

        for (const issue of parsed.error.issues) {
          const key = issue.path?.[0];
          if (
            key === "nombre" ||
            key === "email" ||
            key === "contrasena" ||
            key === "confirmContrasena" ||
            key === "rol" ||
            key === "state"
          ) {
            if (!nextErrors[key]) nextErrors[key] = issue.message;
          }
        }

        setFieldErrors(nextErrors);
        return;
      }

      setSubmitting(true);
      try {
        const payload = {
          nombre: parsed.data.nombre,
          email: parsed.data.email,
          contrasena: parsed.data.contrasena,
          rol: parsed.data.rol,
          state: parsed.data.state,
        };
        const res = await fetch("/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = (await res.json().catch(() => null)) as {
          ok?: boolean;
          field?: "nombre" | "email";
          error?: string;
        } | null;

        if (!res.ok) {
          if (res.status === 409) {
            if (json?.field === "email") {
              setFieldErrors({ email: json.error || "El correo ya existe" });
            } else if (json?.field === "nombre") {
              setFieldErrors({
                nombre: json.error || "El nombre de usuario ya existe",
              });
            } else {
              setFieldErrors({
                nombre: json?.error || "El nombre de usuario ya existe",
              });
            }
          } else {
            console.error(json?.error || "No se pudo crear el usuario");
          }
          return;
        }

        notifySuccess("Usuario creado", {
          description: `${parsed.data.nombre} (${parsed.data.rol})`,
        });

        setForm(DEFAULT_FORM);
        setFieldErrors({});
      } catch (err) {
        console.error("POST /api/usuarios error", err);
      } finally {
        setSubmitting(false);
      }
    },
    [confirmContrasena, contrasena, email, nombre, rol, state, submitting],
  );

  const onCancel = useCallback(() => {
    setForm(DEFAULT_FORM);
    setFieldErrors({});
  }, []);

  return (
    <div>
      <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <form
          id="createUserForm"
          className="flex flex-col gap-6"
          onSubmit={onSubmit}
          noValidate
        >
          <figure className={styles.previewContainer}>
            <AvatarInitials name={nombre || "?"} size="xl" />
            <figcaption className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-sm font-medium text-foreground">
                {nombre || "Nombre del usuario"}
              </span>
              <span className="text-xs text-muted-foreground">
                {email || "ejemplo@colsof.com"}
              </span>
              <div className="flex items-center gap-2">
                {rol && <Badge variant="info">{rol}</Badge>}
                {state && (
                  <Badge variant={state === "Activo" ? "success" : "destructive"}>
                    {state}
                  </Badge>
                )}
              </div>
            </figcaption>
          </figure>

          <Separator />

          <fieldset className={styles.fieldset}>
            <h2>Información básica</h2>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label>Nombre de usuario</label>
                <Input
                  value={nombre}
                  onChange={(e) => {
                    setField("nombre")(e.target.value);
                    clearError("nombre");
                  }}
                  placeholder="Ej: Juan Pérez"
                  autoComplete="name"
                  type="text"
                />
                {fieldErrors.nombre && (
                  <div className={styles.toggle}>
                    <UseIcon name="alert-circle" className="size-4 shrink-0" />
                    <span>{fieldErrors.nombre}</span>
                  </div>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label>Correo</label>
                <Input
                  value={email}
                  onChange={(e) => {
                    setField("email")(e.target.value);
                    clearError("email");
                  }}
                  placeholder="usuario@colsof.com.co"
                  autoComplete="email"
                  inputMode="email"
                  type="email"
                />
                {fieldErrors.email && (
                  <div className={styles.toggle}>
                    <UseIcon name="alert-circle" className="size-4 shrink-0" />
                    <span>{fieldErrors.email}</span>
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          <Separator />

          <fieldset className={styles.fieldset}>
            <h2>Contraseña</h2>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label>Contraseña</label>
                <div className="relative">
                  <Input
                    value={contrasena}
                    onChange={(e) => {
                      setField("contrasena")(e.target.value);
                      clearError("contrasena");
                    }}
                    placeholder="Ingrese la contraseña"
                    autoComplete="new-password"
                    type={showPasswords ? "text" : "password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 size-8"
                    aria-label={
                      showPasswords
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    onClick={() => setShowPasswords((v) => !v)}
                  >
                    <UseIcon name={showPasswords ? "eye-off" : "eye-rounded"} />
                  </Button>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Confirmar contraseña</label>
                <div className="relative">
                  <Input
                    value={confirmContrasena}
                    onChange={(e) => {
                      setField("confirmContrasena")(e.target.value);
                      clearError("confirmContrasena");
                    }}
                    placeholder="Confirme la contraseña"
                    autoComplete="new-password"
                    type={showPasswords ? "text" : "password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 size-8"
                    aria-label={
                      showPasswords
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    onClick={() => setShowPasswords((v) => !v)}
                  >
                    <UseIcon name={showPasswords ? "eye-off" : "eye-rounded"} />
                  </Button>
                </div>
              </div>
              {fieldErrors.contrasena && (
                <div className={styles.toggle}>
                  <UseIcon name="alert-circle" className="size-4 shrink-0" />
                  <span>{fieldErrors.contrasena}</span>
                </div>
              )}
              {fieldErrors.confirmContrasena && (
                <div className={styles.toggle}>
                  <UseIcon name="alert-circle" className="size-4 shrink-0" />
                  <span>{fieldErrors.confirmContrasena}</span>
                </div>
              )}

              {!fieldErrors.confirmContrasena && passwordsMismatch && (
                <div className={styles.toggle}>
                  <UseIcon name="alert-circle" className="size-4 shrink-0" />
                  <span>No coinciden</span>
                </div>
              )}
              {!fieldErrors.confirmContrasena && passwordsMatch && (
                <div className={styles.success}>
                  <UseIcon name="check-circle" className="size-4 shrink-0" />
                  <span>Coinciden</span>
                </div>
              )}
            </div>
          </fieldset>

          <Separator />

          <fieldset className={styles.fieldset}>
            <h2>Permisos y estado</h2>

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label>Rol</label>
                <DropdownSelect<Role>
                  value={rol}
                  onValueChange={(v) => {
                    setField("rol")(v);
                    clearError("rol");
                  }}
                  placeholder="Rol"
                  allLabel="Selecciona"
                  options={ROLE_OPTIONS}
                  disabled={submitting}
                />
                {fieldErrors.rol && (
                  <div className={styles.toggle}>
                    <UseIcon name="alert-circle" className="size-4 shrink-0" />
                    <span>{fieldErrors.rol}</span>
                  </div>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label>Estado inicial</label>
                <DropdownSelect<StateUser>
                  value={state}
                  onValueChange={(v) => {
                    if (v) setField("state")(v);
                    clearError("state");
                  }}
                  placeholder="Estado"
                  allLabel="Activo"
                  options={STATE_OPTIONS}
                  disabled={submitting}
                />
                {fieldErrors.state && (
                  <div className={styles.toggle}>
                    <UseIcon name="alert-circle" className="size-4 shrink-0" />
                    <span>{fieldErrors.state}</span>
                  </div>
                )}
              </div>
            </div>
          </fieldset>
        </form>
      </section>
      <footer className="flex justify-end gap-3.5 mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="createUserForm"
          variant="info"
          disabled={submitting}
        >
          Crear usuario
        </Button>
      </footer>
    </div>
  );
}
