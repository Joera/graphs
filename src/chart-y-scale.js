let ChartYScale = function ChartYScale(config,dimensions,scale) {

    let set = function set(data) {

        let endDate = new Date();

        scale.yLinear = d3.scaleLinear()
            .range([(config.fixedHeight || dimensions.height), 0])
            .domain([
                config.minValue,
                config.maxValue || d3.max(data, d => d[config.yParameter])
            ]).nice();

        scale.stacked = d3.scaleLinear()
            .range([(config.fixedHeight || dimensions.height), 0])
            .domain([
                config.minValue,
                config.maxValue || d3.max(data, function (d) { if (d[d.length - 1] && d[d.length - 1][1]) { return d[d.length - 1][1]; }} )
            ]).nice();

        scale.yBlocks = d3.scaleLinear()
            .range([(config.maxValue / 100), 0]) // geen idee waarom 259 ipv 250
            .domain([0,config.maxValue]);

        return scale;
    }


    let reset = function reset(dimensions,newScales) {

        return newScales;
    }


    return {
        set : set,
        reset : reset,
    }
}


