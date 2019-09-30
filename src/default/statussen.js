var statussen  = function (element,filter) {


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
    config.margin.bottom = 0;
    config.margin.left = 30;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 50;
    config.padding.left = 30;
    config.padding.right = 0;
    // name of first column with values of bands on x axis

    // y-axis
    config.yParameter = 'totaal';
    // config.minValue = 0;
    // config.maxValue = 10000;
    // config.fixedHeight = 200;

    // x-axis
    // config.minWidth = 460;
    config.xParameter = 'status';
    config.paddingInner = [0.5];
    config.paddingOuter = [0.25];

    let colours = ['orange','green','darkblue','blue','green'];

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

    function prepareData(json,muni) {

        console.log(json);

        json = json.filter( j => j['_category'] === muni)[0];

        let data = [];

        data.push({
            status: (window.innerWidth  > 760) ? "Ontvangst en analyse" : "1",
            totaal: json['ONTVANGST']

        });

        data.push({
            status: (window.innerWidth  > 760) ? "Schade-opname wordt ingepland" : "2",
            totaal: json['PLANNING_OPNAME']

        });


        data.push({
            status: (window.innerWidth  > 760) ? "Schade-opname uitgevoerd, adviesrapport opleveren" : "3",
            totaal: json['OPLEV_SCHADERAPPORT']

        });


        data.push({
            status: (window.innerWidth  > 760) ? "Adviesrapport opgeleverd, besluit voorbereiden" : "4",
            totaal: json['VOORBER_CIE']

        });

        data.push({
            status: (window.innerWidth  > 760) ? "Besluit genomen" : "5",
            totaal: json['BESCHIKT']

        });


        return data;
    }

    function draw(data) {

        // with data we can init scales
        xScale = chartXScale.set(data);
        yScale = chartYScale.set(data,config.yParameter);
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
        chartAxis.redrawXBandAxis(dimensions, xScale, axes, true);
        chartAxis.redrawYAxis(yScale, axes);
        // redraw data
        chartBar.redraw(dimensions, xScale,yScale);
    }


    function run(json, muni) {

        let data = prepareData(json,muni);
        draw(data);
        redraw();
    }

    url = "https://tcmg.publikaan.nl/api/gemeentes";

    d3.json(url, function (error, json) {
        if (error) throw error;
        run(json,'all');

        window.addEventListener("resize", redraw, false);

        if(municipalitySelect != null) {
            municipalitySelect.addEventListener("change", function () {
                run(json,municipalitySelect.options[municipalitySelect.selectedIndex].value);
            });
        }
    });
}