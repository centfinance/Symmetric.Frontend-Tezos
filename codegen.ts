import type { CodegenConfig } from "@graphql-codegen/cli";
import * as symmConfig from "./config/config";

const config: CodegenConfig = {
  schema: symmConfig.default.graphQLAPI,
  documents: ["*/*/*.vue", "*/*/*.ts"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
