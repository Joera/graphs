var gemeentes = function(element,dataMapping,property,smallMultiple) {

    let dropdown = document.querySelector('.map-selector ul');

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

    if (window.innerWidth < 600) {

        Object.keys(dimensions).map(function(key, index) {
            dimensions[key] *= 1.25;
        });
    }

    let colours = dataMapping.map( (p) => p.colour);

    chartSVG.redraw(dimensions);

    let chartMap = ChartMap(config,svg,dimensions,smallMultiple);

    function prepareData(json,property)  {

        // console.log(property);
        // console.log(json);

        // willen we hier nog filteren .. of is een object in geheugen ?

        // json.forEach( (feature) => {
        //
        //
        //
        //     let gemeenteData = json.find( (g) => {
        //         return sluggify(g._category) == sluggify(feature.properties.gemeentenaam);
        //     });
        //
        //     for (let key in gemeenteData) {
        //         gemeenteData[sluggify(key)] = gemeenteData[key];
        //     }
        //
        //     feature.properties = Object.assign({}, feature.properties, gemeenteData);
        // });


        return json;
    }


    function draw(features) {


    }

    function redraw(features, property) {

        yScale = chartYScale.set(features,property);
        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);
        // redraw data
        chartMap.redraw(dimensions,property,yScale,colours);
    }



    function run(geoData,property) {

        let features = prepareData(geoData,property);

        chartMap.draw(features);
        redraw(features, property);

        createDropdown();
        setListeners(features,property);
    }

    function createDropdown() {

        if(dropdown) {

            dataMapping.forEach((mapping, i) => {

                let li = document.createElement('li');
                let input = document.createElement('input');
                input.type = 'radio';
                input.name = 'property';
                input.id = mapping.column;
                input.value = mapping.column;
                input.checked = (i < 1) ? true : false;
                li.appendChild(input);

                let label = document.createElement('label');
                label.innerText = mapping.label;
                label.htmlFor = mapping.column;

                li.appendChild(label);

                dropdown.appendChild(li);
            });

        }
    }

    function setListeners(features,property) {


        let radios = [].slice.call(document.querySelectorAll('.map-selector ul li input[type=radio]'));

        window.addEventListener("resize", redraw(features, property), false);

        for (let radio of radios) {
            radio.addEventListener( 'change', () => {
                console.log(radio.value);
                redraw(features,radio.value);
            },false)
        }
    }

    let url = 'https://tcmg-hub.publikaan.nl/api/gemeenten';

    if (!globalData.geoData) {
        d3.json(url, function(error, json) {
            globalData.geoData = topojson.feature(json, json.objects.gemeenten).features;
            run(globalData.geoData,property)
        });

    } else {

        run(globalData.geoData,property)
    }


    // for example on window resize

}