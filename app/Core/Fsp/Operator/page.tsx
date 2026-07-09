import type { Metadata } from "next";
import DebugBar from "@/components/DebugBar";
import MainMenu from "@/components/MainMenu";
import OperatedBA from "@/components/OperatedBA";
import SiteHeader from "@/components/SiteHeader";
import { getUserType } from "@/components/userType";

export const metadata: Metadata = {
  title: "EnergyLink - Operator",
};

// Operator details — reached from the Non-Op Search table by the WIO, and
// viewable by the operator too (both see the bank list; Plaid is operator-only).
export default async function OperatorPage({
  searchParams,
}: {
  searchParams: Promise<{ operator?: string }>;
}) {
  const { operator } = await searchParams;
  const userType = await getUserType();
  const isWio = userType === "wio";

  return (
    <>
      <DebugBar />
      {/* ponytail: same URL-scoped demo state as NonOpSearch — ZTEST-DD hardcoded */}
      <SiteHeader userType={userType} loginAs={isWio ? "ZTEST-DD" : undefined} />
      <MainMenu userType={userType} ownerView={isWio} />
      <main className="flex flex-auto flex-col px-2.5 pt-2.5 lg:px-5">
        {/* The BA detail screen doubles as the operator's details */}
        <OperatedBA
          partner={operator ?? "ZTEST-I"}
          operatorView
          userType={userType}
        />
      </main>
    </>
  );
}
