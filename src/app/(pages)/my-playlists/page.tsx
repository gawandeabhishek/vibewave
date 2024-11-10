import { onAuthenticateUser } from "@/actions/user";
import AppCard from "@/components/global/card";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

// Update PlaylistProps to match the shape of the playlist data returned by Prisma
// Adjust PlaylistProps to match the actual shape of the playlist data
// Adjust PlaylistProps to match the actual structure of your playlist data
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
  imageUrl: string; // Matching the imageUrl field
  userId: string | null;
}

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

  const res = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
    include: {
      myPlaylists: {
        where: {
          user: {
            clerkId: user.id,
          },
        },
      },
    },
  });

  if (!res) {
    return { status: 403 };
  }

  const playlistData = await fetch(
    `${process.env.BASE_URL}/api/top-playlists`,
    { next: { revalidate: 10 } }
  );

  if (!playlistData) return notFound();

  const myPlaylists: PlaylistProps[] = res.myPlaylists;

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
