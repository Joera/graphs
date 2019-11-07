var forceStatusLooptijden  = function (element,smallMultiple) {


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
                name : 'Ontvangst en analyse',
                value : "ontvangst"
            },
            {   key : 'minder_dan_een_half_jaar',
                value : json['MNDER_HALF_JAAR_ONTVANGST'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                value : json['HALF_JAAR_1JAAR_ONTVANGST'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                value : json['TUSSEN_1_2_JAAR_ONTVANGST'],
            },
            {   key : 'langer_dan_twee_jaar',
                value : json['LANGER_2_JAAR_ONTVANGST'],
            }

        ]);

        data.push([
            {   key : 'status',
                name : 'Schade-opname wordt ingepland',
                value : "planning_opname"
            },
            {   key : 'minder_dan_een_half_jaar',
                value : json['MINDER_HALF_JAAR_PLANNING'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                value : json['MINDER_HALF_JAAR_PLANNING'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                value : json['TUSSEN_1_2_JAAR_PLANNING_OPNAME'],
            },
            {   key : 'langer_dan_twee_jaar',
                value : json['LANGER_2_JAAR_PLANNING_OPNAME'],
            }
        ]);

        data.push([
            {   key : 'status',
                name : 'Schade-opname uitgevoerd, adviesrapport opleveren',
                value : "opleveren_schaderapport"
            },
            {   key : 'minder_dan_een_half_jaar',
                value : json['MINDER_HALF_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                value : json['TUSSEN_1_2_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                value : json['TUSSEN_1_2_JAAR_OPLEV_SCHRAP'],
            },
            {   key : 'langer_dan_twee_jaar',
                value : json['LANGER_2_JAAR_OPLEV_SCHRAP'],
            }
        ]);



        data.push([
            {   key : 'status',
                name: 'Adviesrapport opgeleverd, besluit voorbereiden',
                value : "voorbereiden_commissie"
            },
            {   key : 'minder_dan_een_half_jaar',
                value : json['MINDER_HALF_JAAR_VOORBER_'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                value : json['HALF_JAAR_1JAAR_VOORBER_CIE'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                value : json['TUSSEN_1_2_JAAR_VOORBER_CIE'],
            },
            {   key : 'langer_dan_twee_jaar',
                value : json['LANGER_2_JAAR_VOORBER_CIE'],
            }
        ]);

        data.push([
            {   key : 'status',
                name: 'Stuwmeerregeling',
                value : "stuwmeerregeling"
            },
            {   key : 'minder_dan_een_half_jaar',
                value : json['MINDER_HALF_JAAR_STATUS_STUW'],
            },
            {   key : 'tussen_half_jaar_en_een_jaar',
                value : json['HALF_JAAR_1JAAR_STATUS_STUW'],
            },
            {   key : 'tussen_een_en_twee_jaar',
                value : json['TUSSEN_1_2_JAAR_STATUS_STUW'],
            },
            {   key : 'langer_dan_twee_jaar',
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

    function draw(data,flattenedData) {

        // with data we can init scales
        xScale = chartXScale.set(data.map( (d) => d[0].value));
        yScale = chartYScale.set(flattenedData) // = radius !!

        svg.group = svg.layers.data.selectAll('g')
            .data(data);

        svg.group.exit().remove();

        svg.groupEnter = svg.group.enter()
            .append("g");

        svg.circles = svg.groupEnter.merge(svg.group).selectAll(".circle")
            .data( d => {

                return d.filter( e => { return e.key !== 'status'});

            });

        svg.headers_lines = svg.groupEnter.merge(svg.group)
            .append("rect")
            .attr('width',1)
            .style('fill','black');

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


        svg.headers = svg.groupEnter.merge(svg.group)
            .append("text")
            .attr("class","header")
            .text( d => {
                return d[0].name
            })
            .attr('dy', (d,i) => (i % 2 == 0) ? 0 : 24)
            .style("text-anchor", "middle")






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

        let groupWidth = dimensions.width / data.length;


        xScale = chartXScale.reset(dimensions,xScale);
        yScale = chartYScale.reset(dimensions,yScale);


        svg.groupEnter.merge(svg.group)
        .attr("transform", (d) => {

                return "translate(" + xScale.band(d[0].value) + ",0)"
               //  return "translate(0,0)"
            });

        svg.circlesEnter.merge(svg.circles)
            .attr("r", (d) => { return yScale.radius(d.value); }) // scale for radius
        //     .style("fill", (d) => { return blue; }); // scale for colour

           ;

        svg.headers
            .attr('dx', groupWidth / 2);


        svg.headers_lines
            .attr('height', (d,i) => (i % 2 == 0) ? 80 : 60)
            .attr('y', (d,i) => (i % 2 == 0) ? 6 : 30)
            .attr('x', groupWidth / 2)


        ;

        let center; //  = {x: dimensions.width / 2, y: dimensions.height / 2};
        let forceStrength = 0.1;


        function charge(d) {
            return -forceStrength * Math.pow(yScale.radius(d.value), 2);
        }

        function ticked() {
            svg.circlesEnter.merge(svg.circles)
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; });
        }

        data.forEach( (group,i) => {


            console.log(groupWidth);

         //   center = {x: ((i * groupWidth) + (groupWidth / 2)) , y: dimensions.height / 2};

            center = {x: (groupWidth / 2) , y: ((dimensions.height / 2) + 20) };

            simulation[group[0].value]
                .velocityDecay(0.2)
                .force('x', d3.forceX().strength(forceStrength).x(center.x))
                .force('y', d3.forceY().strength(forceStrength).y(center.y))
                .force('charge', d3.forceManyBody().strength(charge))
                .on('tick', ticked);
        });
    }

    function run(json, muni) {

        let { data, flattenedData } = prepareData(json,muni);
        draw(data, flattenedData);
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