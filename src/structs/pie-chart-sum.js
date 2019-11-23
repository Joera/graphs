class PieChartSum  {


    constructor(elementID,dataMapping,property,segment,smallMultiple) {

        this.elementID = elementID;
        this.element = d3.select(elementID).node();
        this.dataMapping = dataMapping;
        this.property = (!this.property || this.property === undefined) ? this.dataMapping[0].column : property;
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

            this.run(globalData.gemeentes,this.property)

        } else {

            d3.json(url, function(error, json) {
                if (error) throw error;
                globalData.gemeentes = json;
                self.run(json,self.property);
            });
        }

    }

    prepareData(json,segment) {

        console.log(segment);

        let d = json.find( j => j['_category'] === segment);



        let data = [];

        // data.push({
        //     status: "Mijnbouwschade",
        //     value: json['BEDRAG_SCHADEBEDRAG']
        //
        // });
        //
        // data.push({
        //     status: "Stuwmeerregeling",
        //     value: json['BEDRAG_SMR']
        //
        // });
        //
        // // data.push({
        // //     status: "Vergoeding overige schades",
        // //     totaal: json['BEDRAG_GEVOLGSCHADE']
        // //
        // // });
        //
        // data.push({
        //     status: "Bijkomende kosten",
        //     value: json['BEDRAG_BIJKOMENDE_KOSTEN']
        //
        // });
        //
        // data.push({
        //     status: "Wettelijke rente",
        //     value: json['BEDRAG_WETTELIJKE_RENTE']
        //
        // });

        return data;
    }

     legend(data,filter) {

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

            this.svg.layers.legend.append("rect")
                .attr("y", (i * 20) - 8)
                .attr("height",12)
                .attr("width",12)
                .attr("fill", config.colours(i))
                .style("opacity", 1);

            this.svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dy", (i * 20) + 2)
                .attr("dx",16)
                .text(d['status'] + ':')
                .attr("width", dimensions.containerWidth)
                .style("opacity", 1);

            this.svg.layers.legend.append("text")
                .attr("class", "small-label")
                .attr("dx", legendWidth)
                .attr("dy", (i * 20) + 2)
                .text(convertToCurrency(d['value']))
                .attr("width", dimensions.containerWidth)
                .style("opacity", 1)
                .style("text-anchor", "end");

        });

         this.svg.layers.legend.append("rect")
            .attr("class", "small-label")
            .attr("y", ((data.length - 1) * 20) + 8)
            .attr("height",.5)
            .attr("width",legendWidth)
            .style("opacity", 1)
            .style("fill","black");

         this.svg.layers.legend.append("text")
            .attr("class", "small-label")
            .attr("dy", (data.length * 20) + 2)
            .text('Totaal:')
            .attr("width",this.dimensions.containerWidth)
            .style("opacity", 1);

         this.svg.layers.legend.append("text")
            .attr("class", "small-label")
            .attr("dx", legendWidth)
            .attr("dy", (data.length * 20) + 2)
            .text(convertToCurrency(json.filter( j => j['_category'] === filter)[0]['TOTAAL_VERLEEND']))
            .attr("width",this.dimensions.containerWidth)
            .style("opacity", 1)
            .style("text-anchor", "end");

            // }
    }

    draw(data) {
        this.chartPie.draw(data);
    }

     redraw() {

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

        window.addEventListener("resize", self.redraw, false);

        if(this.municipalitySelect != null) {
            this.municipalitySelect.addEventListener("change", function () {
                self.run(json,municipalitySelect.options[municipalitySelect.selectedIndex].value);
            });
        }

    }
}