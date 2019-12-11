class MultiBarWithIncrement  {

    constructor(endpoint,elementID,config,dataMapping,segment) {

        this.endpoint = endpoint;
        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.config = config;
        this.dataMapping = dataMapping;
        this.smallMultiple = config.smallMultiple;
        this.segment = segment;
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

        this.config.padding.top = 20;
        this.config.padding.bottom = 60;
        this.config.padding.left = 40;
        this.config.padding.right = 20;

        this.config.minValue = 0;

        this.config.xParameter = '_date';
        this.config.xScaleType = 'time';
        this.config.xScaleTicks ='timeMonth';
        this.config.yScaleType = 'linear';

        this.config.paddingInner = 0;
        this.config.paddingOuter = 0;

        this.config.barWidth = 12;

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
        this.chartMultiBarsPlus = ChartMultiBarsToDots(this.config, this.svg);
        this.chartLegend = ChartLegend(this.config, this.svg);

        this.chartAxis.drawXAxis();
        this.chartAxis.drawYAxis();

        let url = 'https://tcmg-hub.publikaan.nl/api/data';

        if (globalData.weeks) {

            this.run(globalData.weeks,'totals')

        } else {

            d3.json(url, function(error, json) {
                if (error) throw error;
                globalData.weeks = json;
                self.run(json,'totals');
            });
        }

    }

    prepareData(json,timeframe)  {

        let data = [];

        let neededColumns = [];
        let flattenedMapping = [];



        for (let mapping of this.dataMapping) {

            for (let property of mapping) {

                flattenedMapping.push(property);
                neededColumns.push(property.column);
            }
        }

        console.log(flattenedMapping);

        for (let week of json) {

            for (let column of neededColumns) {

                let o = {};

                o['property'] = column;
                o['timeframe'] = (column.indexOf('nieuwe_') > -1) ? 'week' : 'totals';
                o[column] = week[column];
                o['_date'] = week['_date'];
                o['_category'] = week['_category'];

                let mapping = flattenedMapping.find( (m) => { return m['column'] === column});

                if(mapping) {

                    o['colour'] = mapping['colour'];
                    o['label'] = mapping['label'];
                }




                data.push(o);
            }
        }


        data.sort(function(a, b) {
            return new Date(a._date) - new Date(b._date);
        });

        let minBarWidth = 18;

        let elWidth = d3.select(this.elementID).node().getBoundingClientRect().width;

        let arrayLength = 2 * Math.floor(elWidth / (2 * minBarWidth));

        data = data.slice(data.length - arrayLength,data.length);

        console.log(data);

        return data;
    }


    redraw(data,timeframe) {

        let colour = blue; // this.dataMapping.find((m) => m.column === property)['colour'];

        this.yScale = this.chartYScale.set(data,this.setYParameter(timeframe));

        // on redraw chart gets new dimensions
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG.redraw(this.dimensions);
        // new dimensions mean new scales
        this.xScale = this.chartXScale.reset(this.dimensions,this.xScale);
        this.yScale = this.chartYScale.reset(this.dimensions,this.yScale);
        // new scales mean new axis

        this.chartAxis.redrawXTimeAxis(this.dimensions,this.xScale,this.axes,true);
        this.chartAxis.redrawYAxis(this.yScale,this.axes);
        // redraw data
        this.chartMultiBarsPlus.redraw(this.dimensions,this.xScale,this.yScale,this.config.yParameter);
    }

    draw(data,timeframe) {

        this.xScale = this.chartXScale.set(data.map(d => { return d[this.config.xParameter] }));

        this.chartMultiBarsPlus.draw(data);
    }

    setYParameter(timeframe) {

        return ((timeframe === 'week') < 0) ? this.config.yParameter : this.config.yParameter.substring(7);
    }

    run(json,timeframe) {

        let self = this;

        let data = this.prepareData(json,timeframe);
        // this.draw(data,timeframe);
        // this.redraw(data,timeframe);
        // legend(data);

        window.addEventListener("resize", () => self.redraw(data), false);

        for (let radio of this.radios) {
            radio.addEventListener( 'change', () => self.redraw(data,radio.value),false);
        }
    }
}