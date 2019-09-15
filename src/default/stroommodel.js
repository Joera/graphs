var stroommodel = function(element) {

    let options = [].slice.call(document.querySelectorAll('.selector li input[type=checkbox]'));
    let radios = [].slice.call(document.querySelectorAll('.selector li input[type=radio]'));

    let colours = ['green','orange','blue'];
    let url = "https://tcmg.publikaan.nl/api/flowchart?week=recent";

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

    let connections = [

        ["VOOR_19MRT", "VOOR_19MRT_MET_HISTORIE", "HISTORIE",""],
        ["VOOR_19MRT", "VOOR_19MRT_GEEN_HISTORIE", "MELDING",""],
        ["VOOR_19MRT", "AOS_VR_19MRT_MET_HISTORIE", "aos_totaal",""],

        ["19MRT_30SEPT", "19MRT_TM_30SEPT_GEEN_HIST", "MELDING",""],
        ["19MRT_30SEPT", "19MRT_TM_30SEPT_MET_HISTO", "HISTORIE",""],
        ["19MRT_30SEPT", "AOS_REGULIER_19MRT_30SEPT", "aos_totaal",""],

        ["VANAF_O1OKT2018","VANAF_O1OKT2018_GEEN_HIST", "MELDING",""],
        ["VANAF_O1OKT2018","VANAF_010KT2018_MET_HISTO","HISTORIE",""],
        ["VANAF_O1OKT2018","AOS_REGULIER_VANAF_1OKT20","aos_totaal",""],

        //  ["GEEN_HISTORIE", "GEEN_HISTORIE", "MELDING"],
        ["HISTORIE", "HISTORIE", "MELDING",""],
        ["MELDING", "OPNAMES", "OPNAMES",""],
        ["MELDING", "AANTAL_BESLUIT_STUWMEER", "STUWMEERREGELING","completed"],
        ["MELDING", "GEEN_REACTIE_STUWMEER", "STUWMEERREGELING","uncompleted"],
        ["MELDING","WACHT_OP_OPNAME","IN_PROCEDURE","in-procedure"],
        ["STUWMEERREGELING", "GEEN_REACTIE_STUWMEER", "IN_PROCEDURE","in-procedure"],
        ["STUWMEERREGELING", "AANTAL_BESLUIT_STUWMEER", "AANTAL_BESLUIT_STUWMEER",""],

        ["aos_totaal","","",""],
        ["OPNAMES","RAPPORTAGES","RAPPORTAGES",""],
        ["OPNAMES","WACHT_OP_RAPPORT","IN_PROCEDURE","in-procedure"],
        ["RAPPORTAGES","BESLUITEN","BESLUITEN",""],
        ["RAPPORTAGES","WACHT_OP_BESLUIT","IN_PROCEDURE","in-procedure"],
        ["BESLUITEN","AANTAL_AFGEWEZEN","AANTAL_AFGEWEZEN",""],
        ["BESLUITEN","AANTAL_GEDEELTELIK_TOEGEK","AANTAL_GEDEELTELIK_TOEGEK",""],
        ["BESLUITEN","AANTAL_GEENCONSISTENT_BES","AANTAL_GEENCONSISTENT_BES",""],
        ["BESLUITEN","AANTAL_GEHEEL_TOEGEKEND","AANTAL_GEHEEL_TOEGEKEND",""],
        ["AANTAL_AFGEWEZEN","","",""],
        ["AANTAL_GEDEELTELIK_TOEGEK","","",""],
        ["AANTAL_GEENCONSISTENT_BES","","",""],
        ["AANTAL_GEHEEL_TOEGEKEND","","",""],
        ["AANTAL_BESLUIT_STUWMEER","","",""],
        ["IN_PROCEDURE","","",""]
    ];

    d3.json(url, {
        method:"POST",
        body: JSON.stringify({ 'connections' : connections }),
        headers: { "Content-type": "application/json; charset=UTF-8"}
    }).then( ({nodes,links}) => {

        function draw() {}

        function redraw() {

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