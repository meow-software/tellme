"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import StarryBackgroundQuote from "@/components/auth/StarryBackgroundQuote"
import { useNotification } from "@/hooks/useNotification"
import { FormField } from "@/components/ui/formField"
import { validateAuthField } from "@/lib/validation"

const login = "login"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const { notification, type, showNotification } = useNotification()
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})


  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      showNotification("Vous avez reçu un email pour changer votre mot de passe")
    }
  }

  return (
    <div className="min-h-screen flex">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Left side - Forgot Password Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="mx-auto w-full max-w-sm">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">No worries, every story has its twists.</p>
            <p className="text-gray-600">Enter your email to receive a password reset link.</p>
          </div>

          {/* Reset Password Form */}
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <FormField
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  validateAuthField("email", e.target.value, setErrors)
                }}
                error={errors.email}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
            >
              Send Reset Link
            </Button>

            <div className="text-center">
              <Link href={login} className="text-sm text-blue-600 hover:text-blue-500">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Starry Night Background */}
      <StarryBackgroundQuote title="Let’s help you return to your story." description="Forgotten passwords don't mean forgotten dreams." className="hidden md:flex" />
    </div>
  )
}
