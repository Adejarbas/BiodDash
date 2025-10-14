/** @type {import('next').NextConfig} */
const nextConfig = {
  //Evita multiplas montagens no dev mode
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
}

export default nextConfig
