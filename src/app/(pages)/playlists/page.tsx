import AppCard from "@/components/global/card";
import { PlaylistProps } from "@/types/song";
import { notFound } from "next/navigation";
import React from "react";

const page = async () => {
  const playlistData = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/top-playlists`,
    {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
    }
  );

  if (!playlistData) return notFound();
  const playlist_data = await playlistData.json();

  const myPlaylists = await playlist_data?.data?.data?.results;

  return (
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
  );
};

export default page;
