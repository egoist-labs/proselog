// @ts-check
const pkg = require("./package.json")

/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    APP_DESCRIPTION: pkg.description,
  },
  output: "standalone",
  experimental: {
    scrollRestoration: true,
  },
  webpack(config) {
    class UnoCSS {
      /**
       *
       * @param {import('webpack').Compiler} compiler
       */
      apply(compiler) {
        const spawn = require("cross-spawn")

        compiler.hooks.beforeRun.tapPromise("unocss", async () => {
          if (globalThis.uno_built) return
          globalThis.uno_watching = true
          spawn.sync("pnpm", ["uno-generate"], { stdio: "inherit" })
        })
        compiler.hooks.watchRun.tap("unocss", () => {
          if (globalThis.uno_watching) return
          globalThis.uno_watching = true
          spawn("pnpm", ["uno-generate", "--watch"], { stdio: "inherit" })
        })
      }
    }

    config.plugins.push(new UnoCSS())
    return config
  },
}
