class StackedArea  {

    constructor(endpoint,elementID,config,dataMapping,property,smallMultiple) {

        this.endpoint = endpoint;
        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.config = config;
        this.dataMapping = dataMapping;
     //   this.property = (!property || property === undefined) ? this.dataMapping[0][0].column : property;
        this.smallMultiple = smallMultiple;
    }

    init() {

        let self = this;

        this.radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));
        this.options = [].slice.call(document.querySelectorAll('.selector li input[type=checkbox]'));
        this.columnArray = this.dataMapping.map( (map) => map.column );

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
        this.chartStackedArea = ChartStackedArea(this.config, this.svg);

        this.chartAxis.drawXAxis();
        this.chartAxis.drawYAxis();

        let url = 'https://tcmg-hub.publikaan.nl' + this.endpoint;

        if (globalData.weeks) {

            this.run(globalData.weeks)

        } else {

            d3.json(url, function(error, json) {
                if (error) throw error;
                globalData.weeks = json;
                self.run(json);
            });
        }

    }

    prepareData(json)  {

        let data = [];
        let mapping;


        for (let week of json) {
            let o = {};
            let legit = true;

            for (let column of this.columnArray)  {

                mapping = this.dataMapping.find( (map) => map.column === column);

                o[column] = week[column];
                o['_date'] = week['_date'];
                o['_category'] = week['_category'];
                o['label'] = mapping.label;
                o['colour'] = mapping.colour;

                if (o[column] === null) {
                    legit = false;
                }
            }

            if(legit) {
                data.push(o);
            }
        }

        data.sort(function(a, b) {
            return new Date(a['_date']) - new Date(b['_date']);
        });

        // data = data.filter( (week) => {
        //
        //     return week[property] !== null && week[property] > 0;
        // });

        data = data.slice(1,data.length);

        this.functions.stack = d3.stack()
            .keys(Object.keys(data[0]).filter(key => {
                return ['_date','_category','label','colour'].indexOf(key) < 0
            } ));

        let stackedData = this.functions.stack(data);

        return {data, stackedData}

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

        if(config.yScaleType === 'stackedNormalized' ) {
            this.chartAxis.redrawYAxisStackedNormalized(this.yScale,this.axes);
        } else {
            this.chartAxis.redrawYAxisStacked(this.yScale,this.axes);
        }

        // redraw data
        this.chartStackedArea.redraw(this.dimensions,this.xScale,this.yScale,this.dataMapping);
    }

    draw(data,stackedData) {

        this.xScale = this.chartXScale.set(data.map(d => d[this.config.xParameter]));
        this.chartStackedArea.draw(data,stackedData);
    }

    run(json) {

        let self = this;

        let { data, stackedData } = this.prepareData(json);
        // this.chartStackedArea.init(stackedData);
        this.draw(data,stackedData);
        this.redraw(stackedData);
        // legend(data);

        window.addEventListener("resize", () => self.redraw(stackedData), false);

        for (let option of this.options) {
            option.addEventListener( 'click', () => {

                if (option.checked) {
                    this.columnArray[this.columnArray.length] = option.value;
                } else {
                    let index = this.columnArray.indexOf(option.value);
                    this.columnArray.splice(index,1);
                }

                this.run(json);

            }, false)
        }
    }
}