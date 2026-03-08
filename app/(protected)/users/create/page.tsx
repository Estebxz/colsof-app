import UserCreateCard from "@shared/users/user-create-card";

export default function UsersCreatePage() {
  return (
    <main>
      <header className="mb-5">
        <h1 className="text-xl font-semibold">Crear usuario</h1>
        <p className="text-muted-foreground text-sm">
          Completa los datos para registrar un nuevo usuario en el sistema.
        </p>
      </header>
      <UserCreateCard />
    </main>
  );
}
