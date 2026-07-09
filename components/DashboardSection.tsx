import type { ReactNode } from "react";

type DashboardSectionProps = {
  icon: string;
  title: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  children: ReactNode;
};

export default function DashboardSection({
  icon,
  title,
  headerClassName = "",
  contentClassName = "",
  children,
}: DashboardSectionProps) {
  return (
    <>
      <h2
        className={`text-[19px] font-bold text-text-secondary ${headerClassName}`}
      >
        <i className={`fe ${icon} mr-4 w-5.5 font-normal text-text-secondary`} />
        {title}
      </h2>
      <div
        className={`ml-9 flex flex-wrap items-stretch gap-4 ${contentClassName}`}
      >
        {children}
      </div>
    </>
  );
}
