import { onAuthenticateUser } from "@/actions/user";
import AppCard from "@/components/global/card";
import { SongProps } from "@/types/song";
import { notFound, redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const auth = await onAuthenticateUser();
  if (auth.status === 400 || auth.status === 500 || auth.status === 404 || auth.status === 403) return redirect('/auth/sign-in');
  const songData = await fetch(`${process.env.BASE_URL}/api/top-songs`);
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
