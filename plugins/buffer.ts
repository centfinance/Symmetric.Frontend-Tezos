import { Buffer } from "buffer";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", () => {
    window.Buffer = Buffer;
  });
});
