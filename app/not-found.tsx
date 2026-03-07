import { UseIcon } from "@hooks/use-icons";
import Header from "@layout/header";
import Footer from "@layout/footer";
import { Button } from "@ui/button";
import { Badge } from "@ui/badges";
import { getSessionUser } from "@auth/session";
import { supportWhatsapp } from "@lib/constants";
import Link from "next/link";

export default async function NotFound() {
  const user = await getSessionUser();
  return (
    <div className="min-h-screen flex flex-col">
      <Header userName={user?.nombre} />
      <main className="flex flex-1 items-center justify-center px-6">
        <section className="text-center">
          <Badge variant="secondary">
            <p className="text-base font-semibold text-blue-600">404</p>
          </Badge>

          <h1 className="my-4 text-6xl tracking-tight font-extrabold sm:text-7xl">
            Página No <br />
            Encontrada
          </h1>

          <p className="max-w-xl mx-auto font-light text-foreground sm:text-xl leading-relaxed">
            Lo sentimos, no pudimos encontrar la página que estás buscando.
          </p>

          <div className="mt-8 flex items-center justify-center gap-x-6">
            <Link href="/">
              <Button variant="info">
                <UseIcon name="arrow-up-left" className="size-4" />
                Volver al inicio
              </Button>
            </Link>

            <a href={supportWhatsapp} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">
                <UseIcon name="whatsapp" className="size-4" />
                Contactar soporte
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
