type Image = {
    quality: string;
    url: string;
  };
  
  type Lyrics = {
    lyrics: string;
    copyright: string | null;
    snippet: string | null;
  };
  
  type Artist = {
    id: string;
    name: string;
    role: string;
    type: string;
    image: Image[];
    url: string;
  };
  
  type Album = {
    id: string | null;
    name: string | null;
    url: string | null;
  };
  
  type Song = {
    id: string;
    name: string;
    type: string;
    year: number | null;
    releaseDate: string | null;
    duration: number | null;
    label: string | null;
    explicitContent: boolean;
    playCount: number | null;
    language: string;
    hasLyrics: boolean;
    lyricsId: string | null;
    lyrics: Lyrics | null;
    url: string;
    copyright: string | null;
    album: Album;
    artists: {
      primary: Artist[];
      featured: Artist[];
      all: Artist[];
    };
    image: Image[];
    downloadUrl: Image[];
  };
  
  type Playlist = {
    id: string;
    name: string;
    description: string | null;
    year: number | null;
    type: string;
    playCount: number | null;
    language: string;
    explicitContent: boolean;
    songCount: number | null;
    url: string;
    image: Image[];
    songs: Song[];
    artists: Artist[];
  };
  
  type TopSong = {
    id: string;
    name: string;
    type: string;
    year: number | null;
    releaseDate: string | null;
    duration: number | null;
    label: string | null;
    explicitContent: boolean;
    playCount: number | null;
    language: string;
    hasLyrics: boolean;
    lyricsId: string | null;
    lyrics: Lyrics | null;
    url: string;
    copyright: string | null;
    album: Album;
    artists: {
      primary: Artist[];
      featured: Artist[];
      all: Artist[];
    };
    image: Image[];
    downloadUrl: Image[];
  };
  
  type TopAlbum = {
    id: string;
    name: string;
    description: string;
    year: number | null;
    type: string;
    playCount: number | null;
    language: string;
    explicitContent: boolean;
    artists: {
      primary: Artist[];
      featured: Artist[];
      all: Artist[];
    };
    songCount: number | null;
    url: string;
    image: Image[];
    songs: Song[];
  };
  
  type ArtistProps = {
    success: boolean;
    data: {
      id: string;
      name: string;
      url: string;
      type: string;
      image: Image[];
      followerCount: number | null;
      fanCount: number | null;
      isVerified: boolean | null;
      dominantLanguage: string | null;
      dominantType: string | null;
      bio: {
        text: string | null;
        title: string | null;
        sequence: string | null;
      }[];
      dob: string | null;
      fb: string | null;
      twitter: string | null;
      wiki: string | null;
      availableLanguages: string[];
      isRadioPresent: boolean | null;
      topSongs: TopSong[];
      topAlbums: TopAlbum[];
      singles: Song[];
    };
  };
  
  type SongsProps = {
    success: boolean;
    data: Song[];
  };
  
  type PlaylistsProps = {
    success: boolean;
    data: Playlist;
  };
  