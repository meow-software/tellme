"use client";

import type React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoadingButton } from "@/components/ui/loadingButton";
import { useNotification } from "@/hooks/useNotification";
import { FormField } from "@/components/ui/formField";
import SocialLoginButtons from "@/components/auth/socialLoginButton";
import { REGEX_PASSWORD, REGEX_MAIL, validateAuthField } from "@/lib/validation";
import { login } from "@/lib/rest";
import { splitCode, type ApiResponse } from "@/lib";
import { useAuth } from '@/hooks/useAuth';
import { useTranslationStore } from "@/stores/useTranslationStore";
import { LoginFormSkeleton } from "./login-form-skeleton";
import { toast } from "sonner";
import { Alert } from "../ui/alert";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const forgotPassword = "forgot-password";
  const register = "register";
  const afterLogin = "/@me";
  const passwordRegex = REGEX_PASSWORD;
  const mailRegex = REGEX_MAIL;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { notification, type, showNotification } = useNotification();
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const { t, requireNamespaces, getAllMessages } = useTranslationStore();

  useEffect(() => {
    (async () => {
      await requireNamespaces(["auth", "common"]);
      setSkeletonLoading(false)
    })();
  }, []);

  const isFormInvalid =
    !email ||
    !password ||
    !!errors.email ||
    !!errors.password ||
    isLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setIsLoading(true);
    setFormError(null);
    let res: ApiResponse;
    try {
      console.log({ usernameOrEmail: email, password, rememberMe })
      res = await login({ usernameOrEmail: email, password, rememberMe });

      if (!res.success) {
        setFormError(res.data.message || t("messages.ERROR_INCORRECT_CREDENTIALS"));
        return;
      }

      showNotification(t("messages.SUCCESS_LOGIN", { username: res.data.user.username }));
      toast.success(t("messages.SUCCESS_LOGIN", { username: res.data.user.username }));
      // router.push(afterLogin);
    } catch (err: any) {
      res = err.response?.data;
      console.log(res);
      if (res && res.errors) {
        if (res.errors.code) {
          const { namespace, key } = splitCode(res.errors.code);
          console.log("----ncode", namespace, key);
          setFormError(t(`${namespace}.${key}`));
          toast.error(t(`${namespace}.${key}`));
        } else {
          if (res && res.errors) setFormError(res.errors.message || t("messages.ERROR_GENERIC"));
          if (res && res.errors) toast.error(res.errors.message || t("messages.ERROR_GENERIC"));
        }

      }
    } finally {
      setIsLoading(false);
    }
  };
  /*
      <header>
        {user ? (
          <>
            <span>{t("auth.LOGIN_CONNECTED")}, {user.username}</span>
            <button onClick={logout}>{t("auth.LOGIN_LOGOUT")}</button>
          </>
        ) : (
          <span>{t("auth.LOGIN_NOT_CONNECTED")}</span>
        )}
      </header>
      */
  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
  }

  const { user, loading, logout } = useAuth()
  if (skeletonLoading) {
    return <LoginFormSkeleton />
  }

  return (
    <>
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}
      <div className="mt-4"><SocialLoginButtons mode="login" onClick={handleSocialLogin} /></div>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{t("common.OR")}</span>
        </div>
      </div>

      {formError && (
        <Alert variant="danger" message={formError} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            id="password"
            type="password"
            label={t("auth.REGISTER_PASSWORD")}
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

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              {t("auth.LOGIN_REMEMBER_ME")}
            </label>
          </div>
          <Link
            href={forgotPassword}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {t("auth.LOGIN_FORGOT_PASSWORD")}
          </Link>
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
            {t("auth.LOGIN_NO_ACCOUNT")}
          </span>
          <Link href={register} className="text-sm text-blue-600 hover:text-blue-500">
            {t("auth.LOGIN_SIGN_UP")}
          </Link>
        </div>
      </form>
    </>
  )
}
