"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  id: string; // Song ID
  likeCount?: string; // Number of likes
  isPlayerIcon?: boolean; // Whether or not to display
};

const LikeButton = ({
  id,
  likeCount = "0",
  isPlayerIcon = false,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const fetchLikedSongs = useCallback(async () => {
    try {
      const response = await fetch("/api/get-liked-songs", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch liked songs");
      }
      const data = await response.json();
      const likedSongIds = data.map((song: { songId: string }) => song.songId);
      setIsLiked(likedSongIds.includes(id));
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchLikedSongs();
  }, [fetchLikedSongs]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;

    setIsLiking(true);
    try {
      const response = await fetch(`/api/like-song`, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: id }),
      });

      if (!response.ok) {
        console.error("Failed to update like status:", await response.text());
        return;
      }

      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error("An error occurred while updating like status:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return isPlayerIcon ? (
      <span className="flex flex-col items-center justify-center gap-2 bg-primary/5 p-2 rounded-full" onClick={handleLike}>
        <Heart
          size={20}
          className={cn(
            "size-4 lg:size-6",
            isLiked ? "text-rose-600 border-0" : ""
          )}
        />{" "}
      <span>{likeCount === "0" ? "Likes" : likeCount}</span>
    </span>
  ) : (
    <span
      className="text-xs !text-[0.55rem] !leading-[0.5rem] flex flex-col items-center justify-center gap-0.5 cursor-pointer"
      onClick={handleLike}
    >
      <Heart
        size={20}
        className={cn(isLiked ? "text-rose-600 border-0" : "")}
      />
      <span>{likeCount === "0" ? "Likes" : likeCount}</span>
    </span>
  );
};

export default LikeButton;
