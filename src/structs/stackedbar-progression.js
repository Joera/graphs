class StackedBarProgression  {

    constructor(endpoint,elementID,config,dataMapping,property,smallMultiple) {

        this.endpoint = endpoint;
        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.config = config;
        this.dataMapping = dataMapping;
        this.property = (!property || property === undefined) ? this.dataMapping[0][0].column : property;
        this.smallMultiple = smallMultiple;
    }

    init() {

        let self = this;

        this.radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));

        let chartObjects = ChartObjects();
        this.config = Object.assign(this.config,chartObjects.config());
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
        this.xScale = chartObjects.xScale();
        this.yScale = chartObjects.yScale();
        this.axes = chartObjects.axes();
        this.functions = chartObjects.functions();

        this.config.padding.left = 40;
        this.config.padding.top = 10;
        this.config.padding.bottom = 15;
        this.config.margin.bottom = 45;

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
        this.chartStackedBars = ChartStackedBars(this.config, this.svg);


        this.chartAxis.drawXAxis();
        this.chartAxis.drawYAxis();

        let url = 'https://tcmg-hub.publikaan.nl' + this.endpoint;

        if (globalData.weeks) {

            this.run(globalData.weeks,this.property)

        } else {

            d3.json(url, function(error, json) {
                if (error) throw error;
                console.log(json);
                globalData.weeks = json;
                self.run(json,self.property);
            });
        }

    }

    prepareData(json,property)  {

        let neededColumns = ['_date','_category'].concat(this.dataMapping.map( (c) => c.column ));

        let data = [];
        let stackedData;

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


        data = data.filter( (week) => {

            return week[property] !== null && week[property] > 0;

        });


        data = data.slice(1,data.length)
        //
        // let minBarWidth = 60;
        //
        // let elWidth = d3.select(this.elementID).node().getBoundingClientRect().width;
        //
        // data = data.slice(data.length - Math.floor(elWidth / minBarWidth),data.length);



        this.functions.stack = d3.stack()
            .keys(Object.keys(data[0]).filter(key => {
                return ['_date','_category'].indexOf(key) < 0
            } ));

        this.functions.normalizedStack = d3.stack()
            .offset(d3.stackOffsetExpand)
            .keys(Object.keys(data[0]).filter(key => {
                return ['status'].indexOf(key) < 0
            } ));

        if(config.yScaleType === 'stackedNormalized' ) {

            stackedData = this.functions.normalizedStack(data);
        } else {

            stackedData = this.functions.stack(data);

        }


        return { data, stackedData,stackedDataNormalized }
    }


    redraw(stackedData) {

        let colours = this.dataMapping.map((m) => m['colour']);

        this.yScale = this.chartYScale.set(stackedData);

        // on redraw chart gets new dimensions
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG.redraw(this.dimensions);
        // new dimensions mean new scales
        this.xScale = this.chartXScale.reset(this.dimensions,this.xScale);
        this.yScale = this.chartYScale.reset(this.dimensions,this.yScale);
        // new scales mean new axis

        this.chartAxis.redrawXTimeAxis(this.dimensions,this.xScale,this.axes,true);
        this.chartAxis.redrawYAxisStacked(this.yScale,this.axes);
        // redraw data
        this.chartStackedBars.redraw(this.dimensions,this.xScale,this.yScale,this.property,colours);
    }

    draw(data,stackedData) {

        this.xScale = this.chartXScale.set(data.map(d => d[this.config.xParameter]));

        this.chartStackedBars.draw(data,stackedData);
    }

    run(json,property) {

        let self = this;

        let { data, stackedData } = this.prepareData(json,property);
        this.draw(data,stackedData);
        this.redraw(stackedData,property);
        // legend(data);

        window.addEventListener("resize", () => self.redraw(data,property), false);

        for (let radio of this.radios) {
            radio.addEventListener( 'change', () => self.redraw(data,radio.value),false);
        }
    }
}