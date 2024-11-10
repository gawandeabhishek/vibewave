import { PlaylistProps, SongProps, ArtistProps } from "./data";

export type CardProps = {
  cardContent: ArtistProps | PlaylistProps | SongProps;
  isPlay?: boolean;
  isPlaying?: boolean;
  isArtist?: boolean;
  isPlaylist?: boolean;
  isSavedPlaylist?: boolean;
};

export type CardContentProps = {
  title: string;
  image: string;
  link: string;
  artists?: string;
  language?: string;
  likeCount?: string;
  type: string;
};
