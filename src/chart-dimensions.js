class ChartDimensions {

    constructor(element,config) {

        this.element = element;
        this.config = config;
    }

    get(dimensions) {

        this.dimensions = dimensions;

        this.element = (typeof this.element === 'string') ? document.querySelector(this.element) : this.element;

        if (this.config.fixedWidth) {

            this.dimensions.svgWidth = this.config.fixedWidth + this.config.padding.left + this.config.padding.right;
            this.dimensions.width = this.config.fixedWidth;

        } else if (this.config.minWidth && this.element.getBoundingClientRect().width < this.config.minWidth) {

            this.dimensions.svgWidth = this.config.minWidth + this.config.padding.left + this.config.padding.right;
            this.dimensions.width = this.config.minWidth;

        } else {

            this.dimensions.svgWidth = this.element.getBoundingClientRect().width - this.config.margin.left - this.config.margin.right;
            this.dimensions.width = dimensions.svgWidth - this.config.padding.left - this.config.padding.right;
        }

        if(this.config.fixedHeight){

            this.dimensions.svgHeight = this.config.fixedHeight + this.config.padding.top + this.config.padding.bottom;
            this.dimensions.height = this.config.fixedHeight
        } else {
            this.dimensions.svgHeight = this.element.getBoundingClientRect().height - this.config.margin.top - this.config.margin.bottom;
            this.dimensions.height = this.dimensions.svgHeight - this.config.padding.top - this.config.padding.bottom;
        }

        return this.dimensions;
    }


}