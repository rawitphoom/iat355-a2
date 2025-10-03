

// a3.js

const W = 900;   // reuse this

// ---------- Chart 1: tiny inline example ----------
const chart1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Simple bar chart (inline data).",
    width: W,
    height: 220,
    data: {
        values: [
            { category: "A", amount: 28 },
            { category: "B", amount: 55 },
            { category: "C", amount: 43 }
        ]
    },
    mark: "bar",
    encoding: {
        x: { field: "category", type: "ordinal", title: "Category" },
        y: { field: "amount", type: "quantitative", title: "Amount" }
    }
};
vegaEmbed("#chart1", chart1, { actions: false });


// ---------- Chart 2: bar chart from CSV (wide) ----------
const barFromWide = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Global Sales by Genre (videogames_wide.csv)",
    width: W,
    height: 360,
    data: { url: "dataset/videogames_wide.csv" },
    mark: { type: "bar", cornerRadiusEnd: 2 },
    encoding: {
        x: { field: "Genre", type: "nominal", sort: "-y", title: "Genre" },
        y: { field: "Global_Sales", type: "quantitative", title: "Global Sales (millions)" },
        color: { field: "Genre", type: "nominal", legend: null, scale: { scheme: "blues" } },
        tooltip: [{ field: "Genre" }, { field: "Global_Sales", title: "Global (M)" }]
    }
};
vegaEmbed("#chart2", barFromWide, { actions: false });



// CHART 3 — stacked area over time (long file)
const spec3 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Stacked area: yearly sales by region",
    width: W,
    height: 260,
    data: { url: "dataset/videogames_long.csv" },
    transform: [
        // keep sensible years only
        { filter: "datum.year >= 1980 && datum.year <= 2020" }
    ],
    mark: { type: "area", interpolate: "monotone" },
    encoding: {
        x: { field: "year", type: "ordinal", title: "Year" },
        y: {
            aggregate: "sum",
            field: "sales_amount",
            type: "quantitative",
            title: "Sales (millions)"
        },
        color: {
            field: "sales_region",
            type: "nominal",
            title: "Region",
            scale: { scheme: "tableau10" }
        },
        tooltip: [
            { field: "year", type: "ordinal", title: "Year" },
            { field: "sales_region", type: "nominal", title: "Region" },
            { aggregate: "sum", field: "sales_amount", type: "quantitative", title: "Sales (M)" }
        ]
    }
};

vegaEmbed("#chart3", spec3);


// ---------- Chart 4: Top 10 Publishers by Global Sales ----------
const chart4 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Top 10 publishers by global sales (sum of Global_Sales).",
    width: W,
    height: 420,
    background: "white",
    data: { url: "dataset/videogames_wide.csv" },

    transform: [
        // Sum sales by Publisher
        { aggregate: [{ op: "sum", field: "Global_Sales", as: "TotalSales" }], groupby: ["Publisher"] },
        // Rank and keep top 10
        { window: [{ op: "rank", as: "rank" }], sort: [{ field: "TotalSales", order: "descending" }] },
        { filter: "datum.rank <= 10" }
    ],

    mark: { type: "bar", cornerRadiusEnd: 3 },

    encoding: {
        y: { field: "Publisher", type: "nominal", sort: "-x", title: "Publisher" },
        x: { field: "TotalSales", type: "quantitative", title: "Global Sales (millions)" },
        color: {
            field: "TotalSales",
            type: "quantitative",
            legend: null,
            scale: { scheme: "blues" }
        },
        tooltip: [
            { field: "Publisher", title: "Publisher" },
            { field: "TotalSales", title: "Global Sales (M)", format: ".1f" }
        ]
    }
};

vegaEmbed("#chart4", chart4, { actions: false });

// ---------- Chart 5: Regional Sales Intensity by Year (heatmap, long CSV) ----------
const heatmapByYearRegion = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Heatmap of summed sales by year and region (videogames_long.csv)",
    width: W,
    height: 220,
    data: { url: "dataset/videogames_long.csv" },
    transform: [
        { filter: "datum.year >= 1980 && datum.year <= 2020" }
    ],
    mark: "rect",
    encoding: {
        x: {
            field: "year",
            type: "ordinal",
            title: "Year",
            axis: { labelAngle: -90 }
        },
        y: {
            field: "sales_region",
            type: "nominal",
            title: "Region",
            // order regions if you want a fixed order:
            sort: ["na_sales", "eu_sales", "jp_sales", "other_sales"]
        },
        color: {
            aggregate: "sum",
            field: "sales_amount",
            type: "quantitative",
            title: "Sales (millions)",
            scale: { scheme: "blues" }
        },
        tooltip: [
            { field: "year", type: "ordinal", title: "Year" },
            { field: "sales_region", type: "nominal", title: "Region" },
            { aggregate: "sum", field: "sales_amount", type: "quantitative", title: "Sales (M)" }
        ]
    },
    config: {
        view: { stroke: null }
    }
};

vegaEmbed("#chart5", heatmapByYearRegion, { actions: false });

// ---------- Chart 6: NA vs EU sales scatter (bubble = Global Sales) ----------
const scatterNAEU = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Scatter: NA vs EU sales; size encodes Global_Sales; color by Genre",
    width: W,
    height: 360,
    data: { url: "dataset/videogames_wide.csv" },
    transform: [
        // keep reasonable years and drop missing values
        { filter: "datum.Year >= 2000 && datum.Year <= 2020" },
        { filter: "isValid(datum.NA_Sales) && isValid(datum.EU_Sales) && isValid(datum.Global_Sales)" }
    ],
    mark: { type: "point", filled: true, opacity: 0.7 },
    encoding: {
        x: { field: "NA_Sales", type: "quantitative", title: "NA Sales (millions)" },
        y: { field: "EU_Sales", type: "quantitative", title: "EU Sales (millions)" },
        size: {
            field: "Global_Sales",
            type: "quantitative",
            title: "Global Sales (millions)",
            scale: { range: [10, 800] }   // bubble size range
        },
        color: {
            field: "Genre",
            type: "nominal",
            legend: { title: "Genre" },
            scale: { scheme: "tableau10" }
        },
        tooltip: [
            { field: "Name", title: "Game" },
            { field: "Year", title: "Year" },
            { field: "Publisher", title: "Publisher" },
            { field: "Genre", title: "Genre" },
            { field: "NA_Sales", title: "NA (M)" },
            { field: "EU_Sales", title: "EU (M)" },
            { field: "Global_Sales", title: "Global (M)" }
        ]
    },
    config: { view: { stroke: null } }
};

vegaEmbed("#chart6", scatterNAEU, { actions: false });














