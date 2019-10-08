let ChartPie = function ChartPie(config,svg,dimensions) {


    // let popup = function popup(d) {
    //
    //     return moment(d[config.xParameter]).subtract(1, 'week').format('D/MM') + ' - '
    //         + moment(d[config.xParameter]).format('D/MM') + '<br/>'
    //         + d['nieuwe_schademeldingen'] + ' Nieuwe schademeldingen' + '<br/>'
    //         + d['nieuwe_afgehandeld'] + ' Deze week afgehandeld';
    // }

    let draw = function draw(data) {

        let pie = d3.pie()
            .sort(null)
            .value(function(d) { return d['totaal']; });

        svg.arcGroup = svg.layers.data.selectAll(".arc_group")
            .data(pie(data))

        svg.arcGroupEnter = svg.arcGroup
            .enter()
            .append("g")
            .attr("class", "arc_group");

        svg.arcGroup.exit().remove();

        svg.arcPath = svg.arcGroup.merge(svg.arcGroupEnter).selectAll(".arc");
            // .data(function(d) { return d; });

        svg.arcPathEnter = svg.arcPath
            .enter()
            .append("path")
            .attr("class","arc")
            .style("fill", function(d,i) { return config.colours(i); });

        svg.arcPath.exit().remove();


    }

    let redraw = function redraw(dimensions,smallMultiple) {

        let radius, arc, labelArc;

        if(smallMultiple || window.innerWidth < 480) {

            radius = 48;

            svg.layers.data
                .attr("transform", "translate(" + radius + "," + ((dimensions.containerHeight / 2) - (radius / 2)) + ")");

            labelArc = d3.arc()
                .outerRadius(radius - 0)
                .innerRadius(radius - 0);

            arc = d3.arc()
                .outerRadius(radius - 0)
                .innerRadius(10);

        } else {

            svg.layers.data
                .attr("transform", "translate(" + (dimensions.containerWidth / 4)+ "," + (dimensions.containerHeight / 2) + ")");

            radius = dimensions.containerWidth / 4;

            if(radius > (config.maxHeight / 2)) {
                radius = config.maxHeight / 2;
            }

            labelArc = d3.arc()
                .outerRadius(radius - 40)
                .innerRadius(radius - 40);

            arc = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(30);
        }

        svg.arcGroup
            .merge(svg.arcGroupEnter);

        svg.arcPath
            .merge(svg.arcPathEnter)
            // .attr("d", arc);
            .transition(500)
            .attr("d", arc);

        // svg.arcLabel
        //     .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })

    }

    return {
        draw: draw,
        redraw: redraw
    }
}
