let ChartSVG = function ChartSVG(element,config,dimensions,svg) {


    let render = function render() {

        svg.body = d3.select(element,config)
            .append('svg');

        svg.main = svg.body.append('g');

    }

    let redraw = function redraw(dimensions) {
        svg.body
            .attr('height', dimensions.containerHeight)
            .attr('width', dimensions.containerWidth);

        svg.main
            .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')')
            .attr('width', (dimensions.containerWidth - config.margin.left - config.margin.right))
            .attr('height', (dimensions.containerHeight - config.margin.top - config.margin.bottom));
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



