var forceStatusLooptijden  = function (element,smallMultiple) {


    let municipalitySelect = document.querySelector('select.municipalities');

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
    config.margin.bottom = (window.innerWidth < 640 || smallMultiple) ? 75 : 0;
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

    config.dateLabels = false;

    let colours = {

        'minder_dan_een_half_jaar': orange,
        'tussen_half_jaar_en_een_jaar': green,
        'tussen_een_en_twee_jaar': blue,
        'langer_dan_twee_jaar': darkblue
    };

    let start = {};
    let simulation = {};

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element, config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element, config, dimensions, svg);
    let chartXScale = new ChartXScale(config,dimensions,xScale);
    let chartYScale = ChartYScale(config,dimensions,yScale);
    let chartAxis = ChartAxis(config, svg);

    let chartCircles = ChartCircles(config,svg);
    chartAxis.drawXAxis();

    function prepareData(json,muni) {

        json = json.filter( j => j['_category'] === muni)[0];

        let data = [];

        data.push([
            {   key : 'status',
                name : 'Ontvangst en analyse',
                value : "ontvangst"
            },
            {   key : 'minder_dan_een_half_jaar',
                name: 'Minder dan een half jaar',
                value : json['MNDER_HALF_JAAR_ONTVANGST'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                name: 'Tussen een half jaar en jaar',
                value : json['HALF_JAAR_1JAAR_ONTVANGST'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                name: 'Tussen een jaar en twee jaar',
                value : json['TUSSEN_1_2_JAAR_ONTVANGST'],
            },
            {   key : 'langer_dan_twee_jaar',
                name: 'Langer dan twee jaar',
                value : json['LANGER_2_JAAR_ONTVANGST'],
            }

        ]);

        data.push([
            {   key : 'status',
                name : 'Schade-opname wordt ingepland',
                value : "planning_opname"
            },
            {   key : 'minder_dan_een_half_jaar',
                name: 'Minder dan een half jaar',
                value : json['MINDER_HALF_JAAR_PLANNING'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                name: 'Tussen een half jaar en jaar',
                value : json['MINDER_HALF_JAAR_PLANNING'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                name: 'Tussen een jaar en twee jaar',
                value : json['TUSSEN_1_2_JAAR_PLANNING_OPNAME'],
            },
            {   key : 'langer_dan_twee_jaar',
                name: 'Langer dan twee jaar',
                value : json['LANGER_2_JAAR_PLANNING_OPNAME'],
            }
        ]);

        data.push([
            {   key : 'status',
                name : 'Schade-opname uitgevoerd, adviesrapport opleveren',
                value : "opleveren_schaderapport"
            },
            {   key : 'minder_dan_een_half_jaar',
                name: 'Minder dan een half jaar',
                value : json['MINDER_HALF_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                name: 'Tussen een half jaar en jaar',
                value : json['TUSSEN_1_2_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                name: 'Tussen een jaar en twee jaar',
                value : json['TUSSEN_1_2_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'langer_dan_twee_jaar',
                name: 'Langer dan twee jaar',
                value : json['LANGER_2_JAAR_OPLEV_SCHRAP'],
            }
        ]);



        data.push([
            {   key : 'status',
                name: 'Adviesrapport opgeleverd, besluit voorbereiden',
                value : "voorbereiden_commissie"
            },
            {   key : 'minder_dan_een_half_jaar',
                name: 'Minder dan een half jaar',
                value : json['MINDER_HALF_JAAR_VOORBER_'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                name: 'Tussen een half jaar en jaar',
                value : json['HALF_JAAR_1JAAR_VOORBER_CIE'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                name: 'Tussen een jaar en twee jaar',
                value : json['TUSSEN_1_2_JAAR_VOORBER_CIE'],
            },
            {   key : 'langer_dan_twee_jaar',
                name: 'Langer dan twee jaar',
                value : json['LANGER_2_JAAR_VOORBER_CIE'],
            }
        ]);

        data.push([
            {   key : 'status',
                name: 'Stuwmeerregeling',
                value : "stuwmeerregeling"
            },
            {   key : 'minder_dan_een_half_jaar',
                name: 'Minder dan een half jaar',
                value : json['MINDER_HALF_JAAR_STATUS_STUW'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                name: 'Tussen een half jaar en jaar',
                value : json['HALF_JAAR_1JAAR_STATUS_STUW'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                name: 'Tussen een jaar en twee jaar',
                value : json['TUSSEN_1_2_JAAR_STATUS_STUW'],
            },
            {   key : 'langer_dan_twee_jaar',
                name: 'Langer dan twee jaar',
                value : json['LANGER_2_JAAR_STATUS_STUW'],
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

    let popup = function popup(d) {

        console.log(d);

        return d.name + '<br/>' + d.value;
    }

    function draw(data,flattenedData) {

        // with data we can init scales
        xScale = chartXScale.set(data.map( (d) => d[0].value));
        yScale = chartYScale.set(flattenedData) // = radius !!
        chartCircles.set(data);
    }

    function redraw() {

        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);

        xScale = chartXScale.reset(dimensions,xScale);
        yScale = chartYScale.reset(dimensions,yScale);

        chartCircles.redraw(dimensions,yScale,smallMultiple);
    }

    function run(json, muni) {

        ({ data, flattenedData } = prepareData(json,muni));
        draw(data, flattenedData);
        redraw();
        // legend(data);
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

        window.addEventListener("resize", redraw, false);
    });
}