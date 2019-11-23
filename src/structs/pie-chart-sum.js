class PieChartSum  {


    constructor(elementID,dataMapping,property,segment,smallMultiple) {

        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.dataMapping = dataMapping;
        this.property = (!this.property || this.property === undefined) ? this.dataMapping[0].column : property;
        this.segment = segment;
        this.smallMultiple = smallMultiple;
    }

    init() {

        let self = this;

        this.municipalitySelect = document.querySelector('select.municipalities');

        let chartObjects = ChartObjects();
        this.config = chartObjects.config();
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
        this.functions = chartObjects.functions();

        this.config.margin.top = 0;
        this.config.margin.bottom = (window.innerWidth > 640) ? 0 : 75;
        this.config.margin.left = 200;
        this.config.margin.right = 0;
        this.config.padding.top = 30;
        this.config.padding.bottom = 50;
        this.config.padding.left = 30;
        this.config.padding.right = 0;

        this.config.currencyLabels = true;
        this.config.maxHeight = 300;

        this.config.colours = d3.scaleOrdinal()
            .range([green,darkblue,blue,orange,grey]);

        this.chartDimensions = new ChartDimensions(this.element,this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        // create svg elements without data
        this.chartSVG = new ChartSVG(this.element,this.config,this.dimensions,this.svg);

        this.chartPie = ChartPie(this.config,this.svg,this.functions);


        let url = 'https://tcmg-hub.publikaan.nl/api/gemeentes';

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

        console.log(segmented);

        let data = [];

       for (let map of this.dataMapping) {

           data.push({
               status: map.label,
               value: segmented[map.column]

           });
       }

        return data;
    }

     legend(data,segment) {

        let legendX = 360;
        let legendY = 180;
        let legendWidth = 200;

        if(this.smallMultiple) {

            legendX = 110;
            legendY = 30;
        }

        if (window.innerWidth < 660) {

            legendX = 260;
            legendY = 180;
        }

        if (window.innerWidth < 480) {

            legendX = 120;
            legendY = 110;
        }

        this.svg.layers.legend
            .attr('transform', 'translate(' + legendX + ',' + legendY + ')');

         this.svg.layers.legend.selectAll('*')
            .remove();

        data.forEach( (d,i) => {

            if (i === data.length - 1) return;

            this.svg.layers.legend.append("rect")
                .attr("y", (i * 20) - 8)
                .attr("height",12)
                .attr("width",12)
                .attr("fill", this.config.colours(i))
                .style("opacity", 1);

            this.svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dy", (i * 20) + 2)
                .attr("dx",16)
                .text(d['status'] + ':')
                .attr("width", this.dimensions.containerWidth)
                .style("opacity", 1);

            this.svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dx", legendWidth)
                .attr("dy", (i * 20) + 2)
                .text(convertToCurrency(d['value']))
                .attr("width", this.dimensions.containerWidth)
                .style("opacity", 1)
                .style("text-anchor", "end");

        });

         this.svg.layers.legend.append("rect")
            .attr("class", "small-label")
            .attr("y", ((data.length - 2) * 20) + 8)
            .attr("height",.5)
            .attr("width",legendWidth)
            .style("opacity", 1)
            .style("fill","black");

         this.svg.layers.legend.append("text")
            .attr("class", "small-label")
            .attr("dy", ((data.length - 1) * 20) + 2)
            .text('Totaal:')
            .attr("width",this.dimensions.containerWidth)
            .style("opacity", 1);

         this.svg.layers.legend.append("text")
            .attr("class", "small-label")
            .attr("dx", legendWidth)
            .attr("dy", ((data.length - 1) * 20) + 2)
            .text(convertToCurrency(data[data.length - 1]['value']))
            .attr("width",this.dimensions.containerWidth)
            .style("opacity", 1)
            .style("text-anchor", "end");

            // }
    }

    draw(data) {
        this.chartPie.draw(data.slice(0,data.length -1));
    }

     redraw() {

        console.log(this);

         this.dimensions = this.chartDimensions.get(this.dimensions);
         this.chartSVG.redraw(this.dimensions);
         this.chartPie.redraw(this.dimensions,this.smallMultiple);
    }

    run(json,segment) {

        let self = this;

        let data = this.prepareData(json,segment);
        this.draw(data);
        this.redraw();
        this.legend(data,segment);

        window.addEventListener("resize", function() { self.redraw() }, false);

        if(this.municipalitySelect != null) {
            this.municipalitySelect.addEventListener("change", function () {
                self.run(json,self.municipalitySelect.options[self.municipalitySelect.selectedIndex].value);
            });
        }

    }
}