import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { UseIcon } from "@hooks/use-icons";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import type { DropdownSelectProps } from "@type/types";

export function DropdownSelect<T extends string>({
  value,
  onValueChange,
  options,
  placeholder,
  allLabel = "Todos",
  disabled = false,
  className,
}: DropdownSelectProps<T>) {
  const selectedLabel =
    value === null
      ? allLabel
      : (options.find((o) => o.value === value)?.label ?? placeholder);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "h-10 w-full justify-between border border-border bg-background px-3 text-foreground hover:bg-muted cursor-pointer",
            className,
          )}
          aria-label={placeholder}
          disabled={disabled}
        >
          <span className="truncate text-sm">{selectedLabel}</span>
          <UseIcon name="dot-menu" className="size-4 shrink-0" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={6}
          align="start"
          className="min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <DropdownMenu.Item
            onSelect={(e) => {
              e.preventDefault();
              onValueChange(null);
            }}
            className={cn(
              "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
              "hover:bg-muted focus:ring-0 focus:ring-ring",
            )}
          >
            <span className="flex-1 truncate">{allLabel}</span>
            {value === null ? (
              <UseIcon name="arrow-prev-small" className="size-4" />
            ) : null}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          {options.map((opt) => (
            <DropdownMenu.Item
              key={opt.value}
              disabled={opt.disabled}
              onSelect={(e) => {
                e.preventDefault();
                onValueChange(opt.value);
              }}
              className={cn(
                "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                "hover:bg-muted focus:ring-0 focus:ring-ring",
                "data-disabled:pointer-events-none data-disabled:opacity-50",
              )}
            >
              <span className="flex-1 truncate">{opt.label}</span>
              {value === opt.value ? (
                <UseIcon name="arrow-prev-small" className="size-4" />
              ) : null}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Arrow className="fill-popover" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default DropdownSelect;
