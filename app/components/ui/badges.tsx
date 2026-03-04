import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

import { cn } from "@lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary",
				destructive:
					"bg-destructive/15 text-destructive border border-destructive/25",
				outline:
					"border border-foreground/30 bg-transparent text-foreground	py-4",
				secondary:
					"bg-white text-secondary-foreground hover:bg-white/80",
				ghost:
					"bg-muted text-muted-foreground",
				success:
					"bg-success/15 text-success border border-success/25",
				warning:
					"bg-amber-500/15 text-amber-600 border border-amber-500/25 dark:text-amber-400",
				info:
					"bg-blue-500/20 text-blue-600 border border-blue-500/25 dark:text-blue-400",
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
	extends HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {
	asChild?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant, size, pulse, asChild = false, children, ...props }, ref) => {
		const Comp = asChild ? Slot : "span";
		return (
			<Comp
				className={cn(badgeVariants({ variant, size, pulse, className }))}
				ref={ref}
				{...props}
			>
				{pulse && (
					<span className="relative flex size-1.5 shrink-0">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
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