"use client"

import { useStarsWorldState } from '@/components/isStars-world-context'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Telescope } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

const StarsButton = () => {
    const { isStarsWorld, setIsStarsWorld } = useStarsWorldState();
    const { theme } = useTheme();
    const [isClient, setIsClient] = useState(false);

    // Check if window is available, this ensures we don't access localStorage on the server
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Render only after the component has mounted on the client
    if (!isClient) return null;

    return theme !== "light" && (
        <SidebarMenuItem onClick={() => setIsStarsWorld(!isStarsWorld)}>
            <SidebarMenuButton>
                <Telescope />
                <span>
                    {isStarsWorld ? "Exit Stars World" : "Explore Stars World"}
                </span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

export default StarsButton;
