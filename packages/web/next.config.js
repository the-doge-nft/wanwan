/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://github.com/stipsan/react-spring-bottom-sheet/issues/210
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "dev-meme-media.s3.us-east-2.amazonaws.com",
      "prod-meme-media.s3.us-east-2.amazonaws.com",
      "media.test.wanwan.me",
      "media.wanwan.me",
      "d2ajgff3y4gfea.cloudfront.net",
    ],
  },
};

module.exports = nextConfig;
