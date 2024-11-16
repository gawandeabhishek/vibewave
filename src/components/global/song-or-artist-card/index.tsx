"use client";

import { useSearchContext } from "@/components/search-context";
import { useSongContext } from "@/components/song-context";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CardContentProps } from "@/types/card";
import { Heart, ListMusic, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

type Props = {
  isPlaylistOrArtistCollectionSong: boolean;
  data: CardContentProps;
  id: string;
  isPlay: boolean;
  isArtist: boolean;
  isPlaying: boolean;
};

const SongOrArtistCard = React.memo(({
  isPlaylistOrArtistCollectionSong,
  data,
  id,
  isPlay,
  isArtist,
  isPlaying,
}: Props) => {
  const { setCurrentSongId } = useSongContext();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const { results } = useSearchContext();

  // Fetch the liked songs from the server
  const fetchLikedSongs = useCallback(async () => {
    try {
      const response = await fetch("/api/get-liked-songs", { method: "GET" });
  
      if (!response.ok) {
        throw new Error("Failed to fetch liked songs");
      }
  
      const data = await response.json();
      const songIds = data.map((song: { songId: string }) => song.songId); // Store only song IDs
      setLikedSongs(songIds);
  
      // Check if the current song is liked
      const isSongLiked = songIds.includes(id);
      setIsLiked(isSongLiked);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  }, [id]); // Ensure this only changes if `id` changes
  

  // Fetch liked songs on component mount
  useEffect(() => {
    if (likedSongs.length === 0) {
      fetchLikedSongs();
    }
  }, [likedSongs, fetchLikedSongs]);
  

  // Update isLiked state when likedSongs change
  useEffect(() => {
    const isSongLiked = likedSongs.includes(id);
    setIsLiked(isSongLiked);
  }, [likedSongs, id]);

  // Handle like/unlike action
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the parent
    if (isLiking) return;

    setIsLiking(true);

    try {
      const response = await fetch(`/api/like-song`, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update like status:", errorText);
        return;
      }

      // Toggle the like state
      setIsLiked((prev) => !prev);
      setLikedSongs((prev) => {
        if (isLiked) {
          return prev.filter((songId) => songId !== id);
        } else {
          return [...prev, id];
        }
      });
    } catch (error) {
      console.error("An error occurred while updating like status:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle song click (play)
  const handleSongClick = async () => {
    if (data.type === "song") {
      try {
        const response = await fetch(`/api/current-song`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentSongId: id }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to update current song:", errorText);
          return;
        }

        setCurrentSongId(id);
      } catch (error) {
        console.error("An error occurred while updating the current song:", error);
      }
    }
  };

  const renderCardContent = () => (
    <>
      <CardContent className="flex justify-center items-center">
        <Image
          src={data.image}
          alt={data.title}
          height={200}
          width={200}
          className="mt-4 rounded-xl"
        />
      </CardContent>

      <CardHeader className="py-0 w-full flex justify-center items-center text-center">
        <CardTitle className="truncate w-[90%]">{data.title}</CardTitle>
        {!isArtist && (
          <CardDescription className="w-[80%] truncate">{data.artists}</CardDescription>
        )}
      </CardHeader>

      <CardFooter className="flex justify-center items-center py-2">
        {!isArtist && (
          <CardDescription className="flex gap-4 items-center justify-center w-fit">
            <span
              className="text-xs !text-[0.55rem] !leading-[0.5rem] flex flex-col items-center justify-center gap-0.5 cursor-pointer"
              onClick={handleLike}
            >
              <Heart
                size={20}
                className={cn(isLiked ? "text-rose-600 border-0" : "")}
              />
              <span>{data.likeCount === "0" ? "Likes" : data.likeCount}</span>
            </span>
            <span
              className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "cursor-pointer")}
            >
              <ListMusic />
            </span>
            {isPlay && (
              <span
                className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "cursor-pointer")}
              >
                <Play />
              </span>
            )}
          </CardDescription>
        )}
      </CardFooter>
    </>
  );

  return (
    <span onClick={handleSongClick}>
      {!isPlaylistOrArtistCollectionSong && !isArtist ? (
        <Card
          className={cn(
            buttonVariants({ variant: isPlaying ? "secondary" : "ghost" }),
            "flex flex-col w-60 h-fit border-none shadow-none p-0 justify-center items-center"
          )}
        >
          {renderCardContent()}
        </Card>
      ) : (
        <Link href={data.link}>
          <Card
            className={cn(
              buttonVariants({ variant: isPlaying ? "secondary" : "ghost" }),
              "flex flex-col w-60 h-fit border-none shadow-none p-0 justify-center items-center"
            )}
          >
            {renderCardContent()}
          </Card>
        </Link>
      )}
    </span>
  );
});

export default SongOrArtistCard;