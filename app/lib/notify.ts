import { toast } from "sonner";

type NotifyOptions = {
  description?: string;
};

export function notifySuccess(message: string, opts?: NotifyOptions) {
  toast.success(message, { description: opts?.description });
}

export function notifyError(message: string, opts?: NotifyOptions) {
  toast.error(message, { description: opts?.description });
}

export function notifyInfo(message: string, opts?: NotifyOptions) {
  toast.message(message, { description: opts?.description });
}
