// Business Associate (partner/WIO) records shown on the Operated BA page.
// Reached by clicking a partner/owner name in the Op Search table.
// ponytail: only ZTEST-V and ZTEST-DD are real captures; the rest are mock BA
// records whose codes / BA numbers / types stay consistent with the Op Search
// table rows.

export interface PartnerInfo {
  code: string;
  name: string; // display form, e.g. "ZTEST - ZTEST-V"
  myBa: string;
  partnerType: "BSP" | "FSP";
  address: string[]; // EnergyLink address, one line per entry
  phone: string;
  fax: string;
  tin: string;
  defaultContact: string; // email
  lastUpdateUser: string;
  lastUpdateDate: string;
}

export const PARTNER_TYPE_LABEL: Record<PartnerInfo["partnerType"], string> = {
  BSP: "Basic Service Partner",
  FSP: "Full Service Partner",
};

// Contacts assignable as "My Assigned JIB Contact" (from the reference capture).
export const JIB_CONTACTS = [
  "ATESTER, CRISLYNE",
  "B, Clyde",
  "Langin, Alicia",
  "Rao, Yashoda",
  "Shefferly, Brian",
  "shefferly, Brian",
  "TEST, TEST",
  "TEST, YASH",
];

// The logged-in operator, so the [Me] picker can select themselves.
export const ME_CONTACT = "B, Clyde";

export const PARTNERS: Record<string, PartnerInfo> = {
  "ZTEST-V": {
    code: "ZTEST-V",
    name: "ZTEST - ZTEST-V",
    myBa: "820255",
    partnerType: "BSP",
    address: ["2000, 400 - 3 AVENUE S.W.", "CALGARY AB T2P 4H2", "UKN, BC   A1A 1A1", "CANADA"],
    phone: "",
    fax: "",
    tin: "",
    defaultContact: "test@siriusminds.com",
    lastUpdateUser: "Shefferly, Brian",
    lastUpdateDate: "2024-12-16 8:43:23 PM",
  },
  "ZTEST-I": {
    code: "ZTEST-I",
    name: "ZTEST - ZTEST-I",
    myBa: "100477",
    partnerType: "BSP",
    address: ["4500 MAIN STREET, SUITE 200", "HOUSTON TX 77002", "UNITED STATES"],
    phone: "(713) 555-1234",
    fax: "",
    tin: "12-3456789",
    defaultContact: "billing@ztest-i.com",
    lastUpdateUser: "Langin, Alicia",
    lastUpdateDate: "2025-02-04 10:12:47 AM",
  },
  "ZTEST-DD": {
    code: "ZTEST-DD",
    name: "ZTEST - ZTEST-DD",
    myBa: "2436687",
    partnerType: "FSP",
    address: ["444-5TH STREET SW", "CALGARY, AB   T2P 2Q2", "CANADA"],
    phone: "(403) 555-5555",
    fax: "",
    tin: "",
    defaultContact: "test@siriusminds.com",
    lastUpdateUser: "Shefferly, Brian",
    lastUpdateDate: "2024-12-16 8:43:23 PM",
  },
  "ZTEST-5": {
    code: "ZTEST-5",
    name: "ZTEST - ZTEST-5",
    myBa: "155555",
    partnerType: "BSP",
    address: ["800 MARIENFELD STREET", "MIDLAND TX 79701", "UNITED STATES"],
    phone: "",
    fax: "",
    tin: "",
    defaultContact: "accounts@ztest5.com",
    lastUpdateUser: "TEST, YASH",
    lastUpdateDate: "2025-01-22 9:04:11 AM",
  },
  "ZTEST-P": {
    code: "ZTEST-P",
    name: "ZTEST - ZTEST-P",
    myBa: "100409",
    partnerType: "BSP",
    address: ["2100 ROSS AVENUE, FLOOR 15", "DALLAS TX 75201", "UNITED STATES"],
    phone: "(214) 555-9876",
    fax: "",
    tin: "",
    defaultContact: "ar@ztest-p.com",
    lastUpdateUser: "Shefferly, Brian",
    lastUpdateDate: "2024-11-30 1:47:52 PM",
  },
  "ZTEST-Z": {
    code: "ZTEST-Z",
    name: "ZTEST - ZTEST-Z",
    myBa: "100409",
    partnerType: "FSP",
    address: ["300 CONVENT STREET, SUITE 1400", "SAN ANTONIO TX 78205", "UNITED STATES"],
    phone: "",
    fax: "",
    tin: "",
    defaultContact: "ap@ztest-z.com",
    lastUpdateUser: "ATESTER, CRISLYNE",
    lastUpdateDate: "2025-03-15 4:33:19 PM",
  },
};

/** Look up a partner by code; falls back to the ZTEST-V reference record. */
export function getPartner(code?: string): PartnerInfo {
  return (code && PARTNERS[code]) || PARTNERS["ZTEST-V"];
}
