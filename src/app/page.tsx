// import { onAuthenticateUser } from "@/actions/user";
import AppCard from "@/components/global/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CardContentProps } from "@/types/card";
import Link from "next/link";

export default async function Home() {

  // const auth = await onAuthenticateUser();
  // if (auth.status === 400 || auth.status === 500 || auth.status === 404) return redirect('/auth/sign-in');
  const songData = await fetch(`${process.env.BASE_URL}/api/top-songs`);

  const song_data = await songData.json();

  const topSongs = await song_data?.data?.data?.results;

  const playlistData = await fetch(
    `${process.env.BASE_URL}/api/top-playlists`
  );

  const playlist_data = await playlistData.json();

  const topPlaylists = await playlist_data?.data?.data?.results;

  const artistData = await fetch(
    `${process.env.BASE_URL}/api/featured-artists`,
    {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
    }
  );

  const artist_data = await artistData.json();

  const topArtists = await artist_data?.data?.data?.results;

  const content = [
    {
      title: "Top Songs",
      cardContent: topSongs,
      link: "/top-songs",
    },
    {
      title: "Top Playlists",
      cardContent: topPlaylists,
      link: "/top-playlists",
    },
    {
      title: "Featured Artists",
      cardContent: topArtists,
      link: "/featured-artists",
    },
  ];

  return (
    <div className="flex flex-col justify-center gap-10 py-10">
      {content.map((item, key) => (
        <div className="flex flex-col gap-6" key={key}>
          <h3 className="font-extrabold pl-4 sm:pl-0 text-3xl sm:text-5xl sm:text-start">
            {item.title}
          </h3>
          <Link href={`${item.link}`} className="text-xs pl-4">
            <Badge className="py-2">Show more</Badge>
          </Link>
          <div
            className={cn(
              item.title === "Top Playlists"
                ? "grid grid-cols-1 lg:grid-cols-2 gap-1 w-full"
                : "flex flex-wrap justify-center items-center lg:items-start lg:justify-start gap-2"
            )}
          >
            {item.cardContent.map((data: CardContentProps, idx: number) =>
              idx < 4 ? (
                <AppCard
                  cardContent={data}
                  key={idx}
                  isArtist={data.type === "artist"}
                  isPlaylist={data.type === "playlist"}
                />
              ) : null
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
