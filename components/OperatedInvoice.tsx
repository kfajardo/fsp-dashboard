"use client";

import { useState, type ReactNode } from "react";
import Button from "@/components/Button";
import OnboardingDrawer from "@/components/OnboardingDrawer";
import { PayModal } from "@/components/OpSearch";
import type { UserType } from "@/components/userType";

// Status pill colors — same map as OpSearch. Kept local so this stays a plain
// (server) component and doesn't import across the OpSearch client boundary.
const STATUS_COLORS: Record<string, string> = {
  Received: "#ffff99",
  Viewed: "#ffd700",
  Paid: "#8bc34a",
};

const PARTNER_TYPES: Record<string, string> = {
  BSP: "Basic Service Partner",
  FSP: "Full Service Partner",
};

const TABS = ["View Invoice", "Invoice History"];

// How far along the invoice lifecycle each status is — history shows events up
// to the invoice's current status.
const STATUS_RANK: Record<string, number> = { Received: 1, Viewed: 2, Paid: 3 };

// event, date, description — full ladder, newest first.
// ponytail: mock dates from the Jan 2026 capture — real history comes from the API
const HISTORY: [string, string, string][] = [
  ["Paid", "2026-03-15 10:02", "Payment submitted from partner's bank account"],
  ["Viewed", "2026-03-14 16:40", "Invoice opened by partner"],
  ["Received", "2026-03-13 08:15", "Delivered to partner's EnergyLink inbox"],
  ["Created", "2026-03-09 14:31", "Invoice created and released by 33 - ZTEST - ZTEST-I"],
];

export type InvoiceParams = {
  invoice: string;
  acctMonth: string;
  partner: string;
  code: string;
  ptype: string;
  status: string;
  amount: string;
};

// Action links in the title strip — mirrors the reference ButtonBar.
// ponytail: demo links; only "Operated Search" points somewhere real.
const ACTIONS: { label: string; icon: string; href?: string; disabled?: boolean }[] = [
  { label: "AR Subledger", icon: "fas fa-book", disabled: true },
  { label: "Operated Search", icon: "fe fe-search", href: "/Core/Fsp/OpSearch?tab=invoices" },
  { label: "File Details", icon: "fas fa-file-alt", href: "#" },
  { label: "Messages", icon: "fe fe-envelope", href: "#" },
];

// Tab boxes at the right end of the title strip (reference: View Invoice / Manage Disputes)
const tabBoxCls =
  "inline-flex w-20 cursor-pointer items-center justify-center self-stretch rounded-t-md border border-[#b8cfe8] px-1.5 py-1 text-center leading-tight";

function InfoLine({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="whitespace-nowrap">
      <span className="font-bold">{label}</span> {children}
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 whitespace-nowrap">
      {label}
      {children}
    </label>
  );
}

const filterInputCls =
  "h-7.5 w-25 rounded-sm border border-border-secondary bg-bg-primary px-2 outline-none focus:border-brand";

export default function OperatedInvoice({
  invoice = "136004883",
  acctMonth = "Jan 2026",
  partner = "ZTEST-V",
  code = "820255",
  ptype = "BSP",
  status: initialStatus = "Received",
  amount = "30.88",
  userType = "operator",
}: Partial<InvoiceParams> & { userType?: UserType }) {
  const [tab, setTab] = useState(0);
  // Paying flips status to Paid, which also unlocks the Paid/Viewed history rows
  const [status, setStatus] = useState(initialStatus);
  const [payOpen, setPayOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);

  // Same gate as NonOpSearch: WIO can pay if either the WIO itself or this
  // invoice's operator (ZTEST-I) is onboarded — otherwise open the drawer,
  // and a later Pay click reads the updated flag. Missing-bank cases surface
  // inside PayModal itself (banner / notice).
  const handlePay = () => {
    const wioOnboarded = sessionStorage.getItem("wio-onboarding-complete") === "true";
    const operatorOnboarded = sessionStorage.getItem("wio-onboarded:ZTEST-I") === "true";
    if (wioOnboarded || operatorOnboarded) setPayOpen(true);
    else setOnboardOpen(true);
  };
  const history = HISTORY.filter(
    ([event]) => event === "Created" || (STATUS_RANK[event] ?? 9) <= (STATUS_RANK[status] ?? 1),
  );

  return (
    <div className="w-full pb-12 text-[14px] text-text-primary">
      {/* Title strip + action bar (full-bleed gray bar) */}
      <div className="-mx-2.5 -mt-2.5 flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-border-secondary bg-bg-secondary px-4 pt-1 lg:-mx-5">
        <span className="font-bold">
          Operated JIB Invoice {invoice} - {acctMonth}
        </span>
        <div className="flex flex-wrap items-stretch gap-1">
          <ul className="flex flex-wrap items-center gap-1">
            {ACTIONS.map((a) =>
              a.disabled ? (
                <li
                  key={a.label}
                  className="inline-flex cursor-help items-center gap-1.5 px-2 py-1 text-text-tertiary"
                >
                  <i className={a.icon} />
                  {a.label}
                </li>
              ) : (
                <li key={a.label}>
                  <a
                    href={a.href}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-link hover:text-link-hover hover:underline"
                  >
                    <i className={a.icon} />
                    {a.label}
                  </a>
                </li>
              ),
            )}
          </ul>
          {/* Tab boxes — View Invoice / Invoice History switch content, Manage Disputes is a link */}
          {TABS.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={`${tabBoxCls} ${
                tab === i
                  ? "-mb-px border-b-bg-primary bg-bg-primary font-bold text-link"
                  : "bg-[#eaf2fb] text-link hover:underline"
              }`}
            >
              {label}
            </button>
          ))}
          <a href="#" className={`${tabBoxCls} bg-[#eaf2fb] text-link hover:underline`}>
            Manage Disputes
          </a>
        </div>
      </div>

      {tab === 1 ? (
        <>
          {/* Invoice History — lifecycle events, newest first */}
          <div className="mt-4 flex items-center justify-center rounded-t-lg bg-bg-tertiary p-2">
            Events 1 - {history.length}
          </div>
          <div className="overflow-x-auto border border-border-tertiary bg-bg-primary">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr>
                  {["Date", "Event", "Description"].map((h) => (
                    <th
                      key={h}
                      className="border-b border-border-tertiary p-1.25 text-left font-bold text-brand"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="border-b border-border-tertiary p-1.25 text-right font-bold text-brand">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map(([event, date, description]) => (
                  <tr key={event} className="hover:bg-bg-secondary">
                    <td className="border-b border-border-tertiary p-1.25 align-top whitespace-nowrap">
                      {date}
                    </td>
                    <td className="border-b border-border-tertiary p-1.25 align-top whitespace-nowrap">
                      <span
                        className="mr-1 inline-block size-2.75 translate-y-px rounded-[3px] border border-border-secondary"
                        style={{ backgroundColor: STATUS_COLORS[event] ?? "#e7e7e7" }}
                      />
                      {event}
                    </td>
                    <td className="border-b border-border-tertiary p-1.25 align-top">
                      {description}
                    </td>
                    <td className="border-b border-border-tertiary p-1.25 text-right align-top">
                      {/* amount only on money events — create/receive/view move no cash */}
                      {(event === "Created" || event === "Paid") && `${amount} CAD`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
      {/* Summary: partner details / Reports / totals */}
      <div className="mt-4 flex flex-wrap justify-between gap-6 px-1">
        <div className="space-y-1 leading-4">
          <InfoLine label="Operator">33 - ZTEST - ZTEST-I</InfoLine>
          <InfoLine label="Partner">
            {code} - {partner}
            <i className="fas fa-sticky-note ml-1.25 text-[#e7b542]" />
          </InfoLine>
          <InfoLine label="Partner Type">{PARTNER_TYPES[ptype] ?? ptype}</InfoLine>
          <InfoLine label="Internal Contact">
            <a href="#" className="text-link hover:underline">
              TEST TEST
            </a>
            <i className="fas fa-sticky-note ml-1.25 text-[#e7b542]" />
          </InfoLine>
          <InfoLine label="Current Status">
            <span
              className="mr-1 inline-block size-2.75 translate-y-px rounded-[3px] border border-border-secondary"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            />
            <a href="#" className="cursor-help text-link hover:underline">
              {status}
            </a>
          </InfoLine>
          <div className="pt-2">
            <a href="#" className="text-link hover:underline">
              View Address Info
            </a>
            <br />
            {/* ponytail: disabled in the capture — no attachments on this invoice */}
            <span className="cursor-help text-text-tertiary">View Attachments</span>
          </div>
        </div>

        <div className="text-center">
          <a href="#" className="text-link hover:underline">
            Reports
          </a>
        </div>

        <div className="ml-auto">
          <table className="ml-auto border-collapse text-right">
            <tbody>
              <tr>
                <td className="pr-6 font-bold">(CAD)</td>
                <td className="whitespace-nowrap">Original</td>
              </tr>
              <tr>
                <td className="pr-6 whitespace-nowrap">Operations</td>
                <td>{amount}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 text-right">
            Holdback:{" "}
            <a href="#" className="text-link hover:underline">
              NA
            </a>
          </div>
          {userType === "wio" && status !== "Paid" && (
            <div className="mt-3 text-right">
              <Button variant="primary" size="md" onClick={handlePay}>
                <i className="fas fa-dollar-sign mr-2 text-[13px]" />
                Pay {amount} CAD
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filter row */}
      <form
        className="mt-6 flex flex-wrap items-center justify-center gap-3 border-y border-border-tertiary py-3"
        // ponytail: filters are non-functional in the demo
      >
        <FilterField label="CC">
          <input type="text" className={filterInputCls} />
        </FilterField>
        <FilterField label="AFE">
          <input type="text" className={filterInputCls} />
        </FilterField>
        <FilterField label="Acct">
          <input type="text" className={filterInputCls} />
        </FilterField>
        <FilterField label="Other">
          <select
            defaultValue=""
            className="h-7.5 rounded-sm border border-border-secondary bg-bg-primary px-2 outline-none focus:border-brand"
          >
            <option value="">Flags</option>
            <option value="OutboundDisputes">Recent Disputes (1yr)</option>
            <option value="Reversals">Reversals</option>
          </select>
        </FilterField>
        <div className="flex gap-1.25">
          <button
            type="reset"
            className="h-8 w-18.75 rounded-sm border border-border-secondary bg-bg-primary hover:bg-bg-secondary"
          >
            Reset
          </button>
          <button
            type="submit"
            className="h-8 w-18.75 rounded-sm bg-brand text-white hover:bg-[color-mix(in_srgb,#4d8f1e,black_6%)]"
          >
            Search
          </button>
        </div>
      </form>

      {/* Properties grid */}
      <div className="mt-4 flex items-center rounded-t-lg bg-bg-tertiary p-2">
        <label className="ml-5 inline-flex cursor-pointer items-center gap-1.5">
          <input type="checkbox" defaultChecked disabled className="size-4 accent-brand" />
          Show Subtext
        </label>
        <span className="mx-auto">Properties 1 - 1</span>
      </div>
      <div className="overflow-x-auto border border-border-tertiary bg-bg-primary">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {["Cost Center", "AFE", "Description"].map((h) => (
                <th
                  key={h}
                  className="border-b border-border-tertiary p-1.25 text-left font-bold text-brand"
                >
                  <a href="#" className="hover:underline">
                    {h}
                  </a>
                </th>
              ))}
              <th className="border-b border-border-tertiary p-1.25 text-right font-bold text-brand">
                <a href="#" className="hover:underline">
                  Original
                </a>
              </th>
              {["Dispute", "Reason", "Flags"].map((h) => (
                <th
                  key={h}
                  className="border-b border-border-tertiary p-1.25 text-left font-bold text-brand"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* ponytail: single mock line item from the capture — real breakdown comes from the API */}
            <tr className="hover:bg-bg-secondary">
              <td className="border-b border-border-tertiary p-1.25 align-top">
                <a href="#" className="text-link hover:underline">
                  L-10024A
                </a>
              </td>
              <td className="border-b border-border-tertiary p-1.25 align-top" />
              <td className="border-b border-border-tertiary p-1.25 align-top">
                QUARRY CHIGWELL2 14-18-41-24
              </td>
              <td className="border-b border-border-tertiary p-1.25 text-right align-top">
                <a href="#" className="text-link hover:underline">
                  {amount}
                </a>
              </td>
              <td className="border-b border-border-tertiary p-1.25 align-top" />
              <td className="border-b border-border-tertiary p-1.25 align-top" />
              <td className="border-b border-border-tertiary p-1.25 align-top" />
            </tr>
          </tbody>
        </table>
      </div>
        </>
      )}

      {payOpen && (
        <PayModal
          // PayModal's operator-search tuple: partner, ptype, myBa, invoice, _, acctMonth, _, status, amount
          row={[partner, ptype, code, invoice, "", acctMonth, "", status, amount]}
          onClose={() => setPayOpen(false)}
          onPaid={() => setStatus("Paid")}
        />
      )}

      {/* WIO's own onboarding (global key), opened by Pay when neither party is onboarded */}
      <OnboardingDrawer open={onboardOpen} onOpenChange={setOnboardOpen} hideTrigger />
    </div>
  );
}
