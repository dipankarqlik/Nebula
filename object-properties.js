const properties = {
  showTitles: true,
  qHyperCubeDef: {
    qInitialDataFetch: [{ qWidth: 30, qHeight: 200 }],
  },
  definition: {
      type: "items",
      component: "accordion",
      items: {
        dimensions: {
          uses: "dimensions",
          min: 2,
          max: 10,
        },
        measures: {
          uses: "measures",
          min: 0,
          max: 2,
        },
        sorting: {
          uses: "sorting",
        },
        settings: {
          uses: "settings",
        },
      },
    },
};

export default properties;
