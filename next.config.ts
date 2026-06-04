import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/guthix',
        destination: '/?ref=0dcde69a-4e93-4fb1-b445-18420396aa72&topic=See+How+Much+Cash+You+Can+Take+Out+Of+Your+House&chatslug=A+Cash+Out+Refinance',
        permanent: false, // Use false (307) so you can easily change it later without browser caching
      },
    ];
  },
};

export default nextConfig;
