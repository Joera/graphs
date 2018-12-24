let ChartSVG = function ChartSVG(element,config,dimensions,svg) {


    let render = function render() {

        svg.body = d3.select(element,config)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
    }

    let redraw = function redraw(dimensions) {
        console.log(dimensions);
        svg.body
            .attr('height', (dimensions.height + config.margin.top + config.margin.bottom + config.padding.top + config.padding.bottom))
            .attr('width', (dimensions.containerWidth));
    }

    let layers = function layers() {

        svg.layers.data = svg.body.append('g')
            .attr('class', 'data');
        svg.layers.axes = svg.body.append('g')
            .attr('class', 'axes');
    }

    render();
    layers();

    return {
        redraw, redraw
    }
}



