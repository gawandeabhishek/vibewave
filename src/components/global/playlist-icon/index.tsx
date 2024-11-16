"use client"; // Ensure this is treated as client-side code

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const PlaylistIcon = ({ id, type }: { id: string; type: string }) => {
  const [isSavedPlaylist, setIsSavedPlaylist] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false); // To prevent multiple clicks
  console.log(type)

  const { isSignedIn } = useAuth();

  // Check if the playlist is saved when the component mounts
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const response = await fetch(`/api/saved-playlists/${id}`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setIsSavedPlaylist(data.isSaved); // Assuming your API returns { isSaved: true/false }
        } else {
          console.error("Failed to fetch saved status");
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkSavedStatus();
  }, [id]);

  const handleListMusic = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the parent
    if (isToggling) return; // Prevent multiple clicks

    setIsToggling(true); // Set toggling state to true

    try {
      const method = isSavedPlaylist ? "DELETE" : "POST";
      const response = await fetch("/api/saved-playlists", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId: id }),
      });

      if (response.ok) {
        setIsSavedPlaylist((prev) => !prev); // Toggle the saved state
      } else {
        console.error("Failed to update saved playlist");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsToggling(false); // Reset toggling state
    }
  };

  return (
    isSignedIn && (
      <span
        className={cn(
          buttonVariants({ variant: "secondary", size: "icon" }),
          "cursor-pointer",
          isSavedPlaylist ? "bg-sidebar-ring hover:bg-sidebar-ring" : ""
        )}
        onClick={handleListMusic}
      >
        <ListMusic />
      </span>
    )
  );
};

export default PlaylistIcon;