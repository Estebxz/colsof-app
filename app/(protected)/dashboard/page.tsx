"use client";

import { UseIcon } from "@/app/hooks/use-icons";
import DashboardStatCards from "@/app/components/dashboard/dashboard-stat-cards";
import CasesReport from "@/app/components/dashboard/cases-report";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground p-4 sm:p-6 lg:p-10">
      <DashboardStatCards />

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <CasesReport />
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
        <UseIcon name="spinner" className="fill-black shrink-0 size-5" />
        <span>Actualizacion automatica activa</span>
      </div>
    </div>
  );
}
