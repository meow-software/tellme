"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import StarryBackgroundQuote from "@/components/auth/StarryBackgroundQuote"
import { FormField } from "@/components/ui/formField"
import SocialLoginButtons from "@/components/auth/SocialLoginButton"
import { REGEX_USERNAME, REGEX_PASSWORD, REGEX_MAIL, validateAuthField } from "@/lib/validation"
import { useNotification } from "@/hooks/useNotification"
import { register } from "@/lib/rest"
import type { ApiResponse } from "@/lib"



const login = "login"
const passwordRegex = REGEX_PASSWORD
const usernameRegex = REGEX_USERNAME
const mailRegex = REGEX_MAIL

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pseudo, setPseudo] = useState("")

  const { notification, type, showNotification } = useNotification()
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)


  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !pseudo || errors.email || errors.password || errors.confirmPassword || errors.pseudo) return;

    setIsLoading(true);
    setFormError(null); // Clear erros
    try {
      const res: ApiResponse = await register({ email, password, pseudo });
      console.log("----res")
      if (!res.success) {
        setFormError(res.message || "Identifiants incorrects");
        return;
      }
      showNotification("Register réussi: " + res.message, "success");
    } catch (err: any) {
      // networking error or 500
      setFormError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex">
      {/* Left side - Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="mx-auto w-full max-w-sm">

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join us to improve your sleep and bring peace to your life</p>
          </div>

          {formError && (
            <p className="text-sm text-red-600">{formError}</p>
          )}

          {/* Social Login Buttons */}
          <div className="mt-4"><SocialLoginButtons mode="register" onClick={handleSocialRegister} /></div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Signup Form */}
          <form className="space-y-4">
            <div>
              <FormField
                id="pseudo"
                label="Pseudo"
                type="text"
                placeholder="Enter your pseudonyme"
                value={pseudo}
                onChange={(e) => {
                  setPseudo(e.target.value)
                  validateAuthField("pseudo", e.target.value, setErrors)
                }}
                error={errors.pseudo}
                pattern={usernameRegex}
                required
              />
            </div>

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
                label="Password"
                id="password"
                type="password"
                placeholder="Create a password"
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

            <div>
              <FormField
                label="Confirm Password"
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  validateAuthField("confirmPassword", e.target.value, setErrors)
                }}
                error={errors.confirmPassword}
                pattern={passwordRegex}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
              disabled={Object.values(errors).some(Boolean)}
            >
              Create Account
            </Button>

            <div className="flex items-center gap-2">
              <span className="ml-2 text-sm text-gray-600">
                Do you have an account?
              </span>
              <Link href={login} className="text-sm text-blue-600 hover:text-blue-500">
                Log in
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
