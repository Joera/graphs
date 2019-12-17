class Cijfers {


    constructor(endpoint,element,config,dataMapping,segment) {

        this.municipalitySelect = document.querySelector('select.municipalities');

        this.endpoint = endpoint;
        this.element = (typeof element === 'string') ? document.querySelector(element) : element;
        this.config = config;
        this.dataMapping = dataMapping;
        this.smallMultiple = config.smallMultiple;
        this.segment = segment;
        // this.data;
    }

    init() {

        let self = this;

        if (globalData.gemeentes) {

            console.log('1');

            this.run(globalData.gemeentes,this.segment);

        } else {

            console.log('2');

            let url = "https://tcmg-hub.publikaan.nl" + this.endpoint;
            console.log(url);
            d3.json(url, function (error, json) {
                if (error) throw error;

                globalData.gemeentes = json;
                self.run(json, self.segment);
            });
        }

        if (this.municipalitySelect != null) {
            this.municipalitySelect.addEventListener("change", function () {
                self.run(data || globalData.gemeentes,self.municipalitySelect.options[self.municipalitySelect.selectedIndex].value)
            });
        }
    }

    prepareData(json,segment) {

        console.log(segment);

        let segmented = json.find( j => j['_category'] === segment);

        let data = [];

        for (let map of this.dataMapping) {

            data.push({
                status: map.label,
                value: segmented[map.column]
            });
        }

        return data;
    }

    run(data,newSegment) {

        // console.log(data);
        // console.log(newSegment);

        let segmentedData = this.prepareData(data,newSegment);

        this.element.innerHTML = '';
        this.element.appendChild(this.single(segmentedData,Object.values(this.dataMapping)));

    }

    redraw(data,newSegment) {

        this.element.innerHTML = '';
        this.run(data,newSegment)
    }

    single(data,mapping)  {

        let average,label;

        // console.log(data);

        // console.log(data.find( (d) => d['_category'] === category));
        let count = data[0].value;

        let miniContainer = document.createElement('div');

        let div = document.createElement('div');

        let number = document.createElement('span');
        number.classList.add('number');
        number.style.backgroundColor =  mapping[0].colour;

        number.innerText = count;

        if(mapping[1]) {

            let gem = Math.round(data[1].value);

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
}