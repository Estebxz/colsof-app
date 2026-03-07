import { UseIcon } from "@/app/hooks/use-icons";
import { Button } from "@ui/button";
import Link from "next/link";

export default function UsersCreate() {
  return (
    <div>
      <Button variant="ghost" size="sm">
        <Link href="/ " className="flex items-center gap-2">
          <UseIcon name="arrow-up-left" className="size-4 shrink-0" />
          <span>Volver a Usuarios</span>
        </Link>
      </Button>
      <h1 className="font-bold text-2xl">Crear usuario</h1>
      <p className="text-muted-foreground text-base">Completa los datos para registrar un nuevo usuario en el sistema.</p>
    </div>
  );
}