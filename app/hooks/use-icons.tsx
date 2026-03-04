import type { IconName } from "@type/types";
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
        href={`/icons.svg#icon-${name}`}
        xlinkHref={`/icons.svg#icon-${name}`}
      />
    </svg>
  );
};
