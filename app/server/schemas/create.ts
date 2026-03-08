import { z } from "zod";

const ROLES = ["Gestor", "Tecnico", "Administrador"] as const;
const STATES = ["Activo", "Inactivo"] as const;

export const createUserSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es requerido"),
  email: z
    .string()
    .trim()
    .min(1, "El correo es requerido")
    .toLowerCase()
    .email("Correo invalido"),
  contrasena: z
    .string()
    .trim()
    .min(1, "La contraseña es requerida")
    .min(8, "Mínimo 8 caracteres"),
  rol: z.enum(ROLES, { message: "El rol es requerido" }),
  state: z.enum(STATES),
});

export const createUserFormSchema = createUserSchema
  .extend({
    confirmContrasena: z.string().trim().min(1, "Confirma la contraseña"),
  })
  .superRefine((data, ctx) => {
    if (data.contrasena !== data.confirmContrasena) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmContrasena"],
        message: "Las contraseñas no coinciden",
      });
    }
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserFormInput = z.infer<typeof createUserFormSchema>;
