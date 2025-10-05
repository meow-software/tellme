"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import StarryBackgroundQuote from "@/components/auth/StarryBackgroundQuote"
import { FormField } from "@/components/ui/formField"
import SocialLoginButtons from "@/components/auth/SocialLoginButton"
import { REGEX_USERNAME, REGEX_PASSWORD, REGEX_MAIL, validateAuthField } from "@/lib/validation"
import { useNotification } from "@/hooks/useNotification"
import { register } from "@/lib/rest"
import type { ApiResponse } from "@/lib"
import { LoadingButton } from "@/components/ui/loadingButton"
import { useTranslationStore } from "@/stores/useTranslationStore"

export default function SignupPage() {
  const login = "login"
  const passwordRegex = REGEX_PASSWORD
  const usernameRegex = REGEX_USERNAME
  const mailRegex = REGEX_MAIL

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pseudo, setPseudo] = useState("")

  const { notification, type, showNotification } = useNotification()
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const { t, requireNamespaces } = useTranslationStore()

  useEffect(() => {
    (async () => {
      requireNamespaces(["auth", "common"]);
    })();
  }, []);
  
  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`)
  }

  const isFormInvalid = !email || !password || !confirmPassword || !pseudo || !!errors.email || !!errors.password || !!errors.confirmPassword || !!errors.pseudo || isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setIsLoading(true);
    setFormError(null);
    setFormSuccess(null);

    let res: ApiResponse;
    try {
      res = await register({ email, username: pseudo, password });

      setFormSuccess(res.data.message);
    } catch (err: any) {
      res = err.response?.data;
      if (res && res.errors) setFormError(res.errors.message || t("messages.ERROR_GENERIC"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="mx-auto w-full max-w-sm">

          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("auth.REGISTER_TITLE")}</h1>
            <p className="text-gray-600">{t("auth.REGISTER_DESCRIPTION")}</p>
          </div>

          <div className="mt-4"><SocialLoginButtons mode="register" onClick={handleSocialRegister} /></div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t("common.OR")}</span>
            </div>
          </div>

          {formError && (
            <p className="text-sm text-red-600 mb-3 mt-3">{formError}</p>
          )}

          {formSuccess && (
            <p className="text-sm text-green-600 mb-3 mt-3">{formSuccess}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <FormField
                id="pseudo"
                label={t("auth.REGISTER_PSEUDO")}
                type="text"
                placeholder={t("auth.REGISTER_ENTER_PSEUDO")}
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
                label={t("auth.REGISTER_EMAIL")}
                placeholder={t("auth.REGISTER_ENTER_EMAIL")}
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
                label={t("auth.REGISTER_PASSWORD")}
                id="password"
                type="password"
                placeholder={t("auth.REGISTER_CREATE_PASSWORD")}
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
                label={t("auth.REGISTER_CONFIRM_PASSWORD")}
                id="confirm-password"
                type="password"
                placeholder={t("auth.REGISTER_CONFIRM_YOUR_PASSWORD")}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  validateAuthField("confirmPassword", e.target.value, setErrors, password)
                }}
                error={errors.confirmPassword}
                pattern={passwordRegex}
                required
              />
            </div>

            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={isFormInvalid}
            >
              {t("auth.LOGIN_TITLE")}
            </LoadingButton>

            <div className="flex items-center gap-2">
              <span className="ml-2 text-sm text-gray-600">
                {t("auth.REGISTER_HAVE_ACCOUNT")}
              </span>
              <Link href={login} className="text-sm text-blue-600 hover:text-blue-500">
                {t("auth.REGISTER_LOG_IN")}
              </Link>
            </div>
          </form>
        </div>
      </div>

      <StarryBackgroundQuote title="" description="" className="hidden md:flex" />

    </div>
  )
}
