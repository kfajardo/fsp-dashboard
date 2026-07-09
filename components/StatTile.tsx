type StatTileProps = {
  title: string;
  icon: string;
  count: number;
  href?: string;
  meCount?: number;
  meHref?: string;
  hiddenLinksTitle?: string;
};

function CountLink({ count, href }: { count: number; href?: string }) {
  const countEl = (
    <span className="ml-2.5 font-bold text-text-emphasis">{count}</span>
  );
  return href ? (
    <a href={href} className="group inline-flex items-center">
      {countEl}
      <i className="fas fa-arrow-right ml-1.25 rounded-full p-2 text-[13px] text-brand group-hover:bg-brand-transparent" />
    </a>
  ) : (
    countEl
  );
}

export default function StatTile({
  title,
  icon,
  count,
  href,
  meCount,
  meHref,
  hiddenLinksTitle,
}: StatTileProps) {
  return (
    <div
      title={hiddenLinksTitle ?? ""}
      className={`grid w-45 grid-rows-[auto_25px_20px] gap-2 rounded-lg border border-border-primary bg-bg-primary px-4 pt-3.5 pb-3 ${
        hiddenLinksTitle ? "cursor-help" : ""
      }`}
    >
      <div className="text-[16px] leading-[20px]">{title}</div>
      <div className="flex items-center text-[24px] leading-[24px]">
        <i className={`fe ${icon} text-text-tertiary`} />
        <CountLink count={count} href={href} />
      </div>
      {meCount != null && (
        <div className="flex items-center text-[14px] leading-[14px] font-medium text-text-secondary">
          <span>Me</span>
          <CountLink count={meCount} href={meHref} />
        </div>
      )}
    </div>
  );
}
