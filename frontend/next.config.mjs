/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ohara-assets.s3.us-east-2.amazonaws.com',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                // Target the asp.net backend url configured locally
                destination: process.env.NEXT_PUBLIC_API_URL
                    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`
                    : 'https://localhost:7160/api/v1/:path*',
            },
        ]
    }
};

export default nextConfig;
