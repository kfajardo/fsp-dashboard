"use client";

import { useState } from "react";
import Button from "@/components/Button";

// owner, assigned user, unprocessed JIB invoices, unprocessed REV checks
// ponytail: only ZTEST-DD's login is wired (the specced demo flow) — other rows stay dead
const OWNERS = [
  { name: "ZTEST-A", assignedUser: "", jib: 0, rev: 1 },
  { name: "ZTEST-C", assignedUser: "", jib: 0, rev: 0 },
  { name: "ZTEST-DD", assignedUser: "", jib: 4, rev: 2, loginHref: "/Core/Fsp/NonOpSearch?tab=invoices" },
];

const rowBtnCls =
  "flex h-5.5 cursor-pointer items-center whitespace-nowrap rounded-sm border border-border-secondary bg-bg-primary text-[13px] text-text-primary hover:bg-bg-secondary";

function GridSelect({ label, value }: { label: string; value: string }) {
  return (
    <div className="mr-1.25 flex items-center text-[13px] text-text-primary">
      <span className="flex h-6.75 items-center rounded-l-sm border border-r-0 border-border-secondary bg-bg-tertiary px-2">
        {label}
      </span>
      <span className="flex h-6.75 cursor-pointer items-center rounded-r-sm border border-border-secondary bg-bg-primary pl-2">
        {value}
        <i className="fas fa-caret-down mx-2 text-text-secondary" />
      </span>
    </div>
  );
}

function FilterInput({ select = false }: { select?: boolean }) {
  return (
    <div className="flex h-6 items-center rounded-sm border border-border-secondary bg-bg-primary px-1.5 text-[13px] text-text-secondary">
      <i className="fas fa-filter mr-1.25 text-[11px]" />
      <span className="flex-1">Filter...</span>
      {select && <i className="fas fa-caret-down mx-1.25" />}
    </div>
  );
}

function Th({ label, sort }: { label: string; sort: "asc" | "none" | null }) {
  return (
    <th className="p-2.5 pb-0 text-left align-top">
      <div className="flex items-center whitespace-nowrap text-[14px] font-bold uppercase">
        <span className="cursor-pointer text-brand hover:underline">{label}</span>
        {sort === "asc" && <i className="fas fa-caret-up ml-1.25 text-[15px] text-brand" />}
        {sort === "none" && <i className="fas fa-sort ml-1.25 text-text-tertiary" />}
      </div>
    </th>
  );
}

export default function AgentOwners() {
  const [alertOpen, setAlertOpen] = useState(true);

  return (
    <div className="flex min-h-0 flex-auto flex-col">
      {alertOpen && (
        <div className="mt-2.5 flex items-center rounded-md bg-[#f3e6c2] px-3.75 py-2.5 text-[15px] text-text-primary">
          <i className="far fa-question-circle mr-3.75 text-[19px] text-[#db9f38]" />
          <p className="flex-1">
            Unable to contact MineralSoft. Please note that some functionality may be affected.
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setAlertOpen(false)}
            className="cursor-pointer px-1 text-[16px] text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>
      )}

      <h1 className="my-3.75 text-[24px] font-bold text-text-primary">Owners</h1>

      {/* ponytail: filter panel contents aren't in the capture (collapsed) — toggle is dead until specced */}
      <div className="mb-2.5 rounded-md border border-border-tertiary bg-bg-primary px-3.75">
        <div className="py-1.75">
          <span className="cursor-pointer text-[14px] font-bold text-link">
            <i className="fas fa-filter mr-1" /> Filters{" "}
            <i className="fas fa-caret-right ml-0.5" />
          </span>
        </div>
      </div>

      <div className="mb-1.25 flex items-center justify-between">
        <div className="flex items-center">
          <GridSelect label="Scroll Mode" value="Grid" />
          <GridSelect label="Show" value="100" />
        </div>
        <div className="flex items-center gap-1.25">
          <Button variant="default" size="sm" className="px-2.5 font-bold">
            <i className="fas fa-sync-alt mr-1.25" /> Refresh Results
          </Button>
          <Button variant="default" size="sm" className="px-2.5 font-bold">
            <i className="fas fa-power-off mr-1.25" /> Reset Filters
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-auto flex-col bg-bg-primary">
        <div className="flex-auto overflow-auto">
          <table className="w-full min-w-435.5 table-fixed border-collapse text-[14px] text-text-primary">
            <colgroup>
              <col className="w-32.5" />
              <col />
              <col className="w-37.5" />
              <col className="w-50" />
              <col className="w-50" />
              <col className="w-17.5" />
            </colgroup>
            <thead>
              <tr className="h-12">
                <th />
                <Th label="Owner Name" sort="asc" />
                <Th label="Assigned User" sort="none" />
                <Th label="Unprocessed Invoices (JIB)" sort="none" />
                <Th label="Unprocessed Checks (REV)" sort="none" />
                <Th label="1099s" sort="none" />
              </tr>
              <tr className="h-8 border-b border-border-tertiary">
                <td />
                <td className="px-1.25">
                  <FilterInput />
                </td>
                <td className="px-1.25">
                  <FilterInput select />
                </td>
                <td />
                <td />
                <td />
              </tr>
            </thead>
            <tbody>
              {OWNERS.map((owner, i) => (
                <tr
                  key={owner.name}
                  className={`h-6.5 border-b border-border-tertiary ${
                    i % 2 ? "bg-bg-secondary" : ""
                  }`}
                >
                  <td className="px-1.25">
                    <div className="flex items-center">
                      {/* ponytail: capture uses fa-user-unlock (not in the font subset) — user-lock is the closest glyph */}
                      {owner.loginHref ? (
                        <a href={owner.loginHref} className={`${rowBtnCls} mr-1.25 px-1.75`}>
                          <i className="far fa-user-lock mr-1.25" /> Login
                        </a>
                      ) : (
                        <button type="button" className={`${rowBtnCls} mr-1.25 px-1.75`}>
                          <i className="far fa-user-lock mr-1.25" /> Login
                        </button>
                      )}
                      <button type="button" className={`${rowBtnCls} pl-1.25`}>
                        More <i className="fas fa-caret-down mx-1.25" />
                      </button>
                    </div>
                  </td>
                  <td className="px-2.5">
                    <a href="#">{owner.name}</a>
                  </td>
                  <td className="px-2.5">{owner.assignedUser}</td>
                  <td className="px-2.5 text-right">{owner.jib}</td>
                  <td className="px-2.5 text-right">{owner.rev}</td>
                  <td />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end px-2.5 py-1.5 text-[13px] text-text-primary">
          <span className="mr-3.75">1 to 3 of 3</span>
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

      <div className="py-2.5">
        <Button variant="default" size="md" className="w-25">
          <i className="fas fa-chevron-left mr-2" /> Back
        </Button>
      </div>
    </div>
  );
}
