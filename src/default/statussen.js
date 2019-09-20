var statussen  = function (element,filter) {

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
    config.margin.bottom = 0;
    config.margin.left = 0;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 30;
    config.padding.left = 40;
    config.padding.right = 0;
    // name of first column with values of bands on x axis

    // y-axis
    config.yParameter = 'totaal';
    config.minValue = 0;
    // config.maxValue = 10000;
    config.fixedHeight = 200;

    // x-axis
    // config.minWidth = 460;
    config.xParameter = 'status';
    config.paddingInner = [0.5];
    config.paddingOuter = [0.25];

    let colours = ['orange','green','darkblue','blue'];

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element, config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element, config, dimensions, svg);
    let chartXScale = ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config, svg);
    let chartBar = ChartBar(config, svg);
    // let chartStackedBars = ChartStackedBars(config,svg,functions);
    //  let chartBlocks = ChartBlocks(config,svg,functions);
    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    function prepareData(json) {

        console.log(json)

        let data = [];

        data.push({
            status: "Melding ontvangen",
            totaal: json[0]['ONTVANGST']

        });

        data.push({
            status: "Schadeopname wordt ingepland",
            totaal: json[0]['PLANNING_OPNAME']

        });

        data.push({
            status: "Schadeopname is ingepland",
            totaal: json[0]['PLANNING_OPNAME']

        });

        data.push({
            status: "Schaderapport wordt geschreven",
            totaal: json[0]['OPLEV_SCHADERAPPORT']

        });


        data.push({
            status: "Besluit wordt voorbereid",
            totaal: json[0]['VOORBER_CIE']

        });

        data.push({
            status: "Besluit genomen",
            totaal: json[0]['BESCHIKT']

        });


        return data;
    }

    function draw(data) {

        // with data we can init scales
        xScale = chartXScale.set(data);
        yScale = chartYScale.set(data);
        // width data we can draw items
        chartBar.draw(data, colours);

    }

    function redraw() {

        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);
        // new dimensions mean new scales
        xScale = chartXScale.reset(dimensions,xScale);
        yScale = chartYScale.reset(dimensions,yScale);
        // new scales mean new axis
        chartAxis.redrawXBandAxis(dimensions, xScale, axes, false);
        chartAxis.redrawYAxis(yScale, axes);
        // redraw data
        chartBar.redraw(dimensions, xScale,yScale);
    }

    function fetchApi(municipality) {

        if(municipality) {
            url = "https://tcmg.publikaan.nl/api/procedure?week=recent";
        } else {
            url = "https://tcmg.publikaan.nl/api/procedure?week=recent";
        }
        // point of data injection when using an api
        d3.json(url, function (error, json) {
            if (error) throw error;
            data = prepareData(json);
            draw(data);
            redraw();

        });
    }

    window.addEventListener("resize", redraw, false);

    // if(procedureSelect != null) {
    //     procedureSelect.addEventListener("change", function () {
    //         console.log('hi');
    //         fetchApi(procedureSelect.options[procedureSelect.selectedIndex].value);
    //     });
    // }

    fetchApi(false);

}