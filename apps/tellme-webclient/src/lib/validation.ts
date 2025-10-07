import { REGEX_USERNAME, REGEX_PASSWORD, REGEX_MAIL } from "@tellme/core"

export { REGEX_PASSWORD, REGEX_USERNAME, REGEX_MAIL }

export const validateAuthField = (field: string, value: string, setErrors: (prev: any) => void, args: string = "", t?: Function) => {
    let errorMessage: string;

    if (field === "pseudo" && !REGEX_USERNAME.test(value)) {
        if (t==undefined) errorMessage = "Username must be 3–20 characters (letters, numbers, . or _)";
        else errorMessage = t("common.USERNAME_NOT_VALIDE");
    }

    if (field === "email" && !REGEX_MAIL.test(value)) {
        if (t==undefined) errorMessage = "Please enter a valid email address.";
        else errorMessage = t("common.EMAIL_NOT_VALIDE");
    }

    if (field === "password" && !REGEX_PASSWORD.test(value)) {
        if (t==undefined) errorMessage = "Password must be 8+ chars with upper, lower, number & symbol.";
        else errorMessage = t("common.PASSWORD_NOT_VALIDE");
    }

    let password = args;
    if (field === "confirmPassword" && value !== password) {
        if (t==undefined) errorMessage = "Passwords do not match.";
        else errorMessage = t("common.PASSWORD_NOT_MATCH");
    }

    setErrors((prev: any) => ({ ...prev, [field]: errorMessage }))
}