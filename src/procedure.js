'use strict';

/**
 *
 */

var Procedure = function Procedure(el,data) {

    let svg = null;
    let element = el;
    let dataset = data;

    let containerWidth = d3.select(element).node().getBoundingClientRect().width;


    let config = {

        margin : {
            top : 0,
            bottom : 0,
            left : 0,
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


    let createSVG = function createSVG() {

        svg = d3.select(element)
            .append('svg')
            // .attr('width', (this.width + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
            .attr('width', (containerWidth + config.margin.left + config.margin.right + config.padding.left + config.padding.right))
            .attr('height', (height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom))
            .append('g')
            .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');



    }

    let setScale = function setScale() {

        console.log(data);

        let xScale = d3.scaleBand()
            .rangeRound([config.padding.left, width])
            .domain([0, data.length]);
        //
        // // y scale
        let yScale = d3.scaleLinear()
            .range([0, height])
            .domain([0, d3.max(data.map( (d) => { return d.total; }))]);

    }

    let yAxis = function yAxis() {



    }









    return {

        createSVG :  createSVG,
        setScale : setScale,
        yAxis : yAxis

    }
}