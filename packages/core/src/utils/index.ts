import { TYPE_NODE_ENV } from "../constant"

export function envIsProd(env : TYPE_NODE_ENV | string) {
    return env === "PROD"
}

export function envIsDev(env : TYPE_NODE_ENV | string) {
    return env === "DEV"
} 