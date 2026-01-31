import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  isLoading?: boolean;
  asChild?: boolean;
};

export function Button({
  className,
  variant = "default",
  isLoading,
  asChild,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp: any = asChild ? Slot : "button";

  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "outline"
      ? "border border-current bg-transparent"
      : "bg-black text-white";

  return (
    <Comp
      className={[base, styles, className].filter(Boolean).join(" ")}
      disabled={asChild ? undefined : disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </Comp>
  );
}