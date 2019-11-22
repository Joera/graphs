class Gemeentes {


    constructor(element, dataMapping, property, smallMultiple) {

        this.element = element;
        this.dataMapping = dataMapping;
        this.property = property;
        this.smallMultiple = smallMultiple;

        this.dropdown = document.querySelector('.map-selector ul');

        this.chartObjects = ChartObjects();
        this.config = this.chartObjects.config();
        this.dimensions = this.chartObjects.dimensions();
        this.yScale = this.chartObjects.yScale();
        this.svg = this.chartObjects.svg();

        this.config.margin.top = 0;
        this.config.padding.left = 0;
        this.config.padding.bottom = 0;
        this.config.margin.bottom = 0;


    }

    init() {

        this.chartDimensions = ChartDimensions(this.element,this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        this.chartSVG = ChartSVG(this.element,this.config,this.dimensions,this.svg);
        this.chartYScale = ChartYScale(this.config,this.dimensions,this.yScale);

        if (window.innerWidth < 600) {

            Object.keys(this.dimensions).map(function(key, index) {
                this.dimensions[key] *= 1.25;
            });
        }

        this.colours = this.dataMapping.map( (p) => p.colour);

        this.chartSVG.redraw(this.dimensions);

        this.chartMap = ChartMap(this.config,this.svg,this.dimensions,this.smallMultiple);

        let url = 'https://tcmg-hub.publikaan.nl/api/gemeenten';

        if (!globalData.geoData) {

            console.log('noData');
            d3.json(url, function(error, json) {
                globalData.geoData = topojson.feature(json, json.objects.gemeenten).features;
                this.run(globalData.geoData,this.property)
            });

        } else {

            console.log('hasData');
            this.run(globalData.geoData,property)
        }
    }

    prepareData(json,property)  {

        return json;
    }

    draw(features) {


    }

    redraw(features, property) {

        this.yScale = this.chartYScale.set(features,property);
        // on redraw chart gets new dimensions
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG.redraw(this.dimensions);
        // redraw data
        this.chartMap.redraw(this.dimensions,property,this.yScale,this.colours);
    }

    run(geoData,property) {

        let features = this.prepareData(geoData,property);

        this.chartMap.draw(features);
        this.redraw(features, property);

        this.createDropdown();
        this.setListeners(features,property);
    }

    createDropdown() {

        if(this.dropdown) {

            this.dataMapping.forEach((mapping, i) => {

                let li = document.createElement('li');
                let input = document.createElement('input');
                input.type = 'radio';
                input.name = 'property';
                input.id = mapping.column;
                input.value = mapping.column;
                input.checked = (i < 1) ? true : false;
                li.appendChild(input);

                let label = document.createElement('label');
                label.innerText = mapping.label;
                label.htmlFor = mapping.column;

                li.appendChild(label);

                this.dropdown.appendChild(li);
            });

        }
    }

    setListeners(features,property) {

        let self = this;

        let radios = [].slice.call(document.querySelectorAll('.map-selector ul li input[type=radio]'));

        window.addEventListener("resize", self.redraw(features, property), false);

        for (let radio of radios) {
            radio.addEventListener( 'change', () => {
                self.redraw(features,radio.value);
            },false)
        }
    }

    run(geoData,property) {

        let features = this.prepareData(geoData,property);

        this.chartMap.draw(features);
        this.redraw(features, property);
        this.createDropdown();
        this.setListeners(features,property);
    }
}



