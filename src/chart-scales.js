let ChartScales = function ChartScales(config,dimensions,scales) {

    let set = function set(data) {

        let endDate = new Date();

        scales.xTime = d3.scaleTime()
            .domain([d3.min(data, d => new Date(d.date)),endDate]);

        scales.yLinear = d3.scaleLinear()
            .range([dimensions.height, config.margin.top + config.padding.top])
            .domain([0,d3.max(data, d => d[config.yParameter])]).nice();

        scales.yLinearReverse = d3.scaleLinear()
            .range([dimensions.height, config.margin.top + config.padding.top])
            .domain([d3.max(data, d => d[config.yParameter]),0]).nice();

        scales.xBand = d3.scaleBand()
            // what is domain when working with a stack?
            .domain(data.map(d => d[config.xParameter]))
            .paddingInner([0.5])
            .paddingOuter([0.01])
            .align([0.5]);

        scales.yInputLinear = d3.scaleLinear()
            .range([dimensions.height, config.margin.top + config.padding.top])
            .domain([0,d3.max(data, d => d.value)]).nice();

        return scales;
    }


    let reset = function reset(dimensions,newScales) {

        newScales.xTime
            .range([config.margin.left + config.padding.left, dimensions.width]);

        newScales.xBand
            // or does this
            .range([config.margin.left + config.padding.left, dimensions.width])

        return newScales;
    }


    return {
        set : set,
        reset : reset,
    }
}


