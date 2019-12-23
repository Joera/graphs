class PieChartSum  {


    constructor(endpoint,elementID,config,dataMapping,segment) {

        this.endpoint = endpoint;
        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.config = config;
        this.dataMapping = dataMapping;
        this.segment = segment;
        this.smallMultiple = config.smallMultiple;

    }

    init() {

        let self = this;

        this.municipalitySelect = document.querySelector('select.municipalities');

        let chartObjects = ChartObjects();
        this.config = Object.assign(this.config,chartObjects.config());
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
        this.functions = chartObjects.functions();


        this.config.margin.bottom = (window.innerWidth > 640) ? 20 : 100;
        // this.config.margin.left = 0;
        // this.config.padding.top = 0;

        // if(this.smallMultiple) {
        //     this.config.padding.left = 100;
        // }

        this.config.colours = d3.scaleOrdinal()
            .range([green,darkblue,blue,orange,grey]);

        this.chartDimensions = new ChartDimensions(this.element,this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        // create svg elements without data
        this.chartSVG = new ChartSVG(this.element,this.config,this.dimensions,this.svg);

        this.chartPie = ChartPie(this.config,this.svg,this.functions);


        let url = 'https://tcmg-hub.publikaan.nl' + this.endpoint;

        if (globalData.gemeentes) {

            this.run(globalData.gemeentes,this.segment)

        } else {

            d3.json(url, function(error, json) {
                if (error) throw error;

                globalData.gemeentes = json;
                self.run(json,self.segment);
            });
        }

    }

    prepareData(json,segment) {
        
        let segmented = json.find( j => j['_category'] === segment);

        let data = [];

        // when total column = false --> add sum of previous columns
        let sum = 0; let value = 0;

        this.dataMapping.forEach( (array,i) => {

            let dataArray = [];

            for (let mapping of array) {

                sum = (segmented[mapping.column] !== undefined) ? sum + segmented[mapping.column] : sum;

                if (Array.isArray(mapping.column)) {

                    for (let prop of mapping.column) {

                        value += segmented[prop];
                        sum += segmented[prop];
                    }

                } else if(!isNaN(segmented[mapping.column])) {

                    value = segmented[mapping.column]

                } else {

                    value = sum;
                }

                dataArray.push({
                    label: mapping.label,
                    value: value,
                    colour: mapping.colour,
                    accented: (i > 1) ? true : false
                });
            }

            data.push(dataArray);
        });

        return data;
    }

     drawLegend(data,segment) {

         let legendX = 360;
         let legendY = 110;
         let legendWidth = 200;

         if(this.smallMultiple) {

             legendX = 240;
             legendY = 30;
             legendWidth = 200;
             this.config.padding.left = 40;
         }

         if (window.innerWidth < 660) {

             legendX = 260;
             legendY = 180;
         }

         if (window.innerWidth < 480) {

             legendX = 130;
             legendY = 110;

         }

        let legendContainer = document.createElement('div');
        legendContainer.classList.add('legend');

        this.element.parentNode.appendChild(legendContainer);

        let chartObjects = ChartObjects();
        let newSVGObject= chartObjects.svg();

         let legendDimensions = {

             width : 360,
             height : 360,
             svgWidth : 360,
             svgHeight : 360
         }

        this.legend = new ChartSVG(legendContainer,this.config,legendDimensions,newSVGObject);

        this.legend.svg.layers.legend.selectAll('*')
            .remove();
        //
        data[0].forEach( (d,i) => {

            this.legend.svg.layers.legend.append("rect")
                .attr("y", (i * 20) - 8)
                .attr("height",12)
                .attr("width",12)
                .attr("fill", d.colour)
                .style("opacity", 1);

            this.legend.svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dy", (i * 20) + 2)
                .attr("dx",16)
                .text(d['label'] + ':')
                .attr("width", this.dimensions.svgWidth)
                .style("opacity", 1);

            this.legend.svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dx", legendWidth)
                .attr("dy", (i * 20) + 2)
                .text( (this.config.currencyLabels) ? convertToCurrency(d['value']) : d['value'])
                .attr("width", this.dimensions.svgWidth)
                .style("opacity", 1)
                .style("text-anchor", "end");

        });
        //
        // // som van totaal
         if(data[1]) {

             this.legend.svg.layers.legend.append("rect")
                 .attr("class", "small-label")
                 .attr("y", ((data[0].length - 1) * 20) + 8)
                 .attr("height", .5)
                 .attr("width", legendWidth)
                 .style("opacity", 1)
                 .style("fill", "black");

             this.legend.svg.layers.legend.append("text")
                 .attr("class", "small-label")
                 .attr("dy", (data[0].length * 20) + 2)
                 .text('Totaal:')
                 .attr("width", this.dimensions.svgWidth)
                 .style("opacity", 1);

             this.legend.svg.layers.legend.append("text")
                 .attr("class", "small-label")
                 .attr("dx", legendWidth)
                 .attr("dy", ((data[0].length) * 20) + 2)
                 .text( (this.config.currencyLabels) ? convertToCurrency(data[1][0]['value']) : data[1][0]['value'])
                 .attr("width", this.dimensions.svgWidth)
                 .style("opacity", 1)
                 .style("text-anchor", "end");

         }
        //
         if(data[2]) {

             this.legend.svg.layers.legend.append("rect")
                 .attr("y", ((data[0].length + 1.5) * 20) - 8)
                 .attr("height",12)
                 .attr("width",12)
                 .attr("fill", orange)
                 .style("opacity", 1);

             this.legend.svg.layers.legend.append("text")
                 .attr("class", "small-label")
                 .attr("dy", ((data[0].length + 1.5) * 20) + 2)
                 .attr("dx", 16)
                 .text(data[2][0].label)
                 .attr("width",this.dimensions.svgWidth)
                 .style("opacity", 1);

             this.legend.svg.layers.legend.append("text")
                 .attr("class", "small-label")
                 .attr("dx", 200)
                 .attr("dy", ((data[0].length + 1.5) * 20) + 2)
                 .text( (this.config.currencyLabels) ? convertToCurrency(data[2][0]['value']) : data[2][0]['value'])
                 .attr("width",this.dimensions.svgWidth)
                 .style("opacity", 1)
                 .style("text-anchor", "end");
         }
    }

    redrawLegend() {



       this.legend.redraw(this.dimensions);

        // this.legendSVG.layers.legend
        //     .attr('transform', 'translate(' + legendX + ',' + legendY + ')');
    }

    draw(data) {

        if(data[2] && data[2][0]) {

            let clonedData = JSON.parse(JSON.stringify(data));
            clonedData[0].unshift(clonedData[2][0]);
            this.chartPie.draw(clonedData[0]);

        } else {

            this.chartPie.draw(data[0])
        }
    }

     redraw() {

         this.dimensions = this.chartDimensions.get(this.dimensions);
         this.chartSVG.redraw(this.dimensions);
         this.chartPie.redraw(this.dimensions,this.smallMultiple);
         this.redrawLegend(this.dimensions,this.smallMultiple);
    }

    run(json,segment) {

        let self = this;

        let data = this.prepareData(json,segment);
        this.draw(data);
        this.drawLegend(data,segment);
        this.redraw();


        window.addEventListener("resize", function() { self.redraw() }, false);

        if(this.municipalitySelect != null) {
            this.municipalitySelect.addEventListener("change", function () {
                self.run(json,self.municipalitySelect.options[self.municipalitySelect.selectedIndex].value);
            });
        }

    }
}