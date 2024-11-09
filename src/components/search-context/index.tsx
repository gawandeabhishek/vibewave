"use client"

import { createContext, useContext, useState } from "react";
import { PlaylistProps, SongProps } from "@/types/song";
import { ArtistProps } from "@/types/artists";

// Define the shape of the context state with proper typing
interface SearchContextType {
  results: CardContentProps | null; // Use the specific type if you have it
  setResults: (data: CardContentProps | null) => void; // Update the type accordingly
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

  return (
    <SearchContext.Provider value={{ results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};
