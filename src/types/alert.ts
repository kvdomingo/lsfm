export type AlertStatus = "success" | "error" | "warning" | "info";

export const AlertColor: Record<AlertStatus, string> = {
  success: "bg-emerald-300",
  error: "bg-red-300",
  warning: "bg-amber-300",
  info: "bg-sky-300",
};
