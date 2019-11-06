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
    config.padding.right = 40;
    // name of first column with values of bands on x axis

    // y-axis
    // config.yParameter = 'totaal';
    // config.minValue = 0;
    // config.maxValue = 10000;
    // config.fixedHeight = 200;

    // x-axis
    // config.minWidth = 460;
    config.xParameter = 'status';
    config.paddingInner = [0.5];
    config.paddingOuter = [0.5];

    config.dateLabels = false;

    config.fixedHeight = 260;

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
    let chartStackedBars = ChartStackedBars(config,svg);
    // let chartStackedBars = ChartStackedBars(config,svg,functions);
    //  let chartBlocks = ChartBlocks(config,svg,functions);
    chartAxis.drawXAxis();
  //  chartAxis.drawYAxis();

    function prepareData(json,muni) {

        json = json.filter( j => j['_category'] === muni)[0];

        let data = [];


        data.push([
            {   key : 'status',
                value : "Minder dan een half jaar"
            },
            {   key : 'ontvangst',
                value : json['MNDER_HALF_JAAR_ONTVANGST'],
            },
            {   key : 'planning_opname',
                value : json['MINDER_HALF_JAAR_PLANNING'],
            },
            {   key : 'opleveren_schaderapport',
                value : json['MINDER_HALF_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'voorbereiden_commissie',
                value : json['MINDER_HALF_JAAR_VOORBER_'],
            },
            {   key : 'stuwmeer',
                value : json['MINDER_HALF_JAAR_STATUS_STUW']
            }
        ]);

        data.push([
            {   key : 'status',
                value : "Tussen half jaar en een jaar"
            },
            {   key : 'ontvangst',
                value : json['HALF_JAAR_1JAAR_ONTVANGST'],
            },
            {   key : 'planning_opname',
                value : json['HALF_JAAR_1JAAR_PLANNING_OPNAME'],
            },
            {   key : 'opleveren_schaderapport',
                value : json['HALF_JAAR_1JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'voorbereiden_commissie',
                value : json['HALF_JAAR_1JAAR_VOORBER_CIE'],
            },
            {   key : 'stuwmeer',
                value : json['HALF_JAAR_1JAAR_STATUS_STUW']
            }
        ]);

        data.push([
            {   key : 'status',
                value : "Tussen een en twee jaar"
            },
            {   key : 'ontvangst',
                value : json['TUSSEN_1_2_JAAR_ONTVANGST'],
            },
            {   key : 'planning_opname',
                value : json['TUSSEN_1_2_JAAR_PLANNING_OPNAME'],
            },
            {   key : 'opleveren_schaderapport',
                value : json['TUSSEN_1_2_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'voorbereiden_commissie',
                value : json['TUSSEN_1_2_JAAR_VOORBER_CIE'],
            },
            {   key : 'stuwmeer',
                value : json['TUSSEN_1_2_JAAR_STATUS_STUW']
            }
        ]);



        data.push([
            {   key : 'status',
                value : "Langer dan twee jaar"
            },
            {   key : 'ontvangst',
                value : json['LANGER_2_JAAR_ONTVANGST'],
            },
            {   key : 'planning_opname',
                value : json['LANGER_2_JAAR_PLANNING_OPNAME'],
            },
            {   key : 'opleveren_schaderapport',
                value : json['LANGER_2_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'voorbereiden_commissie',
                value : json['LANGER_2_JAAR_VOORBER_CIE'],
            },
            {   key : 'stuwmeer',
                value : json['LANGER_2_JAAR_STATUS_STUW']
            }
        ]);






        // functions.normalizedStack = d3.stack()
        //     .offset(d3.stackOffsetExpand)
        //     .keys(Object.keys(data[0]).filter(key => {
        //         return ['status'].indexOf(key) < 0
        //     } ));

        // functions.stack = d3.stack()
        //     .keys(Object.keys(data[0]).filter(key => {
        //         return ['status'].indexOf(key) < 0
        //     } ));

     //   let stackedData = functions.normalizedStack(data);
     //    let stackedData = functions.stack(data);
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

        console.log(data);

        // with data we can init scales
        xScale = chartXScale.set(data);
        yScale = chartYScale.set(data)

        svg.group = svg.layers.data.selectAll('g')
            .data(data);

        svg.group.exit().remove();

        svg.groupEnter = svg.group.enter()
            .append("g");

        svg.circles = svg.groupEnter.merge(svg.group).selectAll(".circle")
            .data( d => {

                return d.filter( e => { return e.key !== 'status'});

            });

        svg.circles.exit().remove();

        svg.circlesEnter = svg.circles.enter()
            .append("circle")
            .attr("class","circle")
            .style("fill", function(d) {

                return colours[d.key];

            })

        for (let group of data) {
            simulation[group[0].value] = d3.forceSimulation()
                .velocityDecay(0.2)
                .nodes(group.filter( (prop) => prop.key !== 'status'));
        }




            // .selectAll("circle");
            //
            //
            //
            // .data(nodes)
            // .enter().append("circle")
            // .attr("r", function(d) { return d.radius; })
            //
            // .call(force.drag);
    }

    function redraw(data) {

        // on redraw chart gets new dimensions
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);

        xScale = chartXScale.reset(dimensions,xScale);
        yScale = chartYScale.reset(dimensions,yScale);


        svg.groupEnter.merge(svg.group)
        .attr("transform", (d) => {
               //  return "translate(" + xScale.band(d.status) + ",0)"
                return "translate(0,0)"
            });

        svg.circlesEnter.merge(svg.circles)
            .attr("r", (d) => { return yScale.radius(d.value); }) // scale for radius
        //     .style("fill", (d) => { return blue; }); // scale for colour

           ;

        let center; //  = {x: dimensions.width / 2, y: dimensions.height / 2};
        let forceStrength = 0.03;


        function charge(d) {
            return -forceStrength * Math.pow(yScale.radius(d.value), 2);
        }

        function ticked() {
            svg.circlesEnter.merge(svg.circles)
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; });
        }

        data.forEach( (group,i) => {

            let groupWidth = dimensions.width / data.length;

            console.log(groupWidth);

            center = {x: ((i * groupWidth) + (groupWidth / 2)) , y: dimensions.height / 2};

            simulation[group[0].value]
                .velocityDecay(0.2)
                .force('x', d3.forceX().strength(forceStrength).x(center.x))
                .force('y', d3.forceY().strength(forceStrength).y(center.y))
                .force('charge', d3.forceManyBody().strength(charge))
                .on('tick', ticked);
        });
    }

    function run(json, muni) {

        let data = prepareData(json,muni);
        draw(data);
        redraw(data);
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
    });

    window.addEventListener("resize", redraw, false);



}