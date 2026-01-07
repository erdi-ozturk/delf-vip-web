import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Sanity resimleri
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash resimleri
      },
      {
        protocol: 'https',
        hostname: 'www.pngmart.com', // YENİ: Şeffaf araç resimleri için izin
      },

      { protocol: 'https', hostname: 'i.dha.com.tr' },
      { protocol: 'https', hostname: 'www.bogazdatekneturu.com' },
    ],
  },
};

export default nextConfig;