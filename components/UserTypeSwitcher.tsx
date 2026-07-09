"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserType } from "@/components/userType";

// ponytail: demo personas, one per user type — swap names/codes when real ones arrive
const PERSONAS: Record<UserType, { name: string; code: string; label: string }> = {
  operator: { name: "Clyde B", code: "ZTEST-I", label: "Operator" },
  wio: { name: "Bison Clyde", code: "ZTESTAGENT", label: "Well Interest Owner" },
};

export default function UserTypeSwitcher({
  userType,
  loginAs,
}: {
  userType: UserType;
  loginAs?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const current = PERSONAS[userType];

  const switchTo = (type: UserType) => {
    document.cookie = `userType=${type}; path=/`;
    setOpen(false);
    router.refresh();
  };

  return (
    <div className="relative -ml-2.75 -mr-2 inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`relative cursor-pointer whitespace-nowrap rounded-lg pt-1.5 pr-6.5 pb-1.25 pl-3 text-right leading-2.5 text-text-primary hover:bg-bg-tertiary ${
          open ? "bg-bg-tertiary" : ""
        }`}
      >
        <span className="text-[12px]">{current.name}</span>
        <span className="block pt-1.5 text-[16px] font-bold uppercase leading-none">
          {loginAs ?? current.code}
        </span>
        {loginAs && (
          <span className="block pt-1 text-[11px] leading-none text-text-secondary">
            via {current.code}
          </span>
        )}
        <i className="fas fa-user-circle absolute top-1.5 right-2 text-[12px] text-brand" />
        <i className="fas fa-caret-down absolute bottom-1.5 right-2.25 text-[16px] text-text-secondary" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul className="absolute right-0 top-full z-50 mt-1.5 min-w-55 rounded-xl border border-border-secondary bg-bg-primary py-1.5 text-left shadow-[0_2px_8px_#00000033]">
            {loginAs && (
              <li className="mb-1.5 border-b border-border-tertiary pb-1.5">
                <a
                  href={`/Core/Fsp/OwnerProfile?owner=${loginAs}`}
                  className="mx-1.5 block cursor-pointer rounded-lg px-3 py-2 hover:bg-bg-tertiary"
                >
                  <span className="block text-[14px] text-text-primary">
                    <i className="far fa-id-card mr-1.5 text-brand" /> My Profile
                  </span>
                  <span className="block text-[12px] text-text-secondary">{loginAs}</span>
                </a>
              </li>
            )}
            {(Object.keys(PERSONAS) as UserType[]).map((type) => (
              <li key={type}>
                <button
                  type="button"
                  onClick={() => switchTo(type)}
                  className="mx-1.5 flex w-[calc(100%-12px)] cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2 text-left hover:bg-bg-tertiary"
                >
                  <span>
                    <span className="block text-[14px] text-text-primary">
                      {PERSONAS[type].name} &middot; {PERSONAS[type].code}
                    </span>
                    <span className="block text-[12px] text-text-secondary">
                      {PERSONAS[type].label}
                    </span>
                  </span>
                  {type === userType && (
                    <i className="fas fa-check text-[12px] text-brand" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
