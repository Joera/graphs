let ChartCircles = function ChartCircles(config,svg,colours) {


    let start = {};
    let simulation = {};
    let data;

    let draw = function draw(d) {

        data = d;

        svg.headerGroup = svg.layers.underData.selectAll('.headerGroup')
            .data(data);

        svg.headerGroup.exit().remove();

        svg.headerGroupEnter = svg.headerGroup.enter()
            .append("g")
            .attr("class","headerGroup");

        svg.group = svg.layers.data.selectAll('.group')
            .data(data);

        svg.group.exit().remove();

        svg.groupEnter = svg.group.enter()
            .append("g")
            .attr("class","group");

        svg.circleGroups = svg.groupEnter.merge(svg.group)
            .selectAll(".circleGroup")
            .data( d => {
                return d.slice(1,d.length);
                // return d.filter( e => { return e.key !== 'status' && e.value > 0});
            });

        svg.headers_lines = svg.headerGroupEnter.merge(svg.headerGroup)
            .append("rect")
            .attr('width',1)
            .style('fill','#ccc');

        svg.circleGroups.exit().remove();

        svg.circleGroupsEnter = svg.circleGroups.enter()
            .append("g")
            .attr("class","circleGroup");

        svg.circleGroupsEnter.merge(svg.circleGroups).selectAll('.circle').remove();
        svg.circleGroupsEnter.merge(svg.circleGroups).selectAll('.small-label').remove();

        svg.circles = svg.circleGroupsEnter.merge(svg.circleGroups)
            .append("circle")
            .attr("class","circle")
            .style("fill", function(d) {
                return d.colour;
            });

        svg.circlesText = svg.circleGroupsEnter.merge(svg.circleGroups)
            .append("text")
            .attr("class","small-label")
            .attr("text-anchor","middle")
            .style("fill","black");

        for (let group of data) {
            simulation[group[0].key] = d3.forceSimulation()
                .velocityDecay(0.25)
                .nodes(group.filter( (prop) => { return prop.key !== 'status' && prop.value > 0 } ));
        }

        svg.headers = svg.headerGroupEnter.merge(svg.headerGroup)
            .append("text")
            .attr("class","header")
            .text( (d,i) => {

                return (window.innerWidth < 640) ? (i + 1) : d[0].label

            })
            .attr('dy', (d,i) => (i % 2 == 0) ? 0 : 24)
            .style("text-anchor", "middle");

    }

    let redraw = function redraw(dimensions,yScale,xScale,smallMultiple) {

        let groupWidth = dimensions.width / data.length;
        let center = {x: (groupWidth / 2) , y: ((dimensions.height / 2) + 20) };
        let forceStrength = 0.025;



        let popup = function popup(d) {
            return d.label + '<br/>' + d.value;
        }

        svg.groupEnter.merge(svg.group)
            .attr("transform", (d) => {
                return "translate(" + xScale.band(d[0].label) + ", " + config.padding.top + ")"
            });

        svg.headerGroupEnter.merge(svg.headerGroup)
            .attr("transform", (d) => {
                return "translate(" + xScale.band(d[0].label) + "," + config.padding.top + ")"
            });


        svg.circleGroupsEnter.merge(svg.circleGroups)
            .attr("transform", (d) => {  return "translate(" + center.x + "," + center.y + ")" })
        ;

        svg.circles
            .attr("r", (d) => { return yScale.radius(d.value); })
            .on("mouseover", function(d) {

                svg.tooltip
                    .html(popup(d))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px")
                    .transition()
                    .duration(250)
                    .style("opacity", 1);
            })
            .on("mouseout", function(d) {
                svg.tooltip.transition()
                    .duration(250)
                    .style("opacity", 0);
            })
        ;

        svg.circlesText
            .text( (d) => {

                if(yScale.radius(d.value) > 50) {
                    return d.value;
                }
            });

        svg.headers
            .attr('dx', groupWidth / 2);


        svg.headers_lines
            .attr('height', (d,i) => (i % 2 == 0) ? (dimensions.height / 4) : (dimensions.height / 4) - 24)
            .attr('y', (d,i) => (i % 2 == 0) ? 6 : 30)
            .attr('x', groupWidth / 2)
        ;

        function cluster(d) {
            return -forceStrength * Math.pow(yScale.radius(d.value), config.radiusOffset);
        }

        function ticked() {

            svg.circleGroupsEnter.merge(svg.circleGroups)
                .attr("transform", (d) => { if(d.x !== undefined) { return "translate(" + d.x + "," + d.y + ")" } })
            ;
        }

        data.forEach( (group,i) => {

            simulation[group[0].key]
                .velocityDecay(0.5)
                // .force('y', d3.forceY().strength(forceStrength).y(center.y))
                .force('center', d3.forceCenter(center.x,center.y))
               // .force('charge', d3.forceManyBody().strength(cluster))
                .force('collide', d3.forceCollide().radius(function(d) {
                    return yScale.radius(d.value)
                }))
                .force('x', d3.forceX().strength(forceStrength).x(center.x))
                .on('tick', ticked);
        });
    }

    return {
        draw: draw,
        redraw: redraw
    }
}
