"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import OnboardingDrawer from "@/components/OnboardingDrawer";
import { BankAccountsTab, WIO_BANKS } from "@/components/OpSearch";
import {
  getPartner,
  JIB_CONTACTS,
  ME_CONTACT,
  PARTNER_TYPE_LABEL,
} from "@/components/partners";

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

// selfView: the WIO viewing their own record (from the user menu) — same
// screen, minus the operator-only onboarding trigger, with the session banner
// reworded for the owner login.
export default function OperatedBA({
  partner,
  selfView = false,
}: {
  partner?: string;
  selfView?: boolean;
}) {
  const p = getPartner(partner);
  const router = useRouter();
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [mailout, setMailout] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="w-full pb-12">
      {/* Page title strip (full-bleed gray bar) */}
      <div className="-mx-2.5 -mt-2.5 flex min-h-9 items-center justify-between gap-3 border-b border-border-secondary bg-bg-secondary px-4 py-1 text-[14px] font-bold text-text-primary lg:-mx-5">
        <span>{selfView ? "My Profile" : "Operated BA"}</span>
        {/* Onboarding is per-WIO — keyed by this BA's code in session storage */}
        {!selfView && <OnboardingDrawer wioCode={p.code} />}
      </div>

      {/* Session info banner (full-bleed) */}
      {showBanner && (
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

            <Row label="Partner">
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
          <BankAccountsTab initial={WIO_BANKS} />
        </div>
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
