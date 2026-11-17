// Turbopack loads .js PostCSS configs through Node without bundling them.
// Resolve here, beside package.json, so its generated loader receives an
// absolute plugin path instead of resolving from .next/build/chunks.
module.exports = {
  plugins: {
    [require.resolve("@tailwindcss/postcss")]: {},
  },
};
