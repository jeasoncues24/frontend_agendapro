"use client"

import { AlertCircle, X } from "lucide-react"
import { toast, Toaster as SonnerToaster } from "sonner"

type ToastProps = {
  title: string
  description?: string
}

const toastStyles = {
  error: {
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-600",
    iconBg: "bg-red-100",
    buttonHover: "hover:text-red-500",
    borderTop: "border-red-100"
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-600",
    iconBg: "bg-green-100",
    buttonHover: "hover:text-green-500",
    borderTop: "border-green-100"
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    text: "text-yellow-600",
    iconBg: "bg-yellow-100",
    buttonHover: "hover:text-yellow-500",
    borderTop: "border-yellow-100"
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-600",
    iconBg: "bg-blue-100",
    buttonHover: "hover:text-blue-500",
    borderTop: "border-blue-100"
  }
}

const createToast = (type: keyof typeof toastStyles) => {
  return ({ title, description }: ToastProps) => {
    const styles = toastStyles[type]
    toast.custom(
      (t: any) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full ${styles.bg} ${styles.border} rounded-md shadow-lg pointer-events-auto flex flex-col relative`}
        >
          <div className="flex-1 w-full p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`h-6 w-6 rounded-full ${styles.iconBg} flex items-center justify-center`}>
                  {type === 'error' && <AlertCircle className={`h-4 w-4 ${styles.text}`} />}
                  {type === 'success' && (
                    <svg className={`h-4 w-4 ${styles.text}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {type === 'warning' && (
                    <svg className={`h-4 w-4 ${styles.text}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  {type === 'info' && (
                    <svg className={`h-4 w-4 ${styles.text}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${styles.text}`}>{title}</p>
                {description && <p className={`mt-1 text-sm ${styles.text}`}>{description}</p>}
              </div>
            </div>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className={`absolute top-2 right-2 p-1 rounded-full ${styles.iconBg} ${styles.text} ${styles.buttonHover} focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2`}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
      ),
      { duration: 5000 },
    )
  }
}

export const customToast = {
  error: createToast('error'),
  success: createToast('success'),
  warning: createToast('warning'),
  info: createToast('info'),
}

export function CustomToaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "transparent",
          border: "none",
          padding: 0,
          boxShadow: "none",
        },
      }}
      className="!fixed !top-4 !right-4 !z-50"
      style={{
        "--toast-width": "400px",
        "--toast-gap": "12px",
      } as React.CSSProperties}
    />
  )
}
