"use client";

import { useSongContext } from "@/components/song-context";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import he from "he";
import {
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LikeButton from "../like-button";

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
  songId: string;
}

const Player = ({ className }: { className?: string }) => {
  const [songData, setSongData] = useState<CardContentProps | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isPlaying");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [isLoop, setIsLoop] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isLoop");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [onceLoop, setOnceLoop] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("onceLoop");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const audioElement = useRef<HTMLAudioElement>(null);
  const { currentSongId, setCurrentSongId } = useSongContext();
  const [songs, setSongs] = useState<CardContentProps[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);

  // Fetch song data when the component mounts or currentSongId changes
  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const res = await fetch(`/api/current-song`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          const song = data.data.data[0];

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
            likeCount: 0,
            downloadUrl: song.downloadUrl[song?.downloadUrl?.length - 1].url,
            songId: song.id,
          };

          setSongData(formattedData);
          setCurrentSongId(song.id); // Store the song ID

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
  }, [currentSongId, currentSongIndex, setCurrentSongId]);

  // Handle audio playback and state changes
  useEffect(() => {
    if (audioElement.current) {
      if (isPlaying) {
        audioElement.current.autoplay = true;
        audioElement.current.play();
      } else {
        audioElement.current.pause();
      }
    }
  }, [isPlaying, currentSongId]);

  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("isPlaying", JSON.stringify(isPlaying));
  }, [isPlaying]);

  useEffect(() => {
    localStorage.setItem("isLoop", JSON.stringify(isLoop));
  }, [isLoop]);

  useEffect(() => {
    localStorage.setItem("onceLoop", JSON.stringify(onceLoop));
  }, [onceLoop]);

  // Handle audio end event
  const handleEnd = () => {
    if (isLoop) {
      // Restart the audio from the beginning
      audioElement.current!.currentTime = 0;
      audioElement.current!.play();
      setCurrentTime(0);
    } else if (onceLoop) {
      // Restart the audio from the beginning
      audioElement.current!.currentTime = 0;
      audioElement.current!.play();
      setCurrentTime(0);
      setOnceLoop(false);
      setIsLoop(false);
    } else {
      skipForward();
    }
  };

  const handleLoopingClick = () => {
    if (!isLoop && !onceLoop) {
      setIsLoop(false);
      setOnceLoop(true);
    } else if (onceLoop && !isLoop) {
      setIsLoop(true);
      setOnceLoop(false);
    } else {
      setIsLoop(false);
      setOnceLoop(false);
    }
  };

  // Function to toggle play/pause
  const togglePlay = () => {
    setIsPlaying((prev: boolean) => !prev);
  };

  // Fetch songs from the database
  useEffect(() => {
    const fetchSongsFromDB = async () => {
      try {
        const res = await fetch(`/api/songs`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setCurrentSongIndex(data.currentIndex);
          setCurrentSongId(data.id);
          setSongs(data.songs);
        } else {
          console.error("Failed to fetch songs:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongsFromDB();
  }, [currentSongId, setCurrentSongId]);

  const skipForward = async () => {
    if (currentSongIndex + 1 >= songs.length) {
      try {
        const res = await fetch(`/api/songs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentSongId }),
        });
        if (res.ok) {
          const data = await res.json();
          const song = data.data;

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
            songId: song.id,
          };
          const saved = await fetch(`/api/current-song`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentSongId: song.id }),
            credentials: "include", // Ensure cookies are sent
          });

          if (!saved.ok) {
            const errorText = await saved.text();
            console.error("Failed to update current song:", errorText);
            return;
          }

          // Set the song data and song ID to the state
          setSongData(formattedData);
          setCurrentSongId(song.id); // Store the song ID
        }
      } catch (error) {
        console.error("Error updating queue:", error);
      }
    } else {
      const nextIndex = currentSongIndex + 1; // Calculate the previous song index
      const nextSong = songs[nextIndex];

      if (nextSong) {
        setCurrentSongIndex(nextIndex);
        setSongData(nextSong);
        setCurrentSongId(nextSong.songId); // Update context with the previous song ID

        try {
          const res = await fetch(`/api/current-song`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentSongId: nextSong.songId }),
            credentials: "include",
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to update current song:", errorText);
          }
        } catch (error) {
          console.error("Error updating queue:", error);
        }

        if (audioElement.current) {
          audioElement.current.src = nextSong.downloadUrl;
          audioElement.current.load();
          audioElement.current.play();
          setIsPlaying(true);
        }
      }
    }
  };

  const skipBack = async () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length; // Calculate the previous song index
    const prevSong = songs[prevIndex];

    if (prevSong) {
      setCurrentSongIndex(prevIndex);
      setSongData(prevSong);
      setCurrentSongId(prevSong.songId); // Update context with the previous song ID

      try {
        const res = await fetch(`/api/current-song`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentSongId: prevSong.songId }),
          credentials: "include",
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to update current song:", errorText);
        }
      } catch (error) {
        console.error("Error updating queue:", error);
      }

      if (audioElement.current) {
        audioElement.current.src = prevSong.downloadUrl;
        audioElement.current.load();
        audioElement.current.play();
        setIsPlaying(true);
      }
    }
  };

  const onPlaying = () => {
    if (audioElement.current) {
      const currentTime = audioElement.current.currentTime;
      localStorage.setItem(
        `song-${songData?.songId}-time`,
        currentTime.toString()
      );
      setCurrentTime(currentTime);
      setDuration(audioElement.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    songData && (
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
          onEnded={handleEnd}
          onLoadedMetadata={(e) => {
            const audio = e.target as HTMLAudioElement;
            setDuration(audio.duration);
          }}
        />
        <Link
          href={`/${songData.type}/${currentSongId}`}
          className="flex items-center gap-4 w-fit"
        >
          <Image
            src={songData.image}
            alt={songData.title}
            width={50}
            height={50}
            className={"rounded-md"}
          />
          <div className="hidden lg:flex flex-col justify-center w-40 pr-10">
            <h3 className="font-bold truncate">{songData.title}</h3>
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
              value={[Math.floor((currentTime / duration) * 100)]}
              onValueChange={(value) => {
                if (audioElement.current) {
                  const newTime = (value[0] / 100) * duration;
                  audioElement.current.currentTime = newTime;
                }
              }}
              className="w-28 md:w-40 lg:w-[14rem] xl:w-[25rem]"
            />
            <span>{formatTime(duration)}</span>
          </div>
          <div className="col-start-2 justify-self-center flex items-center sm:flex-row flex-col justify-normal gap-2">
            <div className="flex gap-2">
              <div
                className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer"
                onClick={skipBack}
              >
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
              <div
                className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer"
                onClick={skipForward}
              >
                <SkipForward className="size-4 lg:size-6" />
              </div>
              <div
                className="bg-primary/5 p-2 rounded-full cursor-pointer"
                onClick={handleLoopingClick}
              >
                {onceLoop ? (
                  <Repeat />
                ) : isLoop ? (
                  <Repeat1 />
                ) : (
                  <Shuffle className="text-primary size-4 lg:size-6" />
                )}
              </div>
            </div>
            <div className="sm:hidden flex gap-2 items-start justify-center">
              <div className="text-primary cursor-pointer text-[0.55rem] leading-[0.5rem] flex flex-col gap-2 items-center justify-center">
                <LikeButton id={songData.songId} isPlayerIcon />
              </div>
              <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
                <ListMusic className="size-4 lg:size-6" />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex gap-2 items-start justify-center">
          <div className="text-primary cursor-pointer text-[0.55rem] leading-[0.5rem] flex flex-col gap-2 items-center justify-center">
            <LikeButton id={songData.songId} isPlayerIcon />
          </div>
          <div className="bg-primary/5 p-2 rounded-full text-primary cursor-pointer">
            <ListMusic className="size-4 lg:size-6" />
          </div>
        </div>
      </div>
    )
  );
};

export default Player;
