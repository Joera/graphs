var ballenbakSpecials  = function (element,smallMultiple) {


  //  let municipalitySelect = document.querySelector('select.municipalities');

    let url;
    let data = {};
    let flattenedData;
    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let xScale = chartObjects.xScale();
    let yScale = chartObjects.yScale();
    let axes = chartObjects.axes();
    let functions = chartObjects.functions();

    config.margin.top = 0;
    config.margin.bottom = (window.innerWidth < 640 || smallMultiple) ? 70 : 0;
    config.margin.left = 0;
    config.margin.right = 0;
    config.padding.top = smallMultiple? 15 : 30;
    config.padding.bottom = 0;
    config.padding.left = 0;
    config.padding.right = 0;
    // name of first column with values of bands on x axis

    config.xParameter = 'status';
    config.paddingInner = [0.2];
    config.paddingOuter = [0.2];

    config.radiusOffset = 2;
    config.radiusFactor = 12;

    config.dateLabels = false;

    let colours = {

        'agro': green,
        'erfgoed': yellow,
        'mkb': blue,
        'overig': orange
    };



    // get dimensions from parent element
    let chartDimensions = new ChartDimensions(element, config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = new ChartSVG(element, config, dimensions, svg);
    let chartXScale = new ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config, svg);

    let chartCircles = ChartCircles(config,svg,colours);
    chartAxis.drawXAxis();

    function prepareData(json,muni) {

        json = json.filter( j => j['_category'] === muni)[0];

        let data = [];

        data.push([
            {   key : 'status',
                name : 'Ontvangst en analyse',
                value : "ontvangst"
            },
            {   key : 'agro',
                name: 'Agro',
                value : json['SPECIALS_ONTVANGST_AGRO'],
            },
            {   key : 'erfgoed',
                name: 'Erfgoed',
                value : json['SPECIALS_ONTVANGST_ERFGOED'],
            },
            {   key : 'mkb',
                name: 'Bedrijven',
                value : json['SPECIALS_ONTVANGST_MKB'],
            },
            {   key : 'overig',
                name: 'Overig',
                value : json['SPECIALS_ONTVANGST_OVERIG_AOS'],
            }

        ]);

        data.push([
            {   key : 'status',
                name : 'Schade-opname wordt ingepland',
                value : "planning_opname"
            },
            {   key : 'agro',
                name: 'Agro',
                value : json['SPECIALS_PLANNING_OPNAME_AGRO'],
            },
            {   key : 'erfgoed',
                name: 'Erfgoed',
                value : json['SPECIALS_PLANNING_OPNAME_ERFGOED'],
            },
            {   key : 'mkb',
                name: 'Bedrijven',
                value : json['SPECIALS_PLANNING_OPNAME_MKB'],
            },
            {   key : 'overig',
                name: 'Overig',
                value : json['SPECIALS_PLAN_OPNAME_OVERIG_AOS'],
            }
        ]);

        data.push([
            {   key : 'status',
                name : 'Schade-opname uitgevoerd, adviesrapport opleveren',
                value : "opleveren_schaderapport"
            },
            {   key : 'agro',
                name: 'Agro',
                value : json['SPECIALS_OPLEV_SCHADERAPP_AGRO'],
            },
            {   key : 'erfgoed',
                name: 'Erfgoed',
                value : json['SPECIALS_OPLEV_SCHADERAP_ERFGOED'],
            },
            {   key : 'mkb',
                name: 'Bedrijven',
                value : json['SPECIALS_OPLEV_SCHADERAPP_MKB'],
            },
            {   key : 'overig',
                name: 'Overig',
                value : json['SPECIALS_OPLV_SCHRAP_OVERIG_AOS'],
            }
        ]);

        data.push([
            {   key : 'status',
                name: 'Adviesrapport opgeleverd, besluit voorbereiden',
                value : "voorbereiden_commissie"
            },
            {   key : 'agro',
                name: 'Agro',
                value : json['SPECIALS_VOORBER_CIE_AGRO'],
            },
            {   key : 'erfgoed',
                name: 'Erfgoed',
                value : json['SPECIALS_VOORBER_CIE_ERFGOED'],
            },
            {   key : 'mkb',
                name: 'Bedrijven',
                value : json['SPECIALS_VOORBER_CIE_MKB'],
            },
            {   key : 'overig',
                name: 'Overig',
                value : json['SPECIALS_VOORBER_CIE_OVERIG_AOS'],
            }
        ]);

        data.push([
            {   key : 'status',
                name: 'Stuwmeerregeling',
                value : "stuwmeerregeling"
            },
            {   key : 'agro',
                name: 'Agro',
                value : json['SPECIALS_STATUS_STUWMEER_AGRO'],
            },
            {   key : 'erfgoed',
                name: 'Erfgoed',
                value : json['SPECIALS_STATUS_STUWMEER_ERFGOED'],
            },
            {   key : 'mkb',
                name: 'Bedrijven',
                value : json['SPECIALS_STATUS_STUWMEER_MKB'],
            },
            {   key : 'overig',
                name: 'Overig',
                value : json['SPECIALS_STATUS_STUW_OVERIG_AOS'],
            }
        ]);

        let flattenedData = [];

        for (let group of data) {
            for (let prop of group) {
                if (Number.isInteger(prop.value)) flattenedData.push(prop.value);
            }
        }

        return { data, flattenedData };
    }

    function legend(data) {

        if (window.innerWidth < 640 || smallMultiple) {

            data.forEach( (d,i) => {

                let text  = (i + 1) + '. ' + d[0]['name'] + ' ';

                svg.layers.legend.append("text")
                    .attr("class", "small-label")
                    .attr("dy", i * 16)
                    .text(text)
                    .attr("width",dimensions.svgWidth)
                    .style("opacity", 1);
            });
        }
    }



    function draw(data,flattenedData) {

        // with data we can init scales
        xScale = chartXScale.set(data.map( (d) => d[0].value));
        yScale = chartYScale.set(flattenedData) // = radius !!
        chartCircles.draw(data);
    }

    function redraw() {

        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);

        xScale = chartXScale.reset(dimensions,xScale);
        yScale = chartYScale.reset(dimensions,yScale);

        chartCircles.redraw(dimensions,yScale,xScale,smallMultiple);
    }

    function run(json, muni) {

        ({ data, flattenedData } = prepareData(json,muni));
        draw(data, flattenedData);
        redraw();
        legend(data);
    }

    url = "https://tcmg-hub.publikaan.nl/api/gemeentes";

    d3.json(url, function (error, json) {
        if (error) throw error;
        run(json, 'all');

        // if (municipalitySelect != null) {
        //     municipalitySelect.addEventListener("change", function () {
        //         run(json, municipalitySelect.options[municipalitySelect.selectedIndex].value);
        //     });
        // }

        window.addEventListener("resize", redraw, false);
    });
}