import Footer from "@layout/footer";
import Header from "@layout/header";
import { AvatarInitials } from "@ui/avatar";
import { Button } from "@ui/button";
import { Badge } from "@ui/badges";
import { getSessionUser } from "@/app/server/auth/session";
import { UseIcon } from "@hooks/use-icons";
import Link from "next/link";

export default async function Home() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header userName={user?.nombre} />
      <section className="flex-1 grid place-items-center px-6 py-10 lg:py-0 lg:px-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="lg:col-span-2 lg:flex lg:flex-col lg:items-center lg:text-center">
            {user && (
              <Badge variant="outline" size="lg">
                <div className="flex items-center gap-2">
                  <AvatarInitials name={user.nombre} size="sm" />
                  {user.nombre}
                </div>
              </Badge>
            )}

            <h1 className="mb-5 text-6xl lg:text-7xl tracking-tight font-extrabold text-slate-900 leading-[1.05] max-w-2xl mt-8">
              Optimiza la gestión de tus{" "}
              <span className="text-blue-600">tickets</span> hoy.
            </h1>

            <p className="mb-8 text-base sm:text-lg font-light text-foreground leading-relaxed max-w-xl">
              <strong className="font-semibold text-foreground">Colsof</strong>{" "}
              es un sistema de gestión de tickets orientado al desarrollo y
              seguimiento de solicitudes por roles. Integra autenticación de
              usuarios que garantiza el acceso seguro a la plataforma y cuenta
              con un sistema de notificaciones que mantiene informados a los
              usuarios sobre el estado y las actualizaciones de sus tickets.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="info" size="lg">
                    Ir al dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <Button variant="info" size="lg">
                    Empezar
                  </Button>
                </Link>
              )}

              <a
                href="https://github.com/nicolasalferez20-jpg/Trabajo_final"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg">
                  <UseIcon name="github" className="size-4" />
                  Ver código fuente
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
