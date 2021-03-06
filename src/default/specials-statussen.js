var specialsStatussen  = function (element,dataMapping,smallMultiple) {




    let municipalitySelect = document.querySelector('select.municipalities');

    let url;
    let data = {};
    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let xScale = chartObjects.xScale();
    let yScale = chartObjects.yScale();
    let axes = chartObjects.axes();
    let functions = chartObjects.functions();

    config.margin.top = 0;
    config.margin.bottom = (window.innerWidth < 640 || smallMultiple) ? 75 : 0;
    config.margin.left = 40;
    config.margin.right = 0;
    config.padding.top = smallMultiple? 15 : 30;
    config.padding.bottom = 50;
    config.padding.left = 30;
    config.padding.right = 0;

    config.xParameter = 'key';
    config.yParameter = 'value';
    config.paddingInner = [0.2];
    config.paddingOuter = [0.2];


    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element, config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element, config, dimensions, svg);
    let chartXScale = new ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config, svg);
    let chartBar = ChartBar(config, svg);
    // let chartStackedBars = ChartStackedBars(config,svg,functions);
    //  let chartBlocks = ChartBlocks(config,svg,functions);
    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    function prepareData(json,muni) {

        json = json.filter( j => j['_category'] === muni)[0];

        let data = [];

        for (let mapping of dataMapping) {

            data.push({
                key: mapping.label,
                value: json[mapping.column],
                colour: mapping.colour
            });
        }

        return data;
    }

    function legend(data) {

        if (window.innerWidth < 640 || smallMultiple) {

            data.forEach( (d,i) => {

                let text  = (i + 1) + '. ' + d[config.xParameter] + ' ';

                svg.layers.legend.append("text")
                    .attr("class", "small-label")
                    .attr("dy", i * 16)
                    .text(text)
                    .attr("width",dimensions.svgWidth)
                    .style("opacity", 1);
            });
        }
    }

    function muniDropdown(data) {

        let option = document.createElement('option');
        option.value = 'all';
        option.innerText = 'Alle gemeenten';
        option.selected = true;
        municipalitySelect.appendChild(option)

        data.forEach( (m) => {

            if(m['_category'] !== 'all' && m['_category'] !== '' &&
                m['SPECIALS_MELDINGEN'] > 24
            ) {

               if (
                    m['SPECIALS_ONTVANGST'] < 25 &&
                    m['SPECIALS_PLANNING_OPNAME'] < 25 &&
                    m['SPECIALS_OPLEV_SCHADERAPP'] < 25 &&
                    m['SPECIALS_VOORBER_CIE'] < 25 &&
                    m['SPECIALS_BESCHIKT'] < 25
               ) {
                   return;
               }

                    option = document.createElement('option');
                    option.value = m['_category'];
                    option.innerText = m['GEMEENTE'];
                    municipalitySelect.appendChild(option)
                }

            })
    }

    function draw(data) {

        // with data we can init scales
        xScale = chartXScale.set(data.map(d => d[config.xParameter]));
        yScale = chartYScale.set(data,config.yParameter);
        // width data we can draw items
        chartBar.draw(data, data.map( (d) => d.colour));

    }

    function redraw() {

        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);
        // new dimensions mean new scales
        xScale = chartXScale.reset(dimensions,xScale);
        yScale = chartYScale.reset(dimensions,yScale);
        // new scales mean new axis
        chartAxis.redrawXBandAxis(dimensions, xScale, axes, true, smallMultiple);
        chartAxis.redrawYAxis(yScale, axes);
        // redraw data
        chartBar.redraw(dimensions, xScale,yScale);
    }


    function run(json, muni) {

        let data = prepareData(json,muni);

        draw(data);
        redraw();
        legend(data);
    }

    url = "https://tcmg-hub.publikaan.nl/api/gemeentes";

    d3.json(url, function (error, json) {
        if (error) throw error;
        muniDropdown(json);
        run(json,'all');

        window.addEventListener("resize", redraw, false);

        if (municipalitySelect != null) {
            municipalitySelect.addEventListener("change", function () {
                run(json, municipalitySelect.options[municipalitySelect.selectedIndex].value);
            });
        }

    });
}