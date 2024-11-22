import { onAuthenticateUser } from "@/actions/user";
import AppCard from "@/components/global/card";
import LikedSongsButton from "@/components/global/liked-songs-button";
import { db } from "@/lib/prisma";
import { SongProps } from "@/types/song";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const auth = await onAuthenticateUser();
  if (
    auth.status === 400 ||
    auth.status === 500 ||
    auth.status === 404 ||
    auth.status === 403
  )
    return redirect("/auth/sign-in");

  const user = await currentUser();
  if (!user) {
    return { status: 403 };
  }

  // Fetch user data and related liked songs
  const res = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
    include: {
      likedSongs: true, // Only include liked songs
    },
  });

  if (!res) {
    return { status: 403 };
  }

  // Fetch the details for each liked song
  const likedSongs = await Promise.all(
    res.likedSongs.map(async (song) => {
      const response = await fetch(
        `${process.env.BASE_URL}/api/song/${song.songId}`
      );
      const songData = await response.json();

      return songData?.data?.data[0];
    })
  );

  return (
    <div>
      <LikedSongsButton />
      <div className="flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2">
        {likedSongs.map((item: SongProps, key: number) => (
          <AppCard cardContent={item} key={key} isPlay />
        ))}
      </div>
    </div>
  );
};

export default page;
