// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages: true,
  modules: [
    // ...
    "@nuxtjs/apollo",
    "nuxt-headlessui",
    "@nuxthq/ui",
    "@pinia/nuxt",
    "@pinia-orm/nuxt",
    "nuxt-quasar-ui",
  ],
  apollo: {
    clients: {
      default: {
        httpEndpoint: "http://3.89.241.7/v1/graphql",
      },
    },
  },
  quasar: {
    extras: {
      fontIcons: ["material-icons"],
    },
  },
});
