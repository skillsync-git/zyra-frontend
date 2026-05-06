/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-xmg2fjjbya-uc.a.run.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://zyra-website.onrender.com/api/:path*',
      },
    ];
  },
};

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   images: {
// //     unoptimized: true,
// //     remotePatterns: [
// //       {
// //         protocol: 'https',
// //         hostname: 'storage.googleapis.com',
// //         pathname: '/**',
// //       },
// //       {
// //         protocol: 'http',
// //         hostname: 'localhost',
// //         pathname: '/uploads/**',
// //       },
// //     ],
// //   },
// // };
// // export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   trailingSlash: true,
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'storage.googleapis.com',
//         pathname: '/**',
//       },
//     ],
//   },
// };
// export default nextConfig;