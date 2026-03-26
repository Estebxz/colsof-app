import { Button } from "@ui/button";
import { cn } from "@lib/utils";
import { UseIcon } from "@hooks/use-icons";
import { AuthPanelProps } from "@type/auth";

export function AuthPanel({
  isActive,
  align,
  onNavigate,
  navigateLabel,
  children,
}: AuthPanelProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col items-center justify-center p-6 md:p-12",
        align === "right" && "bg-ring",
        !isActive && "hidden md:flex",
      )}
    >
      <div className="w-full max-w-sm flex flex-col gap-4">
        {isActive && (
          <>
            {onNavigate && (
              <Button
                type="button"
                variant="secondary"
                onClick={onNavigate}
                className="w-full justify-between gap-2"
              >
                {align === "right" && (
                  <UseIcon
                    name="arrow-default"
                    className="size-5 shrink-0 -rotate-90"
                  />
                )}

                <span className={cn(align === "right" && "flex-1 text-right")}>
                  {navigateLabel}
                </span>

                {align === "left" && (
                  <UseIcon
                    name="arrow-default"
                    className="size-5 shrink-0 rotate-90"
                  />
                )}
              </Button>
            )}
            {children}
          </>
        )}
      </div>
    </div>
  );
}
