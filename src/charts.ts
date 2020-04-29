export interface VegaChartProps {
  x: string;
  xtype: string;
  xagg: string;
  y: string;
  ytype: string;
  yagg: string;
  values: object[];
  mark: string;
  width: string | number;
  height: string | number;
}

export default function genVegaLiteSpec({
  mark,
  values,
  x,
  xtype,
  xagg,
  y,
  ytype,
  yagg,
  width,
  height,
}: VegaChartProps) {
  const xfield =
    typeof xagg === "boolean" || xagg === ""
      ? { field: x, type: xtype }
      : { aggregate: xagg, type: xtype };
  const yfield =
    typeof yagg === "boolean" || yagg === ""
      ? { field: y, type: ytype }
      : { aggregate: yagg, type: ytype };

  const encoding: any = {};
  if (typeof x === "string" && x !== "") encoding.x = xfield;
  if (typeof y === "string" && y !== "") encoding.y = yfield;

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    width,
    height,
    data: { values },
    mark: { type: mark, tooltip: true },
    encoding,
  };
}
