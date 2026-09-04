import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/bayi-panel", "/api/", "/mesajlarim"],
      },
    ],
    sitemap: "https://www.tezgahci.com.tr/sitemap.xml",
  };
}
