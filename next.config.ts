import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/guthix',
        destination: '/?ref=3a2546e2-74a6-40f4-8133-1f12388c1049&topic=See+How+Much+Cash+You+Can+Take+Out+Of+Your+House&chatslug=A+Cash+Out+Refinance',
        permanent: false, // Use false (307) so you can easily change it later without browser caching
      },
    ];
  },
};

export default nextConfig;
