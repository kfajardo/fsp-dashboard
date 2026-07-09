"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import OnboardingDrawer, { BusinessSection, DEMO } from "@/components/OnboardingDrawer";
import { BankAccountsTab, ManualBankForm, loadBanks } from "@/components/OpSearch";
import {
  getPartner,
  JIB_CONTACTS,
  ME_CONTACT,
  PARTNER_TYPE_LABEL,
} from "@/components/partners";
import type { UserType } from "@/components/userType";

// ponytail: the demo's WIO login is hardcoded page chrome (loginAs="ZTEST-DD")
const WIO_NAME = "ZTEST - ZTEST-DD";

// Demo bank details for the partial-onboarding Auto fill — matches the
// onboarding drawer's Acme demo data; routing passes the ABA checksum.
const DEMO_BANK = {
  name: "Acme Operating Account",
  account: "123456789012",
  routing: "021000021",
};

function Row({
  label,
  top = false,
  children,
}: {
  label: ReactNode;
  top?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`flex gap-3 py-1 ${top ? "items-start" : "items-center"}`}>
      <div
        className={`w-48 shrink-0 text-right text-text-primary ${top ? "pt-1.5" : ""}`}
      >
        {label}
      </div>
      <div className="min-w-0 flex-1 text-text-primary">{children}</div>
    </div>
  );
}

// Read-only value cell — the reference's .CellLbl (cream box, gray border).
function Cell({ children }: { children?: ReactNode }) {
  return (
    <span className="inline-flex min-h-7 min-w-6 items-center rounded border border-[#ccc] bg-[#fcfcf4] px-3 py-1">
      {children}
    </span>
  );
}

// WIO-side "partial" onboarding of a non-onboarded operator: a side drawer
// (same shell as the normal onboarding drawer) with the full flow's Business
// Information section plus a manual bank form — no Plaid, no checkboxes;
// agreement happens by clicking Continue (Moov wording above the button).
// ManualBankForm supplies the mock 3s submit; completion is flagged in
// sessionStorage for the banner. The first bank lands at defaultIndex 0, so
// it's the default automatically. Also opened from the pay modal's error CTA
// (renderTrigger swaps the button for an inline link).
export function OperatorOnboardDrawer({
  operatorName,
  onDone,
  renderTrigger,
}: {
  operatorName: string;
  onDone: () => void;
  renderTrigger?: (open: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [bizDone, setBizDone] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  // What the WIO entered in Business Information — persisted on Continue so
  // the operator's own full onboarding starts from it
  const [bizForm, setBizForm] = useState<Record<string, string> | null>(null);

  const complete = (name: string, account: string) => {
    // Same store the operator's own banking tab reads — both parties see it
    const state = loadBanks("operator");
    state.rows.push([name, "Checking", `••••${account.slice(-4)}`, "Unverified"]);
    sessionStorage.setItem("banks:operator", JSON.stringify(state));
    sessionStorage.setItem("operator-onboarded-by", WIO_NAME);
    if (bizForm)
      sessionStorage.setItem("operator-partial-business", JSON.stringify(bizForm));
    setOpen(false);
    onDone();
  };

  return (
    <>
      {renderTrigger ? (
        renderTrigger(() => setOpen(true))
      ) : (
        <Button variant="primary" size="md" onClick={() => setOpen(true)}>
          Onboard
        </Button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 font-normal">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-150 flex-col bg-bg-primary shadow-2xl">
            <header className="flex items-center justify-between border-b border-border-tertiary px-5 py-3.5">
              <div>
                <h2 className="text-[19px] font-bold text-text-emphasis">
                  Operator Onboarding
                </h2>
                <p className="text-[12px] text-text-secondary">
                  Onboarding {operatorName} on their behalf
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setPrefilled(true);
                    setBizDone(true);
                    setBizForm({ ...DEMO.business });
                  }}>
                  Auto fill
                </Button>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="px-2 text-[18px] text-text-secondary hover:text-text-emphasis">
                  ✕
                </button>
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <p className="mb-4 text-[13px] text-text-secondary">
                Provide the operator&apos;s business details and bank account
                to partially onboard them. The operator can complete their full
                onboarding later.
              </p>

              {/* Business Information — the full drawer's section, sans its
                  ToS checkbox; collapses to its header once saved */}
              <div className="rounded-sm border border-border-tertiary">
                <div className="flex w-full items-center gap-3 px-4 py-3">
                  <i className="fe fe-buildings w-5 text-center text-[16px] text-text-secondary" />
                  <span className="flex-1">
                    <span className="block text-[14px] font-bold text-text-emphasis">
                      Business Information
                    </span>
                    <span className="block text-[12px] text-text-secondary">
                      The operator&apos;s business details
                    </span>
                  </span>
                  {bizDone && <i className="fas fa-check-circle text-brand" />}
                </div>
                {!bizDone && (
                  <div className="border-t border-border-tertiary px-4 py-4">
                    <BusinessSection
                      prefilled={prefilled}
                      hideTos
                      onSaved={(_, form) => {
                        setBizForm(form);
                        setBizDone(true);
                      }}
                    />
                  </div>
                )}
              </div>

              <h3 className="mt-4 mb-2 text-[14px] font-bold text-text-emphasis">
                Bank Account
              </h3>
              <ManualBankForm
                // remounts on Auto fill so the demo values are picked up
                key={prefilled ? "prefilled" : "blank"}
                initial={prefilled ? DEMO_BANK : undefined}
                submitLabel="Continue"
                submitDisabled={!bizDone}
                onAdd={complete}>
                <p className="text-center text-[13px] text-text-secondary">
                  By clicking continue, you agree to the terms of Moov&apos;s{" "}
                  <a href="#" className="text-link hover:underline">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-link hover:underline">
                    Platform Agreement
                  </a>
                  .
                </p>
              </ManualBankForm>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

// selfView: the WIO viewing their own record (from the user menu) — same
// screen, minus the operator-only onboarding trigger, with the session banner
// reworded for the owner login.
// operatorView: the WIO viewing an operator's record (from the Non-Op Search
// table) — same screen, minus the session banner, onboarding trigger, and
// bottom sections, which are all operator- or self-specific.
export default function OperatedBA({
  partner,
  selfView = false,
  operatorView = false,
  userType,
}: {
  partner?: string;
  selfView?: boolean;
  operatorView?: boolean;
  // who is looking at the operatorView — gates the Onboard button (WIO only)
  // and the Plaid option in the bank list (operator only)
  userType?: UserType;
}) {
  const p = getPartner(partner);
  const router = useRouter();
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [mailout, setMailout] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  // Operator onboarding state — done by the operator themselves, or partially
  // by the WIO (which records who did it for the banner).
  // sessionStorage is browser-only; read after mount to keep SSR happy.
  const [onboardedBy, setOnboardedBy] = useState<string | null>(null);
  const [opSelfOnboarded, setOpSelfOnboarded] = useState(false);
  useEffect(() => {
    if (!operatorView) return;
    setOnboardedBy(sessionStorage.getItem("operator-onboarded-by"));
    setOpSelfOnboarded(
      sessionStorage.getItem("operator-onboarding-complete") === "true",
    );
  }, [operatorView]);
  const opOnboarded = !!onboardedBy || opSelfOnboarded;

  // CTA deep-link from the pay modal: the bank section mounts after hydration,
  // so the native #banks anchor scroll needs a manual nudge
  useEffect(() => {
    if (operatorView && opOnboarded && window.location.hash === "#banks")
      document.getElementById("banks")?.scrollIntoView();
  }, [operatorView, opOnboarded]);

  return (
    <div className="w-full pb-12">
      {/* Page title strip (full-bleed gray bar) */}
      <div className="-mx-2.5 -mt-2.5 flex min-h-9 items-center justify-between gap-3 border-b border-border-secondary bg-bg-secondary px-4 py-1 text-[14px] font-bold text-text-primary lg:-mx-5">
        <span>{operatorView ? "Operator" : selfView ? "My Profile" : "Operated BA"}</span>
        {/* Onboarding triggers live on the operator details only; the
            operator's view of a WIO profile must never show one. The WIO gets
            the partial drawer; the operator gets their own full onboarding
            (same drawer + flag as their dashboard), even after a WIO partial. */}
        {operatorView && userType === "wio" && !opOnboarded && (
          <OperatorOnboardDrawer
            operatorName={p.name}
            onDone={() => setOnboardedBy(WIO_NAME)}
          />
        )}
        {operatorView && userType === "operator" && (
          <OnboardingDrawer
            storageKey="operator-onboarding-complete"
            title="Operator Onboarding"
            onComplete={() => setOpSelfOnboarded(true)}
            // A WIO partial exists: finishing it is the operator's job
            triggerLabel={onboardedBy ? "Complete Onboarding" : "Onboard"}
          />
        )}
      </div>

      {/* Partial-onboarding banner — who onboarded this operator */}
      {operatorView && onboardedBy && (
        <div className="-mx-2.5 flex items-start gap-2 border-b border-[#bce8f1] bg-[#d9edf7] px-4 py-2.5 text-[14px] font-normal text-[#31708f] lg:-mx-5">
          <i className="fas fa-info-circle mt-0.5" />
          <span className="flex-1">Onboarded by {onboardedBy}.</span>
        </div>
      )}

      {/* Session info banner (full-bleed) — login-switch artifact, not shown on the operator details view */}
      {showBanner && !operatorView && (
        <div className="-mx-2.5 flex items-start gap-2 border-b border-[#bce8f1] bg-[#d9edf7] px-4 py-2.5 text-[14px] text-[#31708f] lg:-mx-5">
          <i className="fas fa-info-circle mt-0.5" />
          <span className="flex-1">
            You are now logged into your {selfView ? p.code : "ZTEST-I"}{" "}
            account. {selfView ? "BISON_CLYDE" : "CLYDE_BISON"} is now logged
            in.
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowBanner(false)}
            className="cursor-pointer text-[18px] leading-none hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Form (centered) */}
      <div className="mx-auto max-w-260 px-4 pt-6 text-[14px]">
        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
          {/* Left column — partner details */}
          <div>
            <Row label="Doc Type">
              <Cell>JIB</Cell>
            </Row>

            <Row label="My BA">
              <input
                type="text"
                value={p.myBa}
                disabled
                className="min-h-7 w-full max-w-45 rounded border border-[#ccc] bg-[#eee] px-2 text-text-secondary"
              />
            </Row>

            <Row label="My Assigned JIB Contact">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <select
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="min-h-7 w-40 rounded border border-[#ccc] bg-bg-primary px-2 outline-none focus:border-brand"
                >
                  <option value="" />
                  {JIB_CONTACTS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="text-text-secondary">
                  [
                  <button
                    type="button"
                    onClick={() => setContact(ME_CONTACT)}
                    className="cursor-pointer text-link hover:underline"
                  >
                    Me
                  </button>
                  ]
                </span>
              </span>
            </Row>

            <Row label="Include In Mailout">
              <input
                type="checkbox"
                checked={mailout}
                onChange={(e) => setMailout(e.target.checked)}
                className="size-4 accent-brand"
              />
            </Row>

            {/* ponytail: only the name row is relabeled — remaining "Partner ..." labels stay as-is */}
            <Row label={operatorView ? "Operator" : "Partner"}>
              <span>{p.name}</span>
              <a
                href="#"
                className="ml-2.5 text-[12px] text-link hover:underline"
              >
                view history
              </a>
            </Row>

            <Row label="Partner Type">
              <Cell>{PARTNER_TYPE_LABEL[p.partnerType]}</Cell>
            </Row>

            <Row label="EnergyLink Address" top>
              <pre className="inline-block rounded border border-[#ccc] bg-[#f5f5f5] p-2.5 font-mono text-[13px] leading-snug">
                {p.address.join("\n")}
              </pre>
              <div className="mt-3 max-w-80 rounded-[3px] border border-[#eee] border-l-[5px] border-l-[#5bc0de] bg-bg-primary px-4 py-3 text-[13px] text-text-primary">
                The name and address information shown on this screen is the
                partner&apos;s current name and address.
                <br />
                <br />
                Each individual invoice will display the partner&apos;s name and
                address from your system at the time it was sent.
              </div>
            </Row>

            <Row label="Phone">
              <Cell>{p.phone}</Cell>
            </Row>
            <Row label="Fax">
              <Cell>{p.fax}</Cell>
            </Row>
            <Row label="TIN #">
              <Cell>{p.tin}</Cell>
            </Row>

            <Row label="Partner's Default Contact">
              <a
                href={`mailto:${p.defaultContact}`}
                className="font-bold text-link hover:underline"
              >
                {p.defaultContact}
              </a>
            </Row>

            <Row label="Last Update User">
              <Cell>{p.lastUpdateUser}</Cell>
            </Row>
            <Row label="Last Update Date">
              <Cell>{p.lastUpdateDate}</Cell>
            </Row>
          </div>

          {/* Right column — accountant's comment */}
          <div className="mt-6 lg:mt-0 lg:pt-1">
            <div>
              Accountant&apos;s Comment - {comment.length}/3000 characters
            </div>
            <textarea
              value={comment}
              maxLength={3000}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 h-35 w-full max-w-125 resize-y rounded border border-[#ccc] bg-bg-primary p-2 outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* Button row (right-aligned, top border) */}
        <div className="mt-4 border-t border-[#ddd] pt-2 text-right">
          <Button
            variant="default"
            size="md"
            className="w-19"
            onClick={() => router.back()}
          >
            Back
          </Button>
          {/* ponytail: Save is a no-op — no BA write API in the demo */}
          <Button variant="primary" size="md" className="ml-2 w-19">
            Save
          </Button>
        </div>
      </div>

      {selfView ? (
        /* Owner self-service banking — same CRUD as the Non-Op Bank Accounts tab */
        <div className="mx-auto max-w-260 px-4">
          <h4 className="mt-8 text-center text-[15px] font-bold text-[#228fb1]">
            Bank Accounts
          </h4>
          <BankAccountsTab profile="wio" />
        </div>
      ) : operatorView ? (
        /* Operator's linked accounts — shared store, visible to operator and
           WIO once onboarded; Plaid linking stays operator-only */
        opOnboarded && (
          <div id="banks" className="mx-auto max-w-260 px-4">
            <h4 className="mt-8 text-center text-[15px] font-bold text-[#228fb1]">
              Bank Accounts
            </h4>
            <BankAccountsTab
              profile="operator"
              allowPlaid={userType === "operator"}
            />
          </div>
        )
      ) : (
        <>
          <h4 className="mt-8 text-center text-[15px] font-bold text-[#228fb1]">
            Contacts the partner has assigned to your ORGs
          </h4>
          <div className="mt-2 text-center font-bold text-text-primary">
            No records found.
          </div>
        </>
      )}
    </div>
  );
}
