"use client"

import React from "react";
import AppCard from "../card";
import { useSearchContext } from "@/components/search-context";
import { PlaylistProps, SongProps } from "@/types/song";
import { ArtistCardProps } from "@/types/artists";

const SearchResult = () => {
  const { results } = useSearchContext();
  const songs = results?.songs?.data.results || [];
  const playlists = results?.playlists?.data.results || [];
  const artists = results?.artists?.data?.results || [];
  return results && (
    <div className="flex flex-col flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2 py-10">
      <div className="flex flex-col gap-10">
        {songs.length > 0 && (
          <h3 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
            Songs
          </h3>
        )}
        <div className="flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2">
          {songs.length > 0
            ? songs.map((item: SongProps, key: number) => (
                <AppCard cardContent={item} key={key} isPlay />
              ))
            : null}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {playlists.length > 0 && (
          <h3 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
            Playlists
          </h3>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 w-full">
          {playlists.length > 0
            ? playlists.map((item: PlaylistProps, key: number) => (
                <AppCard cardContent={item} key={key} isPlay isPlaylist />
              ))
            : null}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {artists.length > 0 && (
          <h3 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
            Artists
          </h3>
        )}
        <div className="flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2">
          {artists.length > 0
            ? artists.map((item: ArtistCardProps, key: number) => (
                <AppCard cardContent={item} key={key} isPlay isArtist />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
