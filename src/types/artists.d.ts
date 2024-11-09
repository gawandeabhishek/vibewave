export type ArtistImage = {
  quality: string;
  url: string;
};

export type ArtistNameProps = {
  id: string;
  name: string;
  role: string;
  type: string;
  image: ArtistImage[];
  url: string;
};

export type ArtistProps = {
  image: string;
  title: string;
  year: number;
  type: string;
  language: string;
  link: string;
  followerCount: number;
  bio: {
    title: string;
    text: string;
  };
  songs: SongProps[];
  similarArtists: ArtistCardProps[];
};

export type ArtistCardProps = {
  title: string;
  image: string;
};
