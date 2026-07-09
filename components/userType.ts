import { cookies } from "next/headers";

export type UserType = "operator" | "wio";

export async function getUserType(): Promise<UserType> {
  const store = await cookies();
  return store.get("userType")?.value === "wio" ? "wio" : "operator";
}
