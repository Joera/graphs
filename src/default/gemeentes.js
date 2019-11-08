var gemeentes = function(element,smallMultiple,property) {

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let yScale = chartObjects.yScale();
    let svg = chartObjects.svg();

    config.margin.top = 0;
    config.padding.left = 0;
    config.padding.bottom = 0;
    config.margin.bottom = 0;

 //   config.fixedHeight = 360;
 //   config.fixedHeight = 360;

    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    let chartSVG = ChartSVG(element,config,dimensions,svg);
    let chartYScale = ChartYScale(config,dimensions,yScale);

    dimensions = chartDimensions.get(dimensions);

   //

    if (window.innerWidth < 600) {

        Object.keys(dimensions).map(function(key, index) {
            dimensions[key] *= 1.25;
        });
    }

    chartSVG.redraw(dimensions);

    let chartMap = ChartMap(config,svg,dimensions);

    let radios = [].slice.call(document.querySelectorAll('.map-selector ul li input[type=radio]'));

    d3.json("/assets/geojson/topojson.json", function (error, mapData) {

        let features = topojson.feature(mapData, mapData.objects.gemeenten).features;

        let url = 'https://tcmg-hub.publikaan.nl/api/gemeentes';

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

            function redraw(features, property) {

                yScale = chartYScale.set(features,property);
                // on redraw chart gets new dimensions
                dimensions = chartDimensions.get(dimensions);
                chartSVG.redraw(dimensions);
                // redraw data
                chartMap.redraw(dimensions,property,yScale);
            }

            let property = 'schademeldingen';
            chartMap.draw(features);

            redraw(features, property);
            // for example on window resize
            window.addEventListener("resize", redraw(features, property), false);

            for (let radio of radios) {
                radio.addEventListener( 'change', () => {
                    redraw(features,radio.value);
                },false)
            }

        });
    });
}