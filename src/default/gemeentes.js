var gemeentes = function(element) {

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();

    config.margin.top = 0;
    config.padding.left = 0;
    config.padding.bottom = 0;
    config.margin.bottom = 0;

    config.fixedHeight = 360;

    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    let projection = d3.geoMercator()
        .scale(1)
        .translate([0, 0]);

    let path = d3.geoPath()
        .projection(projection);

    let chartSVG = ChartSVG(element,config,dimensions,svg);

    dimensions = chartDimensions.get(dimensions);
    chartSVG.redraw(dimensions);

    let chartMap = ChartMap(config,svg);



    d3.json("/assets/geojson/topojson.json", function (error, mapData) {

        let features = topojson.feature(mapData, mapData.objects.gemeenten).features;
        var l = features[3],
            b = [
                [0.114, -1.101],
                [0.12022108488117365, -1.105]
            ],
            s = .15 / Math.max((b[1][0] - b[0][0]) / dimensions.containerWidth, (b[1][1] - b[0][1]) / dimensions.height),
            t = [((dimensions.containerWidth - s * (b[1][0] + b[0][0])) / 2) + 60 , ((dimensions.height - s * (b[1][1] + b[0][1])) / 2) - 0];

        projection
            .scale(s)
            .translate(t)
        ;

        let url = 'https://tcmg.publikaan.nl/api/gemeentes';

        d3.json(url, function(error, json) {
            if (error) throw error;

            features.forEach( (feature) => {

                let gemeenteData = json.find( (g) => {
                    return sluggify(g._category) == sluggify(feature.properties.gemeentenaam);
                });

                for (let key in gemeenteData) {
                    gemeenteData[sluggify(key)] = gemeenteData[key];
                }

                feature.properties = Object.assign({}, feature.properties, gemeenteData);
            });


            console.log(features);



            function redraw(property) {
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // redraw data
                chartMap.redraw(dimensions,property);
            }

            chartMap.draw(data);
            //  chartLegend.drawDefault(dimensions);
            // further drawing happens in function that can be repeated.
            let property = 'melding';
            redraw(property);
            // for example on window resize
            window.addEventListener("resize", redraw, false);

        });
    });
}