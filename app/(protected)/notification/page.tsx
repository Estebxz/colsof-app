import { StatCard } from "@shared/stat-card";
import { UseIcon } from "@hooks/use-icons";
import { stats } from "@type/statistics";

export default function NotificationPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.label}
              value={stat.value}
              statusLabel={stat.subtext || "Ninguna nueva"}
              icon={<UseIcon name={stat.icon} className="size-4.5 shrink-0" />}
              variant="info"
            />
          ))}
        </div>
    </div>
  );
}
