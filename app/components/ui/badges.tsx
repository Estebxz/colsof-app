import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

import { cn } from "@lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 gap-1.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive/15 text-destructive border-destructive/25",
        outline: "border-foreground/30 bg-transparent text-foreground",
        secondary:
          "bg-white text-secondary-foreground hover:bg-white/80",
        ghost: "bg-muted text-muted-foreground",
        success: "bg-success/15 text-success border-success/25",
        warning: "bg-warning/15 text-warning border-warning/25",
        info: "bg-ring/15 text-ring border-ring/25",
      },
      size: {
        sm: "h-5 px-2 text-[10px] rounded-full [&_svg]:size-2.5",
        default: "h-6 px-2.5 text-xs rounded-full [&_svg]:size-3",
        lg: "h-7 px-3 text-sm rounded-full [&_svg]:size-3.5",
      },
      pulse: {
        true: "relative",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      pulse: false,
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant, size, pulse, asChild = false, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        className={cn(badgeVariants({ variant, size, pulse, className }))}
        ref={ref}
        {...props}
      >
        {pulse && (
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-90" />
            <span className="relative inline-flex size-1.5 rounded-full bg-current" />
          </span>
        )}
        {children}
      </Comp>
    );
  },
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
