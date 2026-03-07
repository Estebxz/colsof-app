import { UseIcon } from "@hooks/use-icons";
import { Button } from "@ui/button";
import Link from "next/link";

export default function UsersCreate() {
  return (
    <main>
      <header className="mb-5">
        <Button variant="ghost" size="sm">
          <Link href="/users" className="flex items-center gap-2">
            <UseIcon name="arrow-up-left" />
            Volver a usuarios
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Crear usuario</h1>
        <p className="text-muted-foreground text-sm">
          Completa los datos para registrar un nuevo usuario en el sistema.
        </p>
      </header>
    </main>
  );
}