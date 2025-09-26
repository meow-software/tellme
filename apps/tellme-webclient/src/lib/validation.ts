import { REGEX_USERNAME, REGEX_PASSWORD, REGEX_MAIL } from "@tellme/core"

export { REGEX_PASSWORD, REGEX_USERNAME, REGEX_MAIL }

export const validateAuthField = (field: string, value: string, setErrors: (prev: any) => void, args: string = "") => {
    let errorMessage: string;

    if (field === "pseudo" && !REGEX_USERNAME.test(value)) {
        errorMessage = "Username must be 3–20 characters (letters, numbers, . or _)"
    }

    if (field === "email" && !REGEX_MAIL.test(value)) {
        errorMessage = "Please enter a valid email address."
    }

    if (field === "password" && !REGEX_PASSWORD.test(value)) {
        errorMessage = "Password must be 8+ chars with upper, lower, number & symbol"
    }

    let password = args;
    if (field === "confirmPassword" && value !== password) {
        errorMessage = "Passwords do not match"
    }

    setErrors((prev: any) => ({ ...prev, [field]: errorMessage }))
}
