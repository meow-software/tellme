import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"
import StarryBackgroundQuote from "@/components/auth/StarryBackgroundQuote"
import { getTranslations } from "next-intl/server";

export default async function ForgotPasswordPage() {

  const t = await getTranslations();

  return (
    <div className="min-h-screen flex">
      {/* Left side - Forgot Password Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="mx-auto w-full max-w-sm">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("auth.FORGOT_PASSWORD_TITLE")}</h1>
            <p className="text-gray-600">{t("auth.FORGOT_PASSWORD_DESCRIPTION_1")}</p>
            <p className="text-gray-600">{t("auth.FORGOT_PASSWORD_DESCRIPTION_2")}</p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>

      {/* Right side - Starry Night Background */}
      <StarryBackgroundQuote title={t("auth.FORGOT_PASSWORD_QUOTE_TITLE")} description={t("auth.FORGOT_PASSWORD_QUOTE_DESCRIPTION")} className="hidden md:flex" />
    </div>
  )
}