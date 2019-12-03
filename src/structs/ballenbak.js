class Ballenbak {


    constructor(endpoint,elementID,config,dataMapping,segment) {

        this.endpoint = endpoint;
        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.config = config;
        this.dataMapping = dataMapping;
        this.segment = segment;

    }

    init() {

        let self = this;

        let colours = {

            'agro': green,
            'erfgoed': yellow,
            'mkb': blue,
            'overig': orange
        };


        this.radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));

        let chartObjects = ChartObjects();
        this.config = Object.assign(this.config,chartObjects.config());
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
        this.xScale = chartObjects.xScale();
        this.yScale = chartObjects.yScale();
        this.axes = chartObjects.axes();
        this.functions = chartObjects.functions();

        this.config.padding.top = this.config.smallMultiple? 15 : 30;
        this.config.margin.bottom = (window.innerWidth < 640 || this.config.smallMultiple) ? 70 : 0;

        this.config.padding.left = 40;

        this.config.paddingInner = 0;
        this.config.paddingOuter = 0;

        if (this.config.smallMultiple) {
            this.config.dataArrayLength = 7;
        }

        this.config.paddingInner = [0.2];
        this.config.paddingOuter = [0.2];

        // get dimensions from parent element
        this.chartDimensions = new ChartDimensions(this.elementID, this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        // create svg elements without data
        this.chartSVG = new ChartSVG(this.elementID, this.config, this.dimensions, this.svg);
        this.chartXScale = new ChartXScale(this.config, this.dimensions, this.xScale);
        this.chartYScale = ChartYScale(this.config, this.dimensions, this.yScale);
        this.chartAxis = ChartAxis(this.config, this.svg);
        this.chartCircles = ChartCircles(this.config,this.svg,colours);

        this.chartAxis.drawXAxis();

        let url = 'https://tcmg-hub.publikaan.nl' + this.endpoint

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

    prepareData(json,muni)  {

        let data = [];
        let flattenedData = [];


        json = json.find( j => j['_category'] === muni);


        console.log(json);

        for (let group of this.dataMapping) {
            for (let o of group) {
                
                if (Number.isInteger(json[o.column] )) {

                    o.value = json[o.column];
                    flattenedData.push(json[o.column]);
                }

                data.push(o);
            }
        }

        return { data, flattenedData };


    }

    legend(data) {

        if (window.innerWidth < 640 || this.config.smallMultiple) {

            data.forEach( (d,i) => {

                let text  = (i + 1) + '. ' + d[0]['name'] + ' ';

                this.svg.layers.legend.append("text")
                    .attr("class", "small-label")
                    .attr("dy", i * 16)
                    .text(text)
                    .attr("width",this.dimensions.svgWidth)
                    .style("opacity", 1);
            });
        }
    }

    draw(data,flattenedData) {

        // with data we can init scales
        this.xScale = this.chartXScale.set(data.map( (d) => d[0].value));
        this.yScale = this.chartYScale.set(flattenedData) // = radius !!
        this.chartCircles.draw(data);
    }

    redraw() {

        // on redraw chart gets new dimensions
        this.dimensions = this.chartDimensions.get(dimensions);
        this.chartSVG.redraw(this.dimensions);

        this.xScale = this.chartXScale.reset(this.dimensions,this.xScale);
        this.yScale = this.chartYScale.reset(this.dimensions,this.yScale);

        this.chartCircles.redraw(this.dimensions,this.yScale,this.xScale,this.config.smallMultiple);
    }

    run(json, muni) {

        ({ data, flattenedData } = this.prepareData(json,muni));
        this.draw(data, flattenedData);
        this.redraw();
        this.legend(data);


        window.addEventListener("resize", () => self.redraw(json, muni), false);

        for (let radio of this.radios) {
            radio.addEventListener( 'change', () => self.redraw(data,radio.value),false);
        }
    }

}