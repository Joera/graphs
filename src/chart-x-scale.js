class ChartXScale {

    constructor(config,dimensions,scale) {

        this.config = config;
        this.dimensions = dimensions;
        this.scale = scale;
        this.data = false;
    }


    set(data) {

        this.data = data;
        let self = this;
        let endDate = new Date();

        this.scale.linear = d3.scaleLinear()
            .domain([
                    d3.min(data.map(d => { console.log(d); return Object.values(d)[0] })),  //
                    d3.max(data.map(d => Object.values(d)[0]))
            ]);

        this.scale.time = d3.scaleTime()
            .domain([
                d3.min(data, d => new Date(d[self.config.xParameter])),  //
                d3.max(data, d => new Date(d[self.config.xParameter])),
            ]);

        this.scale.band = d3.scaleBand()
            // what is domain when working with a stack?
            .domain(data) /// where was data.map(d => d[self.config.xParameter]) used?
            .paddingInner(self.config.paddingInner)
            .paddingOuter(self.config.paddingOuter)
            .align([0.5])
        ;

        this.scale.stackedNormalized = d3.scaleLinear();

        return this.scale;
    }


    reset(dimensions,newScale) {

        let self = this;

        newScale.time
            .range([0, dimensions.width]);

        newScale.linear
            .range([0, dimensions.width]);

        newScale.band
            // or does this
            .range([0,dimensions.width]);

        newScale.stackedNormalized
            .range([0,dimensions.width]);

        return newScale;
    }
}


