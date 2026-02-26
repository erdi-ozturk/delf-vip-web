import { MetadataRoute } from "next";
import { db } from "@/app/lib/db";

const baseUrl = "https://www.delfvip.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Statik sayfalar
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/booking`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/services`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tours`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/terms`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Araç sayfaları (DB'den dinamik)
  let vehicleRoutes: MetadataRoute.Sitemap = [];
  try {
    const vehicles = await db.vehicle.findMany({ select: { name: true } });
    vehicleRoutes = vehicles.map((v) => ({
      url: `${baseUrl}/booking?vehicle=${encodeURIComponent(v.name)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB erişilemezse sadece statik rotalar döner
  }

  return [...staticRoutes, ...vehicleRoutes];
}
