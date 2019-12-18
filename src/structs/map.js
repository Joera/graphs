class Map {


    constructor(endpoint,elementID,config,dataMapping,segment) {

        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.dataMapping = dataMapping;
        this.property = dataMapping[0].column;
        this.segment = segment;
        this.features;
        this.smallMultiple = config.smallMultiple;

        this.dropdown = document.querySelector('.map-selector ul');

        this.chartObjects = ChartObjects();
        this.config = this.chartObjects.config();
        this.dimensions = this.chartObjects.dimensions();
        this.yScale = this.chartObjects.yScale();
        this.svg = this.chartObjects.svg();

    }

    init() {

        let self = this;

        this.chartDimensions = new ChartDimensions(this.element,this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG = new ChartSVG(this.element,this.config,this.dimensions,this.svg);
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
            d3.json(url, function(error, json) {
                globalData.geoData = topojson.feature(json, json.objects.gemeenten).features;
                self.run(globalData.geoData,self.property)
            });

        } else {
            this.run(globalData.geoData,this.property)
        }
    }

    prepareData(json,property)  {

        return json;
    }

    draw() {


    }

    redraw(newProperty) {

        if (newProperty && newProperty != undefined) { this.property = newProperty };

        this.yScale = this.chartYScale.set(this.features,this.property);
        // on redraw chart gets new dimensions
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG.redraw(this.dimensions);
        // redraw data
        this.chartMap.redraw(this.dimensions,this.property,this.yScale,this.colours);
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

    setListeners(property) {

        let self = this;

        let radios = [].slice.call(document.querySelectorAll('.map-selector ul li input[type=radio]'));

        window.addEventListener("resize", self.redraw(property), false);

        for (let radio of radios) {
            radio.addEventListener( 'change', () => {
                self.redraw(radio.value);
            },false)
        }
    }

    run(geoData,property) {

        this.features = this.prepareData(geoData,property);

        this.chartMap.draw(this.features);
        this.redraw(property);
        this.createDropdown();
        this.setListeners(property);
    }
}



