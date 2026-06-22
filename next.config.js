/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io', 'res.cloudinary.com', 'k1yeaaumim.ufs.sh', 'images.unsplash.com', 'lupz513xt9.ufs.sh', 'z3la6lekxc.ufs.sh', 'ik.imagekit.io'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig 