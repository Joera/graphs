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



        svg.arcGroup = svg.layers.data.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        svg.arcPath = svg.arcGroup
            .append("path")
            .style("fill", function(d) { return config.colours(d['status']); });

        svg.arcLabel = svg.arcGroup.append("text")
            .attr("dy", ".35em")
            .text(function(d) { return d['status']; });

    }

    let redraw = function redraw(dimensions) {

        svg.layers.data
            .attr("transform", "translate(" + (dimensions.containerWidth / 2)+ "," + (dimensions.containerHeight / 2) + ")");

        let radius = dimensions.containerWidth / 4;

        let labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        let arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        svg.arcPath
            .attr("d", arc);

        svg.arcLabel
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })

    }

    return {
        draw: draw,
        redraw: redraw
    }
}
