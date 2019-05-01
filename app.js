// Node modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

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
    res.render('pages/index');
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

app.post('/signup', function (req, res) {  
    const customer = {
        CustomerId: req.body.id,
        FirstName: req.body.firstname,
        LastName: req.body.lastname,
        Email: req.body.email,
        PhoneNumber: req.body.phone,
        Address: req.body.address,
        Password: req.body.password
    };
    
    connection.query('INSERT INTO `Customer` SET ?', customer, function (error, results) {
        if (error) {
            console.log(error);
            return res.status(400).json(error);
        }
        return res.sendStatus(200);
    });
});

app.post('/login', function (req, res) {  
    const values = [req.body.username, req.body.password];
    
    connection.query('SELECT * FROM Customer WHERE CustomerId = ? AND Password = ?', values, function (error, results) {
        console.log(results);
        if (results.length == 0) {
            return res.sendStatus(400);
        }
        return res.sendStatus(200);
    });
});

app.post('/additem', function (req, res) {
    const itemId = generateId();
    const item = {
        ItemId: itemId,
        SellerId: req.body.sellerid,
        Quantity: parseInt(req.body.quantity),
        Name: req.body.name,
        Description: req.body.description,
        Type: req.body.type,
        Price: parseFloat(req.body.price)
    };
    
    connection.query('INSERT INTO `Item` SET ?', item, function (error, results) {
        if (error) {
            console.log(error);
            return res.status(400).json(error);
        }
        return res.json(item);
    });
});

app.get('/items', function (req, res) {

    connection.query('SELECT * FROM Item', function (error, results) {
        res.render('pages/items', {
            items: results
        });
    });
});

app.get('/items/:id', function (req, res) {
    const id = req.params.id;

    connection.query('SELECT * FROM Customer INNER JOIN Item ON Customer.CustomerId = Item.SellerId WHERE ItemId = ?', [id], function (error, results) {
        const item = results[0]
        connection.query('SELECT * FROM Item INNER JOIN Review ON Item.ItemId = Review.ItemId WHERE ItemId = ?', [id], function (error, results) {
            res.render('pages/detaileditem', {
                item: item,
                reviews: results
            });
            console.log(item);
            console.log(results);
        });
    });
});

app.listen(port, () => console.log('Starting DigitalMarket!'));
