// als we iets van een completionratio hebben .. per node
// en dan sorteren we daarop

// eerst even goeie update

let ChartSankey = function ChartSankey(config,svg) {


    let path;


    let translate = function translate(name) {

        if(name === 'MELDING') return 'schademelding';

    }

    let set = function set(nodes,links,dimensions) {

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

    let draw = function draw(nodes,links) {

        // Set the sankey diagram properties


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

        svg.nodeRectUncompleted = svg.nodeGroupEnter
            .append("rect")
            .style("fill", orange)
            .style("stroke", orange);

        svg.nodeGroupUncompleted = svg.nodeLayer.selectAll('.node-uncompleted')
            .data(links.filter( (l) => l.class === 'in-procedure'));

        svg.nodeGroupUncompleted.exit().remove();

        svg.nodeGroupUncompletedEnter = svg.nodeGroupUncompleted
            .enter()
            .append("g")
            .attr("class", "node-uncompleted");

        svg.nodeRectUncompleted = svg.nodeGroupUncompletedEnter
            .append("rect")
            .style("fill", orange )
            .style("stroke", orange );

        svg.nodeName = svg.nodeGroupEnter
            .append("text")
            .attr("x", -6)
            .attr("dy", ".5em")
            .attr("transform", null)
            .text(d => d.name)
            .attr("text-anchor", "start");

        svg.nodeValue = svg.nodeGroupEnter
            .append("text")
            .attr("x", -6)
            .attr("dy", "-.5em")
            .attr("transform", null);

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
            .style("opacity", 0.4)
            .attr("height", function(d) { return d.dy; })
            .attr("width", svg.sankey.nodeWidth())
            .transition()
            .delay(500)
            .duration(1500)
            .style("opacity", 1);

        svg.nodeGroupUncompleted
            .merge(svg.nodeGroupUncompletedEnter)
            .attr("transform", function(d) {
                return "translate(" + d.source.x + "," + d.source.y + ")";
            });

        svg.nodeRectUncompleted
            .style("opacity", 0.4)
            .attr("height", function(d) { console.log(d); return d.dy; })
            .attr("width", svg.sankey.nodeWidth())
            .transition()
            .delay(500)
            .duration(1500)
            .style("opacity", 1);

        svg.nodeName
            .attr("x", (d) => {
                return (d.x < dimensions.width / 2) ? 6 + svg.sankey.nodeWidth() : -6
            })
            .attr("y", (d) => d.dy / 2 )
            .attr("text-anchor", (d) => {
                return (d.x < dimensions.width / 2) ? "start" : "end";
            });

        svg.nodeValue
            .attr("y", function(d) { return d.dy / 2; })
            .attr("x", (d) => {
                return (d.x < dimensions.width / 2) ? 6 + svg.sankey.nodeWidth() : -6
            })
            .attr("text-anchor", (d) => {
                return (d.x < dimensions.width / 2) ? "start" : "end";
            })
            .text(d => thousands(d.value));
    }


    return  {
        set : set,
        draw : draw,
        redraw : redraw
    }
}


