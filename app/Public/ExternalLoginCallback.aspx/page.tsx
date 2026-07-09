import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserType } from "@/components/userType";

export const metadata: Metadata = {
  title: "EnergyLink",
};

const ACCOUNTS: { name: string; userId: string; userType: UserType; dest: string }[] = [
  { name: "ZTEST-A", userId: "CLYDE_ZTEST", userType: "operator", dest: "/" },
  { name: "ZTESTAGENT", userId: "ZT_BSN_CLYDE", userType: "wio", dest: "/Core/Agent/Owners" },
  { name: "ZTEST-I", userId: "CLYDE_BISON", userType: "operator", dest: "/" },
];

async function loginAs(formData: FormData) {
  "use server";
  const account = ACCOUNTS.find((a) => a.name === formData.get("account"));
  if (!account) return;
  (await cookies()).set("userType", account.userType);
  redirect(account.dest);
}

export default function ExternalLoginCallbackPage() {
  return (
    <div
      className="relative flex-auto overflow-auto bg-[#ebe9e6] text-[16px] leading-[1.5] text-[#222]"
      style={{ fontFamily: '"Helvetica Neue",Helvetica,Roboto,Arial,sans-serif' }}
    >
      <span className="absolute top-0 left-0 z-50 inline-block border border-[#796e65] bg-[#ff0] py-0 pr-1 pl-0.5 text-[#796e65]">
        Test
      </span>

      <div className="flex h-35 items-center bg-white pl-17">
        <a href="/">
          <img src="/enverus-logo.png" alt="Enverus" className="h-5.5 w-37.5" />
        </a>
      </div>

      <div className="bg-[#f6f4f1] pt-12.5">
        <div className="mx-auto w-full max-w-117.5 rounded-xs border border-[#ccc] bg-white">
          <h3
            className="mt-3.75 mb-2 text-center text-[22px] leading-6.75  text-[#56bc2f]"
            style={{ fontFamily: "Roboto,Helvetica,Arial,Lucida,sans-serif" }}
          >
            Choose an Account
          </h3>
          <ul className="p-5">
            {ACCOUNTS.map((account) => (
              <li key={account.userId} className="mb-2.5 rounded-xs border border-[#ccc]">
                <form action={loginAs}>
                  <input type="hidden" name="account" value={account.name} />
                  <button
                    type="submit"
                    className="relative flex w-full cursor-pointer items-center px-2 pt-1.25 pb-1 text-left hover:bg-[#f5f5f5]"
                  >
                    <img
                      src="/flag-us.png"
                      alt=""
                      className="h-3 w-5"
                    />
                    <div className="pr-7.5 pl-2 leading-3.5">
                      <span className="text-[14px] leading-4.5 font-bold text-[#333]">
                        {account.name}
                      </span>
                      <span className="block text-[12px] leading-4.5 text-[#796e65]">
                        User ID: {account.userId}
                      </span>
                    </div>
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <div className="p-5">
            <a
              href="#"
              className="flex w-full items-center justify-center rounded-xs border border-[#ccc] py-1.75 text-[#333] hover:bg-[#f5f5f5]"
            >
              <img src="/logout-e.png" alt="" className="mr-1.25 w-6" />
              <span className="mr-5">Logout of Enverus</span>
            </a>
          </div>
        </div>

        <div className="py-12.5 pl-16">
          <ul className="flex text-[16px] text-[#666]">
            <li className="border-r border-[#666] pr-11.5">© 2026 ENVERUS</li>
            <li className="pl-12">
              <a
                href="https://www.enverus.com/privacy-policy/"
                target="_blank"
                className="text-[#666] hover:underline"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
