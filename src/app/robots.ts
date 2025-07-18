// app/robots.ts

import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://vibewave.vercel.app/sitemap.xml",
    host: "https://vibewave.vercel.app",
  };
}
