// WIO onboarding rules carried over verbatim from bison-jib-web-flow
// (operator verification schemas + onboarding constants). Messages must match.

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ALLOWED_CHARS = /^[a-zA-Z0-9 .,'&#/()!@+:;-]*$/;
export const CHAR_ERROR =
  "Contains characters not allowed by our payment provider. Use only letters, numbers, spaces, and common punctuation (. , ' - & # / !)";

export const PO_BOX_REGEX =
  /^\s*(?:p\.?\s*o\.?\s*b(?:ox)?|post\s+office\s+box)\s*\d*/i;
export const PO_BOX_ERROR =
  "P.O. Box addresses are not permitted. Please provide a physical street address.";

export const BUSINESS_ADDRESS_UNAVAILABLE_ERROR =
  "Please complete the Business Information address before saving a personal address.";
export const ADDRESS_MATCH_ERROR =
  "Must use a personal address, not the business address";

export const BUSINESS_TYPES = [
  { value: "llc", label: "LLC" },
  { value: "partnership", label: "Partnership" },
  { value: "publicCorporation", label: "Public corporation" },
  { value: "soleProprietorship", label: "Sole proprietorship" },
  { value: "trust", label: "Trust" },
  { value: "privateCorporation", label: "Private corporation" },
  { value: "unincorporatedAssociation", label: "Unincorporated association" },
  { value: "unincorporatedNonProfit", label: "Unincorporated non-profit" },
  { value: "incorporatedNonProfit", label: "Incorporated non-profit" },
  { value: "governmentEntity", label: "Government entity" },
] as const;

// ponytail: static industry list; source app loads Moov industries + MCC codes from API
export const INDUSTRY_CATEGORIES = [
  { value: "oil_gas_extraction", label: "Oil & Gas Extraction" },
  { value: "mining", label: "Mining & Quarrying" },
  { value: "energy", label: "Energy & Utilities" },
  { value: "petroleum_refining", label: "Petroleum & Coal Products" },
  { value: "pipeline_transportation", label: "Pipeline Transportation" },
  { value: "natural_gas_distribution", label: "Natural Gas Distribution" },
  { value: "support_activities_mining", label: "Support Activities for Mining" },
  { value: "construction", label: "Construction" },
  { value: "real_estate", label: "Real Estate" },
  { value: "professional_services", label: "Professional, Scientific & Technical Services" },
  { value: "finance_insurance", label: "Finance & Insurance" },
  { value: "other", label: "Other" },
] as const;

export const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
  { value: "DC", label: "District Of Columbia" }, { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" }, { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" }, { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" }, { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" }, { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" }, { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" }, { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" }, { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" }, { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" }, { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" }, { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" }, { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" }, { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" }, { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" }, { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" }, { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" }, { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" }, { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" }, { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" }, { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" }, { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export const US_TERRITORIES = [
  { value: "AS", label: "American Samoa" }, { value: "GU", label: "Guam" },
  { value: "MH", label: "Marshall Islands" }, { value: "MP", label: "Northern Mariana Islands" },
  { value: "PR", label: "Puerto Rico" }, { value: "UM", label: "United States Minor Outlying Islands" },
  { value: "VI", label: "Virgin Islands" },
];

export const ACCEPTED_EXTENSIONS = ".pdf,.csv,.jpg,.jpeg,.png";
export const ACCEPTED_TYPES = ["application/pdf", "text/csv", "image/jpeg", "image/png"];
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// ---------------------------------------------------------------------------
// Formatters (input masks)
// ---------------------------------------------------------------------------

export const digitsOnly = (v: string) => v.replace(/\D/g, "");

export function formatPhone(value: string): string {
  const digits = digitsOnly(value).slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function formatEIN(value: string): string {
  const digits = digitsOnly(value).slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

export function formatSSN(value: string): string {
  const digits = digitsOnly(value).slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function formatZip(value: string): string {
  return digitsOnly(value).slice(0, 5);
}

export function formatCurrency(value: string): string {
  return digitsOnly(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Rule engine — mirrors the zod schemas as ordered rule lists
// ---------------------------------------------------------------------------

export type Rule = (v: string) => string | null;
export type Schema = Record<string, Rule[]>;
export type Errors = Record<string, string>;

const req: Rule = (v) => (v.trim() ? null : "Required");
const maxLen = (n: number): Rule => (v) =>
  v.length <= n ? null : `Must be ${n} characters or less`;
const chars: Rule = (v) => (ALLOWED_CHARS.test(v) ? null : CHAR_ERROR);
const emailRule: Rule = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Invalid email address";
const phone10: Rule = (v) =>
  digitsOnly(v).length === 10 ? null : "Must be 10 digits";
const zip5: Rule = (v) => (digitsOnly(v).length === 5 ? null : "Must be 5 digits");
const einRule: Rule = (v) =>
  /^\d{2}-\d{7}$/.test(v.trim()) ? null : "Must be in format XX-XXXXXXX";
const ssnRule: Rule = (v) =>
  /^\d{3}-\d{2}-\d{4}$/.test(v.trim()) ? null : "Must be in format XXX-XX-XXXX";
const noPoBox: Rule = (v) => (PO_BOX_REGEX.test(v.trim()) ? PO_BOX_ERROR : null);
const adult18: Rule = (v) => {
  const dob = new Date(v);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
  return actualAge >= 18 ? null : "Must be at least 18 years old";
};
const urlRule: Rule = (v) => {
  try {
    const url = new URL(v);
    return ["http:", "https:"].includes(url.protocol)
      ? null
      : "Must be a valid URL (http:// or https://) or left empty";
  } catch {
    return "Must be a valid URL (http:// or https://) or left empty";
  }
};
const positiveWhole: Rule = (v) => {
  const digits = digitsOnly(v);
  return digits.length > 0 && parseInt(digits, 10) > 0
    ? null
    : "Must be a positive whole number";
};

/** Optional field: rules only run when a value is present. */
const opt = (...rules: Rule[]): Rule[] => [
  (v) => {
    if (!v) return null;
    for (const rule of rules) {
      const err = rule(v);
      if (err) return err;
    }
    return null;
  },
];

export function validateFormRules(schema: Schema, form: Record<string, string>): Errors {
  const errors: Errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const err = rule(form[field] ?? "");
      if (err) {
        errors[field] = err;
        break;
      }
    }
  }
  return errors;
}

/** Blur validation: skip empty fields (user hasn't filled them yet). */
export function validateFieldRules(
  schema: Schema,
  form: Record<string, string>,
  field: string,
): string | null {
  const value = form[field];
  if (!value) return null;
  for (const rule of schema[field] ?? []) {
    const err = rule(value);
    if (err) return err;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Section schemas
// ---------------------------------------------------------------------------

export const businessSchema: Schema = {
  legalBusinessName: [req, maxLen(64), chars],
  doingBusinessAs: opt(maxLen(64), chars),
  ein: [req, einRule],
  businessType: [req],
  industry: [req],
  description: [
    (v) => (v.trim().length >= 10 ? null : "Must be at least 10 characters"),
    maxLen(100),
  ],
  website: opt(urlRule),
  phone: [req, phone10],
  email: [req, emailRule],
  addressLine1: [req, maxLen(60), chars, noPoBox],
  addressLine2: opt(maxLen(60), chars),
  city: [req, maxLen(32), chars],
  state: [req],
  country: [
    (v) => (v.trim() ? null : "Country is required."),
    (v) => (v === "US" ? null : "Country must be United States (US)."),
  ],
  zipCode: [req, zip5],
};

export const officerSchema: Schema = {
  firstName: [req, maxLen(64), chars],
  lastName: [req, maxLen(64), chars],
  title: [req, maxLen(64), chars],
  email: [req, emailRule],
  phone: [req, phone10],
  dateOfBirth: [req, adult18],
  ssn: [req, ssnRule],
  addressLine1: [req, maxLen(60), chars, noPoBox],
  city: [req, maxLen(32), chars],
  state: [req],
  postalCode: [req, zip5],
};

export const ownerSchema: Schema = {
  firstName: [req, maxLen(64), chars],
  lastName: [req, maxLen(64), chars],
  email: [req, emailRule],
  phone: [req, phone10],
  dateOfBirth: [req, adult18],
  ssn: [req, ssnRule],
  ownershipPercentage: [
    req,
    (v) => {
      const num = Number(v.trim());
      return !isNaN(num) && Number.isInteger(num) && num >= 25 && num <= 100
        ? null
        : "Must be a whole number between 25 and 100";
    },
  ],
  addressLine1: [req, maxLen(60), chars, noPoBox],
  city: [req, maxLen(32), chars],
  state: [req],
  postalCode: [req, zip5],
};

export const volumeSchema: Schema = {
  averageMonthlyVolume: [req, positiveWhole],
  averageTransactionAmount: [req, positiveWhole],
  maxTransactionAmount: [req, positiveWhole],
};

/** Volume validation incl. the max >= avg cross-field check. */
export function validateVolume(form: Record<string, string>): Errors {
  const errors = validateFormRules(volumeSchema, form);
  const max = parseInt(digitsOnly(form.maxTransactionAmount), 10);
  const avg = parseInt(digitsOnly(form.averageTransactionAmount), 10);
  if (
    !errors.maxTransactionAmount &&
    !errors.averageTransactionAmount &&
    !isNaN(max) &&
    !isNaN(avg) &&
    max < avg
  ) {
    errors.maxTransactionAmount =
      "Must be greater than or equal to average transaction amount";
    errors.averageTransactionAmount = "Cannot exceed maximum transaction amount";
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Cross-form checks
// ---------------------------------------------------------------------------

const normalize = (v: string) => v.trim().toLowerCase().replace(/\s+/g, " ");
const normalizeZip = (v: string) => digitsOnly(v).slice(0, 5);

export interface BusinessAddress {
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
}

export function hasCompleteBusinessAddress(a: BusinessAddress): boolean {
  return Boolean(a.addressLine1.trim() && a.city.trim() && a.state.trim() && a.zipCode.trim());
}

/** True when a person's (officer/owner) address matches the business address. */
export function addressMatchesBusiness(
  person: { addressLine1: string; city: string; state: string; postalCode: string },
  business: BusinessAddress,
): boolean {
  if (!person.addressLine1 && !person.city && !person.state && !person.postalCode) {
    return false;
  }
  return (
    normalize(person.addressLine1) === normalize(business.addressLine1) &&
    normalize(person.city) === normalize(business.city) &&
    normalize(person.state) === normalize(business.state) &&
    normalizeZip(person.postalCode) === normalizeZip(business.zipCode)
  );
}

export function validateOwnershipTotal(
  owners: { ownershipPercentage: string }[],
): string | null {
  const total = owners.reduce((sum, o) => {
    const pct = Number(o.ownershipPercentage);
    return sum + (isNaN(pct) ? 0 : pct);
  }, 0);
  if (total > 100) {
    return `Total ownership is ${total}%, which exceeds 100%. Please adjust.`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Self-check — run: node components/onboardingValidation.ts
// ---------------------------------------------------------------------------

if (typeof process !== "undefined" && process.argv?.[1]?.includes("onboardingValidation")) {
  const assert = (cond: boolean, msg: string) => {
    if (!cond) throw new Error(`FAIL: ${msg}`);
  };

  const validBusiness = {
    legalBusinessName: "Acme Oil & Gas, LLC",
    doingBusinessAs: "",
    ein: "12-3456789",
    businessType: "llc",
    industry: "oil_gas_extraction",
    description: "We operate oil and gas wells.",
    website: "https://acme.example.com",
    phone: "(555) 123-4567",
    email: "billing@acme.com",
    addressLine1: "100 Main St",
    addressLine2: "",
    city: "Houston",
    state: "TX",
    country: "US",
    zipCode: "77001",
  };
  assert(Object.keys(validateFormRules(businessSchema, validBusiness)).length === 0, "valid business passes");
  assert(validateFormRules(businessSchema, { ...validBusiness, addressLine1: "PO Box 12" }).addressLine1 === PO_BOX_ERROR, "PO box rejected");
  assert(validateFormRules(businessSchema, { ...validBusiness, ein: "123456789" }).ein === "Must be in format XX-XXXXXXX", "EIN format");
  assert(validateFormRules(businessSchema, { ...validBusiness, legalBusinessName: "Acme™" }).legalBusinessName === CHAR_ERROR, "disallowed chars");
  assert(validateFormRules(businessSchema, { ...validBusiness, country: "CA" }).country === "Country must be United States (US).", "non-US country");
  assert(validateFormRules(businessSchema, { ...validBusiness, description: "too short" }).description === "Must be at least 10 characters", "description min");

  const seventeenYearsAgo = new Date();
  seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17);
  const officer = {
    firstName: "Jane", lastName: "Doe", title: "CEO", email: "jane@acme.com",
    phone: "(555) 123-4567", dateOfBirth: "1990-06-15", ssn: "123-45-6789",
    addressLine1: "200 Oak Ave", city: "Houston", state: "TX", postalCode: "77002",
  };
  assert(Object.keys(validateFormRules(officerSchema, officer)).length === 0, "valid officer passes");
  assert(
    validateFormRules(officerSchema, { ...officer, dateOfBirth: seventeenYearsAgo.toISOString().slice(0, 10) }).dateOfBirth === "Must be at least 18 years old",
    "under-18 rejected",
  );

  assert(
    validateFormRules(ownerSchema, { ...officer, ownershipPercentage: "24" }).ownershipPercentage === "Must be a whole number between 25 and 100",
    "ownership below 25 rejected",
  );
  assert(!validateFormRules(ownerSchema, { ...officer, ownershipPercentage: "25" }).ownershipPercentage, "ownership 25 ok");

  const volErrors = validateVolume({
    averageMonthlyVolume: "50,000",
    averageTransactionAmount: "10,000",
    maxTransactionAmount: "5,000",
  });
  assert(volErrors.maxTransactionAmount === "Must be greater than or equal to average transaction amount", "max < avg flagged on max");
  assert(volErrors.averageTransactionAmount === "Cannot exceed maximum transaction amount", "max < avg flagged on avg");

  assert(validateOwnershipTotal([{ ownershipPercentage: "60" }, { ownershipPercentage: "60" }]) !== null, "ownership > 100 flagged");
  assert(validateOwnershipTotal([{ ownershipPercentage: "50" }, { ownershipPercentage: "50" }]) === null, "ownership = 100 ok");

  assert(
    addressMatchesBusiness(
      { addressLine1: " 100  main st ", city: "HOUSTON", state: "tx", postalCode: "77001-1234" },
      { addressLine1: "100 Main St", city: "Houston", state: "TX", zipCode: "77001" },
    ),
    "address match normalizes case/whitespace/zip",
  );

  console.log("onboardingValidation self-check: all assertions passed");
}
