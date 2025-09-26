"use client"

import React from "react"

interface NotificationProps {
  message: string | null
  type?: "success" | "error" | "info" // pour styliser selon le type
}

const Notification: React.FC<NotificationProps> = ({ message, type = "info" }) => {
  if (!message) return null

  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 rounded-md shadow-lg text-white animate-fade-in ${typeStyles[type]}`}
    >
      {message}
    </div>
  )
}

export default Notification
