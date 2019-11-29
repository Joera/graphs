class ChartDimensions {

    constructor(element,config) {

        this.element = element;
        this.config = config;
    }

    get(dimensions) {

        this.dimensions = dimensions;

        if (this.config.fixedWidth) {

            this.dimensions.containerWidth = this.config.fixedWidth + this.config.padding.left + this.config.padding.right;
            this.dimensions.width = this.config.fixedWidth;

        } else if (this.config.minWidth && d3.select(this.element).node().getBoundingClientRect().width < this.config.minWidth) {

            this.dimensions.containerWidth = this.config.minWidth + this.config.padding.left + this.config.padding.right;
            this.dimensions.width = this.config.minWidth;

        } else {

            this.dimensions.containerWidth = d3.select(this.element).node().getBoundingClientRect().width - this.config.margin.left - this.config.margin.right;
            this.dimensions.width = dimensions.containerWidth - this.config.padding.left - this.config.padding.right;
        }




        if(this.config.fixedHeight){
            this.dimensions.containerHeight = this.config.fixedHeight + this.config.padding.top + this.config.padding.bottom;
            this.dimensions.height = this.config.fixedHeight
        } else if(this.config.blocks) {
            this.dimensions.containerHeight = (this.config.maxValue / 100) + this.config.padding.top + this.config.padding.bottom;
            this.dimensions.height = (this.config.maxValue / 100);
        } else {
            this.dimensions.containerHeight = d3.select(this.element).node().getBoundingClientRect().height - this.config.margin.top - this.config.margin.bottom;
            this.dimensions.height = this.dimensions.containerHeight - this.config.padding.top - this.config.padding.bottom;
        }

        return this.dimensions;
    }


}