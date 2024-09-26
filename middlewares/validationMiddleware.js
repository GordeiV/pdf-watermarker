const {PDFDocument} = require("pdf-lib");

const FILE_SIZE_LIMIT = 536870912; // 512 MB in bytes

/**
 * Validate PDF file. Checks for valid format, size, and encryption status.
 * If any validation fails, it sends response with an appropriate error message.
 *
 * NOTE: If successful, it attaches PDF file to the request as 'req.loadedPdf' (PDFDocument class).
 */
exports.validatePdfFile = async (req, res, next) => {
    if (!req.files || !req.files.pdfFile) {
        return res.status(400).json({error: 'PDF file must be provided.'});
    }

    const file = req.files.pdfFile;
    if (file.mimetype !== "application/pdf") {
        return res.status(400).json({error: 'Invalid file format. Please upload a PDF file.'})
    }


    if (file.size > FILE_SIZE_LIMIT) {
        return res.status(400).json({error: 'File size exceeds the limit (512 MB).'});
    }

    let pdfDoc;
    try {
        pdfDoc = await PDFDocument.load(file.data, {ignoreEncryption: true} );
    } catch (e) {
        return res.status(400).json({
            error: 'Failed to process the document. The PDF file may be corrupted.',
            message: e.message
        })
    }

    if(pdfDoc.isEncrypted) {
        return res.status(400).json({error: 'The PDF file is encrypted.'})
    }

    req.loadedPdf = pdfDoc;
    next()
};