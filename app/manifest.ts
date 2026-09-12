import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ORVENLUX',
    short_name: 'ORVENLUX',
    description: 'Luxury Watches & Accessories',
    start_url: '/',
    display: 'standalone',
    background_color: '#2A2825', // Charcoal
    theme_color: '#D4AF37', // Gold
    icons: [
      {
        src: '/icon-192x192.png', // تأكد من إضافة هذه الأيقونات في مجلد public
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}