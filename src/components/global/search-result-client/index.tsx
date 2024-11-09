// src/components/global/search-result.tsx

import SearchResult from "@/components/global/search-result";

export default function SearchResultClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SearchResult />
      {children}
    </>
  );
}
