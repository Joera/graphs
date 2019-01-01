let ChartDimensions = function ChartDimensions(element,config) {

    let get = function get(dimensions) {


        dimensions.containerWidth = d3.select(element).node().getBoundingClientRect().width - config.margin.left - config.margin.right;
        dimensions.width = dimensions.containerWidth - config.padding.left - config.padding.right;

        if(config.fixedHeight) {
            dimensions.containerHeight = config.fixedHeight + config.padding.top + config.padding.bottom;
            dimensions.height = config.fixedHeight;
        } else {
            dimensions.containerHeight = d3.select(element).node().getBoundingClientRect().height - config.margin.top - config.margin.bottom;
            dimensions.height = dimensions.containerHeight - config.padding.top - config.padding.bottom;
        }

        return dimensions;
    }

    return {
        get : get
    }
}