/** @type {import('next').NextConfig} */
const NextFederationPlugin = require("@module-federation/nextjs-mf");

const getFormattedDateWithHour = (date = new Date()) => {
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month (01-12)
  const dd = String(date.getDate()).padStart(2, "0"); // Day (01-31)
  const yy = String(date.getFullYear()).slice(-2); // Year (last two digits)
  const hh = date.getHours(); // Hour (00-23)
  let HHadd = hh > 18 ? 4 : hh > 12 ? 3 : hh > 6 ? 2 : 1;

  return `${mm}${dd}${yy}${HHadd}`; // Format: MMDDYYHH
};

const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true, // Disable image optimization for all images - recommended for production if using external URLs
    domains: [
      "zwilt.s3.amazonaws.com",
      "zwilt.s3.us-east-1.amazonaws.com",
      "d2b6gadzbomflj.cloudfront.net",
      "res.cloudinary.com",
      "media.w3.org",
      "amazonaws.com",
      "s3.amazonaws.com",
      "s3.us-east-1.amazonaws.com",
      "zwilt.s3.us-east-1.amazonaws.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zwilt.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "letsenhance.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      }
    ],
    // Next.js only allows 'image/webp' and 'image/avif' in formats
    // Add formats to prevent browser warnings
    formats: ['image/webp', 'image/avif'],
    // Increase the image buffer size for larger images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  webpack(config, options) {
    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: "next1",
        filename: "static/chunks/remoteEntry7_3.js",
        remotes: {
          remoteApp: `remoteApp@${
            process.env.NEXT_PUBLIC_STORE_APP
          }/_next/static/${
            isServer ? "ssr" : "chunks"
          }/remoteEntry7_3.js?ts=${getFormattedDateWithHour()}`,
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
