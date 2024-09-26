const {rgb} = require("pdf-lib");
const path = require('path');
const os = require('os');
const fs = require("fs");
const {v4: uuidv4} = require('uuid');

/**
 * Add a watermark to a PDF file by placing it in the top-left corner of each page, and send the modified PDF as a response.
 */
exports.addWatermark = async (req, res) => {
    try {
        if (!req.body.watermarkText) {
            return res.status(400).json({error: 'Watermark text must be provided.'});
        }

        const pdfDoc = req.loadedPdf;
        const file = req.files.pdfFile;

        const fileNameWithoutExtension = file.name.substring(0, file.name.lastIndexOf("."));
        const tempFilePath = path.join(os.tmpdir(), `${fileNameWithoutExtension}_${uuidv4()}.pdf`);
        fs.writeFileSync(tempFilePath, file.data);

        // Add watermark to each page
        const watermarkText = req.body.watermarkText;
        for (const page of pdfDoc.getPages()) {
            const height = page.getSize().height;
            page.drawText(watermarkText, {x: 15, y: height - 26, size: 20, color: rgb(0, 0, 0)});
        }
        const modifiedPdfBytes = await pdfDoc.save();

        fs.unlinkSync(tempFilePath);

        res.attachment(`${fileNameWithoutExtension}_modified.pdf`)
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        return res.status(200).type('pdf').send(Buffer.from(modifiedPdfBytes.buffer));
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error.'});
    }
}