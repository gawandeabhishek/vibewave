"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import he from "he"; // Assuming you are using the 'he' library for HTML entity decoding
import { useSongContext } from "@/components/song-context";
import Link from "next/link";

interface ArtistNameProps {
  name: string;
}

interface CardContentProps {
  title: string;
  image: string;
  link: string;
  type: string;
  artists: string;
  likeCount: number;
  downloadUrl: string;
}

const Player = ({ className }: { className?: string }) => {
  const [songData, setSongData] = useState<CardContentProps | null>(null);
  const [songId, setSongId] = useState<string>(""); // To store the current song ID
  const [currentTime, setCurrentTime] = useState(0); // To store the current playback time
  const [duration, setDuration] = useState(0); // To store the total duration of the song
  const [isPlaying, setIsPlaying] = useState(false); // To control play/pause state
  const audioElement = useRef<HTMLAudioElement>(null);
  const { currentSongId } = useSongContext();

  // Fetch song data when the component mounts
  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const res = await fetch(`/api/current-song`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          const song = data.data.data[0];

          // Transform the response data into the desired format
          const formattedData: CardContentProps = {
            title: he.decode(song.name),
            image: song.image[song.image.length - 1]?.url,
            link: `/${song.type}/${song.id}`,
            type: song.type,
            artists: song.artists.primary
              ? he.decode(
                  song.artists.primary
                    ?.map(
                      (singer: ArtistNameProps, idx: number) =>
                        singer?.name +
                        (idx === song.artists.primary.length - 1 ? "" : ", ")
                    )
                    .join("")
                )
              : "",
            likeCount: 0, // Set the like count (you can modify it as needed)
            downloadUrl: song.downloadUrl[song?.downloadUrl?.length - 1].url,
          };

          // Set the song data and song ID to the state
          setSongData(formattedData);
          setSongId(song.id); // Store the song ID

          // Retrieve the stored current time from localStorage
          const savedTime = localStorage.getItem(`song-${song.id}-time`);
          if (savedTime) {
            setCurrentTime(parseFloat(savedTime)); // Set the current time to the saved time
          }
        } else {
          console.error("Error fetching current song:", res.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch song data:", error);
      }
    };

    fetchSongData();
  }, [currentSongId]); // Added songData as a dependency to re-fetch when it changes

  // Function to toggle play/pause
  const togglePlay = () => {
    if (audioElement.current) {
      // If the song is already playing, pause it
      if (isPlaying) {
        audioElement.current.pause();
      } else {
        // If the song is not playing, set the current time from saved state
        audioElement.current.currentTime = currentTime;
        audioElement.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioElement.current) {
      if (isPlaying) {
        audioElement.current.autoplay = true;
        audioElement.current.play();
      } else {
        audioElement.current.pause();
      }
    }
  }, [isPlaying, currentSongId]); // Only run this effect when the `play` or `pause` state changes

  // // Skip forward to the next song
  // const skipForward = async () => {
  //   try {
  //     const response = await fetch(`/api/next-song?currentSongId=${songId}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       const nextSong = data.song;

  //       setSongData({
  //         title: he.decode(nextSong.name),
  //         image: nextSong.image[nextSong.image.length - 1]?.url,
  //         link: `/${nextSong.type}/${nextSong.id}`,
  //         type: nextSong.type,
  //         artists: nextSong.artists.primary
  //           ? he.decode(
  //               nextSong.artists.primary
  //                 ?.map(
  //                   (singer: ArtistNameProps, idx: number) =>
  //                     singer?.name +
  //                     (idx === nextSong.artists.primary.length - 1 ? "" : ", ")
  //                 )
  //                 .join("")
  //             )
  //           : "",
  //         likeCount: 0,
  //         downloadUrl:
  //           nextSong.downloadUrl[nextSong?.downloadUrl?.length - 1].url,
  //       });
  //       setSongId(nextSong.id);
  //       if (audioElement.current) {
  //         audioElement.current.src =
  //           nextSong.downloadUrl[nextSong?.downloadUrl?.length - 1].url;
  //         audioElement.current.play(); // Play the next song
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error skipping forward:", error);
  //   }
  // };

  // // Skip backward to the previous song
  // const skipBack = async () => {
  //   try {
  //     const response = await fetch(`/api/prev-song?currentSongId=${songId}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       const prevSong = data.song;

  //       setSongData({
  //         title: he.decode(prevSong.name),
  //         image: prevSong.image[prevSong.image.length - 1]?.url,
  //         link: `/${prevSong.type}/${prevSong.id}`,
  //         type: prevSong.type,
  //         artists: prevSong.artists.primary
  //           ? he.decode(
  //               prevSong.artists.primary
  //                 ?.map(
  //                   (singer: ArtistNameProps, idx: number) =>
  //                     singer?.name +
  //                     (idx === prevSong.artists.primary.length - 1 ? "" : ", ")
  //                 )
  //                 .join("")
  //             )
  //           : "",
  //         likeCount: 0,
  //         downloadUrl:
  //           prevSong.downloadUrl[prevSong?.downloadUrl?.length - 1].url,
  //       });
  //       setSongId(prevSong.id);
  //       if (audioElement.current) {
  //         audioElement.current.src =
  //           prevSong.downloadUrl[prevSong?.downloadUrl?.length - 1].url;
  //         audioElement.current.play(); // Play the previous song
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error skipping back:", error);
  //   }
  // };

  // Function to handle the onTimeUpdate event
  const onPlaying = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = event.target as HTMLAudioElement;
    setCurrentTime(audio.currentTime); // Update the current time

    // Save the current time in localStorage
    if (songId) {
      localStorage.setItem(`song-${songId}-time`, audio.currentTime.toString());
    }

    setDuration(audio.duration); // Update the duration
  };

  // If no song data is provided, show fallback UI
  if (!songData) {
    return <></>;
  }

  // Helper function to format time in minutes:seconds
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className={cn(
        className,
        "flex justify-between h-32 sm:h-20 px-4 py-2 rounded-md gap-10 items-start bg-primary/5 backdrop-blur-sm"
      )}
    >
      <audio
        ref={audioElement}
        src={songData?.downloadUrl}
        onTimeUpdate={onPlaying}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => {
          const audio = e.target as HTMLAudioElement;
          setDuration(audio.duration);
        }}
      />
      <Link href={`/${songData.type}/${currentSongId}`} className="flex items-center gap-4 w-fit">
        <Image
          src={songData.image}
          alt={songData.title}
          width={50}
          height={50}
          className={"rounded-md"}
        />
        <div className="hidden lg:flex flex-col justify-center w-40 pr-10">
          <h3 className="font-bold truncate">
            {songData.title}
          </h3>
          <p className="text-xs text-secondary-foreground truncate w-[60%]">
            {songData.artists}
          </p>
        </div>
      </Link>
      <div className="flex flex-col items-center w-fit gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span>{formatTime(currentTime)}</span>
          <Slider
            max={100}
            step={0.000001}
            value={[Math.floor((currentTime / duration) * 100)]} // Use percentage for progress
            onValueChange={(value) => {
              if (audioElement.current) {
                const newTime = (value[0] / 100) * duration;
                audioElement.current.currentTime = newTime; // Update audio current time
              }
            }}
            className="w-28 md:w-40 lg:w-[14rem] xl:w-[25rem]"
          />
          <span>{formatTime(duration)}</span>
        </div>
        <div className="col-start-2 justify-self-center flex items-center sm:flex-row flex-col justify-normal gap-2">
          <div className="flex gap-2">
            <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
              <SkipBack className="size-4 lg:size-6" />
            </div>
            <div
              className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer"
              onClick={togglePlay}
            >
              {!audioElement.current?.paused ? (
                <Pause className="text-primary size-4 lg:size-6" />
              ) : (
                <Play className="text-primary size-4 lg:size-6" />
              )}
            </div>
            <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
              <SkipForward className="size-4 lg:size-6" />
            </div>
            <div className="bg-primary/5 p-2 rounded-full cursor-pointer">
              <Repeat className="text-primary size-4 lg:size-6" />
            </div>
          </div>
          <div className="sm:hidden flex gap-2 items-start justify-center">
            <div className="text-primary cursor-pointer text-[0.55rem] leading-[0.5rem] flex flex-col gap-2 items-center justify-center">
              <span className="bg-primary/5 p-2 rounded-full ">
                <Heart className="size-4 lg:size-6" />
              </span>{" "}
              <span>1M</span>
            </div>
            <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
              <ListMusic className="size-4 lg:size-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex gap-2 items-start justify-center">
        <div className="text-primary cursor-pointer text-[0.55rem] leading-[0.5rem] flex flex-col gap-2 items-center justify-center">
          <span className="bg-primary/5 p-2 rounded-full ">
            <Heart className="size-4 lg:size-6" />
          </span>{" "}
          <span>1M</span>
        </div>
        <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
          <ListMusic className="size-4 lg:size-6" />
        </div>
      </div>
    </div>
  );
};

export default Player;
