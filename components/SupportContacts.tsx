import type { ReactNode } from "react";

function ContactColumn({
  header,
  children,
}: {
  header: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="text-[16px] font-bold text-alternative">
        {header}
      </h3>
      {children}
    </div>
  );
}

function ContactIcon({ icon }: { icon: string }) {
  return (
    <i className={`fe ${icon} pr-2.5 align-middle text-[18px] text-text-secondary`} />
  );
}

export default function SupportContacts() {
  return (
    <>
      <div className="text-alternative">For immediate assistance...</div>
      <div className="flex w-full flex-wrap gap-x-20 gap-y-6">
        <ContactColumn header="SUPPORT DESK HOURS">
          <div>Monday - Friday, 8 AM - 5 PM</div>
          <div>Central Standard Time</div>
        </ContactColumn>
        <ContactColumn header="APPLICATION SUPPORT">
          <a href="tel:1-888-573-3364">
            <ContactIcon icon="fe-phone" />
            1-888-573-3364
          </a>
          <a href="mailto:support@energylink.com">
            <ContactIcon icon="fe-envelope-alt" />
            support@energylink.com
          </a>
        </ContactColumn>
        <ContactColumn header="BILLING SUPPORT">
          <a href="tel:1-512-566-4680">
            <ContactIcon icon="fe-phone" />
            1-512-566-4680
          </a>
          <a href="mailto:accountsreceivable@enverus.com">
            <ContactIcon icon="fe-envelope-alt" />
            accountsreceivable@enverus.com
          </a>
        </ContactColumn>
      </div>
    </>
  );
}
