d3.json(window.location + '/config.json', function(error, json) {

    let config = json;

    let page = 'vorige-week';
    let segment = 'all';
    let graphs = [];

    let municipalityDropdown = document.querySelector('select.muni-select');
    let municipalityOptions = [].slice.call(document.querySelectorAll('ul.muni-select li'));
    let specialOptions = [].slice.call(document.querySelectorAll('.specials-select option'));
    let segmentOptions = municipalityOptions.concat(specialOptions);
    let menuOptions = [].slice.call(document.querySelectorAll('#menu ul li'));
    let pages = [].slice.call(document.querySelectorAll('section.page'));

    let openPage = function openPage(pageName) {

        for (let page of pages) {

            if (page.id === pageName) {

                page.style.display = (window.innerWidth < 600) ? 'flex' : 'grid';

                for (let vis of [].slice.call(page.querySelectorAll('article'))) {

                    let container = document.createElement('div');
                    container.classList.add('container');

                    if(config[vis.id].smallMultiple) {
                        container.classList.add('small_multiple');
                    }

                    vis.appendChild(container);

                    // clear html in containers
                    vis.querySelector('.container').innerHTML = '';

                    // console.log(config[vis.id]);

                    graphs[vis.id] = new window[vis.getAttribute('data-script')](config[vis.id].api,vis.querySelector('.container'), config[vis.id], config[vis.id].dataMapping, segment, vis.getAttribute('data-property'),true);
                    graphs[vis.id].init();

                    if (config[vis.id].header) {

                        if (vis.querySelector('.article_header')) { vis.querySelector('.article_header').remove() }

                        let headerContainer = document.createElement('div');
                        headerContainer.classList.add('article_header');

                        let h = document.createElement('h3');
                        h.innerText = (typeof config[vis.id].header === 'string') ? config[vis.id].header : config[vis.id].dataMapping[0].label;

                        headerContainer.appendChild(h);

                        for (let i = 0; i < 3; i++) {

                            let span = document.createElement('span');
                            headerContainer.appendChild(span);
                        }

                        vis.querySelector('.container').parentNode.prepend(headerContainer);
                    }

                    // uniformize props in function --> window[method](el,dataMapping,property,segment,smallMultiple)
                    //       window[vis.getAttribute('data-script')](vis.querySelector('.container'),dataMapping[vis.id],vis.getAttribute('data-property'),true);
                }

            } else {

                page.style.display = 'none';
            }
        }
    }

    let changeSegment = function changeSegment(newSegment) {

        segment = newSegment;

        for (let graph of Object.values(graphs)) {
            // what do we do with data?

            //    console.log(graph);

            if (graph.endpoint === "/api/data" ) {

                graph.run(newSegment,true)
            }
        }
    }

    menuOptions.forEach( (o) => {

        o.addEventListener( 'click', () => {

            menu(true);
            openPage(o.getAttribute('data-nav'));
        });
    });

    segmentOptions.forEach( (o) => {

        o.addEventListener( 'change', () => {

            changeSegment(o.getAttribute('data-value'));
        });
    });

    municipalityDropdown.addEventListener( 'change', () => {

        changeSegment(municipalityDropdown.value);
    });

    // one call per gemeente

    d3.json('https://tcmg-hub.publikaan.nl/api/gemeenten', function(error, json) {
        if (error) throw error;
        globalData.geoData = topojson.feature(json, json.objects.gemeenten).features;

        d3.json('https://tcmg-hub.publikaan.nl/api/gemeentes', function (error, json) {
            if (error) throw error;
            globalData.gemeentes = json;

            d3.json('https://tcmg-hub.publikaan.nl/api/data', function (error, json) {
                if (error) throw error;
                globalData.data = json;
                openPage(page);
            });
        });
    });

    let menu = function(close) {

        if (close) {

            document.querySelector('#menu').classList.remove('open');

        } else {

            document.querySelector('#menu').classList.toggle('open');
        }
    }

    document.querySelector('#hamburger').addEventListener( 'click', () => {

        menu();
    });

});