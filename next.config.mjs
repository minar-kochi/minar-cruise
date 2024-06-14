/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
         remotePatterns : [
            {
                hostname: "cochincruiseline.com",
                protocol: "https",
                
            }
         ]
    }
};

export default nextConfig;
