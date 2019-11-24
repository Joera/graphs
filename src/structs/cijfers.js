class Cijfers {


    constructor(element,dataMapping,property,segment,smallMultiple) {



        this.element = (typeof element === 'string') ? document.querySelector(element) : element;
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
            console.log('2');

        } else {

            let url = "https://tcmg-hub.publikaan.nl/api/gemeentes";

            d3.json(url, function (error, json) {
                console.log('1');
                if (error) throw error;
                globalData.gemeentes = json;
                self.run(json, self.segment);
            });
        }
    }

    run(data,newSegment) {



        let self = this;

        if(newSegment && newSegment != undefined) { this.segment = newSegment }

        if(data && data != undefined) { this.data = data; }

        this.element.appendChild(self.single(self.dataMapping));

    }

    redraw(data,newSegment) {

        this.element.innerHTML = '';
        this.run(data,newSegment)
    }

    single(mapping)  {

        let average,label;

        // console.log(data.find( (d) => d['_category'] === category));
        let count = this.data.find( (d) => d['_category'] === this.segment)[mapping[0].column];

        let miniContainer = document.createElement('div');

        let div = document.createElement('div');

        let number = document.createElement('span');
        number.classList.add('number');
        number.style.backgroundColor =  mapping[0].colour;

        number.innerText = count;

        if(mapping[1]) {

            let gem = Math.round(this.data.find((d) => d['_category'] === this.segment)[mapping[1].column]);

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

        if(mapping[1]) {
            miniContainer.appendChild(label);
            miniContainer.appendChild(average);
        }


        return miniContainer;


    }




     //   window.addEventListener("resize", redraw, false);

        // if(municipalitySelect != null) {
        //     municipalitySelect.addEventListener("change", function () {
        //         run(json,municipalitySelect.options[municipalitySelect.selectedIndex].value);
        //     });
        // }



}