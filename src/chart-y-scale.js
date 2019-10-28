let ChartYScale = function ChartYScale(config,dimensions,scale) {

    let set = function set(data,property) {

        let endDate = new Date();
        let minValue;

        // kun je dit meegeven als conditional

        if(config.minValue) {
            minValue = d3.min(data, d => d[property]) *.75;
        } else {
            minValue = 0; //
        }

        scale.linear = d3.scaleLinear()
            .domain([
                minValue,
                config.maxValue || d3.max(data, d => d[property])
            ]).nice();

        let arrayOfCumulatedValues = [];

        for (let p = 0; p < data.length; p++) {
            for (let i = 0; i < data[p].length; i++) {
                for (let e = 0; e < data.length; e++) {
                    arrayOfCumulatedValues.push(data[e][i][1]);
                }
            }
        }

        // console.log(arrayOfCumulatedValues);

        scale.stacked = d3.scaleLinear()
            .domain([
                minValue,
                config.maxValue || d3.max(arrayOfCumulatedValues)
            ])
            .nice();

        scale.stackedNormalized = d3.scaleLinear();


     //   let mapMax =

        scale.map = d3.scaleLinear()
            .domain([0, d3.max(data, d => {

                if (d.properties && d.properties[property] !== undefined) {
                    return d.properties[property];
                }
            })])
            .range([0.3,1]);

        scale.band = d3.scaleBand()
            .domain(data.map(d => d[config.xParameter]))
            .paddingInner(config.paddingInner)
            .paddingOuter(config.paddingOuter)
            .align([0.5])

        return scale;

    }


    let reset = function reset(dimensions,newScale) {

        newScale.linear
            .range([dimensions.height, 0]);

        newScale.stacked
            .range([(config.fixedHeight || dimensions.height), 0]);

        newScale.stackedNormalized
            .range([(config.fixedHeight || dimensions.height), 0]);

        newScale.band
            .range([0,dimensions.height])

        return newScale;
    }


    return {
        set : set,
        reset : reset,
    }
}


