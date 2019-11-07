var forceLooptijdenStatus  = function (element,smallMultiple) {


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
    config.margin.left = 0;
    config.margin.right = 0;
    config.padding.top = smallMultiple? 15 : 30;
    config.padding.bottom = 0;
    config.padding.left = 0;
    config.padding.right = 0;

    config.xParameter = 'status';
    config.paddingInner = [0.2];
    config.paddingOuter = [0.2];

    config.dateLabels = false;

    config.radiusOffset = 1.8;
    config.radiusFactor = 10;

    let colours = {

        'ontvangst': orange,
        'planning_opname': green,
        'opleveren_schaderapport': blue,
        'voorbereiden_commissie': darkblue,
        'stuwmeer': grey
    };

    let simulation = {};

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element, config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element, config, dimensions, svg);
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
                name : "Minder dan een half jaar",
                value : "Minder dan een half jaar"
            },
            {   key : 'ontvangst',
                name: 'Ontvangst en analyse',
                value : json['MNDER_HALF_JAAR_ONTVANGST'],
            },
            {   key : 'planning_opname',
                name : 'Schade-opname wordt ingepland',
                value : json['MINDER_HALF_JAAR_PLANNING'],
            },
            {   key : 'opleveren_schaderapport',
                name : 'Schade-opname uitgevoerd, adviesrapport opleveren',
                value : json['MINDER_HALF_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'voorbereiden_commissie',
                name: 'Adviesrapport opgeleverd, besluit voorbereiden',
                value : json['MINDER_HALF_JAAR_VOORBER_'],
            },
            {   key : 'stuwmeer',
                name: 'Stuwmeerregeling',
                value : json['MINDER_HALF_JAAR_STATUS_STUW']
            }
        ]);

        data.push([
            {   key : 'status',
                name : "Tussen half jaar en een jaar",
                value : "Tussen half jaar en een jaar"
            },
            {   key : 'ontvangst',
                name: 'Ontvangst en analyse',
                value : json['HALF_JAAR_1JAAR_ONTVANGST'],
            },
            {   key : 'planning_opname',
                name : 'Schade-opname wordt ingepland',
                value : json['HALF_JAAR_1JAAR_PLANNING_OPNAME'],
            },
            {   key : 'opleveren_schaderapport',
                name : 'Schade-opname uitgevoerd, adviesrapport opleveren',
                value : json['HALF_JAAR_1JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'voorbereiden_commissie',
                name: 'Adviesrapport opgeleverd, besluit voorbereiden',
                value : json['HALF_JAAR_1JAAR_VOORBER_CIE'],
            },
            {   key : 'stuwmeer',
                name: 'Stuwmeerregeling',
                value : json['HALF_JAAR_1JAAR_STATUS_STUW']
            }
        ]);

        data.push([
            {   key : 'status',
                name : "Tussen een en twee jaar",
                value : "Tussen een en twee jaar"
            },
            {   key : 'ontvangst',
                name: 'Ontvangst en analyse',
                value : json['TUSSEN_1_2_JAAR_ONTVANGST'],
            },
            {   key : 'planning_opname',
                name : 'Schade-opname wordt ingepland',
                value : json['TUSSEN_1_2_JAAR_PLANNING_OPNAME'],
            },
            {   key : 'opleveren_schaderapport',
                name : 'Schade-opname uitgevoerd, adviesrapport opleveren',
                value : json['TUSSEN_1_2_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'voorbereiden_commissie',
                name: 'Adviesrapport opgeleverd, besluit voorbereiden',
                value : json['TUSSEN_1_2_JAAR_VOORBER_CIE'],
            },
            {   key : 'stuwmeer',
                name: 'Stuwmeerregeling',
                value : json['TUSSEN_1_2_JAAR_STATUS_STUW']
            }
        ]);



        data.push([
            {   key : 'status',
                name : "Langer dan twee jaar",
                value : "Langer dan twee jaar"
            },
            {   key : 'ontvangst',
                name: 'Ontvangst en analyse',
                value : json['LANGER_2_JAAR_ONTVANGST'],
            },
            {   key : 'planning_opname',
                name : 'Schade-opname wordt ingepland',
                value : json['LANGER_2_JAAR_PLANNING_OPNAME'],
            },
            {   key : 'opleveren_schaderapport',
                name : 'Schade-opname uitgevoerd, adviesrapport opleveren',
                value : json['LANGER_2_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'voorbereiden_commissie',
                name: 'Adviesrapport opgeleverd, besluit voorbereiden',
                value : json['LANGER_2_JAAR_VOORBER_CIE'],
            },
            {   key : 'stuwmeer',
                name: 'Stuwmeerregeling',
                value : json['LANGER_2_JAAR_STATUS_STUW']
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

    function draw(data,flattenedData) {

        // with data we can init scales
        xScale = chartXScale.set(data.map( (d) => d[0].value));
        yScale = chartYScale.set(flattenedData) // = radius !!
        chartCircles.draw(data);

    }

    function redraw(data) {

        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);

        xScale = chartXScale.reset(dimensions,xScale);
        yScale = chartYScale.reset(dimensions,yScale);

        chartCircles.redraw(dimensions,yScale,xScale,smallMultiple);
    }

    function run(json, muni) {

        let { data, flattenedData } = prepareData(json,muni);
        draw(data, flattenedData);
        redraw();
    }

    url = "https://tcmg-hub.publikaan.nl/api/gemeentes";

    d3.json(url, function (error, json) {
        if (error) throw error;
        run(json, 'all');

        if (municipalitySelect != null) {
            municipalitySelect.addEventListener("change", function () {
                run(json, municipalitySelect.options[municipalitySelect.selectedIndex].value);
            });
        }
    });

    window.addEventListener("resize", redraw, false);



}