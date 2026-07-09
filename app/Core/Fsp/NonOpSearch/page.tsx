import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DebugBar from "@/components/DebugBar";
import MainMenu from "@/components/MainMenu";
import NonOpSearch from "@/components/NonOpSearch";
import SiteHeader from "@/components/SiteHeader";
import { getUserType } from "@/components/userType";

export const metadata: Metadata = {
  title: "EnergyLink - Non-Op Search",
};

const TAB_BY_PARAM: Record<string, number> = {
  invoices: 0,
  property: 1,
  statements: 2,
  "1099": 3,
  inquiry: 4,
  banking: 5,
};

export default async function NonOpSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const userType = await getUserType();

  // Non-Op Search is the owner view reached from the WIO agent portal
  if (userType === "operator") redirect("/");

  return (
    <>
      <DebugBar />
      {/* ponytail: "logged in as owner" is URL-scoped demo state, not a session — ZTEST-DD hardcoded */}
      <SiteHeader userType={userType} loginAs="ZTEST-DD" />
      <MainMenu userType={userType} ownerView />
      <main className="flex flex-auto flex-col px-2.5 pt-2.5 lg:px-5">
        <NonOpSearch initialTab={TAB_BY_PARAM[tab ?? ""] ?? 0} />
      </main>
    </>
  );
}
