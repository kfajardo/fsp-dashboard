import Button from "@/components/Button";
import DashboardSection from "@/components/DashboardSection";
import OnboardingDrawer from "@/components/OnboardingDrawer";
import DebugBar from "@/components/DebugBar";
import EduCenter from "@/components/EduCenter";
import MainMenu from "@/components/MainMenu";
import NewsList from "@/components/NewsList";
import SiteHeader from "@/components/SiteHeader";
import StatTile from "@/components/StatTile";
import SupportContacts from "@/components/SupportContacts";
import { getUserType } from "@/components/userType";

const news = [
  {
    text: 'Enverus Blog "A weekly update on the latest insight of the energy industry".',
    action: "Read",
  },
  {
    text: "Get Ahead With the 2025 Mineral and Royalty Market Outlook Webinar!",
    action: "Watch",
  },
  {
    text: "Register for webinars on Enverus Upcoming Event calendar.",
    action: "Register",
  },
  {
    text: "Explore solutions for mineral investment and management",
    action: "Explore",
  },
];

export default async function Home() {
  const userType = await getUserType();

  // ZTEST-DD (WIO) dashboard — logged in as ZTEST-DD "via ZTESTAGENT".
  // Mirrors GET /api/Dashboard/GetFspItemsToAddress: NON-OPERATING STATS only.
  if (userType === "wio") {
    const nonOpSearch = (type: string, countType: "Group" | "Me") =>
      `/Core/Fsp/NonOpSearch?tab=invoices&itemToAddressType=${type}&countType=${countType}`;
    return (
      <>
        <DebugBar />
        <SiteHeader userType={userType} loginAs="ZTEST-DD" />
        <MainMenu userType={userType} ownerView />
        <main className="flex flex-auto flex-col px-2.5 pt-2.5 lg:px-5">
          <div className="mx-auto w-full max-w-300">
            <div className="flex items-center justify-between">
              <h1 className="mt-3.75 mb-6.25 text-[24px] font-bold text-text-primary">
                Dashboard
              </h1>
              <Button variant="tertiary" size="sm" href="#">
                <i className="fe fe-building-list mr-2 text-[18px]" />
                Operator Lists
              </Button>
            </div>

            <DashboardSection
              icon="fe-buildings"
              title="NON-OPERATING STATS"
              headerClassName="mb-2.5"
              contentClassName="mb-6"
            >
              {/* ponytail: fe-laptop-gear (real icon) absent from the subsetted
                  font — fe-file-search reads closest for invoices */}
              <StatTile
                title="Non-Op Invoices to Process"
                icon="fe-file-search"
                count={17}
                href={nonOpSearch("NonOpInvoicesToProcess", "Group")}
                meCount={17}
                meHref={nonOpSearch("NonOpInvoicesToProcess", "Me")}
              />
              <StatTile
                title="Non-Op Payments to Process"
                icon="fe-money-bill-gear"
                count={32}
                href={nonOpSearch("NonOpPaymentsToProcess", "Group")}
                meCount={32}
                meHref={nonOpSearch("NonOpPaymentsToProcess", "Me")}
              />
            </DashboardSection>

            <div className="mb-6 flex flex-wrap gap-x-10.5 gap-y-6">
              <div className="flex min-w-105 flex-1 flex-col">
                <DashboardSection
                  icon="fe-megaphone"
                  title={<>ENVERUS NEWS &amp; EVENTS</>}
                  contentClassName="h-full"
                >
                  <NewsList items={news} />
                </DashboardSection>
              </div>
              <div className="flex min-w-105 flex-1 flex-col gap-2.5">
                <div className="flex">
                  <OnboardingDrawer />
                </div>
                <EduCenter />
              </div>
            </div>

            <DashboardSection
              icon="fe-comment-question"
              title="ENERGYLINK CLIENT SUPPORT"
              contentClassName="mb-6"
            >
              <SupportContacts />
            </DashboardSection>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <DebugBar />
      <SiteHeader userType={userType} />
      <MainMenu userType={userType} />
      <main className="flex flex-auto flex-col px-2.5 pt-2.5 lg:px-5">
        <div className="mx-auto w-full max-w-300">
          <div className="flex items-center justify-between">
            <h1 className="mt-3.75 mb-6.25 text-[24px] font-bold text-text-primary">
              Dashboard
            </h1>
            <Button variant="tertiary" size="sm" href="#">
              <i className="fe fe-building-list mr-2 text-[18px]" />
              Operator Lists
            </Button>
          </div>

          <DashboardSection
            icon="fe-buildings"
            title="NON-OPERATING STATS"
            headerClassName="mb-2.5"
            contentClassName="mb-6"
          >
            <StatTile
              title="Non-Op Payments to Process"
              icon="fe-money-bill-gear"
              count={1}
              hiddenLinksTitle="The Non-Op Search role is required to view details."
            />
          </DashboardSection>

          <DashboardSection
            icon="fe-buildings"
            title="OPERATING STATS"
            headerClassName="mb-2.5"
            contentClassName="mb-6"
          >
            <StatTile
              title="Op Open Inquiries"
              icon="fe-head-question"
              count={2}
              href="#"
            />
          </DashboardSection>

          <div className="mb-6 flex flex-wrap gap-x-10.5 gap-y-6">
            <div className="flex min-w-105 flex-1 flex-col">
              <DashboardSection
                icon="fe-megaphone"
                title={<>ENVERUS NEWS &amp; EVENTS</>}
                contentClassName="h-full"
              >
                <NewsList items={news} />
              </DashboardSection>
            </div>
            <div className="flex min-w-105 flex-1 flex-col gap-2.5">
              <div className="flex justify-end">
                <OnboardingDrawer showReset storageKey="operator-onboarding-complete" />
              </div>
              <EduCenter />
            </div>
          </div>

          <DashboardSection
            icon="fe-comment-question"
            title="ENERGYLINK CLIENT SUPPORT"
            contentClassName="mb-6"
          >
            <SupportContacts />
          </DashboardSection>
        </div>
      </main>
    </>
  );
}
