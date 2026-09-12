import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "whitespace-nowrap",
    "rounded-lg",
    "border border-transparent",
    "text-sm font-medium",
    "outline-none",
    "select-none",
    "transition-all",
    "duration-[var(--duration-fast)]",
    "ease-[var(--ease-luxury)]",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",
    "hover:shadow-md",
    "active:translate-y-px",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "aria-invalid:border-destructive",
    "aria-invalid:ring-destructive/30",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:brightness-95",

        outline:
          "border-border bg-background text-foreground hover:bg-muted",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost:
          "bg-transparent text-foreground hover:bg-muted",

        destructive:
          "bg-destructive text-white hover:brightness-95",

        link:
          "border-0 bg-transparent text-primary underline-offset-4 hover:underline shadow-none hover:shadow-none",
      },

      size: {
        default: "h-11 px-5",

        xs: "h-8 px-3 text-xs",

        sm: "h-10 px-4",

        lg: "h-12 px-6 text-base",

        icon: "size-11",

        "icon-xs": "size-8",

        "icon-sm": "size-10",

        "icon-lg": "size-12",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps =
  ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };