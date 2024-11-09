import AppCard from "@/components/global/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListMusic, Shuffle } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import numeral from "numeral";
import { PlaylistProps, SongProps } from "@/types/song";
import { ArtistCardProps, ArtistNameProps, ArtistProps } from "@/types/artists";
import he from "he";

type Props = {
  params: { dataId: string; id: string };
};

const page = async ({ params: { dataId, id } }: Props) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${dataId}/${id}`);
  if (!res) return notFound();

  const formatFollowers = (count: number) => {
    return numeral(count).format("0.[0]a").toUpperCase();
  };

  if (!res.ok) {
    return notFound();
  }

  const result = await res.json();
  const song = () => {
    const raw = result.data.data[0];
    const data: SongProps = {
      image: raw.image[raw.image.length - 1]?.url,
      title: he.decode(raw.name),
      artist: raw.artists.primary
        ? he.decode(
            raw.artists.primary
              ?.map(
                (singer: ArtistNameProps, idx: number) =>
                  singer?.name +
                  (idx === raw.artists.primary.length - 1 ? "" : ", ")
              )
              .join("")
          )
        : "",
      download: raw.downloadUrl[raw.downloadUrl.length - 1].url,
      type: raw.type,
      language: raw.language,
      link: `/${raw.type}/${raw.id}`,
    };

    return (
      <main className="flex flex-col lg:flex-row items-center justify-start gap-20 p-10">
        <Image
          src={data.image}
          alt={data.title}
          height={300}
          width={300}
          className="rounded-xl"
        />
        <div className="flex flex-col items-start justify-center gap-2">
          <h3 className="text-5xl font-extrabold text-primary flex-grow">
            {data.title}
          </h3>
          <p className="text-primary/50 text-2xl flex-grow">{data.artist}</p>
        </div>
      </main>
    );
  };

  const playlist = () => {
    const raw = result.data.data;
    const data: PlaylistProps = {
      image: raw.image[raw.image.length - 1]?.url,
      title: raw.name,
      description: raw.description,
      year: raw.year,
      artist: raw.artists
        ? he.decode(
            raw.artists
              ?.map(
                (singer: ArtistNameProps, idx: number) =>
                  singer?.name +
                  (idx === raw.artists.length - 1 ? "" : ", ")
              )
              .join("")
          )
        : "",
      type: raw.type,
      language: raw.language,
      link: `/${raw.type}/${raw.id}`,
      songs: raw.songs,
    };
    return (
      <main className="min-h-screen">
        <div className="flex flex-col lg:flex-row items-center justify-start gap-20 p-10">
          <Image
            src={data.image}
            alt={data.title}
            height={300}
            width={300}
            className="rounded-xl"
          />
          <div className="flex flex-col items-start justify-center gap-2">
            <h3 className="text-2xl xl:text-5xl font-extrabold text-primary flex-grow">
              {data.title}
            </h3>
            {data.description ? (
              <p className="text-primary/50 flex-grow text-xs xl:text-base">
                {data.description}
              </p>
            ) : null}
            {data.artist ? <p>Artists: {data.artist}</p> : null}
            {data.year ? <p>Year: {data.year}</p> : null}
            {data.language ? <p>Language: {data.language}</p> : null}

            <div className="flex gap-4 items-center w-fit">
              <span
                className={cn(
                  buttonVariants({ variant: "secondary", size: "icon" }),
                  "my-4"
                )}
              >
                <Shuffle />
              </span>
              <span
                className={cn(
                  buttonVariants({ variant: "secondary", size: "icon" })
                )}
              >
                <ListMusic />
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2">
          {data.songs.map((item: SongProps, key: number) => (
            <AppCard cardContent={item} key={key} isPlay />
          ))}
        </div>
      </main>
    );
  };

  const artist = () => {
    const raw = result.data.data;
    const data: ArtistProps = {
      image: raw.image[raw.image.length - 1]?.url,
      title: he.decode(raw.name),
      year: raw.year,
      type: raw.type,
      language: raw.language,
      link: `/${raw.type}/${raw.id}`,
      followerCount: raw.followerCount,
      bio: {
        title: raw.bio[0] ? he.decode(raw.bio[0].title) : "",
        text: raw.bio[0] ? he.decode(raw.bio[0].text) : "",
      },
      songs: raw.topSongs,
      similarArtists: raw.similarArtists,
    };

    return (
      <main className="min-h-screen flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-center justify-start gap-20 p-10">
          <Image
            src={data.image}
            alt={data.title}
            height={300}
            width={300}
            className="rounded-xl"
          />
          <div className="flex flex-col items-start justify-center gap-2">
            <h3 className="text-5xl font-extrabold text-primary flex-grow">
              {data.title}
            </h3>
            {data.year ? <p>Year: {data.year}</p> : null}
            {data.language ? <p>Language: {data.language}</p> : null}
            {data.followerCount ? (
              <p>Followers: {formatFollowers(data.followerCount)}</p>
            ) : null}

            <div>
              <span className="font-bold">Bio</span>
              <p className="text-lg">
                <strong>Title:</strong> {data.bio.title}
              </p>
              <p className="text-xs text-primary/50">{data.bio.text}</p>
            </div>
          </div>
        </div>
        <h3 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
          Top Songs
        </h3>
        <div className="flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2">
          {data.songs.map((item: SongProps, key: number) => (
            <AppCard cardContent={item} key={key} isPlay />
          ))}
        </div>
        {data.similarArtists.length > 0 ? (
          <>
            <h3 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
              Similar Artists
            </h3>
            <div className="flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2">
              {data.similarArtists.map((item: ArtistCardProps, key: number) => (
                <AppCard cardContent={item} key={key} isPlay isArtist />
              ))}
            </div>
          </>
        ) : null}
      </main>
    );
  };

  return dataId === "song"
    ? await song()
    : dataId === "playlist"
    ? await playlist()
    : dataId === "artist"
    ? await artist()
    : notFound();
};

export default page;
