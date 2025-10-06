"use server";
import { LoginForm } from "@/components/auth/loginForm"
import StarryBackgroundQuote from "@/components/auth/starryBackgroundQuote"
import { getTranslations } from "next-intl/server";

export default async function SignInPage() {

  const t = await getTranslations();
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("auth.LOGIN_TITLE")}</h1>
            <p className="text-gray-600">{t("auth.LOGIN_DESCRIPTION")}</p>
          </div>
          <LoginForm />
        </div>
      </div>
      <StarryBackgroundQuote title={t("auth.LOGIN_QUOTE_TITLE")} description={t("auth.LOGIN_QUOTE_DESCRIPTION")} className="hidden md:flex" />
    </div>
  )
}