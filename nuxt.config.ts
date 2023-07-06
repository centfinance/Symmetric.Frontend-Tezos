import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages: true,
  tailwindcss: {
    injectPosition: "first",
    config: {
      content: [],
      // corePlugins: {
      //   preflight: false,
      // },
    },
  },
  modules: [
    // ...
    "nuxt-quasar-ui",
    "@nuxtjs/apollo",
    "nuxt-headlessui",
    "@nuxthq/ui",
    "@pinia/nuxt",
    "@pinia-orm/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  ssr: false,

  apollo: {
    clients: {
      default: {
        httpEndpoint: "http://35.171.27.49:8080/v1/graphql",
      },
    },
  },
  piniaPersistedstate: {
    storage: "localStorage",
  },
  quasar: {
    extras: {
      fontIcons: ["material-icons"],
    },
  },
  vite: {
    plugins: [nodePolyfills({})],
    // resolve: {
    //   alias: {
    //     util: "rollup-plugin-node-polyfills/polyfills/util",
    //     sys: "util",
    //     events: "rollup-plugin-node-polyfills/polyfills/events",
    //     stream: "rollup-plugin-node-polyfills/polyfills/stream",
    //     path: "rollup-plugin-node-polyfills/polyfills/path",
    //     querystring: "rollup-plugin-node-polyfills/polyfills/qs",
    //     punycode: "rollup-plugin-node-polyfills/polyfills/punycode",
    //     url: "rollup-plugin-node-polyfills/polyfills/url",
    //     http: "rollup-plugin-node-polyfills/polyfills/http",
    //     https: "rollup-plugin-node-polyfills/polyfills/http",
    //     os: "rollup-plugin-node-polyfills/polyfills/os",
    //     assert: "rollup-plugin-node-polyfills/polyfills/assert",
    //     constants: "rollup-plugin-node-polyfills/polyfills/constants",
    //     _stream_duplex:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/duplex",
    //     _stream_passthrough:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough",
    //     _stream_readable:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/readable",
    //     _stream_writable:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/writable",
    //     _stream_transform:
    //       "rollup-plugin-node-polyfills/polyfills/readable-stream/transform",
    //     timers: "rollup-plugin-node-polyfills/polyfills/timers",
    //     console: "rollup-plugin-node-polyfills/polyfills/console",
    //     vm: "rollup-plugin-node-polyfills/polyfills/vm",
    //     zlib: "rollup-plugin-node-polyfills/polyfills/zlib",
    //     tty: "rollup-plugin-node-polyfills/polyfills/tty",
    //     domain: "rollup-plugin-node-polyfills/polyfills/domain",
    //   },
    // },
    // optimizeDeps: {
    //   esbuildOptions: {
    //     define: {
    //       global: "globalThis",
    //     },
    //     plugins: [
    //       NodeGlobalsPolyfillPlugin({
    //         process: true,
    //         buffer: true,
    //       }),
    //     ],
    //   },
    // },
    // build: {
    //   rollupOptions: {
    //     plugins: [
    //       // Enable rollup polyfills plugin
    //       // used during production bundling
    //       rollupNodePolyFill({
    //         process: true,
    //         buffer: true,
    //       }),
    //     ],
    //   },
    // },
  },
});
