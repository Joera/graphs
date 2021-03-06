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
            .value(function(d) { return d['value']; });

        svg.arcs = svg.layers.data.selectAll(".arc")
            .data(pie(data), function(d){ return d.data.label; });

    }

    let redraw = function redraw(dimensions,smallMultiple) {

        let radius, arc, labelArc, innerRadius;


        if(smallMultiple || window.innerWidth < 480) {

            radius = 66;
            innerRadius = 20;

                svg.layers.data
                .attr("transform", "translate(" + radius + ",66)");

            labelArc = d3.arc()
                .outerRadius(radius - 0)
                .innerRadius(radius - 0);

            arc = d3.arc()
                .outerRadius(radius - 0)
                .innerRadius(innerRadius);

        } else {

            innerRadius = (config.innerRadius !== undefined) ? config.innerRadius : 30;

            svg.layers.data
                .attr("transform", "translate(" + (dimensions.svgWidth / 3)+ "," + (dimensions.svgHeight / 2) + ")");

            radius = dimensions.svgWidth / 3;

            if(radius > (config.maxHeight / 2)) {
                radius = config.maxHeight / 2;
            }

            labelArc = d3.arc()
                .outerRadius(radius - 40)
                .innerRadius(radius - 40);

            arc = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(innerRadius);
        }

        function arcTween(a) {

            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return arc(i(t));
            };
        }

        svg.arcs
            .transition()
            .duration(500)
            .attrTween("d", arcTween);

        // svg.arcGroup
        //     .merge(svg.arcGroupEnter);
        //
        // svg.arcPath = svg.arcGroupEnter
        //     .append("path")
        //     .attr("class","arc")
        //     .style("fill", function(d,i) { return config.colours(i); })
        //     .attr("d", arc);

        svg.arcs.enter().append("path")
            .attr("class", "arc")
            .attr("fill", function(d, i) { return d.data.colour })
            .attr("d", arc)
            .each(function(d) { this._current = d; });
    }



    return {
        draw: draw,
        redraw: redraw
    }
}
