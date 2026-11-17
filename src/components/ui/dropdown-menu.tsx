"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "@/components/ui/icons.jsx";

import { cn } from "@/lib/utils";
import useIsPhone from "@/hooks/useIsPhone.js";
import { SheetBackdrop, SheetHandle, isSheetBackdrop } from "@/components/ui/MenuSheet.jsx";

// On a phone every menu opens as a sheet from the bottom of the screen
// (menu-sheet.css), its submenus sliding over it with a Back row instead of
// flying out sideways. `sheet={false}` on DropdownMenuContent keeps a menu a
// dropdown. The open state is held here, open or not controlled, so the
// sheet's handle and dimmed page can close the menu.
type SheetContextValue = { phone: boolean; open: boolean; close: () => void };
const SheetContext = React.createContext<SheetContextValue>({ phone: false, open: false, close: () => {} });

// True inside a menu shown as a sheet, so its submenus are sheets too.
const InSheetContext = React.createContext(false);

// The submenu's row, kept when it is tapped or opened from the keyboard (the
// ways a sheet's submenu opens), so its Back row can name it and hand focus back.
type SubContextValue = {
  setOpen: (open: boolean) => void;
  trigger: HTMLElement | null;
  setTrigger: (trigger: HTMLElement) => void;
};
const SubContext = React.createContext<SubContextValue | null>(null);

// An open state that follows `open` when it is passed and keeps its own when
// it isn't, telling onOpenChange either way.
function useOpenState(
  open: boolean | undefined,
  defaultOpen: boolean | undefined,
  onOpenChange: ((open: boolean) => void) | undefined,
) {
  const [own, setOwn] = React.useState(defaultOpen ?? false);
  const controlled = open !== undefined;
  const setOpen = React.useCallback((next: boolean) => {
    if (!controlled) setOwn(next);
    onOpenChange?.(next);
  }, [controlled, onOpenChange]);
  return [controlled ? open : own, setOpen] as const;
}

// A pointerdown on the dimmed page must not dismiss the menu: its click does
// that, so the click can't reach the page under it (MenuSheet.jsx).
type OutsideHandler = NonNullable<React.ComponentProps<typeof DropdownMenuPrimitive.Content>["onPointerDownOutside"]>;
function keepForBackdrop(handler?: OutsideHandler): OutsideHandler {
  return (event) => {
    handler?.(event);
    if (isSheetBackdrop(event.target)) event.preventDefault();
  };
}

function DropdownMenu({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const phone = useIsPhone();
  const sheet = React.useMemo(() => ({ phone, open, close: () => setOpen(false) }), [phone, open, setOpen]);
  return (
    <SheetContext.Provider value={sheet}>
      <DropdownMenuPrimitive.Root data-slot="dropdown-menu" open={open} onOpenChange={setOpen} {...props} />
    </SheetContext.Provider>
  );
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  sheet = true,
  children,
  onPointerDownOutside,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  sheet?: boolean;
}) {
  const { phone, open, close } = React.useContext(SheetContext);
  const asSheet = phone && sheet;
  return (
    <>
    {asSheet && open && <SheetBackdrop onClose={close} portal />}
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        data-menu-sheet={asSheet ? "" : undefined}
        sideOffset={sideOffset}
        onPointerDownOutside={asSheet ? keepForBackdrop(onPointerDownOutside) : onPointerDownOutside}
        className={cn(
          "darkmode bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className,
        )}
        {...props}
      >
        {asSheet && <SheetHandle onClose={close} />}
        <InSheetContext.Provider value={asSheet}>{children}</InSheetContext.Provider>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
    </>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "darkmode focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const [trigger, setTrigger] = React.useState<HTMLElement | null>(null);
  const sub = React.useMemo(() => ({ setOpen, trigger, setTrigger }), [setOpen, trigger]);
  return (
    <SubContext.Provider value={sub}>
      <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" open={open} onOpenChange={setOpen} {...props} />
    </SubContext.Provider>
  );
}

// The submenu row's name for its sheet's Back row: the row's first piece of
// text ("Line style", "Layout"), without the current value shown after it.
function subName(trigger: HTMLElement | null) {
  for (const node of Array.from(trigger?.childNodes || [])) {
    const text = node.textContent?.trim();
    if (text) return text;
  }
  return "";
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  const sub = React.useContext(SubContext);
  const inSheet = React.useContext(InSheetContext);
  const { onClick, onKeyDown, onPointerMove, onPointerLeave, ...rest } = props;
  // In a sheet a submenu opens on a tap only: Radix opens one when a mouse
  // rests on its row, which would throw a sheet over this one as the pointer
  // passes. Cancelling the event skips Radix's own handler.
  const tapOnly = (handler?: (event: React.PointerEvent<HTMLDivElement>) => void) => (event: React.PointerEvent<HTMLDivElement>) => {
    handler?.(event);
    if (inSheet) event.preventDefault();
  };
  return (
    <DropdownMenuPrimitive.SubTrigger
      onClick={(event) => { onClick?.(event); sub?.setTrigger(event.currentTarget); }}
      onKeyDown={(event) => { onKeyDown?.(event); sub?.setTrigger(event.currentTarget); }}
      onPointerMove={tapOnly(onPointerMove)}
      onPointerLeave={tapOnly(onPointerLeave)}
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "darkmode focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...rest}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  children,
  onPointerDownOutside,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const { close } = React.useContext(SheetContext);
  const sub = React.useContext(SubContext);
  const asSheet = React.useContext(InSheetContext);
  // Focus goes back to the row once the sheet under this one shows again: a
  // hidden element can't take focus.
  const back = () => {
    sub?.setOpen(false);
    requestAnimationFrame(() => sub?.trigger?.focus());
  };
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      data-menu-sheet={asSheet ? "" : undefined}
      onPointerDownOutside={asSheet ? keepForBackdrop(onPointerDownOutside) : onPointerDownOutside}
      className={cn(
        "darkmode bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-lg",
        className,
      )}
      {...props}
    >
      {asSheet && <SheetHandle onClose={close} />}
      {asSheet && (
        // An item, so it is in the arrow-key order; preventDefault keeps the
        // menu open, as choosing an item would close it.
        <DropdownMenuPrimitive.Item className="menu-sheet-back" onSelect={(event) => { event.preventDefault(); back(); }}>
          <ChevronRightIcon className="menu-sheet-back-icon size-4" aria-hidden="true" />
          {subName(sub?.trigger ?? null) || "Back"}
        </DropdownMenuPrimitive.Item>
      )}
      {children}
    </DropdownMenuPrimitive.SubContent>
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
