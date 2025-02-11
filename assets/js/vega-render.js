document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("vegachart").forEach((chart) => {
        const spec = JSON.parse(chart.textContent); // Parse Vega-Lite spec

        vegaEmbed(chart, spec).then(result => {
            const view = result.view;

            
        }).catch(console.error);
    });
});
