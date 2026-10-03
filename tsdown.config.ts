import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/game/index.ts",
    "src/manager/index.ts",
    "src/server/index.ts",
    "src/client/index.ts",
    "src/react-client/index.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
});
