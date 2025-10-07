import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "p-4 mb-4 text-sm rounded-lg dark:bg-gray-800",
  {
    variants: {
      variant: {
        info: "text-blue-800 bg-blue-50 dark:text-blue-400",
        danger: "text-red-800 bg-red-50 dark:text-red-400",
        success: "text-green-800 bg-green-50 dark:text-green-400",
        warning: "text-yellow-800 bg-yellow-50 dark:text-yellow-300",
        dark: "text-gray-800 bg-gray-50 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  title?: string
  message: string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, message, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {title && <span className="font-medium">{title}</span>} {message}
      </div>
    )
  }
)

Alert.displayName = "Alert"

export { Alert, alertVariants }
