import type { Metadata } from "next";
import DebugBar from "@/components/DebugBar";
import MainMenu from "@/components/MainMenu";
import OperatedInvoice, { type InvoiceParams } from "@/components/OperatedInvoice";
import SiteHeader from "@/components/SiteHeader";
import { getUserType } from "@/components/userType";

export const metadata: Metadata = {
  title: "EnergyLink - Operated JIB Invoice",
};

export default async function OperatedInvoicePage({
  searchParams,
}: {
  searchParams: Promise<Partial<InvoiceParams>>;
}) {
  const params = await searchParams;
  const userType = await getUserType();

  return (
    <>
      <DebugBar />
      <SiteHeader userType={userType} />
      <MainMenu userType={userType} />
      <main className="flex flex-auto flex-col px-2.5 pt-2.5 lg:px-5">
        <OperatedInvoice {...params} userType={userType} />
      </main>
    </>
  );
}
