class BarProgression  {

    constructor(endpoint,elementID,config,dataMapping,segment) {

        this.endpoint = endpoint;
        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.config = config;
        this.dataMapping = dataMapping;
        this.property = this.dataMapping[0].column;
        this.smallMultiple = config.smallMultiple;
    }

    init() {

        let self = this;

        this.radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));

        let chartObjects = ChartObjects();
        this.config = Object.assign(chartObjects.config(),this.config);
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
        this.xScale = chartObjects.xScale();
        this.yScale = chartObjects.yScale();
        this.axes = chartObjects.axes();
        this.functions = chartObjects.functions();

        // this.config.padding.top = 20;
        // this.config.margin.bottom = 15;
        //
        // this.config.padding.left = 40;

        this.config.paddingInner = 0;
        this.config.paddingOuter = 0;

        if (this.smallMultiple) {
            this.config.dataArrayLength = 7;
        }



        // get dimensions from parent element
        this.chartDimensions = new ChartDimensions(this.elementID, this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        // create svg elements without data
        this.chartSVG = new ChartSVG(this.elementID, this.config, this.dimensions, this.svg);
        this.chartXScale = new ChartXScale(this.config, this.dimensions, this.xScale);
        this.chartYScale = ChartYScale(this.config, this.dimensions, this.yScale);
        this.chartAxis = ChartAxis(this.config, this.svg);
        this.chartBarsIncrease = ChartBarsIncrease(this.config, this.svg);


        this.chartAxis.drawXAxis();
        this.chartAxis.drawYAxis();

        let url = 'https://tcmg-hub.publikaan.nl' + this.endpoint

        if (globalData.weeks) {

            this.run(globalData.weeks,this.property)

        } else {

            d3.json(url, function(error, json) {
                if (error) throw error;
                globalData.weeks = json;
                self.run(json,self.property);
            });
        }

    }

    prepareData(json,property)  {

        let neededColumns = ['_date','_category'].concat(this.dataMapping.map( (c) => c.column ));

        let data = [];

        for (let week of json) {
            let o = {};
            for (let p of Object.entries(week))  {
                if (neededColumns.indexOf(p[0]) > -1 ) {
                      o[p[0]] = p[1];
                }
            }
            data.push(o);
        }

        data.sort(function(a, b) {
            return new Date(a._date) - new Date(b._date);
        });

        let minBarWidth = 60;

        let elWidth = d3.select(this.elementID).node().getBoundingClientRect().width;

        data = data.slice(data.length - Math.floor(elWidth / minBarWidth),data.length);

        return data;
    }


    redraw(data,property) {

        let colour = this.dataMapping.find((m) => m.column === property)['colour'];

        this.yScale = this.chartYScale.set(data,property);

        // on redraw chart gets new dimensions
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG.redraw(this.dimensions);
        // new dimensions mean new scales
        this.xScale = this.chartXScale.reset(this.dimensions,this.xScale);
        this.yScale = this.chartYScale.reset(this.dimensions,this.yScale);
        // new scales mean new axis

        this.chartAxis.redrawXTimeAxis(this.dimensions,this.xScale,this.axes,false);
        this.chartAxis.redrawYAxis(this.yScale,this.axes);
        // redraw data
        this.chartBarsIncrease.redraw(this.dimensions,this.xScale,this.yScale,property,colour);
    }

    draw(data,property) {

        this.xScale = this.chartXScale.set(data.map(d => d[this.config.xParameter]));

        this.chartBarsIncrease.draw(data);
    }

    run(json,property) {

        let self = this;

        let data = this.prepareData(json,property);
        this.draw(data,property);
        this.redraw(data,property);
        // legend(data);

        window.addEventListener("resize", () => self.redraw(data,property), false);

        for (let radio of this.radios) {
            radio.addEventListener( 'change', () => self.redraw(data,radio.value),false);
        }
    }
}