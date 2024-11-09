import AppCard from "@/components/global/card";
import { SongProps } from "@/types/song";
import { notFound } from "next/navigation";
import React from "react";

const page = async () => {
  const songData = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/top-songs`, {
    next: { revalidate: 10 }, // Revalidate every 10 seconds
  });

  if (!songData) return notFound(); // If the API call fails, return 404 page not found.
  const song_data = await songData.json();

  const likedSongs = await song_data?.data?.data?.results;
  return (
    <div className="flex flex-col justify-center gap-10 py-10">
      <h3 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
        Top Songs
      </h3>
      <div className="flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2">
        {likedSongs.map((item: SongProps, key: number) => (
          <AppCard cardContent={item} key={key} isPlay />
        ))}
      </div>
    </div>
  );
};

export default page;
