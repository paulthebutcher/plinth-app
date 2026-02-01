import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
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
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";
  const styles = {
    default:
      "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:bg-primary-active",
    outline: "border border-border bg-background hover:bg-background-muted",
    ghost: "bg-transparent hover:bg-background-muted",
  }[variant];

  return (
    <Comp
      className={cn(base, styles, className)}
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