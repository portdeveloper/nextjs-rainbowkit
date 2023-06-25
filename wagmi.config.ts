import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "deployedContracts/generated.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "../hello_foundry",
    }),
  ],
});
