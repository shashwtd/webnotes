import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // im hardcoding this for now, might change later
      new URL("https://tjhhkcyacyjamhcuglhh.supabase.co/storage/v1/object/public/**"),
    ],
  }
};

export default nextConfig;
