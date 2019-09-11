let ChartScales = function ChartScales(config,dimensions,scales) {

    let set = function set(data) {

        let endDate = new Date();

        scales.xTime = d3.scaleTime()
            .domain([
                d3.min(data, d => new Date(d[config.xParameter])),  //
                d3.max(data, d => new Date(d[config.xParameter])),
            ]);

        scales.yLinear = d3.scaleLinear()
            .range([(config.fixedHeight || dimensions.height), 0])
            .domain([
                config.minValue,
                config.maxValue || d3.max(data, d => d[config.yParameter])
            ]).nice();

        scales.yStacked = d3.scaleLinear()
            .range([(config.fixedHeight || dimensions.height), 0])
            .domain([
                config.minValue,
                config.maxValue || d3.max(data, function (d) { console.log(d); if (d[d.length] && d[d.length][1]) { console.log(d[d.length][1]); return d[d.length][1]; }} )
            ]).nice();

        scales.xBand = d3.scaleBand()
            // what is domain when working with a stack?
            .domain(data.map(d => d[config.xParameter]))
            .paddingInner(config.paddingInner)
            .paddingOuter(config.paddingOuter)
            .align([0.5])
        ;

        scales.yInputLinear = d3.scaleLinear()
            .range([259, 0]) // geen idee waarom 259 ipv 250
            .domain([0,25000]);

       // console.log((config.maxValue / 100) + config.scaleOffset);

        scales.yBlocks = d3.scaleLinear()
            .range([(config.maxValue / 100), 0]) // geen idee waarom 259 ipv 250
            .domain([0,config.maxValue]);

        return scales;
    }


    let reset = function reset(dimensions,newScales) {

        newScales.xTime
            .range([0, dimensions.width]);

        newScales.xBand
            // or does this
            .range([0, dimensions.width])

        return newScales;
    }


    return {
        set : set,
        reset : reset,
    }
}


