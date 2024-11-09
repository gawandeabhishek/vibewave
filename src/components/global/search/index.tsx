"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchContext } from "@/components/search-context";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { setResults } = useSearchContext(); 

  useEffect(() => {
    const handleSearch = async (query: string) => {
      try {
        if (!query) {
          setResults(null); // Clear results if query is empty
          return;
        }
  
        // Make a fetch request to the API endpoint with the search query
        const response = await fetch(
          `${process.env.BASE_URL}/api/global-search/${query}`
        );
  
        if (!response.ok) {
          throw Error("Failed to fetch results");
        }
  
        const data = await response.json();
        setResults(data.data); // Assuming data contains the search results
      } catch (err) {
        console.error(err);
        setResults(null); // Clear previous results if there's an error
      }
    };
  
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500); // Add a small debounce (500ms) to prevent excessive API calls
  
    return () => clearTimeout(timeoutId); // Clear timeout if user keeps typing
  }, [searchQuery, setResults]); // Added setResults to dependencies
  
  

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="flex items-center justify-center gap-2 w-full">
        <Input
          placeholder="Search..."
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Trigger onChange API call
        />
        <Button type="button">Search</Button> {/* No onClick handler here */}
      </div>
    </div>
  );
};

export default Search;
