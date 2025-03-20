import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "worker/sw.ts",
  swDest: "public/sw.js",
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [
        // anything pointing to <WEBSITE_URL>/api/auth/* will be rewritten to <PORTAL_URL>/portal/api/auth/*
        // this necessary because NextAuth will use its redirects to the current host/domain
        // and we want all the auth routes to be managed in the portal site
        {
          source: `/api/auth/:path*`,
          destination: `${process.env.NEXTAUTH_URL}/api/auth/:path*`,
        },
      ],
    };
  },
};

export default withSerwist(nextConfig);
