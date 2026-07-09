import type { ReactNode } from "react";

function TabInfo({
  label,
  value,
  xlOnly = false,
  limitedWidth = false,
  title,
}: {
  label: ReactNode;
  value: ReactNode;
  xlOnly?: boolean;
  limitedWidth?: boolean;
  title?: string;
}) {
  return (
    <div
      className={`leading-[12px] not-first:ml-3.75 ${xlOnly ? "max-2xl:hidden" : ""}`}
    >
      <div className="whitespace-nowrap text-[9px] text-text-secondary">
        {label}
      </div>
      <div
        title={title}
        className={`whitespace-nowrap pt-0.25 text-[11px] ${
          limitedWidth ? "max-w-30 overflow-hidden text-ellipsis" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function DebugBar() {
  return (
    <div className="max-xl:hidden">
      <div className="pointer-events-none absolute inset-x-0 z-4 flex h-[80vh] -translate-y-[calc(100%-32px)] flex-col items-center justify-end text-[12px] font-normal">
        <label
          className="pointer-events-auto relative bottom-0 flex cursor-pointer select-none border border-t-0 border-border-secondary bg-bg-secondary px-3.5 py-0.5
            before:absolute before:top-0 before:-left-[10px] before:block before:h-full before:w-4.5 before:skew-x-[25deg] before:rounded-bl-sm before:border-l before:border-border-secondary before:bg-bg-secondary before:content-['']
            after:absolute after:top-0 after:-right-[10px] after:block after:h-full after:w-4.5 after:-skew-x-[25deg] after:rounded-br-sm after:border-r after:border-border-secondary after:bg-bg-secondary after:content-['']"
        >
          <TabInfo
            label="Environment"
            value={
              <span className="-mt-0.25 inline-block whitespace-nowrap rounded-[3px] border border-[#c2c200] bg-[#ff0] px-1.25 text-center text-[11px] leading-[12px] text-black">
                TEST
              </span>
            }
          />
          <TabInfo label="Database" value="TEST" />
          <TabInfo label="Server" value="V02DENL-TEST-0" />
          <TabInfo label="Version" value="26.7" />
          <TabInfo
            label="Git b5b922b99f-dirty"
            value="current_release"
            title="current_release"
            limitedWidth
          />
          <TabInfo
            label={
              <>
                Compiled By <strong className="uppercase">Radek.Altof</strong>
              </>
            }
            value="Jul 2 8:39 AM"
          />
          <TabInfo label="Running Since" value="Jul 7 2:12 AM" xlOnly />
          <TabInfo label="Peak Memory" value="651.96 MB" xlOnly />
          <TabInfo
            label="Session Server"
            value="enl-redis-cache-dev.7onbyc.ng.0001.use1.cache.amazonaws.com"
            title="enl-redis-cache-dev.7onbyc.ng.0001.use1.cache.amazonaws.com"
            limitedWidth
            xlOnly
          />
        </label>
      </div>
    </div>
  );
}
