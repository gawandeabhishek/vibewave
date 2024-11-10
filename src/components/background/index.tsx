"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import StarsCanvas from "../global/stars";
import { useStarsWorldState } from "../isStars-world-context";

const Background = () => {
  const { isStarsWorld } = useStarsWorldState();
  const { theme } = useTheme();

  // Local state to check if component is mounted on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client
  }, []);

  // Only render the StarsCanvas after the component has mounted
  if (!isClient) return null;

  return theme !== "light" && isStarsWorld ? <StarsCanvas /> : <></>;
};

export default Background;
