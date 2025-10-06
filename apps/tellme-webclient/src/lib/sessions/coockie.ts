import { DEFAULT_LANGUAGE } from "@/lib";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function getCookie(name: string) : Promise<RequestCookie | undefined>{
      return (await cookies()).get(name);
}

export async function getLang() {
    const lang =  (await getCookie("lang"))?.value ;
    return lang ? lang : DEFAULT_LANGUAGE;
}