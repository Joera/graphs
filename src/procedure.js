'use strict';

/**
 *
 */

var Procedure = function Procedure(el,data) {

    let svg = null;
    let element = el;
    let dataset = data;
    let layers = {};
    let xScale;
    let yScale;
    let colourMap;

    let containerWidth = d3.select(element).node().getBoundingClientRect().width;

    let barWidth = 80;


    let config = {

        margin : {
            top : 60,
            bottom : 60,
            left : 60,
            right : 0
        },

        padding : {
            top : 0,
            bottom : 0,
            left : 0,
            right : 0
        }
    };

    let height = 400;
    let width = containerWidth - config.margin.left - config.margin.right - config.padding.left - config.padding.right;


    let renderSVG = function createSVG() {

        svg = d3.select(element)
            .append('svg')
            // .attr('width', (this.width + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
            .attr('width', (containerWidth + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
            .attr('height', (height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom))
            .append('g')
            .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');




        //     .offset("zero")
    }

    let renderLayers = function renderLayers() {

        layers.axis = svg.append('g')
            .attr('class', 'axis');

        layers.bars = svg.append('g')
            .attr('class', 'bars');

    }

    let setScale = function setScale() {

        xScale = d3.scaleBand()
            .range([config.margin.left, width - config.margin.right])
            .domain(data.map(d => d.name))
            .paddingInner([0.1])
            .paddingOuter([0.3])
            .align([0.5]);
        //
        // // y scale
        yScale = d3.scaleLinear()
            .range([height - config.margin.bottom, config.margin.top])
            .domain([0,d3.max(data, d => d.total)]).nice();

        // colourMap = d3.scaleOrdinal(d3.schemeCategory20)
        //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"])
        //     .domain(data.columns.slice(3));

    }

    let renderYAxis = function renderYAxis() {

        let totalAxis = d3.axisLeft(yScale);

        layers.axis.append("g")
            .attr('class', 'total-axis')
            .attr("transform", "translate(0,0)")
            .call(totalAxis);
    }

    let renderXAxis = function renderYAxis() {

        let statusAxis = d3.axisBottom(xScale);

        layers.axis.append("g")
            .attr('class', 'status-axis')
            .attr("transform", "translate(" + (-barWidth / 2 - 10) + "," + (height - config.margin.bottom) + ")")
            .call(statusAxis);
    }


    let renderBars = function renderBars() {

        console.log('nieuw');

        let stack = d3.stack().keys([0,1,2,3]);
        stack.value(function (d, key) {
            return d[key].y;
        });

            let stackedData = data.map(function(d) {


                // console.log(d);

                return [
                    {
                        'cat' : d.name,
                        'val' : d['cvw_met_historie']
                    },
                    {
                        'cat' : d.name,
                        'val' : d['cvw_zonder_historie']
                    },
                    {
                        'cat' : d.name,
                        'val' : d['nieuw_met_historie']
                    },
                    {
                        'cat' : d.name,
                        'val' : d['nieuw_zonder_historie']
                    }
                ];

                // console.log(d);
                // return d.map(function(p, i) {
                //     return {
                //         'key': d.name,
                //         'value': p
                //     };
                // });
            });

            console.log(stackedData);

        let category = layers.bars.selectAll(".category")
            .data(stackedData)
            .enter().append("g")
            .attr("class",function(d, i) { return d.id + ' category' ; });
           // .style("fill", function(d, i) { return color(i); });




        let bar = category.selectAll(".bar")
            .data(function(d) {  return d; })
            .enter()
            .append('rect')
            .attr('y', (d) => {
                console.log(d);
                return yScale(d.val);
            })
            .attr('x', (d,i) => {
                return xScale(d.name);
            })
            .attr('width', barWidth)
            .attr('height', (d) => {
                return yScale(0) - yScale(d.val);
            })
            .attr('class', 'bar');

    }

    let renderFlows = function renderFlows() {


        let areaData = []


        for (let i = 0; i < data.length - 1; i++) {  //  -

            areaData.push([data[i],data[i + 1]]);

        }

        let area = d3.area()
            .curve(d3.curveCardinal)
            .x0((d,i) => { if (i < 1) { return xScale(d.name) + barWidth } else { return xScale(d.name);}})
            .x1((d,i) => { if (i < 1) { return xScale(d.name) + barWidth } else { return xScale(d.name); }})
            .y0(yScale(0))
            .y1((d) => { return yScale(d.total); });


        layers.bars.selectAll('.flow')
            .data(areaData)
            .enter()
            .append("path")
            .attr("d", area)
            .attr("fill", "#ccc")
            .attr('class', 'flow');


    }









    return {

        renderSVG :  renderSVG,
        renderLayers : renderLayers,
        setScale : setScale,
        renderXAxis : renderXAxis,
        renderYAxis : renderYAxis,
        renderBars :  renderBars,
        renderFlows : renderFlows

    }
}