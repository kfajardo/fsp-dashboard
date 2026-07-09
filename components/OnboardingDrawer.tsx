"use client";

import { useEffect, useState, type ReactNode } from "react";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_TYPES,
  ADDRESS_MATCH_ERROR,
  BUSINESS_ADDRESS_UNAVAILABLE_ERROR,
  BUSINESS_TYPES,
  INDUSTRY_CATEGORIES,
  MAX_FILE_SIZE,
  US_STATES,
  US_TERRITORIES,
  addressMatchesBusiness,
  businessSchema,
  formatCurrency,
  formatEIN,
  formatFileSize,
  formatPhone,
  formatSSN,
  formatZip,
  hasCompleteBusinessAddress,
  officerSchema,
  ownerSchema,
  validateFieldRules,
  validateFormRules,
  validateOwnershipTotal,
  validateVolume,
  type BusinessAddress,
  type Errors,
  type Schema,
} from "@/components/onboardingValidation";

// ---------------------------------------------------------------------------
// Shared UI bits (EnergyLink design language)
// ---------------------------------------------------------------------------

const controlCls = (error?: boolean) =>
  `w-full min-h-7.5 rounded-sm border bg-bg-primary px-2 text-[14px] text-text-primary outline-none focus:border-brand ${
    error ? "border-callout" : "border-border-secondary"
  }`;

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[14px] font-medium text-text-emphasis">
        {label}
        {required && <span className="ml-0.5 text-callout">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[12px] text-callout">{error}</p>}
      {hint && <p className="mt-1 text-[12px] text-text-secondary">{hint}</p>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  error,
  formatter,
  maxLength,
  max,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "date";
  error?: boolean;
  formatter?: (v: string) => string;
  maxLength?: number;
  max?: string;
  autoComplete?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) =>
        onChange(formatter ? formatter(e.target.value) : e.target.value)
      }
      onBlur={onBlur}
      placeholder={placeholder}
      maxLength={maxLength}
      max={max}
      autoComplete={autoComplete}
      className={`${controlCls(error)} placeholder:text-text-tertiary`}
    />
  );
}

function Select({
  value,
  onChange,
  options,
  groups,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options?: readonly { value: string; label: string }[];
  groups?: readonly {
    group: string;
    options: readonly { value: string; label: string }[];
  }[];
  placeholder?: string;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlCls(error)} cursor-pointer appearance-none pr-7 ${
          !value ? "text-text-secondary" : ""
        }`}>
        <option value="">{placeholder ?? "Select..."}</option>
        {groups
          ? groups.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))
          : options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
      </select>
      <i className="fas fa-caret-down pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-text-secondary" />
    </div>
  );
}

function CurrencyInput({
  value,
  onChange,
  onBlur,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <span
        className={`pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-[14px] ${
          error ? "text-callout" : "text-text-secondary"
        }`}>
        $
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(formatCurrency(e.target.value))}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${controlCls(error)} pl-6 placeholder:text-text-tertiary`}
      />
    </div>
  );
}

function WarningBanner({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-sm border border-callout/30 bg-callout/10 px-3 py-2.5 text-[13px] text-text-primary">
      {children}
    </div>
  );
}

const US_STATES_AND_TERRITORIES = [
  { group: "States", options: US_STATES },
  { group: "US Outlying Territories", options: US_TERRITORIES },
];

const COUNTRY_OPTIONS = [{ value: "US", label: "United States" }];

const TWO_COL = "grid grid-cols-1 gap-4 sm:grid-cols-2";

// ---------------------------------------------------------------------------
// Auto fill demo data — every value passes the section validations
// (officer/owner addresses intentionally differ from the business address)
// ---------------------------------------------------------------------------

// Exported for the partial-onboarding drawer's Auto fill (OperatedBA).
export const DEMO = {
  business: {
    legalBusinessName: "Acme Oil & Gas, LLC",
    doingBusinessAs: "Acme Energy",
    ein: "12-3456789",
    businessType: "llc",
    industry: "oil_gas_extraction",
    description: "We operate oil and gas wells across Texas.",
    website: "https://acme.example.com",
    phone: "(555) 123-4567",
    email: "billing@acme.com",
    addressLine1: "100 Main St",
    addressLine2: "Suite 400",
    city: "Houston",
    state: "TX",
    country: "US",
    zipCode: "77001",
  },
  officer: {
    firstName: "Jane",
    lastName: "Doe",
    title: "CEO",
    email: "jane.doe@acme.com",
    phone: "(555) 987-6543",
    dateOfBirth: "1985-06-15",
    ssn: "123-45-6789",
    addressLine1: "200 Oak Ave",
    city: "Houston",
    state: "TX",
    postalCode: "77002",
  },
  owner: {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@acme.com",
    phone: "(555) 456-7890",
    dateOfBirth: "1978-03-22",
    ssn: "987-65-4321",
    ownershipPercentage: "40",
    addressLine1: "300 Pine Ln",
    city: "Austin",
    state: "TX",
    postalCode: "78701",
  },
  volume: {
    averageMonthlyVolume: "250,000",
    averageTransactionAmount: "5,000",
    maxTransactionAmount: "25,000",
  },
};

// ---------------------------------------------------------------------------
// Per-section form state hook
// ---------------------------------------------------------------------------

function useSectionForm<T extends Record<string, string>>(
  initial: T,
  schema: Schema,
) {
  const [form, setForm] = useState<Record<string, string>>(initial);
  const [errors, setErrors] = useState<Errors>({});

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const blur = (field: string) => {
    setForm((current) => {
      const err = validateFieldRules(schema, current, field);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next[field] = err;
        else delete next[field];
        return next;
      });
      return current;
    });
  };

  return { form, errors, setErrors, update, blur };
}

// ---------------------------------------------------------------------------
// Section: Business Information
// ---------------------------------------------------------------------------

// Business details a WIO captured while partially onboarding the operator —
// the operator's own full onboarding starts from these instead of blank.
function loadPartialBusiness(): Record<string, string> | null {
  try {
    return JSON.parse(sessionStorage.getItem("operator-partial-business")!);
  } catch {
    return null;
  }
}

// Also reused by the WIO's partial operator onboarding (OperatedBA), which
// replaces the checkbox with agree-by-continuing wording at its own submit —
// hideTos drops the Terms of Service block and its Save gating. onSaved
// receives the whole form so the partial flow can persist it for later.
export function BusinessSection({
  prefilled,
  onSaved,
  hideTos = false,
}: {
  prefilled: boolean;
  onSaved: (address: BusinessAddress, form: Record<string, string>) => void;
  hideTos?: boolean;
}) {
  const { form, errors, setErrors, update, blur } = useSectionForm(
    prefilled
      ? { ...DEMO.business }
      : loadPartialBusiness() ?? {
          legalBusinessName: "",
          doingBusinessAs: "",
          ein: "",
          businessType: "",
          industry: "",
          description: "",
          website: "",
          phone: "",
          email: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          country: "US",
          zipCode: "",
        },
    businessSchema,
  );
  const [tosChecked, setTosChecked] = useState(prefilled || hideTos);

  const handleSave = () => {
    const errs = validateFormRules(businessSchema, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSaved(
      {
        addressLine1: form.addressLine1,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
      },
      form,
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-text-secondary">
        Enter your business details. This information is required by our payment
        processing partner.
      </p>

      <div className={TWO_COL}>
        <Field
          label="Legal Business Name"
          required
          error={errors.legalBusinessName}>
          <TextInput
            value={form.legalBusinessName}
            onChange={(v) => update("legalBusinessName", v)}
            onBlur={() => blur("legalBusinessName")}
            placeholder="Legal business name"
            error={!!errors.legalBusinessName}
          />
        </Field>
        <Field label="Doing Business As (DBA)" error={errors.doingBusinessAs}>
          <TextInput
            value={form.doingBusinessAs}
            onChange={(v) => update("doingBusinessAs", v)}
            onBlur={() => blur("doingBusinessAs")}
            placeholder="DBA (optional)"
            error={!!errors.doingBusinessAs}
          />
        </Field>
      </div>

      <div className={TWO_COL}>
        <Field label="EIN" required error={errors.ein}>
          <TextInput
            value={form.ein}
            onChange={(v) => update("ein", v)}
            onBlur={() => blur("ein")}
            placeholder="XX-XXXXXXX"
            error={!!errors.ein}
            formatter={formatEIN}
            maxLength={10}
          />
        </Field>
        <Field label="Business Type" required error={errors.businessType}>
          <Select
            value={form.businessType}
            onChange={(v) => update("businessType", v)}
            options={BUSINESS_TYPES}
            placeholder="Select business type"
            error={!!errors.businessType}
          />
        </Field>
      </div>

      <Field label="Industry" required error={errors.industry}>
        <Select
          value={form.industry}
          onChange={(v) => update("industry", v)}
          options={INDUSTRY_CATEGORIES}
          placeholder="Select industry"
          error={!!errors.industry}
        />
      </Field>

      <Field label="Business Description" required error={errors.description}>
        <textarea
          value={form.description}
          onChange={(e) => {
            if (e.target.value.length <= 100)
              update("description", e.target.value);
          }}
          onBlur={() => blur("description")}
          placeholder="Brief description of your business activities"
          maxLength={100}
          rows={2}
          className={`${controlCls(!!errors.description)} resize-none py-1.5 placeholder:text-text-tertiary`}
        />
        <div className="flex justify-end">
          <span
            className={`text-[12px] ${form.description.length > 0 && form.description.length < 10 ? "font-medium text-callout" : "text-text-secondary"}`}>
            {form.description.length}/100
          </span>
        </div>
      </Field>

      <Field label="Website" error={errors.website}>
        <TextInput
          value={form.website}
          onChange={(v) => update("website", v)}
          onBlur={() => blur("website")}
          placeholder="https://www.example.com (optional)"
          error={!!errors.website}
        />
      </Field>

      <div className={TWO_COL}>
        <Field label="Business Phone" required error={errors.phone}>
          <TextInput
            value={form.phone}
            onChange={(v) => update("phone", v)}
            onBlur={() => blur("phone")}
            placeholder="(555) 123-4567"
            type="tel"
            error={!!errors.phone}
            formatter={formatPhone}
            maxLength={14}
          />
        </Field>
        <Field label="Business Email" required error={errors.email}>
          <TextInput
            value={form.email}
            onChange={(v) => update("email", v)}
            onBlur={() => blur("email")}
            placeholder="billing@company.com"
            type="email"
            error={!!errors.email}
          />
        </Field>
      </div>

      <WarningBanner>
        Provide the physical location where your business conducts daily
        operations. P.O. boxes and registered agent addresses are not permitted.
      </WarningBanner>

      <Field label="Street Address" required error={errors.addressLine1}>
        <TextInput
          value={form.addressLine1}
          onChange={(v) => update("addressLine1", v)}
          onBlur={() => blur("addressLine1")}
          placeholder="Street address"
          error={!!errors.addressLine1}
        />
      </Field>

      <Field label="Street Address 2" error={errors.addressLine2}>
        <TextInput
          value={form.addressLine2}
          onChange={(v) => update("addressLine2", v)}
          onBlur={() => blur("addressLine2")}
          placeholder="Suite, floor, unit (optional)"
          error={!!errors.addressLine2}
        />
      </Field>

      <div className={TWO_COL}>
        <Field label="City" required error={errors.city}>
          <TextInput
            value={form.city}
            onChange={(v) => update("city", v)}
            onBlur={() => blur("city")}
            placeholder="City"
            error={!!errors.city}
          />
        </Field>
        <Field label="State" required error={errors.state}>
          <Select
            value={form.state}
            onChange={(v) => update("state", v)}
            groups={US_STATES_AND_TERRITORIES}
            placeholder="Select state"
            error={!!errors.state}
          />
        </Field>
      </div>

      <div className={TWO_COL}>
        <Field label="ZIP Code" required error={errors.zipCode}>
          <TextInput
            value={form.zipCode}
            onChange={(v) => update("zipCode", v)}
            onBlur={() => blur("zipCode")}
            placeholder="ZIP code"
            error={!!errors.zipCode}
            formatter={formatZip}
            maxLength={5}
          />
        </Field>
        <Field label="Country" required error={errors.country}>
          <Select
            value={form.country}
            onChange={(v) => update("country", v)}
            options={COUNTRY_OPTIONS}
            placeholder="Select country"
            error={!!errors.country}
          />
        </Field>
      </div>

      {!hideTos && (
        <div>
          <p className="mb-1 text-[14px] font-medium text-text-emphasis">
            Terms of Service <span className="text-callout">*</span>
          </p>
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={tosChecked}
              onChange={(e) => setTosChecked(e.target.checked)}
              className="h-4 w-4 shrink-0 cursor-pointer accent-brand"
            />
            <span className="text-[13px] text-text-primary">
              I have read and accept the Terms of Service
            </span>
          </label>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          disabled={!tosChecked}
          onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section: Control Officer
// ---------------------------------------------------------------------------

const PERSONAL_ADDRESS_HINT =
  "Must be a personal/residential address. P.O. boxes and business addresses are not permitted.";

function OfficerSection({
  businessAddress,
  prefilled,
  onSaved,
}: {
  businessAddress: BusinessAddress | null;
  prefilled: boolean;
  onSaved: () => void;
}) {
  const { form, errors, setErrors, update, blur } = useSectionForm(
    prefilled
      ? { ...DEMO.officer }
      : {
          firstName: "",
          lastName: "",
          title: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          ssn: "",
          addressLine1: "",
          city: "",
          state: "",
          postalCode: "",
        },
    officerSchema,
  );
  const today = new Date().toISOString().slice(0, 10);

  const handleSave = () => {
    const errs = validateFormRules(officerSchema, form);
    if (!errs.addressLine1) {
      if (!businessAddress || !hasCompleteBusinessAddress(businessAddress)) {
        errs.addressLine1 = BUSINESS_ADDRESS_UNAVAILABLE_ERROR;
      } else if (
        addressMatchesBusiness(
          {
            addressLine1: form.addressLine1,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
          },
          businessAddress,
        )
      ) {
        errs.addressLine1 = ADDRESS_MATCH_ERROR;
      }
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSaved();
  };

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-text-secondary">
        Enter the details for the authorized representative who has significant
        management responsibility for the business.
      </p>

      <div className={TWO_COL}>
        <Field label="First Name" required error={errors.firstName}>
          <TextInput
            value={form.firstName}
            onChange={(v) => update("firstName", v)}
            onBlur={() => blur("firstName")}
            placeholder="First name"
            error={!!errors.firstName}
          />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <TextInput
            value={form.lastName}
            onChange={(v) => update("lastName", v)}
            onBlur={() => blur("lastName")}
            placeholder="Last name"
            error={!!errors.lastName}
          />
        </Field>
      </div>

      <div className={TWO_COL}>
        <Field label="Job Title" required error={errors.title}>
          <TextInput
            value={form.title}
            onChange={(v) => update("title", v)}
            onBlur={() => blur("title")}
            placeholder="CEO, CFO, etc."
            error={!!errors.title}
          />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput
            value={form.email}
            onChange={(v) => update("email", v)}
            onBlur={() => blur("email")}
            placeholder="officer@company.com"
            type="email"
            error={!!errors.email}
          />
        </Field>
      </div>

      <div className={TWO_COL}>
        <Field label="Phone" required error={errors.phone}>
          <TextInput
            value={form.phone}
            onChange={(v) => update("phone", v)}
            onBlur={() => blur("phone")}
            placeholder="(555) 123-4567"
            type="tel"
            error={!!errors.phone}
            formatter={formatPhone}
            maxLength={14}
          />
        </Field>
        <Field label="Date of Birth" required error={errors.dateOfBirth}>
          <TextInput
            value={form.dateOfBirth}
            onChange={(v) => update("dateOfBirth", v)}
            onBlur={() => blur("dateOfBirth")}
            type="date"
            max={today}
            error={!!errors.dateOfBirth}
          />
        </Field>
      </div>

      <Field
        label="SSN"
        required
        error={errors.ssn}
        hint="Required for identity verification. Encrypted and securely stored.">
        <TextInput
          value={form.ssn}
          onChange={(v) => update("ssn", v)}
          onBlur={() => blur("ssn")}
          placeholder="XXX-XX-XXXX"
          error={!!errors.ssn}
          formatter={formatSSN}
          maxLength={11}
          autoComplete="new-password"
        />
      </Field>

      <WarningBanner>
        Control officers must use a personal/residential address. P.O. boxes and
        business addresses are not permitted.
      </WarningBanner>

      <Field
        label="Home Address"
        required
        error={errors.addressLine1}
        hint={PERSONAL_ADDRESS_HINT}>
        <TextInput
          value={form.addressLine1}
          onChange={(v) => update("addressLine1", v)}
          onBlur={() => blur("addressLine1")}
          placeholder="Street address"
          error={!!errors.addressLine1}
        />
      </Field>

      <div className={TWO_COL}>
        <Field label="City" required error={errors.city}>
          <TextInput
            value={form.city}
            onChange={(v) => update("city", v)}
            onBlur={() => blur("city")}
            placeholder="Houston"
            error={!!errors.city}
          />
        </Field>
        <Field label="State" required error={errors.state}>
          <Select
            value={form.state}
            onChange={(v) => update("state", v)}
            groups={US_STATES_AND_TERRITORIES}
            placeholder="Select state"
            error={!!errors.state}
          />
        </Field>
      </div>

      <div className="sm:w-1/2 sm:pr-2">
        <Field label="ZIP Code" required error={errors.postalCode}>
          <TextInput
            value={form.postalCode}
            onChange={(v) => update("postalCode", v)}
            onBlur={() => blur("postalCode")}
            placeholder="77001"
            error={!!errors.postalCode}
            formatter={formatZip}
            maxLength={5}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section: Beneficial Owners
// ---------------------------------------------------------------------------

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  ownershipPercentage: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
}

const emptyOwner = (): Owner => ({
  id: crypto.randomUUID(),
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  ssn: "",
  ownershipPercentage: "25",
  addressLine1: "",
  city: "",
  state: "",
  postalCode: "",
});

function OwnerCard({
  owner,
  index,
  errors,
  isExpanded,
  onToggle,
  onRemove,
  onUpdate,
  onBlur,
}: {
  owner: Owner;
  index: number;
  errors: Errors;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (field: string, value: string) => void;
  onBlur: (field: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const name =
    `${owner.firstName} ${owner.lastName}`.trim() || `Owner ${index + 1}`;

  return (
    <div className="rounded-sm border border-border-tertiary">
      <div className="flex w-full items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-left">
          <i
            className={`fas fa-caret-down text-text-secondary ${isExpanded ? "" : "-rotate-90"}`}
          />
          <span className="text-[14px] font-medium text-text-emphasis">
            {name}
          </span>
          {owner.ownershipPercentage && (
            <span className="text-[12px] text-text-secondary">
              {owner.ownershipPercentage}% ownership
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-[12px] text-link hover:text-link-hover">
          Remove
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 border-t border-border-tertiary px-3 py-4">
          <div className={TWO_COL}>
            <Field label="First Name" required error={errors.firstName}>
              <TextInput
                value={owner.firstName}
                onChange={(v) => onUpdate("firstName", v)}
                onBlur={() => onBlur("firstName")}
                placeholder="First name"
                error={!!errors.firstName}
              />
            </Field>
            <Field label="Last Name" required error={errors.lastName}>
              <TextInput
                value={owner.lastName}
                onChange={(v) => onUpdate("lastName", v)}
                onBlur={() => onBlur("lastName")}
                placeholder="Last name"
                error={!!errors.lastName}
              />
            </Field>
          </div>

          <div className={TWO_COL}>
            <Field
              label="Ownership %"
              required
              error={errors.ownershipPercentage}
              hint="Whole number between 25 and 100">
              <TextInput
                value={owner.ownershipPercentage}
                onChange={(v) => onUpdate("ownershipPercentage", v)}
                onBlur={() => onBlur("ownershipPercentage")}
                placeholder="25"
                error={!!errors.ownershipPercentage}
                maxLength={3}
              />
            </Field>
            <Field label="Email" required error={errors.email}>
              <TextInput
                value={owner.email}
                onChange={(v) => onUpdate("email", v)}
                onBlur={() => onBlur("email")}
                placeholder="owner@company.com"
                type="email"
                error={!!errors.email}
              />
            </Field>
          </div>

          <div className={TWO_COL}>
            <Field label="Phone" required error={errors.phone}>
              <TextInput
                value={owner.phone}
                onChange={(v) => onUpdate("phone", v)}
                onBlur={() => onBlur("phone")}
                placeholder="(555) 123-4567"
                type="tel"
                error={!!errors.phone}
                formatter={formatPhone}
                maxLength={14}
              />
            </Field>
            <Field label="Date of Birth" required error={errors.dateOfBirth}>
              <TextInput
                value={owner.dateOfBirth}
                onChange={(v) => onUpdate("dateOfBirth", v)}
                onBlur={() => onBlur("dateOfBirth")}
                type="date"
                max={today}
                error={!!errors.dateOfBirth}
              />
            </Field>
          </div>

          <Field
            label="SSN"
            required
            error={errors.ssn}
            hint="Required for identity verification. Encrypted and securely stored.">
            <TextInput
              value={owner.ssn}
              onChange={(v) => onUpdate("ssn", v)}
              onBlur={() => onBlur("ssn")}
              placeholder="XXX-XX-XXXX"
              error={!!errors.ssn}
              formatter={formatSSN}
              maxLength={11}
              autoComplete="new-password"
            />
          </Field>

          <Field
            label="Home Address"
            required
            error={errors.addressLine1}
            hint={PERSONAL_ADDRESS_HINT}>
            <TextInput
              value={owner.addressLine1}
              onChange={(v) => onUpdate("addressLine1", v)}
              onBlur={() => onBlur("addressLine1")}
              placeholder="Street address"
              error={!!errors.addressLine1}
            />
          </Field>

          <div className={TWO_COL}>
            <Field label="City" required error={errors.city}>
              <TextInput
                value={owner.city}
                onChange={(v) => onUpdate("city", v)}
                onBlur={() => onBlur("city")}
                placeholder="Houston"
                error={!!errors.city}
              />
            </Field>
            <Field label="State" required error={errors.state}>
              <Select
                value={owner.state}
                onChange={(v) => onUpdate("state", v)}
                groups={US_STATES_AND_TERRITORIES}
                placeholder="Select state"
                error={!!errors.state}
              />
            </Field>
          </div>

          <div className="sm:w-1/2 sm:pr-2">
            <Field label="ZIP Code" required error={errors.postalCode}>
              <TextInput
                value={owner.postalCode}
                onChange={(v) => onUpdate("postalCode", v)}
                onBlur={() => onBlur("postalCode")}
                placeholder="77001"
                error={!!errors.postalCode}
                formatter={formatZip}
                maxLength={5}
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}

function OwnersSection({
  officerDone,
  businessAddress,
  prefilled,
  onSaved,
}: {
  officerDone: boolean;
  businessAddress: BusinessAddress | null;
  prefilled: boolean;
  onSaved: () => void;
}) {
  const [owners, setOwners] = useState<Owner[]>(
    prefilled ? [{ id: "demo-owner", ...DEMO.owner }] : [],
  );
  const [ownerErrors, setOwnerErrors] = useState<Record<string, Errors>>({});
  const [expandedOwnerId, setExpandedOwnerId] = useState<string | null>(null);
  const [noOwnersCertified, setNoOwnersCertified] = useState(false);
  const [certifyOwners, setCertifyOwners] = useState(prefilled);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const addOwner = () => {
    const owner = emptyOwner();
    setOwners((prev) => [...prev, owner]);
    setExpandedOwnerId(owner.id);
    setNoOwnersCertified(false);
  };

  const removeOwner = (id: string) => {
    setOwners((prev) => prev.filter((o) => o.id !== id));
    setOwnerErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setGlobalError(null);
  };

  const updateOwner = (id: string, field: string, value: string) => {
    setOwners((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
    );
    setOwnerErrors((prev) => {
      if (!prev[id]?.[field]) return prev;
      const next = { ...prev[id] };
      delete next[field];
      return { ...prev, [id]: next };
    });
    setGlobalError(null);
  };

  const blurOwner = (id: string, field: string) => {
    setOwners((current) => {
      const owner = current.find((o) => o.id === id);
      if (owner) {
        const err = validateFieldRules(
          ownerSchema,
          owner as unknown as Record<string, string>,
          field,
        );
        setOwnerErrors((prev) => {
          const next = { ...(prev[id] || {}) };
          if (err) next[field] = err;
          else delete next[field];
          return { ...prev, [id]: next };
        });
      }
      return current;
    });
  };

  const handleSave = () => {
    // Path B: certified no beneficial owners
    if (noOwnersCertified && owners.length === 0) {
      onSaved();
      return;
    }

    // Path A: validate all owners
    let hasErrors = false;
    const newErrors: Record<string, Errors> = {};
    for (const owner of owners) {
      const errs = validateFormRules(
        ownerSchema,
        owner as unknown as Record<string, string>,
      );
      if (!errs.addressLine1) {
        if (!businessAddress || !hasCompleteBusinessAddress(businessAddress)) {
          errs.addressLine1 = BUSINESS_ADDRESS_UNAVAILABLE_ERROR;
        } else if (
          addressMatchesBusiness(
            {
              addressLine1: owner.addressLine1,
              city: owner.city,
              state: owner.state,
              postalCode: owner.postalCode,
            },
            businessAddress,
          )
        ) {
          errs.addressLine1 = ADDRESS_MATCH_ERROR;
        }
      }
      if (Object.keys(errs).length > 0) {
        newErrors[owner.id] = errs;
        hasErrors = true;
      }
    }

    const totalErr = validateOwnershipTotal(owners);
    if (totalErr) {
      setGlobalError(totalErr);
      hasErrors = true;
    }

    if (hasErrors) {
      setOwnerErrors(newErrors);
      const firstWithError = owners.find((o) => newErrors[o.id]);
      if (firstWithError) setExpandedOwnerId(firstWithError.id);
      return;
    }

    setOwnerErrors({});
    setGlobalError(null);
    onSaved();
  };

  const total = owners.reduce(
    (sum, o) => sum + (Number(o.ownershipPercentage) || 0),
    0,
  );
  const saveDisabled =
    !officerDone ||
    (owners.length === 0 && !noOwnersCertified) ||
    (owners.length > 0 && !certifyOwners);

  return (
    <div className="space-y-4">
      {!officerDone && (
        <WarningBanner>
          <span className="font-medium">Control Officer Required</span>
          <br />
          At least one control officer (representative) is required before
          beneficial owners can be submitted. Please complete the Control
          Officer section first.
        </WarningBanner>
      )}

      <p className="text-[13px] text-text-secondary">
        List any individuals who own 25% or more of the business. If no
        individual owns 25% or more, certify below that none exist.
      </p>

      {globalError && (
        <div className="rounded-sm border border-callout/30 bg-callout/10 px-3 py-2.5 text-[13px] text-callout">
          {globalError}
        </div>
      )}

      {owners.map((owner, index) => (
        <OwnerCard
          key={owner.id}
          owner={owner}
          index={index}
          errors={ownerErrors[owner.id] || {}}
          isExpanded={expandedOwnerId === owner.id}
          onToggle={() =>
            setExpandedOwnerId((prev) => (prev === owner.id ? null : owner.id))
          }
          onRemove={() => removeOwner(owner.id)}
          onUpdate={(field, value) => updateOwner(owner.id, field, value)}
          onBlur={(field) => blurOwner(owner.id, field)}
        />
      ))}

      <button
        type="button"
        onClick={addOwner}
        disabled={noOwnersCertified && owners.length === 0}
        className="w-full rounded-sm border border-dashed border-brand py-1.5 text-[14px] font-medium text-brand hover:bg-brand-transparent disabled:pointer-events-none disabled:opacity-50">
        + Add Beneficial Owner
      </button>

      {owners.length > 1 && total > 0 && (
        <div
          className={`rounded-sm px-3 py-1.5 text-[12px] font-medium ${
            total > 100
              ? "bg-callout/10 text-callout"
              : "bg-bg-tertiary text-text-secondary"
          }`}>
          Total ownership: {total}%{total > 100 ? " — exceeds 100%" : ""}
        </div>
      )}

      {owners.length === 0 && (
        <label className="flex cursor-pointer items-start gap-2 select-none">
          <input
            type="checkbox"
            checked={noOwnersCertified}
            onChange={(e) => setNoOwnersCertified(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand"
          />
          <span className="text-[13px] text-text-primary">
            I certify that no individual owns 25% or more of this business.
          </span>
        </label>
      )}

      {owners.length > 0 && (
        <label className="flex cursor-pointer items-start gap-2 select-none">
          <input
            type="checkbox"
            checked={certifyOwners}
            onChange={(e) => setCertifyOwners(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand"
          />
          <span className="text-[13px] text-text-primary">
            I certify I&apos;ve listed all individuals with 25% or greater
            ownership in this business, and one control officer with significant
            management authority.
          </span>
        </label>
      )}

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          disabled={saveDisabled}
          onClick={handleSave}>
          Save Beneficial Owners
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section: Processing Volume
// ---------------------------------------------------------------------------

function VolumeSection({
  prefilled,
  onSaved,
}: {
  prefilled: boolean;
  onSaved: () => void;
}) {
  const { form, errors, setErrors, update, blur } = useSectionForm(
    prefilled
      ? { ...DEMO.volume }
      : {
          averageMonthlyVolume: "",
          averageTransactionAmount: "",
          maxTransactionAmount: "",
        },
    // blur-level rules only; the max/avg cross-check runs on save
    {
      averageMonthlyVolume: [],
      averageTransactionAmount: [],
      maxTransactionAmount: [],
    },
  );

  const handleSave = () => {
    const errs = validateVolume(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSaved();
  };

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-text-secondary">
        Provide information about your expected payment processing volume.
      </p>

      <Field
        label="Average Monthly Volume"
        required
        error={errors.averageMonthlyVolume}
        hint="Total dollar amount you expect to process monthly">
        <CurrencyInput
          value={form.averageMonthlyVolume}
          onChange={(v) => update("averageMonthlyVolume", v)}
          onBlur={() => blur("averageMonthlyVolume")}
          placeholder="50,000"
          error={!!errors.averageMonthlyVolume}
        />
      </Field>

      <Field
        label="Average Transaction Amount"
        required
        error={errors.averageTransactionAmount}
        hint="Typical single invoice / payment amount">
        <CurrencyInput
          value={form.averageTransactionAmount}
          onChange={(v) => update("averageTransactionAmount", v)}
          onBlur={() => blur("averageTransactionAmount")}
          placeholder="5,000"
          error={!!errors.averageTransactionAmount}
        />
      </Field>

      <Field
        label="Maximum Transaction Amount"
        required
        error={errors.maxTransactionAmount}
        hint="Largest single payment you expect to receive">
        <CurrencyInput
          value={form.maxTransactionAmount}
          onChange={(v) => update("maxTransactionAmount", v)}
          onBlur={() => blur("maxTransactionAmount")}
          placeholder="25,000"
          error={!!errors.maxTransactionAmount}
        />
      </Field>

      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section: Documents
// ---------------------------------------------------------------------------

interface StagedFile {
  id: string;
  name: string;
  size: number;
}

function DocsSection({
  prefilled,
  onSaved,
}: {
  prefilled: boolean;
  onSaved: () => void;
}) {
  const [files, setFiles] = useState<StagedFile[]>(
    prefilled
      ? [{ id: "demo-file", name: "sample-jib-invoice.pdf", size: 245760 }]
      : [],
  );
  const [error, setError] = useState<string | null>(null);

  // ponytail: dumb staging only — files are never uploaded anywhere
  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setError(null);
    const valid: StagedFile[] = [];
    for (const file of Array.from(list)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(
          `"${file.name}" is not an accepted file type. Use PDF, CSV, JPEG, or PNG.`,
        );
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds the 20MB limit.`);
        continue;
      }
      valid.push({ id: crypto.randomUUID(), name: file.name, size: file.size });
    }
    if (valid.length > 0) setFiles((prev) => [...prev, ...valid]);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <h4 className="text-[14px] font-medium text-text-emphasis">
            Business Verification
          </h4>
          <span className="rounded-full bg-callout/10 px-2 py-0.5 text-[11px] font-medium text-callout">
            Required
          </span>
        </div>
        <p className="text-[13px] text-text-secondary">
          Upload business verification documents (sample JIB or invoice).
          Accepted formats: PDF, CSV, JPEG, PNG (max 20MB each).
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center gap-1 rounded-sm border-2 border-dashed border-border-secondary px-6 py-6 hover:border-brand">
        <i className="fas fa-upload text-[20px] text-text-secondary" />
        <span className="text-[14px] font-medium text-text-emphasis">
          Select files
        </span>
        <span className="text-[12px] text-text-secondary">
          PDF, CSV, JPEG, PNG accepted (20MB max)
        </span>
        <input
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium tracking-wider text-text-secondary uppercase">
            Ready to upload
          </p>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-sm bg-bg-tertiary px-3 py-2">
              <i className="fas fa-sticky-note text-text-secondary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] text-text-emphasis">
                  {file.name}
                </p>
                <p className="text-[12px] text-text-secondary">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFiles((prev) => prev.filter((f) => f.id !== file.id))
                }
                className="text-[12px] text-link hover:text-link-hover">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-sm border border-callout/30 bg-callout/10 px-3 py-2.5 text-[13px] text-callout">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          disabled={files.length === 0}
          onClick={onSaved}>
          {files.length > 0
            ? `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`
            : "Upload Documents"}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Drawer
// ---------------------------------------------------------------------------

const SECTIONS = [
  {
    key: "business",
    title: "Business Information",
    subtitle: "Your business details",
    icon: "fe fe-buildings",
  },
  {
    key: "officer",
    title: "Control Officer",
    subtitle: "Authorized representative details",
    icon: "fas fa-user-circle",
  },
  {
    key: "owners",
    title: "Beneficial Owners",
    subtitle: "List owners or certify none own 25%+",
    icon: "fe fe-building-list",
  },
  {
    key: "volume",
    title: "Processing Volume",
    subtitle: "Expected transaction volume",
    icon: "fe fe-money-bill-gear",
  },
  {
    key: "docs",
    title: "Documents",
    subtitle: "Upload verification documents",
    icon: "fas fa-upload",
  },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

export default function OnboardingDrawer({
  wioCode,
  storageKey: selfKey = "wio-onboarding-complete",
  open,
  onOpenChange,
  hideTrigger,
  showReset,
  onComplete,
  triggerLabel = "Onboard",
}: {
  wioCode?: string;
  // Which profile's own onboarding this is — the WIO's and the operator's
  // dashboards must NOT share one flag (operator passes its own key).
  storageKey?: string;
  // Controlled mode: parent owns open state (e.g. opened by the WIO's $ button).
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Hide the inline Onboard button / completed badge when driven from elsewhere.
  hideTrigger?: boolean;
  // Show the floating "Reset onboarding" overlay — Operator Dashboard only.
  showReset?: boolean;
  // Fires when onboarding finishes, for parents that gate UI on the flag.
  onComplete?: () => void;
  // Trigger button text — "Complete Onboarding" when a WIO already did a partial.
  triggerLabel?: string;
}) {
  // Per-WIO pages namespace their onboarded state by code; a profile's own
  // onboarding (no wioCode) uses that profile's key.
  const storageKey = wioCode ? `wio-onboarded:${wioCode}` : selfKey;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setIsOpen = (v: boolean) =>
    onOpenChange ? onOpenChange(v) : setInternalOpen(v);
  const [openSection, setOpenSection] = useState<SectionKey | null>("business");
  const [done, setDone] = useState<Record<SectionKey, boolean>>({
    business: false,
    officer: false,
    owners: false,
    volume: false,
    docs: false,
  });
  const [businessAddress, setBusinessAddress] =
    useState<BusinessAddress | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [completed, setCompleted] = useState(false);

  // sessionStorage is browser-only; read after mount to keep SSR/hydration happy.
  // Re-runs on storageKey so switching between WIO pages reflects each one's state.
  useEffect(() => {
    setCompleted(sessionStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  useEffect(() => {
    if (!isOpen || submitting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, submitting]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(t);
  }, [showToast]);

  const handleComplete = () => {
    setSubmitting(true);
    // ponytail: mock 3s submit — swap the timeout for the real API call
    setTimeout(() => {
      sessionStorage.setItem(storageKey, "true");
      setCompleted(true);
      setSubmitting(false);
      setIsOpen(false);
      setShowToast(true);
      onComplete?.();
    }, 3000);
  };

  const resetOnboarding = () => {
    sessionStorage.removeItem(storageKey);
    setCompleted(false);
    setPrefilled(false);
    setDone({
      business: false,
      officer: false,
      owners: false,
      volume: false,
      docs: false,
    });
    setBusinessAddress(null);
    setOpenSection("business");
  };

  // Marks everything done and seeds sections with DEMO data; sections mount
  // fresh on expand, so collapsing all is enough to pick up the prefill.
  const autoFill = () => {
    setPrefilled(true);
    setBusinessAddress({
      addressLine1: DEMO.business.addressLine1,
      city: DEMO.business.city,
      state: DEMO.business.state,
      zipCode: DEMO.business.zipCode,
    });
    setDone({
      business: true,
      officer: true,
      owners: true,
      volume: true,
      docs: true,
    });
    setOpenSection(null);
  };

  const markDone = (key: SectionKey) => {
    const nextDone = { ...done, [key]: true };
    setDone(nextDone);
    const next = SECTIONS.find((s) => !nextDone[s.key]);
    setOpenSection(next?.key ?? null);
  };

  const doneCount = Object.values(done).filter(Boolean).length;
  const firstIncomplete = SECTIONS.findIndex((s) => !done[s.key]);
  // ponytail: linear gating — a section is locked unless done (reviewable) or it's the current step
  const isLocked = (key: SectionKey, index: number) =>
    !done[key] && index !== firstIncomplete;

  return (
    <>
      {!hideTrigger &&
        (completed ? (
          <div className="flex min-h-8 items-center gap-2 rounded-sm border border-brand/30 bg-brand/10 px-3 text-[13px] text-text-primary">
            <i className="fas fa-check-circle text-brand" />
            You have already completed onboarding.
            {wioCode && (
              <button
                type="button"
                onClick={resetOnboarding}
                className="ml-1 cursor-pointer font-bold text-link hover:underline">
                Reset
              </button>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsOpen(true)}>
            {triggerLabel}
          </Button>
        ))}

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !submitting && setIsOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-150 flex-col bg-bg-primary shadow-2xl">
            <header className="flex items-center justify-between border-b border-border-tertiary px-5 py-3.5">
              <div>
                <h2 className="text-[19px] font-bold text-text-emphasis">
                  WIO Onboarding
                </h2>
                <p className="text-[12px] text-text-secondary">
                  {doneCount} of {SECTIONS.length} sections complete
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={submitting}
                  onClick={autoFill}>
                  Auto fill
                </Button>
                <button
                  type="button"
                  aria-label="Close"
                  disabled={submitting}
                  onClick={() => setIsOpen(false)}
                  className="px-2 text-[18px] text-text-secondary hover:text-text-emphasis disabled:opacity-50">
                  ✕
                </button>
              </div>
            </header>

            {/* fieldset natively disables every button/input inside while submitting */}
            <fieldset
              disabled={submitting}
              className={`min-h-0 flex-1 ${submitting ? "opacity-60" : ""}`}>
              <div className="h-full space-y-2.5 overflow-y-auto px-5 py-4">
                {SECTIONS.map((section, index) => {
                  const locked = isLocked(section.key, index);
                  return (
                    <div
                      key={section.key}
                      className="rounded-sm border border-border-tertiary">
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() =>
                          setOpenSection((prev) =>
                            prev === section.key ? null : section.key,
                          )
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-50">
                        <i
                          className={`${section.icon} w-5 text-center text-[16px] text-text-secondary`}
                        />
                        <span className="flex-1">
                          <span className="block text-[14px] font-bold text-text-emphasis">
                            {section.title}
                          </span>
                          <span className="block text-[12px] text-text-secondary">
                            {section.subtitle}
                          </span>
                        </span>
                        {done[section.key] && (
                          <i className="fas fa-check-circle text-brand" />
                        )}
                        <i
                          className={`fas ${locked ? "fa-lock" : "fa-caret-down"} text-text-secondary ${!locked && openSection !== section.key ? "-rotate-90" : ""}`}
                        />
                      </button>

                      {openSection === section.key && (
                        <div className="border-t border-border-tertiary px-4 py-4">
                          {section.key === "business" && (
                            <BusinessSection
                              prefilled={prefilled}
                              onSaved={(address) => {
                                setBusinessAddress(address);
                                markDone("business");
                              }}
                            />
                          )}
                          {section.key === "officer" && (
                            <OfficerSection
                              businessAddress={businessAddress}
                              prefilled={prefilled}
                              onSaved={() => markDone("officer")}
                            />
                          )}
                          {section.key === "owners" && (
                            <OwnersSection
                              officerDone={done.officer}
                              businessAddress={businessAddress}
                              prefilled={prefilled}
                              onSaved={() => markDone("owners")}
                            />
                          )}
                          {section.key === "volume" && (
                            <VolumeSection
                              prefilled={prefilled}
                              onSaved={() => markDone("volume")}
                            />
                          )}
                          {section.key === "docs" && (
                            <DocsSection
                              prefilled={prefilled}
                              onSaved={() => markDone("docs")}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <footer className="flex items-center justify-between border-t border-border-tertiary px-5 py-3">
              <span className="text-[13px] text-text-secondary">
                {submitting
                  ? "Submitting your information..."
                  : doneCount === SECTIONS.length
                    ? "All sections complete"
                    : "Complete all sections to submit"}
              </span>
              <Button
                variant="primary"
                size="md"
                disabled={doneCount < SECTIONS.length || submitting}
                onClick={handleComplete}>
                {submitting && <Spinner className="mr-2" />}
                {submitting ? "Completing..." : "Complete Onboarding"}
              </Button>
            </footer>
          </aside>
        </div>
      )}

      {showToast && (
        <div className="fixed right-5 bottom-5 z-50 flex max-w-100 items-start gap-3 rounded-sm border border-border-secondary bg-bg-primary px-4 py-3 shadow-lg">
          <i className="fas fa-check-circle relative top-0.5 text-[18px] text-brand" />
          <div className="flex-1">
            <p className="text-[14px] font-bold text-text-emphasis">
              Onboarding complete
            </p>
            <p className="text-[12px] text-text-secondary">
              Your information has been submitted for verification.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setShowToast(false)}
            className="text-[14px] text-text-secondary hover:text-text-emphasis">
            ✕
          </button>
        </div>
      )}

      {/* Floating reset — Operator Dashboard only (opt-in via showReset) */}
      {completed && showReset && (
        <div className="fixed bottom-5 left-5 z-50 rounded-sm border border-border-secondary bg-bg-primary p-2 shadow-lg">
          <Button variant="default" size="sm" onClick={resetOnboarding}>
            Reset onboarding for this Operator
          </Button>
        </div>
      )}
    </>
  );
}
