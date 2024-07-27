/** @type {import('next').NextConfig} */
// const withMDX = require('@next/mdx')()

import withMDX from '@next/mdx'

const nextConfig = {
    // Configure `pageExtensions` to include MDX files
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    // Optionally, add any other Next.js config below
    images: {
         remotePatterns : [
            {
                hostname: "cochincruiseline.com",
                protocol: "https",
                
            },
            {
                hostname: "drive.google.com",
                protocol: "https"
            }
         ]
    }
};

export default withMDX()(nextConfig)