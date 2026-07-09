import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AgentOwners from "@/components/AgentOwners";
import DebugBar from "@/components/DebugBar";
import MainMenu from "@/components/MainMenu";
import SiteHeader from "@/components/SiteHeader";
import { getUserType } from "@/components/userType";

export const metadata: Metadata = {
  title: "EnergyLink - Owners",
};

export default async function AgentOwnersPage() {
  const userType = await getUserType();

  // Owners is a WIO (agent) screen
  if (userType === "operator") redirect("/");

  return (
    <>
      <DebugBar />
      <SiteHeader userType={userType} />
      <MainMenu userType={userType} />
      <main className="flex min-h-0 flex-auto flex-col px-2.5 lg:px-5">
        <AgentOwners />
      </main>
    </>
  );
}
