let ChartXScale = function ChartXScale(config,dimensions,scale) {

    let set = function set(data) {

        let endDate = new Date();

        scale.time = d3.scaleTime()
            .domain([
                d3.min(data, d => new Date(d[config.xParameter])),  //
                d3.max(data, d => new Date(d[config.xParameter])),
            ]);

        scale.band = d3.scaleBand()
            // what is domain when working with a stack?
            .domain(data.map(d => d[config.xParameter]))
            .paddingInner(config.paddingInner)
            .paddingOuter(config.paddingOuter)
            .align([0.5])
        ;

        return scale;
    }


    let reset = function reset(dimensions,newScale) {

        newScale.time
            .range([0, dimensions.width]);

        newScale.band
            // or does this
            .range([0, dimensions.width])

        return newScale;
    }


    return {
        set : set,
        reset : reset,
    }
}


