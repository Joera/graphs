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
            .domain([
                minValue,
                config.maxValue || d3.max(data, d => d[property])
            ]).nice();

        scale.stacked = d3.scaleLinear()
            .domain([
                minValue,
                config.maxValue || d3.max(data, function (d) {

                        for (let i = 0; i < d.length - 1; i++) {
                            console.log(d[i][1]);
                            return d[i][1];
                        }
                } )
            ]).nice();

        return scale;
    }


    let reset = function reset(dimensions,newScale) {

        newScale.linear
            .range([dimensions.height, 0]);

        newScale.stacked
            .range([(config.fixedHeight || dimensions.height), 0]);



        return newScale;
    }


    return {
        set : set,
        reset : reset,
    }
}


