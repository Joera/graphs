class Cijfers {


    constructor(element,dataMapping,property,segment,smallMultiple) {

        this.element = element;
        this.dataMapping = dataMapping;
        this.property = property;
        this.smallMultiple = smallMultiple;
        this.segment = segment;
        this.data;
    }

    init() {

        let self = this;

        if (globalData.gemeentes) {

            this.run(globalData.gemeentes,this.segment);

        } else {

            let url = "https://tcmg-hub.publikaan.nl/api/gemeentes";

            d3.json(url, function (error, json) {
                if (error) throw error;
                self.run(json, self.segment);
            });
        }
    }

    run(data,newSegment) {

        if(newSegment && newSegment != undefined) { this.segment = newSegment }

        this.data = data;

        if (typeof this.dataMapping === 'object')  {
            // multiple balletjes

            for (let item of Object.entries(this.dataMapping)) {

                this.single();
            }

        } else {
            // single balletje
                this.single();
        }


    }

    single()  {

        console.log(this.dataMapping);

        let average,label;

        // console.log(data.find( (d) => d['_category'] === category));
        let count = this.data.find( (d) => d['_category'] === this.segment)[this.property];

        let miniContainer = document.createElement('div');

        let div = document.createElement('div');

        let number = document.createElement('span');
        number.classList.add('number');
        number.style.backgroundColor =  this.dataMapping[0].colour;

        number.innerText = count;

        if(this.dataMapping[1]) {

            let gem = Math.round(data.find((d) => d['_category'] === this.segment)[this.dataMapping[1].column]);

            label = document.createElement('span');
            label.classList.add('label');
            label.innerText = 'gemiddelde laatste 8 weken';

            average = document.createElement('span');
            average.classList.add('average');
            average.innerText = gem;


            let diff = document.createElement('span');
            diff.classList.add('diff');
            diff.innerText = (((count - gem) / gem) * 100).toFixed(0) + '%';

            number.appendChild(diff);
        }

        div.appendChild(number);
        miniContainer.appendChild(div);

        if(this.dataMapping[1]) {
            miniContainer.appendChild(label);
            miniContainer.appendChild(average);
        }

        this.element.appendChild(miniContainer);
    }




     //   window.addEventListener("resize", redraw, false);

        // if(municipalitySelect != null) {
        //     municipalitySelect.addEventListener("change", function () {
        //         run(json,municipalitySelect.options[municipalitySelect.selectedIndex].value);
        //     });
        // }



}