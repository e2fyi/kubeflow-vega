#!/usr/bin/env node
import minimist from "minimist";
import * as vega from "vega";
import * as fs from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import genVegaLiteSpec from "./charts";
import genHtml from "./template";

const defaultUiMetadataPath = "/mlpipeline-ui-metadata.json";

type FieldType = "quantitative" | "temporal" | "ordinal" | "nominal";

interface SupportedArgs extends minimist.ParsedArgs {
  dpath: string;
  dtype: "json" | "csv" | "tsv" | "topojson";
  dkey?: string;
  x: string;
  xtype: FieldType;
  xagg: string;
  y: string;
  ytype: FieldType;
  yagg: string;
  aggregate?: string;
  mark: string;
  interactive?: boolean;
  spec?: string;
  width?: string | number;
  height?: string | number;
  "ui-metadata-path"?: string;
}

const {
  dpath,
  dtype = "csv",
  dkey = "",
  x = "",
  xtype = "quantitative",
  xagg = "",
  y = "",
  ytype = "quantitative",
  yagg = "",
  mark = "point",
  spec: specPath = "",
  interactive,
  height = "container",
  width = "container",
  "ui-metadata-path": uiMetadataPath = defaultUiMetadataPath,
} = minimist(process.argv.slice(2)) as SupportedArgs;

console.log(`reading data from ${dpath}`);
dkey && console.log(`selecting data from json.${dkey}`);

// load values
const schema = { type: dtype, property: dkey } as vega.Format;
const values = vega.read(fs.readFileSync(dpath).toString(), schema);

// generate spec
let spec: any = undefined;
if (typeof specPath === "string" && specPath !== "") {
  try {
    spec = JSON.parse(fs.readFileSync(specPath).toString());
  } catch (error) {
    console.log(error);
  }
}
spec = spec || genVegaLiteSpec({ mark, values, x, y, xagg, yagg, xtype, ytype, height, width });
console.log(`Generated spec: ${spec}`);

// writing ui-metadata
const uiMetadata = {
  outputs: [
    {
      type: "web-app",
      storage: "inline",
      source: genHtml(spec),
    },
  ],
};

mkdirp(path.dirname(uiMetadataPath))
  .then(() => {
    console.log(`writing mlpipeline-ui-metadata to ${uiMetadataPath}`);
    fs.writeFileSync(uiMetadataPath, JSON.stringify(uiMetadata));
  })
  .catch((error) => console.error(error));
