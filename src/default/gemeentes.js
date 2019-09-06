var gemeentes = function(element) {

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();

    config.margin.top = 0;
    config.padding.left = 0;
    config.padding.bottom = 0;
    config.margin.bottom = 0;

    config.fixedHeight = 360;

    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    let projection = d3.geoMercator()
        .scale(1)
        .translate([0, 0]);

    let path = d3.geoPath()
        .projection(projection);

    let chartSVG = ChartSVG(element,config,dimensions,svg);

    dimensions = chartDimensions.get(dimensions);
    chartSVG.redraw(dimensions);

    let property = 'melding';

    d3.json("/assets/geojson/topojson.json", function (error, mapData) {

        let features = topojson.feature(mapData, mapData.objects.gemeenten).features;
        var l = features[3],
            b = [
                [0.114, -1.101],
                [0.12022108488117365, -1.105]
            ],
            s = .15 / Math.max((b[1][0] - b[0][0]) / dimensions.containerWidth, (b[1][1] - b[0][1]) / dimensions.height),
            t = [((dimensions.containerWidth - s * (b[1][0] + b[0][0])) / 2) + 60 , ((dimensions.height - s * (b[1][1] + b[0][1])) / 2) - 0];

        projection
            .scale(s)
            .translate(t)
        ;

        let url = 'https://tcmg.publikaan.nl/api/gemeentes';

        d3.json(url, function(error, json) {
            if (error) throw error;

            features.forEach( (feature) => {

                let gemeenteData = json.find( (g) => {
                    return sluggify(g._category) == sluggify(feature.properties.gemeentenaam);
                });

                for (let key in gemeenteData) {
                    gemeenteData[sluggify(key)] = gemeenteData[key];
                }

                feature.properties = Object.assign({}, feature.properties, gemeenteData);
            });


            console.log(features);

            svg.layers.data.selectAll("path")
                .data(features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("stroke", function (d, i) {

                    if (d.properties[property]) {
                        return '#fff';
                    } else {
                        return '#ccc';
                    }
                })
                .attr("fill", function (d, i) {

                    if (d.properties[property]) {
                        return 'orange';
                    } else {
                        return '#eee';
                    }
                })
                .attr("fill-opacity", function (d, i) {

                    // to do : use d3.max to find max value
                    // if(d.properties.melding) {
                    //     return .6;
                    // } else {
                    //     return .6;
                    // }
                    let ratio = .8 * d.properties[property] / 1500;
                    return ratio + 0.2;
                })
                .attr("class", function (d, i) {
                    return sluggify(d.properties.gemeentenaam);
                })
                .on("mouseover", function (d) {

                    if(d.properties.totaal) {

                        d3.select(this).attr("fill-opacity", 1);
                    }

                    let html = "<span class='uppercase'>" + d.properties.gemeentenaam + "</span>";

                    svg.tooltip
                        .html(html)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 5) + "px")
                        .transition()
                        .duration(250)
                        .style("opacity", 1);
                })
                .on("mouseout", function (d) {

                    if (d.properties.totaal) {

                        d3.select(this).attr("fill-opacity", .4);
                    }

                    svg.tooltip.transition()
                        .duration(250)
                        .style("opacity", 0);
                })
                .on("click", function (d) {

                    setMunicipalitySelect(sluggify(d.properties.gemeentenaam));
                });
        });
    });
}