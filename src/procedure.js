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

    let containerWidth = d3.select(element).node().getBoundingClientRect().width;

    let barWidth = 80;


    let config = {

        margin : {
            top : 0,
            bottom : 0,
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



    }

    let renderLayers = function renderLayers() {

        layers.axis = svg.append('g')
            .attr('class', 'axis');

        layers.bars = svg.append('g')
            .attr('class', 'bars');

    }

    let setScale = function setScale() {

        xScale = d3.scaleBand()
            .rangeRound([config.padding.left, width])
            .domain([0, data.length]);
        //
        // // y scale
        yScale = d3.scaleLinear()
            .range([0, height])
            .domain([d3.max(data.map( (d) => { return d.total; })),0]);

    }

    let renderYAxis = function renderYAxis() {

        let totalAxis = d3.axisLeft(yScale);

        layers.axis.append("g")
            .attr('class', 'total-axis')
            .attr("transform", "translate(0,30)")
            .call(totalAxis);
    }


    let renderBars = function renderBars() {

        let bar = layers.bars.selectAll('.bar')
            .data((d) => {
                return [d];
            })
            .enter()
            .append('rect')
            .attr('x', (d) => {
                return yScale(d.total);
            })
            .attr('y', (d,i) => {
                return xScale(i) + config.margin.top +config.padding.top;
            })
            .attr('width', barWidth)
            .attr('height', (d) => {
                return yScale(d.total);
            })
            .attr('class', 'bar');


    }









    return {

        renderSVG :  renderSVG,
        renderLayers : renderLayers,
        setScale : setScale,
        renderYAxis : renderYAxis,
        renderBars :  renderBars

    }
}