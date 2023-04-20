/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://github.com/stipsan/react-spring-bottom-sheet/issues/210
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      "dev-meme-media.s3.us-east-2.amazonaws.com",
      "prod-meme-media.s3.us-east-2.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-meme-media.s3.us-east-2.amazonaws.com",
        pathname: "/*",
        port: "",
      },
      {
        protocol: "https",
        hostname: "prod-meme-media.s3.us-east-2.amazonaws.com",
        pathname: "/*",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
