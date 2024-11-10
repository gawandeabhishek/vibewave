"use client"; // Ensure this is treated as client-side code

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ListMusic } from "lucide-react";
import Cookies from "js-cookie"; // Correct import for js-cookie
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const PlaylistIcon = ({ id, type }: { id: string; type: string }) => {
  // Set default value to false if cookie is undefined or not available
  const [isSavedPlaylist, setIsSavedPlaylist] = useState<boolean>(false);
  console.log(type)

  // Ensure cookies are only accessed on the client-side
  useEffect(() => {
    const savedStatus = Cookies.get(`playlist-${id}`); // Using Cookies.get to access cookie
    if (savedStatus) {
      setIsSavedPlaylist(!!JSON.parse(savedStatus));
    }
  }, [id]);

  const handleListMusic = async () => {
    try {
      if (!isSavedPlaylist) {
        // Save the playlist
        const response = await fetch("/api/saved-playlists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playlistId: id }),
        });

        if (response.ok) {
          setIsSavedPlaylist(true); // Update state when saved
          Cookies.set(`playlist-${id}`, JSON.stringify(true)); // Update cookie when saved
        } else {
          console.error("Failed to save playlist");
        }
        if (response.status === 404) {
          setIsSavedPlaylist(true);
        }
      } else {
        // Unsave the playlist
        const response = await fetch("/api/saved-playlists", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playlistId: id }),
        });

        console.log(response.ok)

        if (response.ok) {
          setIsSavedPlaylist(false); // Update state when unsaved
          Cookies.set(`playlist-${id}`, JSON.stringify(false)); // Update cookie when unsaved
        } else { // Update state when unsaved
          console.error("Failed to unsave playlist");
        }
        if (response.status === 404) {
          setIsSavedPlaylist(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { isSignedIn } = useAuth();
  
  console.log("Class applied:", isSavedPlaylist ? "bg-sidebar-ring" : "");

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
