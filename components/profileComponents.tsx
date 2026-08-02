"use client";

import * as React from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type ProfileDropdownProps = {
  user: {
    name?: string;
    image?: string;
    role?: string;
  };
  /**
   * Called when the user picks "Logout" from the menu.
   * The parent owns the loading state and the redirect,
   * so this just fires a callback instead of doing async work here.
   */
  onLogout?: () => void;
  /**
   * Disables the trigger and prevents the menu from opening while a
   * parent-owned flow (e.g. desktop logout overlay) is in progress.
   */
  disabled?: boolean;
};

export type ProfileDropdownHandle = {
  closeMenu: () => void;
};

function getDashboardHref(role?: string) {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "PROVIDER") return "/provider-dashboard";
  return "/customer-dashboard";
}

const ProfileDropdown = React.forwardRef<ProfileDropdownHandle, ProfileDropdownProps>(
  function ProfileDropdown({ user, onLogout, disabled }, ref) {
    const dashboardHref = getDashboardHref(user.role);

    React.useImperativeHandle(ref, () => ({
      closeMenu: () => setOpen(false),
    }));

    const [open, setOpen] = React.useState(false);

    // When the parent locks the dropdown (e.g. during a logout overlay),
    // force-close any open menu and keep it closed.
    React.useEffect(() => {
      if (disabled && open) {
        setOpen(false);
      }
    }, [disabled, open]);

    return (
      <DropdownMenu
        open={disabled ? false : open}
        onOpenChange={disabled ? undefined : setOpen}
      >
        <DropdownMenuTrigger asChild>
          <button
            disabled={disabled}
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {user.name || "User"}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={dashboardHref}>Dashboard</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              // Do NOT close the menu here — the parent owns the loading
              // overlay and will close the dropdown via `closeMenu()` before
              // showing the full-page spinner. Closing here first races with
              // the parent state and can cause the menu to flash.
              onLogout?.();
            }}
            className="text-red-500 focus:text-red-500"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

export default ProfileDropdown;