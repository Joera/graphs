var specialsShareCompleted  = function (element,smallMultiple) {


    // let municipalitySelect = document.querySelector('select.municipalities');

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
    config.padding.left = 0;
    config.padding.right = 0;
    // name of first column with values of bands on x axis

    // y-axis
    // config.yParameter = 'totaal';
    // config.minValue = 0;
    // config.maxValue = 10000;
    // config.fixedHeight = 200;

    // x-axis
    // config.minWidth = 460;
    config.xParameter = 'status';
    config.paddingInner = [0.25];
    config.paddingOuter = [0.25];

    config.dateLabels = false;

    let colours = {

        'langer_dan_twee': 'orange',
        'tussen_een_en_twee': 'green',
        'tussen_half_en_een': 'blue',
        'minder_dan_half': 'darkblue'
    }

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element, config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element, config, dimensions, svg);
    let chartXScale = new ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config, svg);
    let chartBarVertical = ChartBarVertical(config,svg);
    // let chartStackedBars = ChartStackedBars(config,svg,functions);
    //  let chartBlocks = ChartBlocks(config,svg,functions);
    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    function prepareData(json,muni) {

        json = json.filter( j => j['_category'] === muni)[0];

        console.log(json);

        // let data = [];

        // data.push({
        //     status: "Ontvangst en analyse",
        //     totaal: json['ONTVANGST'],
        //     langer_dan_twee: json['LANGER_2_JAAR_ONTVANGST'],
        //     tussen_een_en_twee: json['TUSSEN_1_2_JAAR_ONTVANGST'],
        //     tussen_half_en_een: json['HALF_JAAR_1JAAR_ONTVANGST'],
        //     minder_dan_half: json['MNDER_HALF_JAAR_ONTVANGST']
        // });
        //
        // data.push({
        //     status: "Schade-opname wordt ingepland",
        //     totaal: json['PLANNING_OPNAME'],
        //     langer_dan_twee: json['LANGER_2_JAAR_PLANNING_OPNAME'],
        //     tussen_een_en_twee: json['TUSSEN_1_2_JAAR_PLANNING_OPNAME'],
        //     tussen_half_en_een: json['HALF_JAAR_1JAAR_PLANNING_OPNAME'],
        //     minder_dan_half: json['MINDER_HALF_JAAR_PLANNING']
        // });
        //
        //
        // data.push({
        //     status: "Schade-opname uitgevoerd, adviesrapport opleveren",
        //     totaal: json['OPLEV_SCHADERAPPORT'],
        //     langer_dan_twee: json['LANGER_2_JAAR_OPLEV_SCHRAP'],
        //     tussen_een_en_twee: json['TUSSEN_1_2_JAAR_OPLEV_SCHRAP'],
        //     tussen_half_en_een: json['HALF_JAAR_1JAAR_OPLEV_SCHRAP'],
        //     minder_dan_half: json['MINDER_HALF_JAAR_OPLEV_SCHRAP']
        // });
        //
        //
        // data.push({
        //     status: "Adviesrapport opgeleverd, besluit voorbereiden",
        //     totaal: json['VOORBER_CIE'],
        //     langer_dan_twee: json['LANGER_2_JAAR_VOORBER_CIE'],
        //     tussen_een_en_twee: json['TUSSEN_1_2_JAAR_VOORBER_CIE'],
        //     tussen_half_en_een: json['HALF_JAAR_1JAAR_VOORBER_CIE'],
        //     minder_dan_half: json['MINDER_HALF_JAAR_VOORBER_']
        // });
        //
        // data.push({
        //     status: "Stuwmeerregeling",
        //     totaal: json['BESCHIKT'],
        //     langer_dan_twee: json['LANGER_2_JAAR_STATUS_STUW'],
        //     tussen_een_en_twee: json['TUSSEN_1_2_JAAR_STATUS_STUW'],
        //     tussen_half_en_een: json['HALF_JAAR_1JAAR_STATUS_STUW'],
        //     minder_dan_half: json['MINDER_HALF_JAAR_STATUS_STUW']
        // });
        //
        // data.push({
        //     status: "Besluit genomen",
        //     totaal: json['BESCHIKT'],
        //     langer_dan_twee: 0,
        //     tussen_een_en_twee: 0,
        //     tussen_half_en_een: 0,
        //     minder_dan_half: json['BESCHIKT']
        //
        // });

        console.log(data);

        //
        // functions.stack = d3.stack()
        //     .keys(Object.keys(data[0]).filter(key => {
        //         return ['status','totaal'].indexOf(key) < 0
        //     } ));
        //
        // let stackedData = functions.stack(data);

        // console.log(stackedData);

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
                    .attr("width",dimensions.containerWidth)
                    .style("opacity", 1);
            });
        }
    }

    function draw(data) {

        // with data we can init scales
        xScale = chartXScale.set(data);
        yScale = chartYScale.set(data);
        // width data we can draw items
        chartBarVertical.draw(data,colours);
    }

    function redraw() {

        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);
        // new dimensions mean new scales
        xScale = chartXScale.reset(dimensions,xScale);
        yScale = chartYScale.reset(dimensions,yScale);
        // new scales mean new axis
        chartAxis.redrawYBandAxis(dimensions, yScale, axes, true, smallMultiple);
        chartAxis.redrawXLinearAxis(xScale, axes);
        // redraw data
        chartBarVertical.redraw(dimensions,xScale,yScale,colours,smallMultiple);
    }


    function run(json, muni) {

        let { data , stackedData } = prepareData(json,muni);
        console.log(stackedData);
        draw(data,stackedData);
        redraw();
        // legend(data);
    }

    url = "https://tcmg-hub.publikaan.nl/api/gemeentes";

    d3.json(url, function (error, json) {
        if (error) throw error;
        run(json, 'all');

    });

    window.addEventListener("resize", redraw, false);

    // if (municipalitySelect != null) {
    //     municipalitySelect.addEventListener("change", function () {
    //         run(json, municipalitySelect.options[municipalitySelect.selectedIndex].value);
    //     });
    // }

}