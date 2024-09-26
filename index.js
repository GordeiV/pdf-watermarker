const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 3000;

const corsConfiguration = {
    origin: [ 'https://purple-forest-0aba81b10.4.azurestaticapps.net', 'http://localhost:4200' ],
    methods: [ 'POST' ]
}

app.use(cors(corsConfiguration));
app.use(fileUpload(undefined));
app.use(express.json());

app.use('/api/pdf', require('./routes/pdfRoute'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});