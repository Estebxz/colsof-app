import type { IconName } from "@type/ui";
import { cn } from "@lib/utils";

interface IconProps {
  name: IconName;
  className?: string;
}

export const UseIcon = ({ name, className = "" }: IconProps) => {
  return (
    <svg
      className={cn("inline-block fill-current", className)}
      aria-hidden="true"
    >
      <use
        href={`/sprites.svg#icon-${name}`}
        xlinkHref={`/sprites.svg#icon-${name}`}
      />
    </svg>
  );
};
