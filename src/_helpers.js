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


var thousands = function(number) {

    return number.toLocaleString('nl-NL');
}

var convertToCurrency = function(number) {

    return number.toLocaleString('nl-NL', {style: 'currency', currency: 'EUR', minimumFractionDigits: 0 });
}


var shortenCurrency = function(string) {

    if (string.length < 8) {
        return string;
    } else if (string.length < 12) {
        return string.slice(0,string.length - 4) + 'K';
    } else {
        return string.slice(0,string.length - 8) + 'M';
    }
}
