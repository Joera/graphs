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

        let average;

        // console.log(data.find( (d) => d['_category'] === category));
        let count = data.find( (d) => d['_category'] === category)[this.property];

        let div = document.createElement('div');

        let number = document.createElement('span');
        number.classList.add('number');
        number.style.backgroundColor =  this.dataMapping[0].colour;

        number.innerText = count;

        if(this.dataMapping[1]) {

            let gem = Math.round(data.find((d) => d['_category'] === category)[this.dataMapping[1].column]);

            average = document.createElement('span');
            average.classList.add('average');
            average.innerText = 'gem: ' + gem;


            let diff = document.createElement('span');
            diff.classList.add('diff');
            diff.innerText = Math.round((count - gem) / gem) + '%';

            number.appendChild(diff);
        }

        div.appendChild(number);
        this.element.appendChild(div);

        if(this.dataMapping[1]) {
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