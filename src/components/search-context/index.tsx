"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname for tracking path changes
import { PlaylistProps, SongProps } from "@/types/song";
import { ArtistProps } from "@/types/artists";

// Define the shape of the context state with proper typing
interface SearchContextType {
  results: CardContentProps | null;
  setResults: (data: CardContentProps | null) => void;
}

// Create the context with default values
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Update the definition of `CardContentProps` to include these properties
export interface CardContentProps {
  songs?: {
    data: {
      results: SongProps[];
    };
  };
  playlists?: {
    data: {
      results: PlaylistProps[];
    };
  };
  artists?: {
    data: {
      results: ArtistProps[];
    };
  };
}

// Create a custom hook to use the context easily
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};

// Provider component
export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [results, setResults] = useState<CardContentProps | null>(null); // Use the correct type or `null`
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    // Reset results whenever the pathname changes
    setResults(null);
  }, [pathname]); // Triggered when `pathname` changes

  return (
    <SearchContext.Provider value={{ results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};
