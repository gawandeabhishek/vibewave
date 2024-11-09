"use client"; // Ensures this code runs on the client side

import { buttonVariants } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth, UserButton } from "@clerk/nextjs"; // Removed UserProfile since it's not used
import { UserX } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserIcon = () => {
  const { state } = useSidebar();
  const { isSignedIn } = useAuth(); // Ensure this hook is used only in the client side

  return (
    <div>
      {[
        {
          title: "Abhishek Gawande",
        },
      ].map((item) => (
        <div
          key={item.title}
          className={cn(
            buttonVariants({
              variant: "ghost",
              size: state === "collapsed" ? "icon" : "sm",
            }),
            state === "collapsed"
              ? ""
              : "flex !items-center font-bold text-sm cursor-pointer !ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
            state === "collapsed" ? "!justify-center" : "!py-6 !justify-start"
          )}
        >
          {isSignedIn ? (
            <span className="flex items-center justify-start gap-2">
              <UserButton />
              <span className={state === "collapsed" ? "hidden" : "flex"}>
                {item.title}
              </span>
            </span>
          ) : (
            <Link
              href="/auth/sign-in"
              className="flex items-center justify-start gap-2"
            >
              <UserX />
              <span>sign in</span>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserIcon;
