var statussen_stroommodel_ii  = function (element,filter) {


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
                'name': 'Beschikt',   // BESCHIKT - AANTAL_BESLUIT_STUWMEER
                'desc': 'description',

            },
            {
                'node': 1,
                'name': 'Ingetrokken',
                'desc': 'description',
            },
            {
                'node': 2,
                'name': 'Afgehandeld samengevat',
                'desc': 'description',
            },
            {
                'node': 3,
                'name': 'Wacht op besluit [VOORBER_CIE]',
                'desc': 'description',
                'class': 'in-procedure'
            },
            {
                'node': 4,
                'name': 'Schaderapport geaccepteerd',  // BESCHIKT + AFGEH_SAMENGEV + INGETROKKEN + VOORBER_CIE
                'desc': 'description',
            },
            {
                'node': 5,
                'name': 'Geheel toegekend',
                'desc': 'description',
            },
            {
                'node': 6,
                'name': 'Geen consistent besluit',
                'desc': 'description',
            },
            {
                'node': 7,
                'name': 'Gedeeltelijk toegekend',
                'desc': 'description',
            },
            {
                'node': 8,
                'name': 'Besluit stuwmeer',
                'desc': 'description',
            },
            {
                'node': 9,
                'name': 'Bijkomkosten huur',
                'desc': 'description',
            },
            {
                'node': 10,
                'name': 'Afgewezen',
                'desc': 'description',
            },
            {
                'node': 11,
                'name': 'Opname plaatsgevonden',  // ( BESCHIKT + AFGEH_SAMENGEV + INGETROKKEN + VOORBER_CIE ) + OPLEV_SCHADERAPPORT
                'desc': 'description',
            },
            {
                'node': 12,
                'name': 'Schaderapport wordt geschreven [OPLEV_SCHADERAPPORT]',
                'desc': 'dec',
                'class': 'in-procedure'
            },
            {
                'node': 13,
                'name': 'Schademelding ontvangen',
                'desc': 'dec'
            },
            {
                'node': 14,
                'name': 'Schadeopname wordt ingepland [PLANNING_OPNAME]',
                'desc': 'dec',
                'class': 'in-procedure'
            },
            {
                'node': 15,
                'name': 'Dossier wordt aangemaakt [ONTVANGST]',
                'desc': 'dec',
                'class': 'in-procedure'
            },
            {
                'node': 16,
                'name': 'Stuwmeerregeling',
                'desc': 'dec',
                'class': ''
            },
            {
                'node': 17,
                'name': 'Geen reactie stuwmeer',
                'desc': 'dec',
                'class': 'in-procedure'
            }
        ];

        let links = [

            {
                'source': 4,
                'target': 0,
                'value': 9197,  // [BESCHIKT] - [BESLUIT STUWMEER]
                'class': ''
            },
            {
                'source': 13,
                'target': 1,
                'value': 797,
                'class': ''
            },
            {
                'source': 13,
                'target': 2,
                'value': 4077,
                'class': ''// samengevoegd
            },
            {
                'source': 4,
                'target': 3,
                'value': 820,
                'class': 'in-procedure'
            },
            {
                'source': 0,
                'target': 5,
                'value': 2300,
                'class': ''
            },
            {
                'source': 0,
                'target': 6,
                'value': 4,
                'class': ''
            },
            {
                'source': 0,
                'target': 7,
                'value': 5880,
                'class': ''
            },
            // {
            //     'source': 0,
            //     'target': 8,
            //     'value': 8567,
            //     'class': ''
            // },
            {
                'source': 0,
                'target': 9,
                'value': 66,
                'class': ''
            },
            {
                'source': 0,
                'target': 10,
                'value': 947,
                'class': ''
            },
            {
                'source': 11,
                'target': 4,
                'value': 10246,  // ( BESCHIKT + AFGEH_SAMENGEV + INGETROKKEN + VOORBER_CIE ) - OPLEV_SCHADERAPPORT - BESLUIT STUWMEER
                'class': ''
            },
            {
                'source': 11,
                'target': 12,
                'value': 4645,  // OPLEV_SCHADERAPPORT
                'class': 'in-procedure'
            },
            {
                'source': 13,
                'target': 11,
                'value': 14891,  // ( BESCHIKT + AFGEH_SAMENGEV + INGETROKKEN + VOORBER_CIE ) - OPLEV_SCHADERAPPORT - BESLUIT STUWMEER
                'class': ''
            },
            {
                'source': 13,
                'target': 14,
                'value': 2214,  // PLANNING OPNAME
                'class': 'in-procedure'
            },
            {
                'source': 13,
                'target': 15,
                'value': 6563,  // ONTVANGST
                'class': 'in-procedure'
            },
            {
                'source': 16,
                'target': 8,
                'value': 8567,  // ONTVANGST
                'class': ''
            },
            {
                'source': 16,
                'target': 17,
                'value': 7312,  // ONTVANGST
                'class': 'in-procedure'
            },
            {
                'source': 13,
                'target': 16,
                'value': 15879,  // ONTVANGST
                'class': ''
            },


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