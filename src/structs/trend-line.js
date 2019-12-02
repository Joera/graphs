class TrendLine {

    constructor(endpoint,elementID,config,dataMapping,property,segment,smallMultiple) {

        this.endpoint = endpoint;
        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.dataMapping = dataMapping;
        this.config = config;
        this.property = (!property || property === undefined) ? this.dataMapping[0][0].column : property;
        this.segment = segment;
        this.smallMultiple = smallMultiple;

    }

    init() {

        let self = this;

        // this.radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));
        this.municipalitySelect = document.querySelector('select.municipalities');

        let chartObjects = ChartObjects();
        this.config = Object.assign(this.config, chartObjects.config());
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
        this.xScale = chartObjects.xScale();
        this.yScale = chartObjects.yScale();
        this.axes = chartObjects.axes();
        this.functions = chartObjects.functions();


        this.config.margin.bottom = (window.innerWidth < 640 || this.smallMultiple) ? 75 : 0;
        this.config.margin.top = this.smallMultiple? 15 : 30;
        this.config.padding.bottom = 50;
        this.config.padding.left = 40;
        //
        // this.config.xParameter = '_date';
        // this.config.xScaleTicks = 'timeMonth';
        // this.config.yParameter = 'percentage_afwijzingen';

        this.config.paddingInner = 0.1;
        this.config.paddingOuter = 0.1;

        // get dimensions from parent element
        this.chartDimensions = new ChartDimensions(this.elementID, this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        // create svg elements without data
        this.chartSVG = new ChartSVG(this.elementID, this.config, this.dimensions, this.svg);
        this.chartXScale = new ChartXScale(this.config, this.dimensions, this.xScale);
        this.chartYScale = ChartYScale(this.config, this.dimensions, this.yScale);
        this.chartAxis = ChartAxis(this.config, this.svg);
        this.chartLine = ChartLine(this.config, this.svg);

        this.chartAxis.drawXAxis();
        this.chartAxis.drawYAxis();

        let url = 'https://tcmg-hub.publikaan.nl/' + this.endpoint;

        if (globalData.municipalities) {

            this.run(globalData.municipalities,this.segment)

        } else {

            d3.json(url, function(error, json) {
                if (error) throw error;
                globalData.municipalities = json;
                self.run(json,self.segment);
            });
        }

    }

    prepareData(json,segment)  {

        let data = [];

        // json.filter( (week) {
        //
        //
        // })

        // start Date

        // let segmented = json.find( j => j['_category'] === segment);

        let neededColumns = ['_date','_category'].concat(this.dataMapping.map( (c) => c.column ));

        for (let week of json) {
            let o = {};
            for (let p of Object.entries(week))  {
                if (neededColumns.indexOf(p[0]) > -1 ) {
                    o[p[0]] = p[1];
                }
            }
            data.push(o);
        }

        data = data.filter( (week) => {


            return week[this.property] > 0
        })

        data.sort(function(a, b) {
            return new Date(a['_date']) - new Date(b['_date']);
        });


        return data;
    }


    redraw(data) {

        this.yScale = this.chartYScale.set(data,this.config.yParameter);

        // on redraw chart gets new dimensions
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG.redraw(this.dimensions);
        // new dimensions mean new scales
        this.xScale = this.chartXScale.reset(this.dimensions,this.xScale);
        this.yScale = this.chartYScale.reset(this.dimensions,this.yScale);
        // new scales mean new axis

        this.chartAxis.redrawXTimeAxis(this.dimensions, this.xScale, this.axes, true, this.smallMultiple);
        this.chartAxis.redrawYAxis(this.yScale,this.axes);
        // redraw data
        this.chartLine.redraw(this.xScale,this.yScale,this.functions);
    }

    draw(data) {

        this.xScale = this.chartXScale.set(data.map(d => d[this.config.xParameter]));

        this.chartLine.draw(data);
    }

    run(json,segment) {

        let self = this;

        let data = this.prepareData(json,segment);
        this.draw(data);
        this.redraw(data);
        // legend(data);

        window.addEventListener("resize", () => self.redraw(data), false);

        if(this.municipalitySelect != null) {
            this.municipalitySelect.addEventListener("change", function () {
                self.run(json,self.municipalitySelect.options[self.municipalitySelect.selectedIndex].value);
            });
        }
    }
}