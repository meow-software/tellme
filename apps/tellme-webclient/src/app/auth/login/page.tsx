"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import StarryBackgroundQuote from "@/components/auth/StarryBackgroundQuote"
import { useNotification } from "@/hooks/useNotification"
import { FormField } from "@/components/ui/formField"
import SocialLoginButtons from "@/components/auth/SocialLoginButton"

import { REGEX_PASSWORD, REGEX_MAIL, validateAuthField } from "@/lib/validation"

const forgotPassword = "forgot-password"
const register = "register"
const passwordRegex = REGEX_PASSWORD
const mailRegex = REGEX_MAIL


export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { notification, type, showNotification } = useNotification()

  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showNotification("Login successful (demo)")
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
  }

  return (
    <div className="min-h-screen flex">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Left side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="mx-auto w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600">Enter to improve your sleep and bring peace to your life</p>
          </div>

          {/* Social Login Buttons */}
          <SocialLoginButtons mode="login" onClick={handleSocialLogin} />

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                pattern={mailRegex}
                required
              />
            </div>

            <div>
              <FormField
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  validateAuthField("password", e.target.value, setErrors)
                }}
                error={errors.password}
                pattern={passwordRegex}
                required
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link
                href={forgotPassword}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
            >
              Login
            </Button>

            <div className="flex items-center gap-2">
              <span className="ml-2 text-sm text-gray-600">
                Don't have an account?
              </span>
              <Link href={register} className="text-sm text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Starry Night Background */}
      <StarryBackgroundQuote title="" description="" className="hidden md:flex" />
    </div>
  )
}
