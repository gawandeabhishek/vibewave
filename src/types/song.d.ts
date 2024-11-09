export type SongProps = {
  image: string;
  title: string;
  artist: string;
  download: string;
  type: string;
  language: string;
  link: string;
};

export type PlaylistProps = {
  image: string;
  title: string;
  artist: string;
  type: string;
  language: string;
  link: string;
  songs: SongProps[];
  description: string;
  year: number;
};
