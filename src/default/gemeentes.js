var gemeentes = function(element,smallMultiple,property) {

    let radios = [].slice.call(document.querySelectorAll('.map-selector ul li input[type=radio]'));

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

    function prepareData(json,property)  {

        globalData.mapFeatures.forEach( (feature) => {

            let gemeenteData = json.find( (g) => {
                return sluggify(g._category) == sluggify(feature.properties.gemeentenaam);
            });

            for (let key in gemeenteData) {
                gemeenteData[sluggify(key)] = gemeenteData[key];
            }

            feature.properties = Object.assign({}, feature.properties, gemeenteData);
        });


        return globalData.mapFeatures;
    }


    function draw(features) {


    }

    function redraw(features, property) {

        yScale = chartYScale.set(features,property);
        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);
        // redraw data
        chartMap.redraw(dimensions,property,yScale);
    }

    let url = 'https://tcmg-hub.publikaan.nl/api/gemeentes';
    if(!property) { property = 'schademeldingen' }

    function run(json,property) {

        let features = prepareData(json);
        chartMap.draw(features);
        redraw(features, property);

        setListeners(features,property);
    }

    function getData() {
        if (!globalData.municipalities) {
            d3.json(url, function(error, json) {
                if (error) throw error
                globalData.municipalities = json;
                run(json,property)
            });

        } else {

            run(globalData.municipalities,property)
        }
    }

    function setListeners(features,property) {

        window.addEventListener("resize", redraw(features, property), false);

        for (let radio of radios) {
            radio.addEventListener( 'change', () => {
                redraw(features,radio.value);
            },false)
        }
    }


    if (!globalData.mapFeatures) {

        d3.json("/assets/geojson/topojson.json", function (error, mapData) {
            globalData.mapFeatures = topojson.feature(mapData, mapData.objects.gemeenten).features;
            getData();
        });

    }  else {

        getData();

    }


    // for example on window resize

}