// Node modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1',
    database: 'db'
});

const port = 80;
const app = express();

const MAX_INTEGER = 2147483647;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function generateId() {
    return Math.round(Math.random() * MAX_INTEGER);
}

app.get('/', function (req, res) {
    console.log('Homepage');
    res.render('./pages/index');
});

app.get('/controllers/form_controller.js', function (req, res) {
    res.sendFile('/controllers/form_controller.js', {
        root: __dirname
    });
});

app.get('/node_modules/jquery/dist/jquery.min.js', function (req, res) {
    res.sendFile('node_modules/jquery/dist/jquery.min.js', {
        root: __dirname
    });
});

app.post('/additem', function (req, res) {
    const values = {
        ItemId: generateId(),
        SellerId: parseInt(req.body.sellerid),
        Quantity: parseInt(req.body.quantity),
        Name: req.body.name,
        Description: req.body.description,
        Type: req.body.type,
        Price: parseFloat(req.body.price)
    };
    
    connection.query('INSERT INTO `Item` SET ?', values, function (error, results) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }
        console.log(results);
      });
});

app.listen(port, () => console.log('Starting DigitalMarket!'));
