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
        let count = data.find( (d) => d['_category'] === category)[this.property];

        let div = document.createElement('div');

        let number = document.createElement('span');
        number.classList.add('number');
        number.style.backgroundColor =  this.dataMapping[0].colour;

        number.innerText = count;

        div.appendChild(number);




        if(this.dataMapping[1]) {

            let gem = Math.round(data.find((d) => d['_category'] === category)[this.dataMapping[1].column]);

            let average = document.createElement('span');
            average.classList.add('average');
            average.innerText = 'gem: ' + gem;
            this.element.appendChild(average);

            let diff = document.createElement('span');
            diff.classList.add('diff');
            diff.innerText = (count - gem);

            div.appendChild(diff);
        }


        this.element.appendChild(div);

    }




     //   window.addEventListener("resize", redraw, false);

        // if(municipalitySelect != null) {
        //     municipalitySelect.addEventListener("change", function () {
        //         run(json,municipalitySelect.options[municipalitySelect.selectedIndex].value);
        //     });
        // }



}