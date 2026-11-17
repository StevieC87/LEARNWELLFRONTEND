import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button button_default",
      // Tailwind color utilities that usually map to custom theme tokens (configured in your Tailwind theme or CSS variables).
      primary: "button button_default",

      destructive: "button button_destructive",
      outline: "button button_outline",
      secondary: "button button_secondary",
      ghost: "button button_ghost",
      link: "button button_outline",
      slim: "button button_slim",
      slimoutline: "button button_outline button_slim",
      transparent: "button button_transparent",
      button_graydash: "button button_graydash",
    },
    size: {
      // default: "px-4 py-2 has-[>svg]:px-3",
      // sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      // lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      // icon: "size-9",
      // "icon-sm": "size-8",
      // "icon-lg": "size-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default" as any,
  },
});

function Button({
  className,
  variant = "default",
  size = "default" as any,
  asChild = false,
  type = "button",
  ...props
}: React.ComponentPropsWithRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp: any = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...(!asChild && { type })}
      {...props}
    />
  );
}

export { Button, buttonVariants };
