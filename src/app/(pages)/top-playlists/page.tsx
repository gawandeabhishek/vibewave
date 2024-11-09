import AppCard from "@/components/global/card";
import { PlaylistProps } from "@/types/song";
import { notFound } from "next/navigation";
import React from "react";

const page = async () => {
  const playlistData = await fetch(
    `${process.env.BASE_URL}/api/top-playlists`,
    {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
    }
  );

  if (!playlistData) return notFound();
  const playlist_data = await playlistData.json();

  const myPlaylists = await playlist_data?.data?.data?.results;

  return (
    <div className="flex flex-col justify-center gap-10 py-10">
      <h3 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
        Top Playlists
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 w-full">
        {myPlaylists.map((item: PlaylistProps, key: number) => (
          <AppCard
            cardContent={item}
            key={key}
            isPlay
            isPlaying={false}
            isPlaylist={true}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
