"use client";

import { useState } from "react";
import Button from "@/components/Button";
import OnboardingDrawer from "@/components/OnboardingDrawer";
import { SHARED_INVOICE } from "@/components/invoices";
import {
  AmountCell,
  BankAccountsTab,
  DateInput,
  FakeSelect,
  Field,
  FileTimeIcon,
  PayModal,
  STATUS_COLORS,
  Th,
  controlCls,
} from "@/components/OpSearch";

const TABS = ["Invoice / Check", "Property", "Statements", "1099", "Inquiry", "Bank Accounts"];

// doc type, operator, my BA sub, invoice/check #, invoice date, op acct month, received date, status, amount
const ROWS = [
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2026-03-13", "Jan 2026", "2026-03-13", "Viewed", SHARED_INVOICE.amount],
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2026-03-09", "Jan 2026", "2026-03-09", "Received", SHARED_INVOICE.amount],
  ["REVENUE", "!ZTEST-I", "1294", "60731", "2026-01-15", "Dec 2025", "2026-03-09", "Received", "541.41"],
  ["REVENUE", "!ZTEST-I", "1294", "60731", "2026-01-15", "Dec 2025", "2026-03-09", "Received", "541.41"],
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2026-03-09", "Dec 2025", "2026-03-09", "Received", SHARED_INVOICE.amount],
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2025-12-30", "Nov 2025", "2025-12-30", "Received", SHARED_INVOICE.amount],
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2025-05-09", "Jun 2025", "2025-05-09", "Received", SHARED_INVOICE.amount],
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2025-04-13", "May 2025", "2025-04-13", "Viewed", SHARED_INVOICE.amount],
  ["REVENUE", "!ZTEST-I", "1294", "60731", "2025-12-15", "Apr 2025", "2025-05-12", "Received", "541.41"],
  ["REVENUE", "!ZTEST-I", "1294", "60731", "2020-12-15", "Apr 2025", "2025-05-09", "Received", "541.41"],
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2025-02-14", "Apr 2025", "2025-02-14", "Received", SHARED_INVOICE.amount],
  ["REVENUE", "!ZTEST-I", "1294", "60731", "2020-12-15", "Mar 2025", "2025-04-13", "Received", "541.41"],
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2025-02-05", "Mar 2025", "2025-02-05", "Received", SHARED_INVOICE.amount],
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2024-12-20", "Feb 2025", "2024-12-20", "Received", SHARED_INVOICE.amount],
  ["JIB", "!ZTEST - ZTEST-I", "2436687", SHARED_INVOICE.number, "2024-12-20", "Jan 2025", "2024-12-20", "Received", SHARED_INVOICE.amount],
  ["REVENUE", "!ZTEST-I", "1294", "60731", "2020-12-15", "Dec 2024", "2025-01-17", "Viewed", "541.41"],
  ["REVENUE", "!ZTEST-I", "1294", "60735", "2020-12-15", "Nov 2024", "2024-12-16", "Received", "541.41"],
  ["REVENUE", "!ZTEST-I", "1294", "60731", "2020-12-15", "Nov 2024", "2025-01-17", "Received", "541.41"],
  ["REVENUE", "!ZTEST-I", "1294", "60731", "2020-12-15", "Oct 2024", "2024-11-08", "Received", "541.41"],
  ["REVENUE", "!ZTEST-I", "1294", "60731", "2020-12-15", "Sep 2024", "2024-10-11", "Received", "541.41"],
];

// capture's icon is an inline SVG (green doc + red hand badge) — doc outline from FileTimeIcon
function FileHandIcon() {
  return (
    <span className="relative inline-flex">
      <svg viewBox="0 0 42 50" role="img" className="h-4 w-3.5 fill-current">
        <path d="M4.48283 0C2.01085 0 0 2.06238 0 4.5977V41.3793C0 43.9146 2.01085 45.977 4.48283 45.977H14.749C13.2642 44.5514 12.6603 43.6253 11.7153 41.8966H3.97851V4.08046H20.677V15.5747H29.0823V17.2656C30.6869 17.544 31.5637 17.7957 33.0608 18.4806V13.7931L22.4141 0H4.48283Z" />
      </svg>
      <i className="fas fa-hand-paper absolute -right-1 -bottom-0.5 text-[11px] text-[#d9534f]" />
    </span>
  );
}

// capture's icon is an inline SVG (doc + blue "?" badge) — same doc outline as FileTimeIcon
function FileQuestionIcon() {
  return (
    <svg viewBox="0 0 42 50" role="img" className="h-4 w-3.5 fill-current">
      <path d="M4.48283 0C2.01085 0 0 2.06238 0 4.5977V41.3793C0 43.9146 2.01085 45.977 4.48283 45.977H14.749C13.2642 44.5514 12.6603 43.6253 11.7153 41.8966H3.97851V4.08046H20.677V15.5747H29.0823V17.2656C30.6869 17.544 31.5637 17.7957 33.0608 18.4806V13.7931L22.4141 0H4.48283Z" />
      <circle cx="26.4" cy="34" r="15.6" className="fill-[#2874d5]" />
      <text
        x="26.4"
        y="42"
        textAnchor="middle"
        fontSize="24"
        fontWeight="bold"
        fill="#fff"
      >
        ?
      </text>
    </svg>
  );
}

function PaginationBar() {
  return (
    <div className="flex items-center text-[12px]">
      <span className="mr-3.75">1 to 20 of 49</span>
      <Button variant="secondary" size="sm" disabled className="w-6">
        <i className="far fa-angle-double-left text-[17px]" />
      </Button>
      <Button variant="secondary" size="sm" disabled className="ml-1 w-6">
        <i className="far fa-angle-left text-[17px]" />
      </Button>
      <Button variant="secondary" size="sm" className="ml-1 w-6">
        <i className="far fa-angle-right text-[17px]" />
      </Button>
      <Button variant="secondary" size="sm" className="ml-1 w-6">
        <i className="far fa-angle-double-right text-[17px]" />
      </Button>
      <span className="ml-3.75">Page</span>
      <input
        readOnly
        value="1"
        className={`${controlCls} mx-1.25 h-6 min-h-6 w-12 justify-center px-2 text-center outline-none`}
      />
      <span>of 3</span>
    </div>
  );
}

function InvoiceCheckTab() {
  const [showActions, setShowActions] = useState(true);
  const [showSubtext, setShowSubtext] = useState(true);
  const [rows, setRows] = useState(ROWS);
  const [payRow, setPayRow] = useState<number | null>(null);
  const [onboardOpen, setOnboardOpen] = useState(false);

  // status lives at tuple index 7
  const markPaid = (i: number) =>
    setRows((prev) => prev.map((r, j) => (j === i ? r.map((v, k) => (k === 7 ? "Paid" : v)) : r)));

  // WIO can pay if either the WIO itself or the operator profile is onboarded.
  // Otherwise open the WIO onboarding drawer; a later $ click reads the updated flag.
  const handlePay = (i: number) => {
    const wioOnboarded = sessionStorage.getItem("wio-onboarding-complete") === "true";
    const operatorOnboarded =
      sessionStorage.getItem("operator-onboarding-complete") === "true";
    // Missing-bank cases surface inside PayModal itself (banner / notice)
    if (wioOnboarded || operatorOnboarded) setPayRow(i);
    else setOnboardOpen(true);
  };

  return (
    <div className="pt-4">
      <form className="mb-3.75" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-wrap items-start pl-5">
          <Field label="Document Type">
            <FakeSelect value="" className="min-w-37.5" />
          </Field>
          <Field label="Invoice/Check Filter">
            <FakeSelect value="Unprocessed" className="min-w-37.5" />
          </Field>
          <Field label="Invoice/Check #">
            <input
              type="text"
              className={`${controlCls} w-37.5 px-2 outline-none`}
            />
          </Field>
          <Field label="Operator">
            <input
              type="text"
              className={`${controlCls} w-37.5 px-2 outline-none`}
            />
          </Field>
          <Field label="From">
            <DateInput id="fromDate" defaultValue="Dec 2016" />
          </Field>
          <Field label="To">
            <DateInput id="toDate" defaultValue="Jul 2026" />
          </Field>
          <Field label="Search Type">
            <FakeSelect value="Acct Month" className="min-w-37.5" />
          </Field>
        </div>

        <div className="mt-4 mb-1.5 flex w-fit cursor-pointer items-center text-text-secondary">
          <i className="fas fa-chevron-right w-5" />
          ADDITIONAL SEARCH CRITERIA
        </div>

        <div className="flex justify-end gap-1.25 border-t border-border-secondary pt-2.5">
          <div className="mr-12 flex flex-wrap items-center gap-2.25">
            <Button variant="tertiary" size="md" href="#">
              <i className="fe fe-building-list mr-2 text-[16px]" />
              Operator Lists
            </Button>
            <div className="self-stretch border border-border-tertiary" />
            <Button variant="tertiary" size="md" href="#">
              <i className="fas fa-trash-alt mr-2 text-[15px]" />
              Cleanup Tool
            </Button>
            <div className="self-stretch border border-border-tertiary" />
            <Button variant="tertiary" size="md">
              <i className="fe fe-xls mr-2 text-[16px]" />
              Export to Excel
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2.25">
            <Button variant="default" size="md" disabled>
              <i className="fas fa-save mr-2 text-[14px]" />
              Save
            </Button>
            <Button variant="default" size="md">
              Reset
            </Button>
            <Button variant="primary" size="md">
              <i className="fe fe-search mr-2 text-[15px]" />
              Search
            </Button>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-center rounded-t-lg bg-[#eceff7] p-2.5">
        <label className="mr-3.75 inline-flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={showActions}
            onChange={(e) => setShowActions(e.target.checked)}
            className="size-4 accent-brand"
          />
          Show Actions
        </label>
        <label className="inline-flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={showSubtext}
            onChange={(e) => setShowSubtext(e.target.checked)}
            className="size-4 accent-brand"
          />
          Show Subtext
        </label>
        <Button variant="default" size="sm" className="ml-3.75 w-6.5">
          <i className="far fa-columns" />
        </Button>
        <div className="ml-12.5">
          <PaginationBar />
        </div>
      </div>

      <div className="overflow-x-auto border border-border-tertiary bg-bg-primary">
        <table className="w-full min-w-435.5 border-collapse text-[14px]">
          <thead>
            <tr>
              {showActions && (
                <th className="w-36 border-b border-border-tertiary p-1.25" />
              )}
              <Th label="ORG #" showSubtext={showSubtext} />
              <Th label="DOC TYPE" showSubtext={showSubtext} />
              <Th label="OPERATOR" showSubtext={showSubtext} />
              <Th label="MY BA" subs={["Op Owner #"]} showSubtext={showSubtext} />
              <Th
                label="INVOICE/CHECK"
                subs={["Invoice/Check Date"]}
                showSubtext={showSubtext}
              />
              <Th
                label="OP ACCT MONTH"
                subs={["Received Date"]}
                sorted
                showSubtext={showSubtext}
              />
              <Th label="STATUS" showSubtext={showSubtext} />
              <Th label="ORIGINAL" subs={["Amt", "CSH"]} right showSubtext={showSubtext} />
              <Th
                label="CLOSED DISPUTED"
                subs={["Amt", "CSH"]}
                right
                showSubtext={showSubtext}
              />
              <Th
                label="OPEN DISPUTED"
                subs={["Amt", "CSH"]}
                right
                showSubtext={showSubtext}
              />
              <Th label="ACCEPTED" subs={["Amt", "CSH"]} right showSubtext={showSubtext} />
              <Th
                label="PENDING CHANGE"
                subs={["Amt", "CSH"]}
                right
                showSubtext={showSubtext}
              />
              <Th label="VOUCHER REF" subs={["My Acct Month"]} showSubtext={showSubtext} />
              <th className="w-12 border-b border-l border-border-tertiary p-1.25 text-center align-top">
                <Button variant="tertiary" size="sm">
                  <i className="fas fa-arrow-to-bottom text-[16px]" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(
              (
                [docType, operator, myBaSub, invoice, invoiceDate, acctMonth, receivedDate, status, amount],
                i,
              ) => (
                <tr key={i} className="hover:bg-bg-secondary">
                  {showActions && (
                    <td className="border-b border-border-tertiary p-0.5 align-top">
                      <div className="flex items-center text-[16px]">
                        {/* ponytail: WIO reuses the operated-invoice view; partner details fall to the reference defaults */}
                        <Button
                          variant="tertiary"
                          size="sm"
                          href={`/Core/Fsp/OperatedInvoice?${new URLSearchParams({ invoice, acctMonth, status, amount }).toString()}`}
                        >
                          <i className="fe fe-file-search" />
                        </Button>
                        <Button variant="tertiary" size="sm" href="#">
                          <FileQuestionIcon />
                        </Button>
                        <Button variant="tertiary" size="sm">
                          <FileHandIcon />
                        </Button>
                        {/* ponytail: plain button, not <Button disabled> — the capture's icon is gray, not faded green */}
                        <button
                          type="button"
                          disabled
                          className="inline-flex min-h-6 items-center justify-center rounded-sm px-1.25 py-0.25 text-text-tertiary"
                        >
                          <FileTimeIcon />
                        </button>
                        <Button variant="tertiary" size="sm" href="#">
                          <i className="fe fe-envelope" />
                        </Button>
                        <Button variant="tertiary" size="sm">
                          <i className="fe fe-print" />
                        </Button>
                        <Button variant="tertiary" size="sm" onClick={() => handlePay(i)}>
                          <i className="fas fa-dollar-sign" />
                        </Button>
                      </div>
                    </td>
                  )}
                  <td className="border-b border-border-tertiary p-1.25 align-top" />
                  <td className="border-b border-border-tertiary p-1.25 align-top">
                    {docType}
                  </td>
                  <td className="border-b border-border-tertiary p-1.25 align-top">
                    <a href="#">{operator}</a>
                  </td>
                  <td className="border-b border-border-tertiary p-1.25 align-top">
                    <div>!No Xref</div>
                    {showSubtext && (
                      <div className="text-[12px] text-text-secondary">{myBaSub}</div>
                    )}
                  </td>
                  <td className="border-b border-border-tertiary p-1.25 align-top">
                    <div>{invoice}</div>
                    {showSubtext && (
                      <div className="text-[12px] text-text-secondary">{invoiceDate}</div>
                    )}
                  </td>
                  <td className="border-b border-border-tertiary p-1.25 align-top">
                    <div>{acctMonth}</div>
                    {showSubtext && (
                      <div className="text-[12px] text-text-secondary">{receivedDate}</div>
                    )}
                  </td>
                  <td className="border-b border-border-tertiary p-1.25 align-top">
                    <span className="whitespace-nowrap">
                      <span
                        className="inline-block size-2.75 translate-y-px rounded-[3px] border border-border-secondary"
                        style={{ backgroundColor: STATUS_COLORS[status] }}
                      />
                      <a href="#" className="ml-1">
                        {status}
                      </a>
                    </span>
                  </td>
                  <AmountCell value={amount} />
                  <AmountCell />
                  <AmountCell />
                  <AmountCell value={amount} />
                  <AmountCell />
                  <td className="border-b border-border-tertiary p-1.25 align-top">
                    <input
                      type="text"
                      className="h-6.5 w-full min-w-42.5 rounded-sm border border-border-secondary bg-bg-primary px-2 outline-none"
                    />
                  </td>
                  <td className="border-b border-border-tertiary p-0.5 text-center align-top">
                    {/* ponytail: one-click voucher download is only offered on REVENUE rows in the capture */}
                    {docType === "REVENUE" && (
                      <Button variant="tertiary" size="sm">
                        <i className="fas fa-arrow-to-bottom text-[16px]" />
                      </Button>
                    )}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-12.5 flex justify-center rounded-b-lg bg-[#eceff7] p-2.5">
        <PaginationBar />
      </div>

      {payRow !== null && (
        <PayModal
          // PayModal takes the operator-search tuple: operator slots in as partner, type FSP
          row={[rows[payRow][1], "FSP", ...rows[payRow].slice(2)]}
          onClose={() => setPayRow(null)}
          onPaid={() => markPaid(payRow)}
        />
      )}

      {/* WIO's own onboarding (global key), opened by $ when neither party is onboarded */}
      <OnboardingDrawer open={onboardOpen} onOpenChange={setOnboardOpen} hideTrigger />
    </div>
  );
}

export default function NonOpSearch({ initialTab = 0 }: { initialTab?: number }) {
  const [tab, setTab] = useState(initialTab);

  return (
    <div className="w-full">
      <h1 className="my-3.75 text-[24px] font-bold text-text-primary">
        Non-Op Search
      </h1>
      <nav className="flex items-end overflow-auto">
        {TABS.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`inline-flex h-9 uppercase min-w-max flex-auto cursor-pointer items-center justify-center rounded-t-md border-b-3 px-4 text-[14px] whitespace-nowrap max-w-50 ${
              tab === i
                ? "border-brand bg-brand-transparent font-black text-brand"
                : "border-transparent hover:bg-brand-transparent "
            }`}>
            {label}
          </button>
        ))}
      </nav>
      <div className="-mt-0.5 h-0.5 bg-border-primary" />
      {/* ponytail: only the Invoice/Check tab is in the reference capture — others render empty */}
      {tab === 0 ? (
        <InvoiceCheckTab />
      ) : TABS[tab] === "Bank Accounts" ? (
        <BankAccountsTab profile="wio" />
      ) : (
        <div className="min-h-15" />
      )}
    </div>
  );
}
