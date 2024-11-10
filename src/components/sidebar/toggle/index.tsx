"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Adjust the import based on your project structure
import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const CustomToggle = () => {
  const { setTheme, theme } = useTheme();
  const { state } = useSidebar(); // Get the sidebar state
  const [mounted, setMounted] = useState(false);

  // Only render theme when the component is mounted (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // While waiting for client-side hydration, render nothing or a fallback (empty span)
    return <span />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "justify-start px-2 text-sm ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <SunMoon className="size-4 rotate-0 scale-100 transition-all" />
        {state === "expanded" && ( // Only show the label when the sidebar is expanded
          <DropdownMenuLabel className="capitalize font-normal pl-0">
            {theme}
          </DropdownMenuLabel>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {["light", "dark", "rose", "blue", "violet"].map((item) => (
          <DropdownMenuItem key={item} onClick={() => setTheme(item)}>
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomToggle;