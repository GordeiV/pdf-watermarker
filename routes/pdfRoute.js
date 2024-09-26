const express = require('express')
const {body} = require('express-validator');

const pdfRouter = express.Router();

const validator = require('../middlewares/validationMiddleware')
const pdfController = require('../controllers/pdfController');

pdfRouter.post('/watermark',
    validator.validatePdfFile,
    body('watermarkText').trim().escape(),
    pdfController.addWatermark);

module.exports = pdfRouter;