import { toast } from "sonner"

interface ToastOptions {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export const showToast = ({ title, description, variant = "default" }: ToastOptions) => {
  const style = {
    background: "white",
    border: variant === "destructive" ? "1px solid rgb(239 68 68)" : "1px solid rgb(229 231 235)",
    color: variant === "destructive" ? "rgb(220 38 38)" : "inherit",
    borderRadius: "0.375rem",
    padding: "1rem",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  }

  if (variant === "destructive") {
    toast.error(title, {
      description,
      style,
    })
  } else {
    toast(title, {
      description,
      style,
    })
  }
}
