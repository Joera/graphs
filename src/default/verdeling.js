var verdeling = function(element) {

    let colours = ['orange','green','green','green','green'];

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let xScale = chartObjects.xScale();
    let yScale = chartObjects.yScale();
    let axes = chartObjects.axes();
    let functions = chartObjects.functions();

    config.margin.top = 0;
    config.margin.bottom = (window.innerWidth > 640) ? 0 : 75;
    config.margin.left = 40;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 50;
    config.padding.left = 30;
    config.padding.right = 0;
    config.xParameter = 'status';  // name of first column with values of bands on x axis
    config.yParameter = 'totaal';  // is being set in type function
    // config.fixedHeight = 160;
    config.minValue = 0;
    // config.maxValue = 6000;
    // config.xAlign = [0.5];
    config.paddingInner = [0.1];
    config.paddingOuter = [0.1];

    let chartDimensions = new ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = new ChartSVG(element,config,dimensions,svg);
    let chartXScale = new ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config,svg);

    chartAxis.drawXAxis();
    chartAxis.drawYAxis();

    let chartBar = ChartBar(config,svg,functions);

    let url = 'https://tcmg-hub.publikaan.nl/api/gemeentes?week=recent';

    d3.json(url, function(error, json) {

        function prepareData(json,filter) {

            json = json.filter( j => j['_category'] === filter)[0];

            let data = [];

            data.push({
                status: "Afgewezen",
                totaal: json['AFW'],
                colour: darkblue

            });

            data.push({
                status: "< €1K",
                totaal: json['0_1000'],
                colour: blue

            });

            data.push({
                status: "€1K t/m €4K",
                totaal: json['1000_4000'],
                colour: green

            });

            data.push({
                status: "€4K t/m €10K",
                totaal: json['4000_10000'],
                colour: yellow

            });

            data.push({
                status: "> €10K",
                totaal: json['MEER_DAN_10000'],
                colour: orange

            });

            return data;
        }

        function legend(data) {

            if (window.innerWidth < 640) {

                data.forEach( (d,i) => {

                    let text  = (i + 1) + '. ' + d[config.xParameter] + ' ';

                    svg.layers.legend.append("text")
                        .attr("class", "small-label")
                        .attr("dy", i * 20)
                        .text(text)
                        .attr("width",dimensions.containerWidth)
                        .style("opacity", 1);
                });
            }
        }

        function draw(data) {

            // with data we can init scales
            xScale = chartXScale.set(data.map( d => d[config.xParameter]));
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
            chartAxis.redrawXBandAxis(dimensions,xScale,axes);
            chartAxis.redrawYAxis(yScale,axes);
            // redraw data
            chartBar.redraw(dimensions,xScale,yScale);
        }

        function run(json,filter) {
            let data = prepareData(json,filter);
            draw(data);
            redraw();
            legend(data);
        }

        run(json,'all');

        window.addEventListener("resize", redraw, false);
    });

    // for example on window resize


    // procedureSelect.addEventListener("change", function() {
    //     run(procedureSelect.options[procedureSelect.selectedIndex].value);
    // });

}