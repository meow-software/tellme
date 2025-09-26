import { redirect } from "next/navigation"

const login = "auth/login"

export default function Home() {
  redirect(login)
}