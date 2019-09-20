var statussen_stroommodel  = function (element,filter) {


    let municipalitySelect = document.querySelector('select.municipalities');

    let url;
    let data = {};
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
    config.margin.left = 30;
    config.margin.right = 0;
    config.padding.top = 30;
    config.padding.bottom = 50;
    config.padding.left = 30;
    config.padding.right = 0;
    // name of first column with values of bands on x axis

    // y-axis
    config.yParameter = 'totaal';
    // config.minValue = 0;
    // config.maxValue = 10000;
    // config.fixedHeight = 200;

    // x-axis
    // config.minWidth = 460;
    config.xParameter = 'status';
    config.paddingInner = [0.5];
    config.paddingOuter = [0.25];

    let colours = ['orange','green','darkblue','blue','orange','green'];

    let connections = [

        ['ONTVANGST','PLANNING_OPNAME','PLANNING_OPNAME']
    ]

    // get dimensions from parent element
    let chartDimensions = ChartDimensions(element, config);
    dimensions = chartDimensions.get(dimensions);

    // create svg elements without data
    let chartSVG = ChartSVG(element, config, dimensions, svg);
    let chartSankey = ChartSankey(config,svg,functions);

    function prepareData(json) {



        // let data = [];
        //
        // data.push({
        //     status: "Schademelding ontvangen",
        //     totaal: json[0]['ONTVANGST']
        //
        // });
        //
        // data.push({
        //     status: "Schadeopname wordt ingepland",
        //     totaal: json[0]['PLANNING_OPNAME']
        //
        // });
        //
        // data.push({
        //     status: "Schadeopname is ingepland",
        //     totaal: json[0]['PLANNING_OPNAME']
        //
        // });
        //
        // data.push({
        //     status: "Schaderapport wordt geschreven",
        //     totaal: json[0]['OPLEV_SCHADERAPPORT']
        //
        // });
        //
        //
        // data.push({
        //     status: "Besluit wordt voorbereid",
        //     totaal: json[0]['VOORBER_CIE']
        //
        // });
        //
        // data.push({
        //     status: "Besluit genomen",
        //     totaal: json[0]['BESCHIKT']
        //
        // });


        return data;
    }

    function draw(nodes,links) {

        chartSankey.draw(nodes, links, dimensions);

    }

    function redraw(nodes,links) {

        chartSankey.set(nodes,links,dimensions);
        dimensions = chartDimensions.get(dimensions);
        chartSVG.redraw(dimensions);
        chartSankey.redraw(dimensions);
    }

    function fetchApi(municipality) {

        let nodes = [

            {
                'node': 0,
                'name': 'ontvangen meldingen',
                'desc': 'description',
            },
            {
                'node': 1,
                'name': 'opname wordt ingepland',
                'desc': 'description',
            }
        ];

        let links = [

            {
                'source': 0,
                'target': 1,
                'value': 500,
                'class': 'chipz'
            }

        ];

        // if(municipality) {
        //     url = "https://tcmg.publikaan.nl/api/flowchart?week=recent&gemeente=" + municipality;
        // } else {
        //     url = "https://tcmg.publikaan.nl/api/flowchart?week=recent";
        // }
        // // point of data injection when using an api
        //
        // d3.json(url, {
        //     method:"POST",
        //     body: JSON.stringify({ 'connections' : connections }),
        //     headers: { "Content-type": "application/json; charset=UTF-8"}
        // }).then( ({nodes,links}) => {

            draw(nodes,links);
            redraw(nodes,links);
        // });
    }

    window.addEventListener("resize", redraw, false);

    if(municipalitySelect != null) {
        municipalitySelect.addEventListener("change", function () {
            fetchApi(municipalitySelect.options[municipalitySelect.selectedIndex].value);
        });
    }

    fetchApi(false);

}