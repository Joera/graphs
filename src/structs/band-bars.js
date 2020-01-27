class BandBars {

    constructor(endpoint,elementID,config,dataMapping,property,segment,smallMultiple) {

        this.endpoint = endpoint;
        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.config = config;
        this.dataMapping = dataMapping;
        this.property = (!property || property === undefined) ? this.dataMapping[0][0].column : property;
        this.segment = segment;
        this.smallMultiple = smallMultiple;
    }

    init() {

        let self = this;

        // this.radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));
        this.municipalitySelect = document.querySelector('select.municipalities');

        let chartObjects = ChartObjects();
        this.config = Object.assign(this.config,chartObjects.config());
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
        this.xScale = chartObjects.xScale();
        this.yScale = chartObjects.yScale();
        this.axes = chartObjects.axes();
        this.functions = chartObjects.functions();

        this.config.margin.bottom = (window.innerWidth < 640 || this.smallMultiple) ? 125 : 50;
        this.config.margin.top = this.smallMultiple? 30 : 45;
        this.config.padding.top = 30;

        this.config.padding.left = 40;

        this.config.xParameter = 'label';
        this.config.yParameter = 'value';

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
        this.chartBar = ChartBar(this.config, this.svg);
        // this.chartLegend = ChartLegend(this.config, this.svg);

        this.chartAxis.drawXAxis();
        this.chartAxis.drawYAxis();

        let url = 'https://tcmg-hub.publikaan.nl' + this.endpoint;

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

        let segmented = json.find( j => j['_category'] === segment);

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

        this.yScale = this.chartYScale.set(data,this.config.yParameter);

        // on redraw chart gets new dimensions
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG.redraw(this.dimensions);
        // new dimensions mean new scales
        this.xScale = this.chartXScale.reset(this.dimensions,this.xScale);
        this.yScale = this.chartYScale.reset(this.dimensions,this.yScale);
        // new scales mean new axis

        this.chartAxis.redrawXBandAxis(this.dimensions, this.xScale, this.axes, true, this.smallMultiple);
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

        if(this.municipalitySelect != null) {
            this.municipalitySelect.addEventListener("change", function () {
                self.run(json,self.municipalitySelect.options[self.municipalitySelect.selectedIndex].value);
            });
        }
    }
}