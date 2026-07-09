import EnergyLinkLogo from "./EnergyLinkLogo";
import UserTypeSwitcher from "./UserTypeSwitcher";
import type { UserType } from "./userType";

function Separator() {
  return (
    <div className="mx-3.25 h-6.5 w-0.5 bg-border-tertiary max-md:mx-2.5 max-md:h-6.25 max-md:w-0 max-sm:mx-2" />
  );
}

export default function SiteHeader({
  userType,
  loginAs,
}: {
  userType: UserType;
  loginAs?: string;
}) {
  return (
    <header className="flex items-center justify-between bg-bg-primary px-2.5 pt-2.5 text-text-primary lg:px-5 max-xl:py-0.5 max-xl:shadow-[0_2px_2px_#00000026]">
      <a href="/" className="mr-auto max-md:hidden">
        <EnergyLinkLogo />
      </a>
      <a
        href="#"
        title="Inbox"
        className="ml-auto flex items-center text-[31px] text-text-secondary hover:text-text-primary max-sm:text-[26px]"
      >
        <i className="fe fe-bell" />
      </a>
      <Separator />
      <button
        type="button"
        title="File Manager"
        aria-label="File Manager"
        className="flex cursor-pointer text-[32px] text-text-secondary hover:text-text-primary max-sm:text-[26px]"
      >
        <i className="fe fe-folders" />
      </button>
      <Separator />
      <a
        href="#"
        title="Chat with us"
        className="flex items-center text-[30px] text-text-secondary hover:text-text-primary max-sm:text-[26px]"
      >
        <i className="far fa-comment" />
        <span className="-ml-2.75 rounded-[2px] bg-callout py-0.5 pr-0.5 pl-0.75 text-[11px] font-bold uppercase leading-none text-white max-sm:text-[9px]">
          help
        </span>
      </a>
      <Separator />
      <UserTypeSwitcher userType={userType} loginAs={loginAs} />
    </header>
  );
}
