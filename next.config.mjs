/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/ipfs/**",
      },
      
       
    ],
  },
};

export default nextConfig;
