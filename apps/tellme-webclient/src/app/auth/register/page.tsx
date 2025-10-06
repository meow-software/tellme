import { RegisterForm } from "@/components/auth/RegisterForm"
import StarryBackgroundQuote from "@/components/auth/StarryBackgroundQuote"
import { getTranslations } from "next-intl/server";

export default async function SignUpPage() {
  const t = await getTranslations();
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("auth.REGISTER_TITLE")}</h1>
            <p className="text-gray-600">'{t("auth.REGISTER_DESCRIPTION")}'</p>
          </div>
          <RegisterForm />
        </div>
      </div>
      <StarryBackgroundQuote title={t("auth.REGISTER_QUOTE_TITLE")} description={t("auth.REGISTER_QUOTE_DESCRIPTION")} className="hidden md:flex" />
    </div>
  )
}