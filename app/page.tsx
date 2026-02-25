import Footer from "@components/footer";
import SignInCard from "@components/sign-in-card";
import Link from "next/link";
import Image from "next/image";
import { UseIcon } from "@hooks/use-icons";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <Link href="/">
          <Image src="/favicon.svg" alt="COLSOF S.A.S" width={70} height={70} />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <section className="w-full px-4 py-6">
          <div className="mx-auto max-w-7xl lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="mb-4 text-6xl tracking-tight font-extrabold text-primary">
                  Optimiza la gestión de tus{" "}
                  <span className="text-blue-600">tickets</span> hoy.
                </h1>

                <p className="mb-8 font-light text-gray-700 sm:text-xl">
                  <strong>Colsof</strong> es un sistema de gestión de tickets
                  orientado al desarrollo y seguimiento de solicitudes por
                  roles. Integra autenticación de usuarios que garantiza el
                  acceso seguro a la plataforma y cuenta con un sistema de
                  notificaciones que mantiene informados a los usuarios sobre el
                  estado y las actualizaciones de sus tickets.
                </p>

                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <a
                    href="/sign-in"
                    className="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:ring-1 focus:ring-white"
                  >
                    Empezar
                  </a>

                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/nicolasalferez20-jpg/Trabajo_final/"
                    className="inline-flex items-center justify-center px-4 py-2.5 text-base font-medium text-gray-900 border border-gray-300 rounded-sm hover:bg-gray-300 focus:ring-1 focus:ring-white"
                  >
                    <UseIcon name="github" className="mr-2 -ml-1 w-5 h-5" />
                    Ver código fuente
                  </a>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <SignInCard />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
