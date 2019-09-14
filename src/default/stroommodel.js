var stroommodel = function(element) {

    let options = [].slice.call(document.querySelectorAll('.selector li input[type=checkbox]'));
    let radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));

    let colours = ['green','orange','blue'];
    let url = "https://tcmg.publikaan.nl/api/stuwmeerregeling?week=recent";

    let chartObjects = ChartObjects();
    let config = chartObjects.config();
    let dimensions = chartObjects.dimensions();
    let svg = chartObjects.svg();
    let xScale = chartObjects.xScale();
    let yScale = chartObjects.yScale();
    let axes = chartObjects.axes();
    let functions = chartObjects.functions();

    config.margin.top = 0;
    config.margin.bottom = 0;
    config.margin.left = 0;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 30;
    config.padding.left = 30;
    config.padding.right = 30;

    let chartDimensions = ChartDimensions(element,config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element,config,dimensions,svg);

    let chartSankey = ChartSankey(config,svg,functions);

    d3.json(url, function(error, json) {

        let columns = Object.keys(json[0]);

        columns = columns.filter(col => {
            return ['id', 'DATUM', 'CATEGORY', 'Totaal', '_date', '_category', '_week', '_year'].indexOf(col) < 0;
        });

        let nodes = [];
        let links = [];
        let index = 0;


        // let groups = json.map( p => p['CATEGORY']).filter( r => r != 'all');
        // let nodes = columns.concat(groups);

        // for (let group of json.filter(r => r['CATEGORY'] != 'all')) {
        //
        //     let title = 'Groep ' + group['CATEGORY'];
        //
        //     let desc = '';
        //
        //     if (group['CATEGORY'] == '1') desc = 'Nog geen opname - melding voor 1 januari 2019';
        //     if (group['CATEGORY'] == '2') desc = 'In opname - nog geen rapport - melding voor 1 januari 2019';
        //
        //     nodes.push({
        //         'node': index,
        //         'name': title,
        //         'desc': desc,
        //     });
        //
        //     let mo_index = 0;
        //
        //     for (let column of columns) {
        //         links.push({
        //             'source': index,
        //             'target': json.filter(r => r['CATEGORY'] != 'all').length + mo_index,
        //             'value': group[column]
        //         });
        //         mo_index++;
        //     }
        //
        //
        //     index++;
        // }
        //
        // for (let column of columns) {
        //     let desc = '';
        //     index++;
        //     nodes.push({
        //         'node': index,
        //         'name': column,
        //         'desc': desc,
        //     });
        // }



        nodes.push({
            'node': 0,
            'name': '19MRT_TM_30SEPT_MET_HISTO',
            'desc': 'hoi'
        });

        nodes.push({
            'node': 1,
            'name': 'VANAF_010KT2018_MET_HISTO',
            'desc': 'hoi'
        });

        nodes.push({
            'node': 2,
            'name': 'VOOR_19MRT_MET_HISTORIE',
            'desc': 'hoi'
        });

        nodes.push({
            'node': 3,
            'name': 'VOOR_19MRT_GEEN_HISTORIE',
            'desc': 'hoi'
        });


        nodes.push({
            'node': 11,
            'name': 'schademeldingen',
            'desc': 'doei'
        });

        nodes.push({
            'node': 12,
            'name': 'aos meldingen',
            'desc': 'doei'
        });

        links.push({
            'source': 0,
            'target': 2,
            'value': 2544
        });

        links.push({
            'source': 1,
            'target': 11,
            'value': 8844
        });

        links.push({
            'source': 2,
            'target': 11,
            'value': 8360
        });

        links.push({
            'source': 3,
            'target': 11,
            'value': 4587
        });

        function draw(data) {

        }

        function redraw() {

            console.log(nodes);
            console.log(links);

            // on redraw chart gets new dimensions
            dimensions = chartDimensions.get(dimensions);
            chartSVG.redraw(dimensions);
            // redraw data
            chartSankey.redraw(nodes, links, dimensions);
        }

        // for example on window resize
        window.addEventListener("resize", redraw, false);

        redraw();
    });

}