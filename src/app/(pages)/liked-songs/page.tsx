import AppCard from "@/components/global/card";
import { SongProps } from "@/types/song";
import { notFound } from "next/navigation";
import React from "react";

const page = async () => {
  const songData = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/top-songs`);
  if (!songData) return notFound();

  if (!songData) return notFound();
  const song_data = await songData.json();

  const likedSongs = await song_data?.data?.data?.results;
  return (
    <div className="flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2">
      {likedSongs.map((item: SongProps, key: number) => (
        <AppCard cardContent={item} key={key} isPlay />
      ))}
    </div>
  );
};

export default page;
