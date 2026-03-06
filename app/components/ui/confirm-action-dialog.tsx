"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";

type ConfirmActionDialogProps = {
  children: ReactNode;
  title: string;
  description?: string;
  details?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
};

export function ConfirmActionDialog({
  children,
  title,
  description,
  details,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  disabled,
}: ConfirmActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        {details ? <div className="pt-1">{details}</div> : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            disabled={disabled || loading}
            onClick={async (e) => {
              e.preventDefault();
              if (disabled || loading) return;

              setLoading(true);
              try {
                await onConfirm();
                setOpen(false);
              } finally {
                setLoading(false);
              }
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
