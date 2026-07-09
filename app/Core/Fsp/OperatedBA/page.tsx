import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DebugBar from "@/components/DebugBar";
import MainMenu from "@/components/MainMenu";
import OperatedBA from "@/components/OperatedBA";
import SiteHeader from "@/components/SiteHeader";
import { getUserType } from "@/components/userType";

export const metadata: Metadata = {
  title: "EnergyLink - Operated BA",
};

export default async function OperatedBAPage({
  searchParams,
}: {
  searchParams: Promise<{ partner?: string }>;
}) {
  const { partner } = await searchParams;
  const userType = await getUserType();

  // Operator-only screen (reached from the Op Search table)
  if (userType === "wio") redirect("/");

  return (
    <>
      <DebugBar />
      <SiteHeader userType={userType} />
      <MainMenu userType={userType} />
      <main className="flex flex-auto flex-col px-2.5 pt-2.5 lg:px-5">
        <OperatedBA partner={partner} />
      </main>
    </>
  );
}
