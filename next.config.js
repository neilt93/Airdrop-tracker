/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle undici's private class fields
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { 
              targets: { node: 'current' },
              modules: false
            }]
          ],
          plugins: [
            ['@babel/plugin-transform-private-methods', { loose: true }],
            ['@babel/plugin-transform-class-properties', { loose: true }],
            ['@babel/plugin-transform-private-property-in-object', { loose: true }]
          ],
          cacheDirectory: true
        }
      }
    })

    // Add fallback for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false
    }

    return config
  }
}

module.exports = nextConfig 