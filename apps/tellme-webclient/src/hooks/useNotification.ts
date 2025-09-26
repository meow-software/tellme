import { useState } from "react"

export function useNotification(timeout = 5000) {
    const [notification, setNotification] = useState<string | null>(null)
    const [type, setType] = useState<"success" | "error" | "info">("info")

    const showNotification = (message: string, notifType: typeof type = "info") => {
        setNotification(message)
        setType(notifType)
        setTimeout(() => setNotification(null), timeout)
    }

    return {
        notification,
        type,
        showNotification,
    }
}
