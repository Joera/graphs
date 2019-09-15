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

        svg.linkLayer = svg.layers.data.append("g")
            .attr("class", "linkGroup");

        svg.links = svg.linkLayer.selectAll(".link")
            .data(links);

        svg.links.exit().remove();

        svg.linksEnter = svg.links
            .enter()
            .append("path")
            .attr("class", function(d) {
                return 'link ' + d.class;
            });

        svg.nodeLayer = svg.layers.data.append("g")
            .attr("class", "nodeGroup");

        svg.nodeGroup = svg.nodeLayer.selectAll('.node')
            .data(nodes);

        svg.nodeGroup.exit().remove();

        svg.nodeGroupEnter = svg.nodeGroup
            .enter()
            .append("g")
            .attr("class", "node");

        svg.nodeRect = svg.nodeGroupEnter
            .append("rect")
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
            });

    }

    let redraw = function redraw(dimensions) {

        // how to update dimensions

        // add in the links
        svg.links
            .merge(svg.linksEnter)
            .attr("d", path)
            .style("stroke-width", function(d) { return Math.min(1, d.dy); })
            .transition()
            .duration(500)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); });

        //    .sort(function(a, b) { return b.dy - a.dy; })

        // add in the nodes
        svg.nodeGroup
            .merge(svg.nodeGroupEnter)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        svg.nodeRect
            .style("opacity", 0.3)
            .attr("height", function(d) { return d.dy; })
            .attr("width", svg.sankey.nodeWidth())
            .transition()
            .delay(1000)
            .duration(1500)
            .style("opacity", 1)

        // add the rectangles for the nodes



            // .append("title")
            // .text(function(d) {
            //     return d.name + "\n" + d.value;
            // });



        // add in the title for the nodes
        // svg.nodeGroup
        //     .append("text")
        //     .attr("x", -6)
        //     .attr("y", function(d) { return d.dy / 2; })
        //     .attr("dy", ".35em")
        //     .attr("text-anchor", "end")
        //     .attr("transform", null)
        //     .text(function(d) { return d.name  })
        //     .filter(function(d) { return d.x < dimensions.width / 2; })
        //     .attr("x", 6 + svg.sankey.nodeWidth())
        //     .attr("text-anchor", "start");

        // add in the title for the nodes
        // svg.nodeGroup
        //     .append("text")
        //     .attr("x", -6)
        //     .attr("y", function(d) { return d.dy / 2; })
        //     .attr("dy", "-.7em")
        //     .attr("text-anchor", "end")
        //     .attr("transform", null)
        //     .text(function(d) { return d.value  })
        //     .filter(function(d) { return d.x < dimensions.width / 2; })
        //     .attr("x", 6 + svg.sankey.nodeWidth())
        //     .attr("text-anchor", "start");


        // tooltip doen met + ' ' + d.desc;
    }


    return  {
        draw : draw,
        redraw : redraw
    }
}


