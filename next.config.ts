// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ Permetti immagini da percorsi locali e domini esterni
  images: {
    // Percorsi locali (relative al progetto)
    domains: [], // Per immagini remote (es. CDN)
    
    // Permetti pattern per immagini locali
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ⚠️ In produzione, specifica i domini esatti
      },
    ],
    
    // Ottimizzazione per sviluppo
    unoptimized: process.env.NODE_ENV === 'development',
    
    // Formati supportati
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },

  // ✅ Configura path alias se non già fatto
  experimental: {
    // serverComponentsExternalPackages: [],
  },
};

export default nextConfig;