class Cijfers {


    constructor(element,dataMapping,property,smallMultiple) {

        this.element = element;
        this.dataMapping = dataMapping;
        this.property = property;
        this.smallMultiple = smallMultiple;


    }

    init() {

        let self = this;


        if (globalData.gemeentes) {

            self.run(globalData.gemeentes, 'all');

        } else {

            let url = "https://tcmg-hub.publikaan.nl/api/gemeentes";

            d3.json(url, function (error, json) {
                if (error) throw error;
                self.run(json, 'all');
            });
        }
    }

    run(data,category) {

        // console.log(data.find( (d) => d['_category'] === category));

        console.log(this.dataMapping);

        let div = document.createElement('div');

        let number = document.createElement('span');
        number.classList.add('number');
        number.style.backgroundColor =  this.dataMapping[0].colour;

        number.innerText = data.find( (d) => d['_category'] === category)[this.property];

        div.appendChild(number);

        this.element.appendChild(div);


        if(this.dataMapping[1]) {
            let average = document.createElement('span');
            average.classList.add('average');
            average.innerText = 'gem: ' + Math.round(data.find((d) => d['_category'] === category)[this.dataMapping[1].column]);
            this.element.appendChild(average);
        }




    }




     //   window.addEventListener("resize", redraw, false);

        // if(municipalitySelect != null) {
        //     municipalitySelect.addEventListener("change", function () {
        //         run(json,municipalitySelect.options[municipalitySelect.selectedIndex].value);
        //     });
        // }



}