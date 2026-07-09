"use client";

import { useEffect, useState, type ReactNode } from "react";
import Button from "@/components/Button";
// benign cycle: OperatedBA imports back from this module, but both sides only
// reference each other at render time, never during module init
import { OperatorOnboardDrawer } from "@/components/OperatedBA";
import Spinner from "@/components/Spinner";
import { SHARED_INVOICE } from "@/components/invoices";

const TABS = ["Invoice / Check", "Property", "Statements", "1099"];

export const STATUS_COLORS: Record<string, string> = {
  Received: "#ffff99",
  Viewed: "#ffd700",
  Paid: "#8bc34a",
};

// partner, partner type, my BA, invoice/check #, invoice date, acct month, sent date, status, amount
const ROWS = [
  ["ZTEST-V", "BSP", "820255", "136004883", "2026-03-13", "Jan 2026", "2026-03-13", "Received", "30.88"],
  ["ZTEST-V", "BSP", "820255", "136004883", "2026-03-09", "Jan 2026", "2026-03-09", "Received", "30.88"],
  ["ZTEST-I", "BSP", "100477", "136004863", "2026-03-13", "Jan 2026", "2026-03-13", "Received", "444.00"],
  ["ZTEST-I", "BSP", "100477", "136004863", "2026-03-09", "Jan 2026", "2026-03-09", "Received", "444.00"],
  ["ZTEST-DD", "FSP", "2436687", SHARED_INVOICE.number, "2026-03-13", "Jan 2026", "2026-03-13", "Viewed", SHARED_INVOICE.amount],
  ["ZTEST-DD", "FSP", "2436687", SHARED_INVOICE.number, "2026-03-09", "Jan 2026", "2026-03-09", "Received", SHARED_INVOICE.amount],
  ["ZTEST-5", "BSP", "155555", "136004823", "2026-03-13", "Jan 2026", "2026-03-13", "Received", "4.44"],
  ["ZTEST-5", "BSP", "155555", "136004823", "2026-03-09", "Jan 2026", "2026-03-09", "Received", "4.44"],
  ["ZTEST-P", "BSP", "100409", "136004813", "2026-03-13", "Jan 2026", "2026-03-13", "Received", "4.44"],
  ["ZTEST-P", "BSP", "100409", "136004813", "2026-03-09", "Jan 2026", "2026-03-09", "Received", "4.44"],
  ["ZTEST-V", "BSP", "820255", "136004883", "2026-03-09", "Dec 2025", "2026-03-09", "Received", "30.88"],
  ["ZTEST-I", "BSP", "100477", "136004863", "2026-03-09", "Dec 2025", "2026-03-09", "Received", "444.00"],
  ["ZTEST-DD", "FSP", "2436687", SHARED_INVOICE.number, "2026-03-09", "Dec 2025", "2026-03-09", "Received", SHARED_INVOICE.amount],
  ["ZTEST-5", "BSP", "155555", "136004823", "2026-03-09", "Dec 2025", "2026-03-09", "Received", "4.44"],
  ["ZTEST-P", "FSP", "100409", "136004813", "2026-03-09", "Dec 2025", "2026-03-09", "Received", "4.44"],
  ["ZTEST-V", "BSP", "820255", "136004883", "2025-12-30", "Nov 2025", "2025-12-30", "Received", "30.88"],
  ["ZTEST-I", "BSP", "100477", "136004863", "2025-12-30", "Nov 2025", "2025-12-30", "Received", "444.00"],
  ["ZTEST-DD", "FSP", "2436687", SHARED_INVOICE.number, "2025-12-30", "Nov 2025", "2025-12-30", "Received", SHARED_INVOICE.amount],
  ["ZTEST-5", "BSP", "155555", "136004823", "2025-12-30", "Nov 2025", "2025-12-30", "Received", "4.44"],
  ["ZTEST-Z", "FSP", "100409", "136004813", "2025-12-30", "Nov 2025", "2025-12-30", "Received", "4.44"],
];

export const controlCls =
  "flex min-h-7.5 items-center rounded-sm border border-border-secondary bg-bg-primary text-[14px]";

export function Field({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="mr-2.25 mb-2.5">
      <div className="my-1.25 min-h-5.25 whitespace-nowrap">{label}</div>
      {children}
    </div>
  );
}

export function FakeSelect({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return (
    <div className={`${controlCls} cursor-pointer pl-2 ${className}`}>
      <span className="flex-1 whitespace-nowrap">{value}</span>
      <i className="fas fa-caret-down w-6.5 text-center" />
    </div>
  );
}

export function DateInput({ id, defaultValue }: { id: string; defaultValue: string }) {
  return (
    <div className={`${controlCls} w-37.5`}>
      <input
        id={id}
        type="text"
        autoComplete="off"
        defaultValue={defaultValue}
        className="w-full min-w-0 px-2 outline-none"
      />
      <i className="far fa-calendar px-2 text-text-secondary" />
    </div>
  );
}

function Radio({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="mr-4 inline-flex cursor-pointer items-center gap-1.5">
      <input
        type="radio"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-brand"
      />
      {label}
    </label>
  );
}

export function FileTimeIcon() {
  return (
    <svg viewBox="0 0 42 50" role="img" className="h-4 w-3.5 fill-current">
      <path d="M4.48283 0C2.01085 0 0 2.06238 0 4.5977V41.3793C0 43.9146 2.01085 45.977 4.48283 45.977H14.749C13.2642 44.5514 12.6603 43.6253 11.7153 41.8966H3.97851V4.08046H20.677V15.5747H29.0823V17.2656C30.6869 17.544 31.5637 17.7957 33.0608 18.4806V13.7931L22.4141 0H4.48283Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7995 34C10.7995 25.1786 17.7987 18 26.3998 18C35.0008 18 42 25.1786 42 34C42 42.8214 35.0008 50 26.3998 50C17.7987 50 10.7995 42.8214 10.7995 34ZM24.1712 27.1429C24.1712 25.881 25.1694 24.8571 26.3998 24.8571C27.6301 24.8571 28.6284 25.881 28.6284 27.1429V33.0536L31.3039 35.7917C32.1744 36.6905 32.1744 38.131 31.3039 39.0298C30.8686 39.4702 30.294 39.6964 29.7253 39.6964C29.1565 39.6964 28.5819 39.4702 28.1467 39.0298L24.1712 34.9464V27.1429Z"
      />
    </svg>
  );
}

export function Th({
  label,
  subs = [],
  right = false,
  sorted = false,
  showSubtext,
}: {
  label: string;
  subs?: string[];
  right?: boolean;
  sorted?: boolean;
  showSubtext: boolean;
}) {
  return (
    <th
      className={`border-b border-l border-border-tertiary p-1.25 align-top font-bold text-text-primary first:border-l-0 ${
        right ? "text-right" : "text-left"
      }`}
    >
      <div
        className={`flex items-center gap-1.25 whitespace-nowrap ${
          right ? "justify-end" : ""
        }`}
      >
        <span className="cursor-pointer text-brand hover:underline text-xs">{label}</span>
        <i
          className={`fas cursor-pointer ${
            sorted ? "fa-caret-down text-xs text-brand" : "fa-sort text-text-tertiary"
          }`}
        />
      </div>
      {showSubtext && subs.length > 0 && (
        <div
          className={`mt-0.5 flex items-center whitespace-nowrap text-[12px] font-normal text-text-secondary ${
            right ? "justify-end" : ""
          }`}
        >
          {subs.map((sub, i) => (
            <div
              key={sub}
              className={`flex items-center gap-1.25 ${
                i > 0 ? "ml-1.25 border-l border-border-tertiary pl-1.25" : ""
              }`}
            >
              <span className="cursor-pointer text-brand hover:underline">{sub}</span>
              <i className="fas fa-sort cursor-pointer text-text-tertiary" />
            </div>
          ))}
        </div>
      )}
    </th>
  );
}

export function AmountCell({ value }: { value?: string }) {
  return (
    <td className="border-b border-border-tertiary p-1.25 text-right align-top">
      {value && <a href="#">{value}</a>}
    </td>
  );
}

const PARTNER_TYPES: Record<string, string> = {
  BSP: "Basic Service Partner",
  FSP: "Full Service Partner",
};

// Mock property lines for the pay modal — enough rows to exercise the
// scrollable table; first entry is the reference capture's well.
const PROPERTY_WELLS = [
  ["L-10024A", "QUARRY CHIGWELL2 14-18-41-24"],
  ["L-10025A", "QUARRY CHIGWELL2 15-18-41-24"],
  ["L-10026B", "QUARRY CHIGWELL2 16-18-41-24"],
  ["L-10027A", "BANNOCK CREEK 03-22-41-24"],
  ["L-10028C", "BANNOCK CREEK 04-22-41-24"],
  ["L-10029A", "HALFWAY COULEE 07-30-42-25"],
  ["L-10030B", "HALFWAY COULEE 08-30-42-25"],
  ["L-10031A", "STETTLER EAST 01-14-38-19"],
  ["L-10032A", "STETTLER EAST 02-14-38-19"],
  ["L-10033D", "FERRYBANK 11-05-44-27"],
  ["L-10034A", "FERRYBANK 12-05-44-27"],
  ["L-10035B", "WILLESDEN GREEN 06-09-42-07"],
] as const;

// Each party's payment readiness (sessionStorage-backed; empty on a fresh
// state / after global reset). Read via state, not in render — the React
// Compiler memoizes render-scope reads, so they'd go stale after the
// in-modal onboarding CTA writes new data.
const readParties = () => ({
  wio: loadBanks("wio"),
  op: loadBanks("operator"),
  opOnboarded:
    sessionStorage.getItem("operator-onboarding-complete") === "true" ||
    sessionStorage.getItem("operator-onboarded-by") != null,
});

export function PayModal({
  row,
  onClose,
  onPaid,
}: {
  row: string[];
  onClose: () => void;
  onPaid: () => void;
}) {
  const [partner, ptype, myBa, invoice, , acctMonth, , status, amount] = row;
  const [phase, setPhase] = useState<"review" | "paying" | "done">("review");
  // lazy init is safe — the modal only ever mounts client-side, on click
  const [parties, setParties] = useState(readParties);
  // second in-modal page: the WIO's own bank CRUD, so fixing a missing bank
  // doesn't lose the payment context; Back re-reads the qualifications
  const [screen, setScreen] = useState<"pay" | "banks">("pay");

  const wioDefault = parties.wio.rows[parties.wio.defaultIndex];
  const wioHasBank = wioDefault != null;
  const operatorHasBank = parties.op.rows[parties.op.defaultIndex] != null;
  const opOnboarded = parties.opOnboarded;

  const invoiceAmount = Number(amount.replace(/,/g, ""));
  // fee = min($500, max($5, invoice × 1%)); total payment = invoice + fee
  const fee = Math.min(500, Math.max(5, invoiceAmount * 0.01));
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const total = fmt(invoiceAmount + fee);

  // ponytail: mock per-property split — equal cent shares with the remainder
  // on the last row, so the lines always sum exactly to the invoice
  const totalCents = Math.round(invoiceAmount * 100);
  const perCents = Math.floor(totalCents / PROPERTY_WELLS.length);
  const rowCents = (i: number) =>
    i === PROPERTY_WELLS.length - 1
      ? totalCents - perCents * (PROPERTY_WELLS.length - 1)
      : perCents;

  const pay = () => {
    setPhase("paying");
    // ponytail: mock 2s payment — swap the timeout for the real payments API
    setTimeout(() => {
      setPhase("done");
      onPaid();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-175 flex-col overflow-hidden rounded-sm bg-bg-primary text-[14px] text-text-primary shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-secondary px-3.75 py-2.5">
          <span className="font-bold">
            {screen === "banks"
              ? "My Bank Accounts"
              : `Operated JIB Invoice ${invoice} - ${acctMonth}`}
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer text-[16px] text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {screen === "pay" ? (
          <>
        <div className="overflow-y-auto p-3.75">
          <div className="flex justify-between gap-4">
            <div className="space-y-1">
              <div>
                <span className="font-bold">Operator</span> 33 - ZTEST
              </div>
              <div>
                <span className="font-bold">Partner</span> {myBa} - {partner}
                <i className="fas fa-sticky-note ml-1.25 text-[#e7b542]" />
              </div>
              <div>
                <span className="font-bold">Partner Type</span> {PARTNER_TYPES[ptype]}
              </div>
              <div>
                <span className="font-bold">Current Status</span>{" "}
                <span
                  className="inline-block size-2.75 translate-y-px rounded-[3px] border border-border-secondary"
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                />{" "}
                {status}
              </div>
            </div>
            <div className="whitespace-nowrap">
              <div className="min-w-72 rounded-sm border border-border-tertiary">
                <div className="border-b border-border-tertiary bg-bg-tertiary px-3 py-1.5 font-bold">
                  Payment Breakdown (CAD)
                </div>
                <div className="flex justify-between gap-8 px-3 pt-2">
                  <span>Operations</span>
                  <span>{fmt(invoiceAmount)}</span>
                </div>
                <div className="flex justify-between gap-8 px-3 pt-1 pb-2">
                  <span>
                    Processing Fee (1%)
                    <span className="ml-1 text-[12px] text-text-secondary">
                      min $5 · max $500
                    </span>
                  </span>
                  <span>{fmt(fee)}</span>
                </div>
                <div className="flex justify-between gap-8 border-t border-border-tertiary px-3 py-2 font-bold">
                  <span>Total Payment</span>
                  <span>{total}</span>
                </div>
              </div>
              <div className="mt-3 text-right">
                Holdback: <a href="#">NA</a>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-t-lg bg-bg-tertiary p-2 text-center">
            Properties 1 - {PROPERTY_WELLS.length}
          </div>
          {/* Rows scroll past ~6 entries; the sticky header stays put.
              border-separate (not collapse) so the th borders stick too. */}
          <div className="max-h-55 overflow-y-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {["Cost Center", "AFE", "Description"].map((h) => (
                  <th
                    key={h}
                    className="sticky top-0 z-10 border-b border-border-tertiary bg-bg-primary p-1.25 text-left font-normal"
                  >
                    <a href="#">{h}</a>
                  </th>
                ))}
                <th className="sticky top-0 z-10 border-b border-border-tertiary bg-bg-primary p-1.25 text-right font-normal">
                  Original
                </th>
              </tr>
            </thead>
            <tbody>
              {PROPERTY_WELLS.map(([costCenter, description], i) => (
                <tr key={costCenter}>
                  <td className="border-b border-border-tertiary p-1.25">
                    <a href="#">{costCenter}</a>
                  </td>
                  <td className="border-b border-border-tertiary p-1.25" />
                  <td className="border-b border-border-tertiary p-1.25">
                    {description}
                  </td>
                  <td className="border-b border-border-tertiary p-1.25 text-right">
                    <a href="#">{fmt(rowCents(i) / 100)}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="border-t border-border-secondary p-3.75">
          {phase !== "done" && (!wioHasBank || !operatorHasBank) && (
            <div className="mb-2.5 space-y-1 rounded-sm bg-[#f2dede] px-3 py-2 text-[#a94442]">
              {!wioHasBank && (
                <div>
                  <i className="fas fa-exclamation-circle mr-1.5" />
                  You need your own default bank account to pay this invoice.{" "}
                  <button
                    type="button"
                    onClick={() => setScreen("banks")}
                    className="cursor-pointer font-bold text-[#a94442] underline"
                  >
                    Add a bank account
                  </button>
                </div>
              )}
              {!operatorHasBank && (
                <div>
                  <i className="fas fa-exclamation-circle mr-1.5" />
                  This operator does not have a default bank account to receive your
                  payment.{" "}
                  {opOnboarded ? (
                    // onboarded, just bankless — send the WIO to the operator's bank CRUD
                    <a
                      href="/Core/Fsp/Operator#banks"
                      className="font-bold text-[#a94442] underline"
                    >
                      Add their bank account
                    </a>
                  ) : (
                    // not onboarded — partial onboarding right here (T&C + manual
                    // bank, auto-default); onDone re-reads the banks above
                    <OperatorOnboardDrawer
                      // ponytail: the demo's only operator, hardcoded like elsewhere
                      operatorName="ZTEST - ZTEST-I"
                      onDone={() => setParties(readParties())}
                      renderTrigger={(open) => (
                        <button
                          type="button"
                          onClick={open}
                          className="cursor-pointer font-bold text-[#a94442] underline"
                        >
                          Onboard this operator
                        </button>
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-2.25">
            {phase === "done" ? (
              <>
                <span className="mr-auto">
                  <i className="fas fa-check-circle mr-1 text-brand" />
                  Payment of {total} CAD submitted
                </span>
                <Button variant="default" size="md" onClick={onClose}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <div className="mr-auto flex items-center gap-2">
                  {wioHasBank && (
                    <>
                      <span className="whitespace-nowrap">Pay from</span>
                      <FakeSelect
                        value={`${wioDefault[0]} ${wioDefault[2]}`}
                        className="min-w-60"
                      />
                    </>
                  )}
                </div>
                <Button
                  variant="default"
                  size="md"
                  onClick={onClose}
                  disabled={phase === "paying"}
                >
                  Cancel
                </Button>
                {operatorHasBank && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={pay}
                    disabled={phase === "paying" || !wioHasBank}
                  >
                    {phase === "paying" ? (
                      <Spinner className="mr-2 text-[14px]" />
                    ) : (
                      <i className="fas fa-dollar-sign mr-2 text-[13px]" />
                    )}
                    Pay {total} CAD
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
          </>
        ) : (
          <>
            <div className="overflow-y-auto px-3.75">
              {/* The WIO's own accounts — Plaid allowed, it's their own list */}
              <BankAccountsTab profile="wio" />
            </div>
            <div className="border-t border-border-secondary p-3.75">
              <Button
                variant="default"
                size="md"
                onClick={() => {
                  setParties(readParties());
                  setScreen("pay");
                }}
              >
                <i className="far fa-angle-left mr-2 text-[15px]" />
                Back
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InvoiceCheckTab() {
  const [showActions, setShowActions] = useState(true);
  const [showSubtext, setShowSubtext] = useState(true);

  return (
    <div className="pt-4">
      <form className="mb-3.75" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-wrap items-start pl-5">
          <Field label="Release State">
            <div className="flex min-h-7.5 items-center">
              <Radio name="released" label="Released" defaultChecked />
              <Radio name="released" label="Unreleased" />
            </div>
          </Field>
          <Field label="Document Type">
            <FakeSelect value="JIB" className="min-w-37.5" />
          </Field>
          <Field label="Invoice/Check Filter">
            <FakeSelect value="All" className="min-w-37.5" />
          </Field>
          <Field label="Invoice/Check #">
            <div className="flex">
              <FakeSelect value="Contains" className="w-30 rounded-r-none" />
              <input
                type="text"
                className={`${controlCls} w-37.5 rounded-l-none border-l-0 px-2 outline-none`}
              />
            </div>
          </Field>
          <Field label="From">
            <DateInput id="fromDate" defaultValue="Jul 2025" />
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
            <Button variant="tertiary" size="md" disabled>
              <i className="fe fe-xls mr-2 text-[16px]" />
              Export to Excel
            </Button>
            <div className="self-stretch border border-border-tertiary" />
            <Button variant="tertiary" size="md" href="#">
              {/* ponytail: reference uses fe-upload but its codepoint isn't in the capture — FA upload glyph instead */}
              <i className="fas fa-upload mr-2 text-[15px]" />
              Upload Void Checks
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2.25">
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

      <div className="flex items-center justify-center rounded-t-lg bg-bg-tertiary p-2.5">
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
        <div className="ml-12.5 flex items-center text-[12px]">
          <span className="mr-3.75">1 to 20 of 20</span>
          <Button variant="secondary" size="sm" disabled className="w-6">
            <i className="far fa-angle-double-left text-[17px]" />
          </Button>
          <Button variant="secondary" size="sm" disabled className="ml-1 w-6">
            <i className="far fa-angle-left text-[17px]" />
          </Button>
          <Button variant="secondary" size="sm" disabled className="ml-1 w-6">
            <i className="far fa-angle-right text-[17px]" />
          </Button>
          <Button variant="secondary" size="sm" disabled className="ml-1 w-6">
            <i className="far fa-angle-double-right text-[17px]" />
          </Button>
          <span className="ml-3.75">
            Page <span className="px-1.25">1</span> of 1
          </span>
        </div>
      </div>

      <div className="mb-12.5 overflow-x-auto border border-border-tertiary bg-bg-primary">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {showActions && (
                <th className="w-30 border-b border-border-tertiary p-1.25" />
              )}
              <Th label="ORG #" showSubtext={showSubtext} />
              <Th label="DOC TYPE" showSubtext={showSubtext} />
              <Th label="PARTNER/OWNER" subs={["Type"]} showSubtext={showSubtext} />
              <Th label="MY BA" showSubtext={showSubtext} />
              <Th
                label="INVOICE/CHECK"
                subs={["Invoice/Check Date"]}
                showSubtext={showSubtext}
              />
              <Th
                label="ACCT MONTH"
                subs={["Sent Date"]}
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
            </tr>
          </thead>
          <tbody>
            {ROWS.map(
              (
                [partner, ptype, myBa, invoice, invoiceDate, acctMonth, sentDate, status, amount],
                i,
              ) => (
                <tr key={i} className="hover:bg-bg-secondary">
                  {showActions && (
                    <td className="border-b border-border-tertiary p-0.5 align-top">
                      <div className="flex items-center text-[16px]">
                        <Button
                          variant="tertiary"
                          size="sm"
                          href={`/Core/Fsp/OperatedInvoice?${new URLSearchParams({ invoice, acctMonth, partner, code: myBa, ptype, status, amount }).toString()}`}
                        >
                          <i className="fe fe-file-search" />
                        </Button>
                        <Button variant="tertiary" size="sm" disabled>
                          <FileTimeIcon />
                        </Button>
                        <Button variant="tertiary" size="sm" href="#">
                          <i className="fe fe-envelope" />
                        </Button>
                        <Button variant="tertiary" size="sm">
                          <i className="fe fe-print" />
                        </Button>
                      </div>
                    </td>
                  )}
                  <td className="border-b border-border-tertiary p-1.25 align-top">33</td>
                  <td className="border-b border-border-tertiary p-1.25 align-top">JIB</td>
                  <td className="border-b border-border-tertiary p-1.25 align-top">
                    <div>
                      <a href={`/Core/Fsp/OperatedBA?partner=${encodeURIComponent(partner)}`}>
                        {partner}
                      </a>
                      <i className="fas fa-sticky-note ml-1.25 text-[#e7b542]" />
                    </div>
                    {showSubtext && (
                      <div className="text-[12px] text-text-secondary">{ptype}</div>
                    )}
                  </td>
                  <td className="border-b border-border-tertiary p-1.25 align-top">
                    {myBa}
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
                      <div className="text-[12px] text-text-secondary">{sentDate}</div>
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
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// Each profile's linked accounts live in sessionStorage — fresh state has
// none, every screen (banking tabs, PayModal) reads the same list, and the
// global reset wipes it. Row shape: [bank, type, account, status].
export type BankState = { rows: string[][]; defaultIndex: number };

export function loadBanks(profile: "operator" | "wio"): BankState {
  try {
    return (
      JSON.parse(sessionStorage.getItem(`banks:${profile}`)!) ?? {
        rows: [],
        defaultIndex: 0,
      }
    );
  } catch {
    return { rows: [], defaultIndex: 0 };
  }
}

// ---------------------------------------------------------------------------
// Mock Plaid Link modal — deliberately styled like Plaid (white card, rounded,
// its own grays), not the EnergyLink design tokens
// ---------------------------------------------------------------------------

const PLAID_INSTITUTIONS = [
  { name: "Gingham Bank", icon: "fas fa-dot-circle", color: "#2563eb" },
  { name: "HT Bank", icon: "fas fa-h-square", color: "#9f1239" },
  { name: "Brocade", icon: "fas fa-th-large", color: "#16a34a" },
  { name: "IKAT", icon: "fas fa-fast-forward", color: "#7c3aed" },
  { name: "T&C Bank", icon: "fas fa-stop-circle", color: "#dc2626" },
  { name: "Jacquard Credit Union", icon: "fas fa-asterisk", color: "#0ea5e9" },
  { name: "CB+", icon: "fas fa-plus-square", color: "#ca8a04" },
  { name: "LenoBank", icon: "fas fa-leaf", color: "#15803d" },
];

function PlaidModal({
  onClose,
  onLinked,
}: {
  onClose: () => void;
  onLinked: (institution: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [institution, setInstitution] = useState(PLAID_INSTITUTIONS[0].name);
  const [phone, setPhone] = useState("");

  // Plaid-style mask: digits grouped 3-3-4 with spaces (415 555 0010)
  const formatUsPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 10);
    return [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(" ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-95 flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl">
        {step === 1 ? (
          <>
          <div className="relative overflow-y-auto p-6">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 cursor-pointer text-[18px] text-gray-700 hover:text-black"
            >
              ✕
            </button>
            <div className="mt-8 flex justify-center">
              <div className="z-1 flex size-14 items-center justify-center rounded-2xl bg-emerald-400 text-[16px] font-black text-white ring-2 ring-white">
                EL
              </div>
              <div className="-ml-2 flex size-14 items-center justify-center rounded-2xl bg-blue-500 text-white ring-2 ring-white">
                <i className="fas fa-th text-[20px]" />
              </div>
            </div>
            <h3 className="mt-5 text-center text-[20px] leading-snug font-semibold">
              EnergyLink uses Plaid to connect your accounts
            </h3>
            <div className="mt-5 flex items-center rounded-xl border border-gray-300 px-3 py-3 text-[15px]">
              <span className="mr-2">🇺🇸</span>
              <span className="mr-2 text-gray-700">+1</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatUsPhone(e.target.value))}
                placeholder="Phone number"
                maxLength={12}
                className="w-full bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="mt-3 flex items-start gap-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <i className="fas fa-bolt text-[12px] text-blue-500" />
              </span>
              <p className="text-[13px] text-gray-600">
                Use your phone number to log in or sign up with Plaid to go faster next time.{" "}
                <a href="#" className="underline">Learn more</a>
              </p>
            </div>
            <p className="mt-6 text-center text-[13px] text-gray-500">
              <a href="#" className="underline">Terms</a> apply. By continuing, you agree to
              Plaid&apos;s <a href="#" className="underline">Privacy Policy</a>
            </p>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-4 w-full cursor-pointer rounded-xl bg-slate-500 py-3 text-[16px] font-semibold text-white hover:bg-slate-600"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-4 w-full cursor-pointer text-center text-[15px] font-semibold"
            >
              Continue as guest
            </button>
          </div>
          <div className="bg-gray-600 px-4 py-2 text-center text-[12px] text-white">
            Sandbox: use phone number <span className="font-semibold">415 555 0010</span>
          </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 pt-4">
              <button
                type="button"
                aria-label="Back"
                onClick={() => setStep(step - 1)}
                className="cursor-pointer text-[18px] text-gray-700 hover:text-black"
              >
                <i className="fas fa-arrow-left" />
              </button>
              <img src="/plaid.webp" alt="Plaid" className="h-4.5" />
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="cursor-pointer text-[18px] text-gray-700 hover:text-black"
              >
                ✕
              </button>
            </div>

            {step === 2 && (
              <>
                <div className="mt-3 flex gap-2 px-5">
                  <div className="h-1 flex-1 rounded-full bg-cyan-400" />
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full w-1/3 rounded-full bg-cyan-400" />
                  </div>
                  <div className="h-1 flex-1 rounded-full bg-gray-200" />
                </div>
                <div className="overflow-y-auto p-5">
                  <h3 className="text-center text-[20px] font-semibold">Select your institution</h3>
                  <div className="mt-4 flex items-center rounded-xl border border-gray-300 px-3 py-2.5">
                    <i className="fas fa-search mr-2 text-gray-400" />
                    <input
                      placeholder="Search 11,000+ institutions"
                      className="w-full bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {PLAID_INSTITUTIONS.map((bank) => (
                      <button
                        key={bank.name}
                        type="button"
                        onClick={() => {
                          setInstitution(bank.name);
                          setStep(3);
                        }}
                        className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-2 hover:border-gray-400"
                      >
                        <i className={`${bank.icon} text-[20px]`} style={{ color: bank.color }} />
                        <span className="text-center text-[14px] font-semibold">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
              <div className="overflow-y-auto p-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <i className="fas fa-mobile-alt text-[20px] text-cyan-700" />
                </div>
                <h3 className="mt-4 text-[20px] font-semibold">Verify your phone number</h3>
                <p className="mt-1 text-[14px] text-gray-500">
                  Enter the code sent to (•••) ••• 5040.
                </p>
                <div className="mt-4 rounded-xl border border-gray-300 px-3 py-3 text-left">
                  <input
                    placeholder="Code"
                    className="w-full bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onLinked(institution)}
                  className="mt-4 w-full cursor-pointer rounded-xl bg-gray-400 py-3 text-[16px] font-semibold text-white hover:bg-gray-500"
                >
                  Submit
                </button>
                <button type="button" className="mt-4 w-full cursor-pointer text-[15px] font-semibold">
                  Resend code
                </button>
              </div>
              <div className="bg-gray-600 px-4 py-2 text-center text-[12px] text-white">
                Sandbox: the code is <span className="font-semibold">123456</span>
              </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const MANUAL_FIELDS = [
  { key: "name", label: "Account Name", placeholder: "e.g. Operating Account", maxLength: 40, digitsOnly: false },
  { key: "account", label: "Account Number", placeholder: "4–17 digits", maxLength: 17, digitsOnly: true },
  { key: "routing", label: "Routing Number", placeholder: "9 digits", maxLength: 9, digitsOnly: true },
] as const;

const EMPTY_MANUAL = { name: "", account: "", routing: "" };

export function ManualBankForm({
  onAdd,
  submitLabel = "Submit",
  submitDisabled = false,
  initial,
  children,
}: {
  onAdd: (name: string, accountNumber: string) => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  // seed values (demo Auto fill) — read once on mount, so pair a change
  // with a key change to remount, like the onboarding drawer sections
  initial?: typeof EMPTY_MANUAL;
  // rendered between the fields and the submit button (e.g. a T&C checkbox)
  children?: ReactNode;
}) {
  const [form, setForm] = useState(initial ?? EMPTY_MANUAL);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_MANUAL>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const errs: Partial<typeof EMPTY_MANUAL> = {};
    if (!form.name.trim()) errs.name = "Account name is required.";
    if (!/^\d{4,17}$/.test(form.account)) errs.account = "Enter a valid US account number (4–17 digits).";
    if (!/^\d{9}$/.test(form.routing)) errs.routing = "Routing number must be 9 digits.";
    else {
      const d = form.routing.split("").map(Number);
      // ABA checksum — catches typos, doesn't prove the bank exists
      if ((3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + d[2] + d[5] + d[8]) % 10 !== 0)
        errs.routing = "Invalid routing number.";
    }
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const submit = () => {
    if (!validate()) return;
    setSaving(true);
    // ponytail: mock 3s save — swap the timeout for the real API call
    setTimeout(() => {
      onAdd(form.name.trim(), form.account);
      setForm(EMPTY_MANUAL);
      setSaving(false);
    }, 3000);
  };

  return (
    <div className="relative mb-4 max-w-160 rounded-sm border border-border-secondary bg-bg-primary p-5">
      <fieldset disabled={saving} className={saving ? "opacity-60" : ""}>
        <div className="space-y-3">
          {MANUAL_FIELDS.map(({ key, label, placeholder, maxLength, digitsOnly }) => (
            <div key={key}>
              <label className="mb-1 block text-[14px] font-medium text-text-emphasis">
                {label}
                <span className="ml-0.5 text-callout">*</span>
              </label>
              <input
                type="text"
                inputMode={digitsOnly ? "numeric" : "text"}
                value={form[key]}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    [key]: digitsOnly ? e.target.value.replace(/\D/g, "") : e.target.value,
                  }))
                }
                className={`w-full min-h-7.5 rounded-sm border bg-bg-primary px-2 text-[14px] text-text-primary outline-none placeholder:text-text-tertiary focus:border-brand ${
                  errors[key] ? "border-callout" : "border-border-secondary"
                }`}
              />
              {errors[key] && <p className="mt-1 text-[12px] text-callout">{errors[key]}</p>}
            </div>
          ))}
          {children}
          <Button variant="primary" size="md" disabled={submitDisabled} onClick={submit}>
            {submitLabel}
          </Button>
        </div>
      </fieldset>
      {saving && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-sm bg-bg-primary/60">
          <Spinner className="text-[18px] text-text-secondary" />
        </div>
      )}
    </div>
  );
}

// ponytail: dumb mock — nothing touches a server; timers fake the Plaid handoff
// allowPlaid=false (WIO viewing the operator's accounts) skips the options grid:
// Add Bank goes straight to the manual form, so Plaid linking stays operator-only.
export function BankAccountsTab({
  profile,
  allowPlaid = true,
}: {
  profile: "operator" | "wio";
  allowPlaid?: boolean;
}) {
  const [adding, setAdding] = useState<false | "options" | "manual">(false);
  const [{ rows: banks, defaultIndex }, setState] = useState<BankState>({
    rows: [],
    defaultIndex: 0,
  });
  const [plaid, setPlaid] = useState<"idle" | "loading" | "modal" | "linking">("idle");
  // in-memory only, so the glow never survives a revisit of the tab
  const [glowIndex, setGlowIndex] = useState<number | null>(null);
  const [settingIndex, setSettingIndex] = useState<number | null>(null);

  // sessionStorage is browser-only; hydrate after mount to keep SSR happy
  useEffect(() => {
    setState(loadBanks(profile));
  }, [profile]);

  // ponytail: persist inside the updater — idempotent, so StrictMode's
  // double-invoke just writes the same JSON twice
  const update = (fn: (s: BankState) => BankState) =>
    setState((prev) => {
      const next = fn(prev);
      sessionStorage.setItem(`banks:${profile}`, JSON.stringify(next));
      return next;
    });

  // The default can't be unlinked and neither can the last row, so whatever
  // remains after an unlink always still contains the default account.
  const unlink = (i: number) => {
    update((s) => ({
      rows: s.rows.filter((_, j) => j !== i),
      // removing a row above the default shifts it up one slot
      defaultIndex: i < s.defaultIndex ? s.defaultIndex - 1 : s.defaultIndex,
    }));
    setGlowIndex(null);
  };

  const makeDefault = (i: number) => {
    setSettingIndex(i);
    // ponytail: mock 3s save — swap the timeout for the real API call
    setTimeout(() => {
      update((s) => ({ ...s, defaultIndex: i }));
      setSettingIndex(null);
    }, 3000);
  };

  const appendBank = (row: string[]) => {
    update((s) => ({ ...s, rows: [...s.rows, row] }));
    setGlowIndex(banks.length);
    setTimeout(() => setGlowIndex(null), 2500);
  };

  const startPlaid = () => {
    setPlaid("loading");
    setTimeout(() => setPlaid("modal"), 2000);
  };

  const handleLinked = (institution: string) => {
    setPlaid("linking");
    setTimeout(() => {
      appendBank([institution, "Checking", "••••5040", "Verified"]);
      setPlaid("idle");
      setAdding(false);
    }, 3000);
  };

  const handleManualAdd = (name: string, accountNumber: string) => {
    appendBank([name, "Checking", `••••${accountNumber.slice(-4)}`, "Unverified"]);
  };

  return (
    <div className="pt-4">
      <div className="mb-2.5 flex items-center justify-between">
        <Button
          variant={adding ? "default" : "primary"}
          size="md"
          onClick={() => setAdding((v) => (v ? false : allowPlaid ? "options" : "manual"))}
        >
          {adding ? (
            "Cancel"
          ) : (
            <>
              <i className="fas fa-plus mr-2 text-[13px]" />
              Add Bank
            </>
          )}
        </Button>
      </div>

      {adding === "options" && (
        <div className="mb-4 grid max-w-160 grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={startPlaid}
            className="cursor-pointer rounded-sm border border-border-secondary bg-bg-primary p-5 text-left hover:border-brand"
          >
            <i className="fas fa-university mb-2 text-[20px] text-brand" />
            <div className="text-[14px] font-bold text-text-emphasis">Link Plaid Account</div>
            <div className="text-[13px] text-text-secondary">
              Connect instantly and securely through your bank login.
            </div>
          </button>
          <button
            type="button"
            onClick={() => setAdding("manual")}
            className="cursor-pointer rounded-sm border border-border-secondary bg-bg-primary p-5 text-left hover:border-brand"
          >
            <i className="fas fa-keyboard mb-2 text-[20px] text-brand" />
            <div className="text-[14px] font-bold text-text-emphasis">Enter Manually</div>
            <div className="text-[13px] text-text-secondary">
              Type in your routing and account numbers yourself.
            </div>
          </button>
        </div>
      )}

      {adding === "manual" && <ManualBankForm onAdd={handleManualAdd} />}

      <div className="mb-12.5 overflow-x-auto border border-border-tertiary bg-bg-primary">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {["BANK", "TYPE", "ACCOUNT", "STATUS", "DEFAULT", "ACTIONS"].map((h) => (
                <th
                  key={h}
                  className="border-b border-border-tertiary p-1.25 text-left font-bold text-text-primary"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {banks.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="border-b border-border-tertiary p-3 text-center text-text-secondary"
                >
                  No bank accounts linked yet.
                </td>
              </tr>
            )}
            {banks.map(([bank, type, account, status], i) => (
              <tr
                key={`${account}-${i}`}
                className={`transition-colors duration-1000 hover:bg-bg-secondary ${
                  i === glowIndex ? "bg-brand/15" : ""
                }`}
              >
                <td className="border-b border-border-tertiary p-1.25">
                  <a href="#">{bank}</a>
                </td>
                <td className="border-b border-border-tertiary p-1.25">{type}</td>
                <td className="border-b border-border-tertiary p-1.25">{account}</td>
                <td className="border-b border-border-tertiary p-1.25">
                  {status === "Verified" && (
                    <i className="fas fa-check-circle mr-1 text-brand" />
                  )}
                  {status}
                </td>
                <td className="border-b border-border-tertiary p-1.25">
                  {i === defaultIndex ? (
                    <span className="whitespace-nowrap font-bold text-[#3c763d]">
                      <i className="fas fa-check-circle mr-1" /> Default
                    </span>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      disabled={settingIndex !== null}
                      onClick={() => makeDefault(i)}
                      className="w-26 px-2"
                    >
                      {settingIndex === i ? (
                        <Spinner className="text-[13px]" />
                      ) : (
                        "Make default"
                      )}
                    </Button>
                  )}
                </td>
                <td className="border-b border-border-tertiary p-1.25">
                  <span
                    title={
                      i === defaultIndex
                        ? "The default account can't be unlinked — make another account default first"
                        : banks.length === 1
                          ? "At least one bank account is required"
                          : undefined
                    }
                  >
                    <Button
                      variant="default"
                      size="sm"
                      disabled={
                        i === defaultIndex || banks.length === 1 || settingIndex !== null
                      }
                      onClick={() => unlink(i)}
                      className="px-2"
                    >
                      <i className="fas fa-unlink mr-1 text-[12px]" />
                      Unlink
                    </Button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(plaid === "loading" || plaid === "linking") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-sm bg-bg-primary px-5 py-4 shadow-2xl">
            <Spinner className="text-[18px] text-text-secondary" />
            {plaid === "linking" && (
              <span className="text-[14px] text-text-primary">Linking Plaid Account</span>
            )}
          </div>
        </div>
      )}

      {plaid === "modal" && (
        <PlaidModal onClose={() => setPlaid("idle")} onLinked={handleLinked} />
      )}
    </div>
  );
}

export default function OpSearch({ initialTab = 0 }: { initialTab?: number }) {
  const [tab, setTab] = useState(initialTab);
  const [onboarded, setOnboarded] = useState(false);

  // sessionStorage is browser-only; read after mount to keep SSR/hydration happy
  useEffect(() => {
    setOnboarded(sessionStorage.getItem("operator-onboarding-complete") === "true");
  }, []);

  const tabs = onboarded ? [...TABS, "Bank Accounts"] : TABS;

  return (
    <div className="w-full">
      <h1 className="my-3.75 text-[24px] font-bold text-text-primary">
        Op Search
      </h1>
      <nav className="flex items-end overflow-auto">
        {tabs.map((label, i) => (
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
      ) : tabs[tab] === "Bank Accounts" ? (
        <BankAccountsTab profile="operator" />
      ) : (
        <div className="min-h-15" />
      )}
    </div>
  );
}
