import type { AnchorHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-brand text-white hover:bg-[color-mix(in_srgb,#4d8f1e,black_6%)] hover:text-white",
  default:
    "border border-border-secondary bg-bg-primary text-text-primary hover:bg-bg-secondary",
  secondary:
    "border border-brand bg-bg-primary text-brand hover:bg-bg-secondary",
  tertiary: "bg-transparent text-brand hover:bg-brand-transparent",
  callout:
    "bg-callout text-white hover:bg-[color-mix(in_srgb,#ff5f29,black_6%)] hover:text-white",
};

const sizes = {
  sm: "min-h-6 px-1.25 py-0.25 text-[14px] leading-[19px]",
  md: "min-h-8 px-4 py-0.75 text-[14px] leading-[21px]",
};

type ButtonProps = {
  variant: keyof typeof variants;
  size: keyof typeof sizes;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
};

export default function Button({
  variant,
  size,
  href,
  target,
  disabled = false,
  onClick,
  className = "",
  children,
}: ButtonProps) {
  const cls = `inline-flex cursor-pointer items-center justify-center rounded-sm text-center font-medium ${
    variants[variant]
  } ${sizes[size]} ${
    disabled ? "pointer-events-none opacity-65" : ""
  } ${className}`;

  if (disabled) {
    return (
      <button type="button" disabled className={cls}>
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
