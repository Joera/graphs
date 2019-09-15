// als we iets van een completionratio hebben .. per node
// en dan sorteren we daarop

// eerst even goeie update

let ChartSankey = function ChartSankey(config,svg) {

    let nodes, links, path;


    let setSankey = function setSankey(nodes,links,dimensions) {

        nodes = nodes;
        links = links;

        svg.sankey = d3.sankey()
            .nodeWidth(24)
            .nodePadding(60)
            .size([dimensions.width, dimensions.height]);

        path = svg.sankey.link();

        svg.sankey
            .nodes(nodes)
            .links(links)
            .layout(64);
    }

    let draw = function draw(nodes,links,dimensions) {

        // Set the sankey diagram properties
        setSankey(nodes,links,dimensions);

        svg.linkGroup = svg.layers.data.append("g")
            .attr("class", "linkGroup");

        svg.links = svg.linkGroup.selectAll(".link")
            .data(links);

        svg.links.exit().remove();

        svg.linksEnter = svg.links
            .enter()
            .append("path")
            .attr("class", function(d) {
                return 'link ' + d.class;
            });

    }

    let redraw = function redraw(dimensions) {

        // how to update dimensions

        // add in the links
        svg.links
            .merge(svg.linksEnter)
            .attr("d", path)
            .style("stroke-width", function(d) { return Math.min(1, d.dy); });
            .transition()
            .duration(500)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); });

        //    .sort(function(a, b) { return b.dy - a.dy; })

        // add in the nodes
        let node = svg.layers.data.append("g").selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; })
       ;

        // add the rectangles for the nodes
        node.append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", svg.sankey.nodeWidth())
            .style("fill", function(d) {
                if (d.name === 'IN_PROCEDURE') {
                    return orange;
                } else {
                    return blue;
                }
            })
            .style("stroke", function(d) {

                if (d.name === 'IN_PROCEDURE') {
                    return orange;
                } else {
                    return blue;
                }
            })
            .append("title")
            .text(function(d) {
                return d.name + "\n" + d.value; });

        let uncompleted = svg.layers.data.append("g").selectAll(".uncomplete")
            .data(links)
            .enter().append("g")
            .attr("class", "uncomplete")
            .attr("transform", function(d) {
                return "translate(" + d.source.x + "," + d.source.y + ")"; })
        ;

        // add the rectangles for the nodes
        uncompleted.append("rect")
            .attr("height", function(d) { console.log(d); return d.dy; })
            .attr("width", svg.sankey.nodeWidth())
            .style("fill", function(d) {
                if (d.target.name === 'IN_PROCEDURE') {
                    return orange;
                } else {
                    return blue;
                }
            })
            .style("stroke", function(d) {

                if (d.target.name === 'IN_PROCEDURE') {
                    return orange;
                } else {
                    return blue;
                }
            })
            .append("title")
            .text(function(d) {
                return d.name + "\n" + d.value; });



        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name  })
            .filter(function(d) { return d.x < dimensions.width / 2; })
            .attr("x", 6 + svg.sankey.nodeWidth())
            .attr("text-anchor", "start");

        // add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", "-.7em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.value  })
            .filter(function(d) { return d.x < dimensions.width / 2; })
            .attr("x", 6 + svg.sankey.nodeWidth())
            .attr("text-anchor", "start");


        // tooltip doen met + ' ' + d.desc;
    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


