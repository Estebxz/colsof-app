import { toast } from "sonner";

type NotifyOptions = {
  description?: string;
};

export function notifySuccess(message: string, opts?: NotifyOptions) {
  toast.success(message, {
    description: opts?.description,
    className: "app-toast-success",
  });
}

export function notifyError(message: string, opts?: NotifyOptions) {
  toast.error(message, {
    description: opts?.description,
    className: "app-toast-error",
  });
}

export function notifyInfo(message: string, opts?: NotifyOptions) {
  toast.message(message, {
    description: opts?.description,
    className: "app-toast-info",
  });
}
