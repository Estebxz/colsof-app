"use client";

import { cn } from "@lib/utils";

interface AvatarInitialsProps {
	name: string;
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
	sm: "size-6 text-[10px]",
	md: "size-8 text-xs",
	lg: "size-10 text-sm",
	xl: "size-14 text-base"
};

function getInitials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase() ?? "")
		.join("");
}

export function AvatarInitials({ name, size = "md", className }: AvatarInitialsProps) {
	return (
		<div
			aria-label={name}
			title={name}
			className={cn(
				"shrink-0 rounded-full bg-ring/80 flex items-center justify-center font-semibold text-white",
				sizeClasses[size],
				className,
			)}
		>
			{getInitials(name)}
		</div>
	);
}