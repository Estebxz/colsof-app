import { Role } from "./user";

export type LoginUserProps = {
  id: string | number;
  nombre?: string;
  apellido?: string;
  email: string;
  rol?: Role;
};

export type SessionUser =
 {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: Role;
};

export type SessionPayload = {
  user: SessionUser;
};

export interface AuthPanelProps {
  isActive: boolean;
  align: "left" | "right";
  onNavigate?: () => void;
  navigateLabel?: string;
  children: React.ReactNode;
}