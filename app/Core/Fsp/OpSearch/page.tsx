import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DebugBar from "@/components/DebugBar";
import MainMenu from "@/components/MainMenu";
import OpSearch from "@/components/OpSearch";
import SiteHeader from "@/components/SiteHeader";
import { getUserType } from "@/components/userType";

export const metadata: Metadata = {
  title: "EnergyLink - Op Search",
};

const TAB_BY_PARAM: Record<string, number> = {
  invoices: 0,
  property: 1,
  statements: 2,
  "1099": 3,
};

export default async function OpSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const userType = await getUserType();

  // Op Search is an Operator-only screen
  if (userType === "wio") redirect("/");

  return (
    <>
      <DebugBar />
      <SiteHeader userType={userType} />
      <MainMenu userType={userType} />
      <main className="flex flex-auto flex-col px-2.5 pt-2.5 lg:px-5">
        <OpSearch initialTab={TAB_BY_PARAM[tab ?? ""] ?? 0} />
      </main>
    </>
  );
}
