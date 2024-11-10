"use client";

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
import React from "react";

type Props = {
  isPlaylistOrArtistCollectionSong: boolean;
  data: CardContentProps;
  id: string;
  isPlay: boolean;
  isArtist: boolean;
  isPlaying: boolean;
};

const SongOrArtistCard = ({
  isPlaylistOrArtistCollectionSong,
  data,
  id,
  isPlay,
  isArtist,
  isPlaying,
}: Props) => {
  const { setCurrentSongId } = useSongContext();
  const handleSongClick = async () => {
    if (data.type === "song") {
      try {
        const response = await fetch(
          `/api/current-song`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentSongId: id }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to update current song:", errorText);
          return;
        }

        setCurrentSongId(id);

      } catch (error) {
        console.error(
          "An error occurred while updating the current song:",
          error
        );
      }
    }
  };

  return (
    <span onClick={handleSongClick}>
      {!isPlaylistOrArtistCollectionSong && !isArtist ? (
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
                    <Heart size={20} /> <span>{data.likeCount === "0" ? "Likes" : data.likeCount}</span>
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
                      <Heart size={20} /> <span>{data.likeCount === "0" ? "Likes" : data.likeCount}</span>
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
      )}
    </span>
  );
};

export default SongOrArtistCard;
