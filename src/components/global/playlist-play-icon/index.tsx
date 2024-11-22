"use client";

import { useSongContext } from "@/components/song-context";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Shuffle } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  playlistId: string;
};

const PlayListPlayIcon = ({ playlistId }: Props) => {
  const { currentSongId } = useSongContext();
  const [isPlayingPlaylist, setIsPlayingPlaylist] = useState(false);

  const handleUpdateQueue = async () => {
    try {
      const response = await fetch("/api/updateQueuedSongs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "playlists", playlistId }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Success message

        setIsPlayingPlaylist(data.isPlayingPlaylist);
      } else {
        console.error(data.error); // Error message
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Function to check if the playlist is currently being played
  const checkPlayingPlaylist = async () => {
    try {
      const response = await fetch(
        `/api/checkPlayingPlaylist?playlistId=${playlistId}`
      );
      const data = await response.json();

      if (response.ok) {
        setIsPlayingPlaylist(data.isPlayingPlaylist);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    checkPlayingPlaylist();
  }, [playlistId, currentSongId, checkPlayingPlaylist]);

  return (
    <span
      className={cn(
        buttonVariants({ variant: "secondary", size: "icon" }),
        "my-4",
        isPlayingPlaylist ? "text-blue-500" : "text-gray-500" // Change color based on playing status
      )}
      onClick={handleUpdateQueue}
    >
      <Shuffle />
    </span>
  );
};

export default PlayListPlayIcon;
