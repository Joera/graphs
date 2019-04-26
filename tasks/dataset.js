'use strict';


/**
 * Render task
 * Re-render all the pages in the local mongodb
 */


const logger = require('../services/logger.service');
const DatasetController = require('../controllers/dataset.controller');
const datasetController = new DatasetController();

datasetController.create(process.argv[2])
    .then((pages) => {
        process.exit(0);
    })
    .catch((error) => {
        process.exit(1);
    });

