import { SnowTypeConfig } from "@snowplow/snowtype/types";
const config: SnowTypeConfig = {
  igluCentralSchemas: [],
  dataStructures: [],
  repositories: [],
  eventSpecificationIds: [],
  dataProductIds: [
    'eb003f2a-9b7b-46cf-ad7b-b8f2ee52bef9'
  ],
  organizationId: 'b12539df-a711-42bd-bdfa-175308c55fd5',
  tracker: '@snowplow/browser-tracker',
  language: 'typescript',
  outpath: './snowtype'
}

export default config;