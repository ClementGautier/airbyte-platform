import fs from "node:fs";
import path from "node:path";

import { defineConfig, Options } from "orval";

import * as apis from "./src/core/api/apis";

type ApiFn = keyof typeof apis;

/**
 * A method returning a post processing hook that will generate the files that will reexport all types
 * into src/core/api/types.
 */
const createTypeReexportFile = (name: string) => {
  return () => {
    console.log(`Write type re-export file for ${name}...`);
    fs.writeFileSync(`./src/core/api/types/${name}.ts`, `export * from "../generated/${name}.schemas";\n`);
  };
};

/**
 * A post processing hook that will enforce the options paramter to become mandatory, since
 * Orval always will generate it as an optional parameter.
 */
const makeSecondParameterMandatory = (files: string[]) => {
  console.log(`Make options parameter mandatory in ${path.basename(files[0])}...`);
  const newContent = fs
    .readFileSync(files[0], { encoding: "utf-8" })
    .replace(/options\?: SecondParameter/g, "options: SecondParameter");
  fs.writeFileSync(files[0], newContent);
};

/**
 * Helper function to create an new auto generated API.
 *
 * @param inputSpecFile The path (relative to airbyte-webapp) to the OpenAPI spec from which to generate an API.
 * @param name The name of the output file for this API.
 * @param apiFn The API function in src/core/api/apis.ts to call for this API. This function must be specific
 *              for this API and use the base api path that this API is reachable under. You don't need to pass this
 *              for type only APIs (i.e. if you don't want to use the generated fetching functions).
 */
const createApi = (inputSpecFile: string, name: string, apiFn?: ApiFn): Options => {
  return {
    input: inputSpecFile,
    output: {
      mode: "split",
      target: `./src/core/api/generated/${name}.ts`,
      prettier: true,
      override: {
        header: (info) => [
          `eslint-disable`,
          `Generated by orval 🍺`,
          `Do not edit manually. Run "pnpm run generate-client" instead.`,
          ...(info.title ? [info.title] : []),
          ...(info.description ? [info.description] : []),
          ...(info.version ? [`OpenAPI spec version: ${info.version}`] : []),
        ],
        // Do only use the mutator if an `apiFn` to call has been specified.
        ...(apiFn
          ? {
              mutator: {
                path: "./src/core/api/apis.ts",
                name: apiFn,
              },
            }
          : {}),
      },
    },
    hooks: {
      afterAllFilesWrite: [makeSecondParameterMandatory, createTypeReexportFile(name)],
    },
  };
};

export default defineConfig({
  api: createApi("../airbyte-api/src/main/openapi/config.yaml", "AirbyteClient", "apiCall"),
  // Can be uncommented to manually generate updated CloudApi files, when running in airbyte-platform-internal
  // cloudApi: createApi("../../cloud-api/src/main/openapi/config.yaml", "CloudApi", "cloudApiCall"),
  connectorBuilder: createApi(
    "../airbyte-connector-builder-server/src/main/openapi/openapi.yaml",
    "ConnectorBuilderClient",
    "connectorBuilderApiCall"
  ),
  connectorManifest: createApi("./src/services/connectorBuilder/connector_manifest_openapi.yaml", "ConnectorManifest"),
});
