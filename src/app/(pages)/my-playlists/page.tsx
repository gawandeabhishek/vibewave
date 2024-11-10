import { onAuthenticateUser } from "@/actions/user";
import AppCard from "@/components/global/card";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

// Update PlaylistProps to match the structure returned by Prisma
export interface PlaylistProps {
  link: string;
  title: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  playlistId: string;
  description: string | null;
  year: number | null;
  artist: string | null;
  type: string;
  language: string | null;
  imageUrl: string;
  userId: string | null;
}

const page = async () => {
  // Authenticate the user
  const auth = await onAuthenticateUser();
  if (auth.status === 400 || auth.status === 500 || auth.status === 404 || auth.status === 403)
    return redirect("/auth/sign-in");

  const user = await currentUser();
  if (!user) {
    return { status: 403 };
  }

  // Fetch user data and related playlists
  const res = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
    include: {
      myPlaylists: true
    },
  });

  if (!res) {
    return { status: 403 };
  }

  const myPlaylists: PlaylistProps[] = res.myPlaylists.map((playlist) => ({
    link: playlist.link,
    title: playlist.title,
    id: playlist.id,
    createdAt: playlist.createdAt,
    updatedAt: playlist.updatedAt,
    playlistId: playlist.playlistId,
    description: playlist.description,
    year: playlist.year,
    artist: playlist.artist,
    type: playlist.type,
    language: playlist.language,
    imageUrl: playlist.imageUrl,
    userId: user.id, // Assuming userId exists in your Playlist model
  }));

  console.log(res)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 w-full">
      {myPlaylists.map((item: PlaylistProps, key: number) => (
        <AppCard
          cardContent={item}
          key={key}
          isPlay
          isPlaying={false}
          isPlaylist
          isSavedPlaylist
        />
      ))}
    </div>
  );
};

export default page;
