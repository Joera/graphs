class ChartSVG {


    constructor(element,config,dimensions,svg) {

        this.element = element;
        this.config = config;
        this.dimensions = dimensions;
        this.svg = svg;

        this.render();
        this.layers();
    }


    render() {

        this.svg.body = d3.select(this.element,this.config)
            .append('svg');

        this.svg.main = this.svg.body.append('g');

    }

    redraw(dimensions) {
        this.svg.body
            .attr('height', dimensions.containerHeight)
            .attr('width', dimensions.containerWidth);

        this.svg.main
            .attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.margin.top + ')')
            .attr('width', (dimensions.containerWidth - this.config.margin.left - this.config.margin.right))
            .attr('height', (dimensions.containerHeight - this.config.margin.top - this.config.margin.bottom));

        this.svg.layers.legend
            .attr('transform', 'translate(' + this.config.padding.left + ',' + (dimensions.containerHeight - 10) + ')');

    }

    layers() {

        this.svg.layers.underData = this.svg.body.append('g')
            .attr('class', 'under_data')
            .attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.padding.top + ')');
        this.svg.layers.data = this.svg.body.append('g')
            .attr('class', 'data')
            .attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.padding.top + ')');
        this.svg.layers.axes = this.svg.body.append('g')
            .attr('class', 'axes');
        this.svg.layers.legend = this.svg.body.append('g')
            .attr('class', 'legend');
    }



}



