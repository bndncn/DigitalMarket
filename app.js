// Node modules
const express = require('express');
const bodyParser = require('body-parser');

const port = 80;
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    console.log('Homepage');
});

app.listen(port, () => console.log('Starting DigitalMarket!'));
