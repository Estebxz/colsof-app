import { Button } from "@/app/components/ui/button";
import { UseIcon } from "@/app/hooks/use-icons";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground p-4 sm:p-6 lg:p-10">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Solucionados",
            value: "12,426",
            change: "+36%",
            positive: true,
          },
          {
            title: "Creados",
            value: "23,848",
            change: "+14%",
            positive: false,
          },
          { title: "En Pausa", value: "8,432", change: "+36%", positive: true },
          { title: "Cerrados", value: "3,493", change: "+36%", positive: true },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm"
          >
            <div className="text-xs text-muted-foreground tracking-wide mb-2 uppercase font-semibold">
              {stat.title}
            </div>

            <div className="text-2xl font-bold leading-none mb-2">
              {stat.value}
            </div>

            <div
              className={`text-sm font-medium ${
                stat.positive ? "text-success" : "text-destructive"
              }`}
            >
              {stat.change} {stat.positive ? "↑" : "↓"}
            </div>
          </div>
        ))}
      </section>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">Reporte de casos</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Cargando datos…
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button variant="outline">12 Meses</Button>
            <Button variant="outline">6 Meses</Button>
            <Button variant="outline">30 Días</Button>
            <Button variant="outline">7 Días</Button>

            <Button variant="link" className="ml-auto flex items-center gap-2">
              <UseIcon name="grid" className="size-4 shrink-0" />
              Exportar CSV
            </Button>
          </div>
        </div>

        <div className="w-full h-65">
          <svg
            viewBox="0 0 580 240"
            className="w-full h-full"
            role="img"
            aria-label="Cargando gráfico..."
          >
            <defs>
              <linearGradient
                id="chartGradPlaceholder"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="oklch(0.55 0.15 254.79)"
                  stopOpacity="0.3"
                />
                <stop
                  offset="90%"
                  stopColor="oklch(0.55 0.15 254.79)"
                  stopOpacity="0.05"
                />
              </linearGradient>
            </defs>
            {[20, 65, 110, 155, 200].map((y) => (
              <line
                key={y}
                x1="48"
                x2="560"
                y1={y}
                y2={y}
                className="stroke-border"
                strokeWidth="1"
              />
            ))}

            {/* Area */}
            <path
              d="M 48 155 C 100 130, 140 140, 190 110 C 240 82, 290 95, 340 65 C 390 40, 440 55, 490 40 L 560 45 L 560 200 L 48 200 Z"
              fill="url(#chartGradPlaceholder)"
            />

            {/* Line */}
            <path
              d="M 48 155 C 100 130, 140 140, 190 110 C 240 82, 290 95, 340 65 C 390 40, 440 55, 490 40 L 560 45"
              fill="none"
              stroke="oklch(0.55 0.15 254.79)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 mt-6">
          {/* ======================== LISTA DE USUARIOS ======================== */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Lista de Usuarios</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Base de datos SQL
                </p>
              </div>
              <a
                href="#"
                className="text-sm text-primary font-medium hover:underline"
              >
                Ver todo →
              </a>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              {/* Header row */}
              <div className="grid grid-cols-5 text-xs font-semibold text-muted-foreground uppercase border-b border-border pb-3 mb-3">
                <div>ID</div>
                <div>Usuario</div>
                <div>Estado</div>
                <div>Rol</div>
                <div></div>
              </div>

              {/* Rows */}
              {[
                {
                  id: "18294",
                  name: "María González",
                  email: "mgonzalez@colsof.com.co",
                  initials: "MG",
                  status: "Activo",
                  role: "Empleado",
                  statusColor: "success",
                },
                {
                  id: "9900",
                  name: "Juan Pérez",
                  email: "jperez@colsof.com.co",
                  initials: "JP",
                  status: "Activo",
                  role: "Empleado",
                  statusColor: "success",
                },
                {
                  id: "24994",
                  name: "Lucía Ramírez",
                  email: "lramirez@colsof.co",
                  initials: "LR",
                  status: "Pendiente",
                  role: "Pasante",
                  statusColor: "warning",
                },
                {
                  id: "19924",
                  name: "Carlos Herrera",
                  email: "cherrera@colsof.com.co",
                  initials: "CH",
                  status: "Inactivo",
                  role: "Empleado",
                  statusColor: "destructive",
                },
              ].map((user, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 items-center py-4 border-b border-border last:border-0 text-sm"
                >
                  <div className="font-medium">{user.id}</div>

                  {/* Usuario */}
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                      {user.initials}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Estado */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        user.statusColor === "success"
                          ? "bg-success/15 text-success"
                          : user.statusColor === "warning"
                            ? "bg-accent/20 text-accent"
                            : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      <span className="size-2 rounded-full bg-current"></span>
                      {user.status}
                    </span>
                  </div>

                  {/* Rol */}
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                      {user.role}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="text-right">
                    <button className="size-8 rounded-md hover:bg-muted transition flex items-center justify-center">
                      ⋯
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================== USUARIOS ACTIVOS ======================== */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Usuarios Activos</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Conectados recientemente
                </p>
              </div>
              <a
                href="#"
                className="text-sm text-primary font-medium hover:underline"
              >
                Ver todo →
              </a>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Jenny Wilson",
                  email: "w.lawson@colsof.com.co",
                  role: "Técnico",
                },
                {
                  name: "Devon Lane",
                  email: "dat.roberts@colsof.com.co",
                  role: "Gestor",
                },
                {
                  name: "Jane Cooper",
                  email: "jgraham@colsof.com.co",
                  role: "Técnico",
                },
                {
                  name: "Dianne Russell",
                  email: "curtis.dc@colsof.com.co",
                  role: "Admin",
                },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={`/default-user.webp`}
                      alt={user.name}
                      className="size-9 rounded-full object-cover"
                      width={36}
                      height={36}
                    />
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                    {user.role}
                  </span>
                </div>
              ))}

              <div className="pt-4 text-center">
                <a
                  href="#"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Ver más →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    <div className="flex items-center gap-2 py-10">
        <UseIcon name="spinner" className="fill-black shrink-0 size-5"/>
        <span>Actualizacion automatica activa</span>
    </div>
    </div>
  );
}
