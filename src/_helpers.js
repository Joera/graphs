var trimColumns =  function(json,neededColumns) {

    // csv.columns = csv.columns.filter( (c) => {
    //     return neededColumns.indexOf(c) > -1;
    // });

    json.forEach( (week,i) => {
        Object.keys(week).forEach( (key) => {
            if (neededColumns.indexOf(key) < 0) {
                delete week[key];
            }
        });
    });
    return json;
};


var trimColumnsAndOrder =  function(json,neededColumns) {

    let newArray = [];
    let newObject;

    json.forEach( (obj,i) => {

        newObject = {};
        neededColumns.forEach( (nc) => {
            newObject[nc] = obj.find( prop => prop === nc);
        });

        newArray.push(newObject)

    }

    return newArray;
}

var hasValue = function(array,value) {

    return array.filter( (i) =>{

        return i[value] !== null;
    })
}


var thousands = function(number) {

    return number.toLocaleString('nl-NL');
}

var convertToCurrency = function(number) {

    number = Math.ceil(number);

    return number.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
}


var shortenCurrency = function(string) {

    if (string.length < 7) {
        return string;
    } else if (string.length < 11) {
        return string.slice(0,string.length - 4) + 'K';
    } else {
        return string.slice(0,string.length - 6) + 'M';
    }
}
