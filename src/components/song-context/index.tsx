"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context
interface SongContextType {
  currentSongId: string;
  setCurrentSongId: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with default values
const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider = ({ children }: { children: ReactNode }) => {
  const [currentSongId, setCurrentSongId] = useState<string>("");

  return (
    <SongContext.Provider value={{ currentSongId, setCurrentSongId }}>
      {children}
    </SongContext.Provider>
  );
};

// Create a custom hook to use the context
export const useSongContext = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongContext must be used within a SongProvider");
  }
  return context;
};
