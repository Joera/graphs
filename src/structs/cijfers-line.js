class CijfersLine  {

    constructor(endpoint,elementID,config,dataMapping,segment) {

        this.endpoint = endpoint;
        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.config = config;
        this.dataMapping = dataMapping;
        this.segment = segment;
        this.property = dataMapping[0].column;
        this.smallMultiple = config.smallMultiple;


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

        this.config.padding.top = 0;
        // this.config.padding.bottom = 15;
        this.config.padding.left = 40;
        this.config.padding.right = 40;
        this.config.paddingInner = 0;
        this.config.paddingOuter = 0;

        // if (this.smallMultiple) {
        //     this.config.dataArrayLength = 7;
        // }

        // get dimensions from parent element
        this.chartDimensions = new ChartDimensions(this.element, this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        // create svg elements without data

        this.chartSVG = new ChartSVG(this.elementID, this.config, this.dimensions, this.svg);

        this.chartXScale = new ChartXScale(this.config, this.dimensions, this.xScale);
        this.chartYScale = ChartYScale(this.config, this.dimensions, this.yScale);
        this.chartAxis = ChartAxis(this.config, this.svg);
        this.chartLine = ChartRaggedLine(this.config, this.svg, this.property);

        this.chartAxis.drawXAxis();
        this.chartAxis.drawYAxis();


        self.run(self.segment);


    }

    prepareData(json)  {


        // en dan bij gemeente switch een nieuwe call doen

        let neededColumns = ['_date','_category'].concat(this.dataMapping.map( (c) => c.column ));

        let data = [];
        let hasEnoughData;

        for (let week of json.slice(0,8)) {

            hasEnoughData = true;

            let clearWeek = {};

            for (let column of neededColumns) {

                if(week[column] !== null) {

                    clearWeek[column] = week[column]

                } else {
                    hasEnoughData = false;
                }
            }

            if(hasEnoughData) {
                data.push(clearWeek);
            }
        }

        return data;
    }


    redraw(data) {

        this.yScale = this.chartYScale.set(data,this.property);

        // on redraw chart gets new dimensions
        this.dimensions = this.chartDimensions.get(this.dimensions);

        this.chartSVG.redraw(this.dimensions);
        // new dimensions mean new scales
        this.xScale = this.chartXScale.reset(this.dimensions,this.xScale);
        this.yScale = this.chartYScale.reset(this.dimensions,this.yScale);
        // // new scales mean new axis
        //
        // this.chartAxis.redrawXTimeAxis(this.dimensions,this.xScale,this.axes,false);
        // this.chartAxis.redrawYAxis(this.yScale,this.axes);
        // // redraw data
        this.chartLine.redraw(this.xScale,this.yScale,this.functions,this.dimensions,data,this.dataMapping[0].colour);
    }

    draw(data) {

        this.xScale = this.chartXScale.set(data.map(d => d[this.config.xParameter]));

        this.chartLine.draw(data);
    }

    average(data) {

        let avg = (data.reduce((a,b) => { return a + parseInt(b[this.property]); },0)) / (data.length);

        return avg;
    }

    html(data)  {

        // let gem = this.average(data);

        let miniContainer = document.createElement('div');

        let div = document.createElement('div');
        div.classList.add('number_circle');
        div.style.backgroundColor =  this.dataMapping[0].colour;

        let number = document.createElement('span');
        number.classList.add('number');

        // number.innerText = data[0][this.property];
        div.appendChild(number);

        let diff = document.createElement('span');
        diff.classList.add('diff');


        // diff.innerHTML = (((data[0][this.property] - gem) / gem) * 100).toFixed(0) + '%' + svgUp;
        //
        // if ((data[0][this.property] - gem) < 0) {
        //     this.element.querySelector('.diff').classList.add('down');
        // } else {
        //     this.element.querySelector('.diff').classList.remove('down');
        // }

        div.appendChild(diff);

        miniContainer.appendChild(div);

        return miniContainer;
    }

    update(data) {

        let gem = this.average(data);

        console.log(gem);

        this.element.querySelector('.number').innerText = Math.round(data[0][this.property]);

        if ((data[0][this.property] - gem) === 0) {

            this.element.querySelector('.diff').innerHTML = "--";

        } else if ((data[0][this.property] - gem) < 0) {

            this.element.querySelector('.diff').innerHTML = Math.round((data[0][this.property] - gem) / gem) + '%' + svgUp;
            this.element.querySelector('.diff').classList.add('down');

        } else if ((data[0][this.property] - gem) > 0) {

            this.element.querySelector('.diff').innerHTML = Math.round((data[0][this.property] - gem) / gem) + '%' + svgUp;
            this.element.querySelector('.diff').classList.remove('down');
        }

    }

    run(newSegment,change) {

        let self = this;

        let url = 'https://tcmg-hub.publikaan.nl' + this.endpoint + '?gemeente=' + newSegment;


        if(globalData.data && !change) {

            let data = self.prepareData(globalData.data);
            self.element.prepend(self.html(data));
            self.update(data);
            self.draw(data);
            self.redraw(data);

        } else if(change) {

            d3.json(url, function(error, json) {
                if (error) {
                    console.log(error);
                    throw error;
                }

                let data = self.prepareData(json);
                self.update(data);
                self.draw(data);
                self.redraw(data);
            });

        } else {

            d3.json(url, function(error, json) {
                if (error) {
                    console.log(error);
                    throw error;
                }

                let data = self.prepareData(json);
                self.element.prepend(self.html(data));
                self.update(data);
                self.draw(data);
                self.redraw(data);
            });

        }
    }
}