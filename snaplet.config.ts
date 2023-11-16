// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path=".snaplet/snaplet.d.ts" />
import { defineConfig } from "snaplet";
import { copycat, faker } from "@snaplet/copycat";
copycat.setHashKey("8aaRKZQlbOxpoNpa");
export default defineConfig({
  generate: {
    async run(snaplet) {
      await snaplet.auth_users((x) => x(5));
      await snaplet.posts((x) => x(50));
    },
  },
});
