import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DebugBar from "@/components/DebugBar";
import MainMenu from "@/components/MainMenu";
import OperatedBA from "@/components/OperatedBA";
import SiteHeader from "@/components/SiteHeader";
import { getUserType } from "@/components/userType";

export const metadata: Metadata = {
  title: "EnergyLink - My Profile",
};

export default async function OwnerProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ owner?: string }>;
}) {
  const { owner } = await searchParams;
  const userType = await getUserType();

  // Owner-view screen, reached from the user menu while logged in as a WIO
  if (userType === "operator") redirect("/");

  // ponytail: same URL-scoped demo state as NonOpSearch — ZTEST-DD default
  const code = owner ?? "ZTEST-DD";

  return (
    <>
      <DebugBar />
      <SiteHeader userType={userType} loginAs={code} />
      <MainMenu userType={userType} ownerView />
      <main className="flex flex-auto flex-col px-2.5 pt-2.5 lg:px-5">
        {/* The BA detail screen doubles as the owner's own profile */}
        <OperatedBA partner={code} selfView />
      </main>
    </>
  );
}
