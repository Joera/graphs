var cijfers = function(element,dataMapping,property,smallMultiple) {


    function run(data,category) {

        console.log(data);

        let div = document.createElement('div');

        let number = document.createElement('span');
        number.classList.add('number');

        number.innerText = '42';

        div.appendChild(number);

        element.appendChild(div);
    }


    let url = "https://tcmg-hub.publikaan.nl/api/gemeentes";

    d3.json(url, function (error, json) {
        if (error) throw error;
        run(json,'all');

        window.addEventListener("resize", redraw, false);

        // if(municipalitySelect != null) {
        //     municipalitySelect.addEventListener("change", function () {
        //         run(json,municipalitySelect.options[municipalitySelect.selectedIndex].value);
        //     });
        // }
    });

}