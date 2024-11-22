"use client";

import { useSongContext } from "@/components/song-context";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AudioLines } from "lucide-react";
import React, { useEffect, useState } from "react";

const LikedSongsButton = () => {
  const [isPlayingLikedSongs, setIsPlayingLikedSongs] = useState(false);
  const { currentSongId } = useSongContext();

  const handleUpdateQueue = async () => {
    try {
      const response = await fetch("/api/updateQueuedSongs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "songs" }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Success message
      } else {
        console.error(data.error); // Error message
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const checkPlayingLikedSongs = async () => {
    const response = await fetch("/api/checkPlayingLikedSongs");
    if (response.ok) {
      const data = await response.json();
      setIsPlayingLikedSongs(data.isPlayingLikedSongs);
    } else {
      console.error("Failed to fetch playing status");
    }
  };

  useEffect(() => {
    checkPlayingLikedSongs();
  }, [currentSongId]);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-fit h-fit my-10 ml-8">
      <h4 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
        Play Liked Songs
      </h4>
      <span
        className={cn(
          buttonVariants({ variant: "secondary", size: "icon" }),
          "cursor-pointer md:h-14 md:w-14 md:[&_svg]:size-10",
          isPlayingLikedSongs ? "text-blue-500" : "text-gray-500"
        )}
        onClick={handleUpdateQueue}
      >
        <AudioLines />
      </span>
    </div>
  );
};

export default LikedSongsButton;
