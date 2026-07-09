"use client";

import { useState } from "react";
import type { UserType } from "./userType";

const itemCls =
  "block cursor-pointer rounded-lg px-3 py-2 mx-1.5 text-[14px] text-text-primary hover:bg-bg-tertiary";

// ponytail: submenu flyouts (Upload New File, File Search, Statement Search) not built —
// only the arrow renders. Add nested panels when their contents are specced.
type MenuGroups = {
  label: string;
  sub?: string;
  submenu?: boolean;
  href?: string;
}[][];

const operatedGroups: MenuGroups = [
  [{ label: "Upload New File", submenu: true }],
  [
    { label: "Operated File Search", submenu: true },
    {
      label: "Operated Invoice/Check Search",
      sub: "JIB, Revenue",
      href: "/Core/Fsp/OpSearch?tab=invoices",
    },
    {
      label: "Operated Statement Search",
      sub: "Payout, Production, 1099",
      submenu: true,
    },
    { label: "Operated Property Search" },
    { label: "Operated Inquiry Search" },
  ],
  [{ label: "Dispute Issues" }, { label: "Dispute Dashboard (Beta)" }],
];

// WIO's Non-Operated dropdown — single group, no separators in the capture
const nonOpGroups: MenuGroups = [
  [
    {
      label: "Non-Op Invoice/Check Search",
      sub: "JIB, Revenue",
      href: "/Core/Fsp/NonOpSearch?tab=invoices",
    },
    {
      label: "Non-Op Statement Search",
      sub: "Payout, Production, 1099",
      submenu: true,
    },
    { label: "Non-Op Property Search", href: "/Core/Fsp/NonOpSearch?tab=property" },
    { label: "Voucher Management" },
    { label: "Non-Op Inquiry Search", href: "/Core/Fsp/NonOpSearch?tab=inquiry" },
  ],
];

function DropdownMenu({ label, groups }: { label: string; groups: MenuGroups }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className={`${itemCls} ml-2 ${open ? "bg-bg-tertiary" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul
            className="absolute left-0 top-full z-50 mt-1.5 min-w-62.5 whitespace-nowrap rounded-xl border border-border-secondary bg-bg-primary py-1.5 shadow-[0_2px_8px_#00000033]"
            onClick={() => setOpen(false)}
          >
            {groups.map((group, gi) => (
              <li key={gi} className={gi > 0 ? "mt-1.5 border-t border-border-tertiary pt-1.5" : ""}>
                <ul>
                  {group.map((item) => {
                    const Tag = item.href ? "a" : "span";
                    return (
                    <li key={item.label} className="relative">
                      <Tag
                        href={item.href}
                        className={`mx-1.5 block cursor-pointer rounded-lg px-3 py-2 hover:bg-bg-tertiary ${
                          item.submenu ? "pr-8" : ""
                        }`}
                      >
                        <span className="block text-[14px] text-text-primary">
                          {item.label}
                        </span>
                        {item.sub && (
                          <span className="block text-[12px] text-text-secondary">
                            {item.sub}
                          </span>
                        )}
                      </Tag>
                      {item.submenu && (
                        <span className="pointer-events-none absolute right-2.5 top-[calc(50%-5px)] h-0 w-0 border-4 border-transparent border-l-text-primary" />
                      )}
                    </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function MainMenu({
  userType,
  ownerView = false,
}: {
  userType: UserType;
  ownerView?: boolean;
}) {
  return (
    <div className="hidden items-center justify-between border-b border-border-secondary bg-bg-primary py-1 pr-2.5 shadow-[0_2px_2px_#00000026] lg:pr-5 xl:flex">
      <nav className="flex items-center">
        {/* ponytail: Agent Portal dropdown contents aren't in the captures — plain item until specced */}
        {userType === "operator" ? (
          <DropdownMenu label="Operated" groups={operatedGroups} />
        ) : ownerView ? (
          <DropdownMenu label="Non-Operated" groups={nonOpGroups} />
        ) : (
          <span className={`${itemCls} ml-2`}>Agent Portal</span>
        )}
        <span className={itemCls}>Reporting</span>
        <span className={itemCls}>Admin</span>
        <span className={itemCls}>Help &amp; Info</span>
        <div className="inline-flex items-center">
          <a
            href="https://app.dev.drillinginfo.com/gallery/"
            target="_blank"
            className={itemCls}
          >
            Enverus Apps
          </a>
        </div>
      </nav>
      <div className="flex items-center" />
    </div>
  );
}
