let ChartYScale = function ChartYScale(config,dimensions,scale) {

    let set = function set(data,property) {

        let endDate = new Date();
        let minValue;

        // kun je dit meegeven als conditional

        if(config.minValue) {
            minValue = (d3.max(data, d => d[property]) > 20000) ? config.minValue : 900;
        } else {
            minValue = 0; //
        }

        scale.linear = d3.scaleLinear()
            .range([(config.fixedHeight || dimensions.height), 0])
            .domain([
                minValue,
                config.maxValue || d3.max(data, d => d[property])
            ]).nice();

        scale.stacked = d3.scaleLinear()
            .range([(config.fixedHeight || dimensions.height), 0])
            .domain([
                minValue,
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


