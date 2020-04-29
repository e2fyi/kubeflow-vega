export interface VegaVersions {
  vega?: number;
  vegaLite?: number;
  vegaEmbed?: number;
}

export default (
  spec: object,
  { vega = 5, vegaLite = 4, vegaEmbed = 6 }: VegaVersions = {}
) => `
<!DOCTYPE html>
<html>
<head>
  <!-- Import Vega & Vega-Lite (does not have to be from CDN) -->
  <script src="https://cdn.jsdelivr.net/npm/vega@${vega}"></script>
  <script src="https://cdn.jsdelivr.net/npm/vega-lite@${vegaLite}"></script>
  <!-- Import vega-embed -->
  <script src="https://cdn.jsdelivr.net/npm/vega-embed@${vegaEmbed}"></script>
  <style>
    body, #vis {
      width: 100vw;
      height: 100vh;
      margin: 0px;
      padding: 0px;
      box-sizing: border-box;
    }
    #vis {
      max-width: 800px;
    }
  </style>

</head>
<body>

<div id="vis"></div>

<script type="text/javascript">
  var spec = ${JSON.stringify(spec)};
  vegaEmbed('#vis', spec, {tooltip: true, hover: true}).then(function(result) {
    // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
  }).catch(console.error);
</script>
</body>
</html>
`;
