"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import logout from "@/app/(authGroup)/_actions/logOut";

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
};

function getDashboardHref(role?: string) {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "PROVIDER") return "/provider-dashboard";
  return "/customer-dashboard";
}

export default function ProfileDropdown({
  user,
}: ProfileDropdownProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dashboardHref = getDashboardHref(user.role);

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout();

        // Refresh server components (Navbar)
        router.refresh();

        // Redirect to home page
        router.push("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
          onClick={handleLogout}
          disabled={isPending}
          className="text-red-500 focus:text-red-500"
        >
          {isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}