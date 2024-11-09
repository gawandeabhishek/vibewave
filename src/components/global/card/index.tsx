"use client";

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
import { ArtistNameProps } from "@/types/artists";
import { CardContentProps, CardProps } from "@/types/card";
import { Heart, ListMusic, Play, CirclePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import he from "he";

const AppCard = ({
  cardContent,
  isPlay = false,
  isPlaying = false,
  isArtist = false,
  isPlaylist = false,
}: CardProps) => {
  const data: CardContentProps = {
    title: he.decode(cardContent.name),
    image: cardContent.image[cardContent.image.length - 1]?.url,
    link: `/${cardContent.type}/${cardContent.id}`,
    type: cardContent.type,
  };

  if (!isArtist && !isPlaylist) {
    data.artists = cardContent.artists.primary
      ? he.decode(
          cardContent.artists.primary
            ?.map(
              (singer: ArtistNameProps, idx: number) =>
                singer?.name +
                (idx === cardContent.artists.primary.length - 1 ? "" : ", ")
            )
            .join("")
        )
      : "";
    data.likeCount = "0"; // Default like count
  }

  if (isPlaylist) {
    data.language = cardContent.language;
  }

  const [isSavedPlaylist, setIsSavedPlaylist] = useState<boolean>(false);

  useEffect(() => {
    const checkIfPlaylistSaved = async () => {
      try {
        const res = await fetch(`/api/saved-playlists?playlistId=${cardContent.id}`, {
          method: "GET", // GET request to check existence
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (res) {
          const { exist } = await res.json();
          setIsSavedPlaylist(exist);
        } else {
          console.error("Failed to fetch playlist status");
        }
      } catch (error) {
        console.error("Error fetching saved playlist status:", error);
      }
    };
  
    if (cardContent.type === "playlist") {
      checkIfPlaylistSaved();
    }
  }, [cardContent.id, cardContent.type]);

  const handleListMusic = async () => {
    try {
      const response = await fetch("/api/saved-playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId: cardContent.id }),
      });

      if (response.ok) {
        setIsSavedPlaylist(true);
      } else {
        console.error("Failed to save playlist");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return isPlaylist ? (
    <Card
      className={cn(
        buttonVariants({ variant: isPlaying ? "secondary" : "ghost" }),
        "grid grid-cols-1 grid-flow-row gap-1 w-full h-fit border-none shadow-none !px-6 !py-4 place-content-center"
      )}
    >
      <Link
        href={`${data.link}`}
        className="grid grid-cols-2 gap-1 w-full place-content-center  h-fit "
      >
        <CardContent className="flex justify-center items-center w-full p-2 m-0">
          <Image
            src={data.image}
            alt={data.title}
            height={100}
            width={100}
            className="mt-4 rounded-xl h-10 w-10 sm:h-[4rem] sm:w-[4rem] lg:h-20 lg:w-20 xl:h-36 xl:w-36 !m-0"
          />
        </CardContent>

        <CardHeader className="py-0 flex flex-col justify-center w-full p-2">
          <CardTitle className="truncate w-[98%] text-xs sm:text-base">
            {data.title}
          </CardTitle>
          <CardDescription className="truncate w-[80%] text-xs">
            {data.language}
          </CardDescription>
        </CardHeader>
      </Link>
      <CardFooter className="flex justify-center items-center p-2 w-full">
        <CardDescription className="flex gap-4 items-center w-fit">
          <span
            className={cn(
              buttonVariants({ variant: "secondary", size: "icon" }),
              isSavedPlaylist && "bg-sidebar-ring"
            )}
            onClick={handleListMusic}
          >
            <ListMusic />
          </span>
          {isPlay && (
            <span
              className={cn(
                buttonVariants({ variant: "secondary", size: "icon" })
              )}
            >
              <CirclePlay />
            </span>
          )}
        </CardDescription>
      </CardFooter>
    </Card>
  ) : (
    <Link href={`${data.link}`}>
      <Card
        className={cn(
          buttonVariants({ variant: isPlaying ? "secondary" : "ghost" }),
          "flex flex-col w-60 h-fit border-none shadow-none p-0 justify-center items-center"
        )}
      >
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
          {!isArtist ? (
            <CardDescription className="w-[80%] truncate">
              {data.artists}
            </CardDescription>
          ) : null}
        </CardHeader>

        <CardFooter className="flex justify-center items-center py-2">
          {!isArtist ? (
            <CardDescription className="flex gap-4 items-center justify-center w-fit">
              <span className="text-xs !text-[0.55rem] !leading-[0.5rem] flex flex-col items-center justify-center gap-0.5">
                <>
                  <Heart size={20} /> <span>{data.likeCount}</span>
                </>
              </span>
              <span
                className={cn(
                  buttonVariants({ variant: "secondary", size: "icon" })
                )}
              >
                <ListMusic />
              </span>
              {isPlay ? (
                <span
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "icon" })
                  )}
                >
                  <Play />
                </span>
              ) : null}
            </CardDescription>
          ) : null}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default AppCard;