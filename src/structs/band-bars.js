class BandBars {

    constructor(elementID,dataMapping,property,segment,smallMultiple) {

        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.dataMapping = dataMapping;
        this.property = (!property || property === undefined) ? this.dataMapping[0][0].column : property;
        this.segment = segment;
        this.smallMultiple = smallMultiple;
    }

    init() {

        let self = this;

        this.radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));

        let chartObjects = ChartObjects();
        this.config = chartObjects.config();
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
        this.xScale = chartObjects.xScale();
        this.yScale = chartObjects.yScale();
        this.axes = chartObjects.axes();
        this.functions = chartObjects.functions();

        this.config.margin.top = 0;
        this.config.margin.bottom = 0;
        this.config.margin.left = 40;
        this.config.margin.right = 0;
        this.config.padding.top = 10;
        this.config.padding.bottom = 15;
        this.config.padding.left = 0;
        this.config.padding.right = 0;

        this.config.xParameter = 'label';
        this.config.yParameter = 'value';

        this.config.paddingInner = 0;
        this.config.paddingOuter = 0;

        // get dimensions from parent element
        this.chartDimensions = new ChartDimensions(this.elementID, this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        // create svg elements without data
        this.chartSVG = new ChartSVG(this.elementID, this.config, this.dimensions, this.svg);
        this.chartXScale = new ChartXScale(this.config, this.dimensions, this.xScale);
        this.chartYScale = ChartYScale(this.config, this.dimensions, this.yScale);
        this.chartAxis = ChartAxis(this.config, this.svg);
        this.chartBar = ChartBar(this.config, this.svg);
        this.chartLegend = ChartLegend(this.config, this.svg);

        this.chartAxis.drawXAxis();
        this.chartAxis.drawYAxis();

        let url = 'https://tcmg-hub.publikaan.nl/api/gemeentes';

        if (globalData.municipalities) {

            this.run(globalData.municipalities,this.property)

        } else {

            d3.json(url, function(error, json) {
                if (error) throw error;
                console.log(json);
                globalData.municipalities = json;
                self.run(json,self.segment);
            });
        }

    }

    prepareData(json,segment)  {

        let data = [];

        let segmented = json.filter( j => j['_category'] === segment);

        console.log(segmented);

        for (let mapping of this.dataMapping) {

            data.push(

                {
                    label:  mapping.label,
                    colour: mapping.colour,
                    value: segmented[mapping.column]
                }
            )
        }


        return data;
    }


    redraw(data) {

        console.log(data);

        this.yScale = this.chartYScale.set(data,this.config.yParameter);

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
        this.chartBar.redraw(this.dimensions,this.xScale,this.yScale);
    }

    draw(data) {

        this.xScale = this.chartXScale.set(data.map(d => d[this.config.xParameter]));

        this.chartBar.draw(data);
    }

    run(json,segment) {

        let self = this;

        let data = this.prepareData(json,segment);
        this.draw(data);
        this.redraw(data);
        // legend(data);

        window.addEventListener("resize", () => self.redraw(data), false);

        for (let radio of this.radios) {
            radio.addEventListener( 'change', () => self.run(json,radio.value),false);
        }
    }
}