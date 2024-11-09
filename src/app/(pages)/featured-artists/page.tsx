import AppCard from "@/components/global/card";
import { ArtistProps } from "@/types/artists";
import { notFound } from "next/navigation";
import React from "react";

const page = async () => {
  const artistData = await fetch(
    `${process.env.BASE_URL}/api/featured-artists`,
    {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
    }
  );

  if (!artistData) return notFound();
  const artist_data = await artistData.json();

  const featuredArtists = await artist_data?.data?.data?.results;
  return (
    <div className="flex flex-col justify-center gap-10 py-10">
      <div className="flex flex-col gap-6">
        <h3 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
          Featured Artists
        </h3>
        <div className="flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2">
          {featuredArtists.map((artist: ArtistProps, idx: number) => (
            <AppCard
              cardContent={artist}
              key={idx}
              isArtist={artist.type === "artist"}
              isPlaylist={artist.type === "playlist"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
