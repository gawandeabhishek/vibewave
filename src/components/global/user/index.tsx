"use client"; // Ensures this code runs on the client side

import { buttonVariants } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth, UserButton, useUser } from "@clerk/nextjs"; // Ensure this hook is used only in the client side
import { UserX } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserIcon = () => {
  const { state } = useSidebar();
  const { user } = useUser(); // Ensure this hook is used only in the client side

  return (
    <>
      {user ? (
        <div
          className={cn(
            buttonVariants({
              variant: "ghost",
              size: state === "collapsed" ? "icon" : "sm",
            }),
            state === "collapsed"
              ? "!justify-center"
              : "!py-6 !justify-start flex !items-center font-bold text-sm cursor-pointer !ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
          )}
        >
          <span className="flex items-center justify-start gap-2">
            <UserButton />
            <span className={state === "collapsed" ? "hidden" : "flex"}>
              {user.firstName}&nbsp;{user.lastName}
            </span>
          </span>
        </div>
      ) : (
        <Link
          href="/auth/sign-in"
          className={cn(
            buttonVariants({
              variant: "ghost",
              size: state === "collapsed" ? "icon" : "sm",
            }),
            state === "collapsed"
              ? "!justify-center"
              : "!py-6 !justify-start flex !items-center font-bold text-sm cursor-pointer !ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
          )}
        >
          <div className="flex items-center justify-start gap-2">
            <UserX />
            <span className={state === "collapsed" ? "hidden" : "flex"}>
              Sign In
            </span>
          </div>
        </Link>
      )}
    </>
  );
};

export default UserIcon;