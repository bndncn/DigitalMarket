// Node modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());

function generateId() {
    return Math.round(Math.random() * MAX_INTEGER);
}

app.get('/', function (req, res) {
    if (req.cookies.id) {
        res.render('pages/index', {
            id: req.cookies.id
        });
    }
    else {
        res.render('pages/index', {
            id: false
        });
    }
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

app.get('/node_modules/bootstrap/dist/css/bootstrap.min.css', function (req, res) {
    res.sendFile('node_modules/bootstrap/dist/css/bootstrap.min.css', {
        root: __dirname
    });
});

app.get('/node_modules/popper.js/dist/umd/popper.min.js', function (req, res) {
    res.sendFile('node_modules/popper.js/dist/umd/popper.min.js', {
        root: __dirname
    });
});

app.get('/node_modules/bootstrap/dist/js/bootstrap.min.js', function (req, res) {
    res.sendFile('node_modules/bootstrap/dist/js/bootstrap.min.js', {
        root: __dirname
    });
});

app.get('/css/styles.css', function (req, res) {
    res.sendFile('css/styles.css', {
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
            return res.status(400).json(error);
        }
        return res.sendStatus(200);
    });
});

app.post('/login', function (req, res) {  
    const values = [req.body.id, req.body.password];
    
    connection.query('SELECT * FROM Customer WHERE CustomerId = ? AND Password = ?', values, function (error, results) {
        if (results.length == 0) {
            return res.sendStatus(400);
        }
        res.cookie('id', req.body.id);
        res.render('pages/index', {
            id: req.body.id
        });
    });
});

app.post('/logout', function (req, res) {  
    res.clearCookie('id');
    res.render('pages/index', {
        id: false
    });
});

app.post('/additem', function (req, res) {
    const itemId = generateId();
    const item = {
        ItemId: itemId,
        SellerId: req.cookies.id,
        Quantity: parseInt(req.body.quantity),
        Name: req.body.name,
        Description: req.body.description,
        Type: req.body.type,
        Price: parseFloat(req.body.price)
    };
    
    connection.query('INSERT INTO `Item` SET ?', item, function (error, results) {
        if (error) {
            return res.status(400).json(error);
        }
        return res.json(item);
    });
});

app.post('/addreview', function (req, res) {
    const review = {
        BuyerId: req.cookies.id,
        ItemId: req.cookies.itemId,
        Rating: req.body.rating,
        Title: req.body.title,
        DetailedReview: req.body.review
    };
    
    connection.query('INSERT INTO `Review` SET ?', review, function (error, results) {
        if (error) {
            return res.status(400).json(error);
        }
        const newHTML = `<div>
            <div>Review Title: ${req.body.title}</div>
            <div>Reviewer: ${req.cookies.id}</div>
            <div>Rating: ${req.body.rating}</div>
            ${req.body.review}
        </div>`
        return res.json(newHTML);
    });
});

app.get('/items', function (req, res) {
    connection.query('SELECT * FROM Item', function (error, results) {
        res.render('pages/items', {
            items: results,
            id: req.cookies.id
        });
    });
});

app.get('/items/:id', function (req, res) {
    const id = req.params.id;

    res.clearCookie('itemId');
    res.cookie('itemId', id);

    connection.query('SELECT * FROM Customer INNER JOIN Item ON Customer.CustomerId = Item.SellerId WHERE ItemId = ?', [id], function (error, results) {
        const item = results[0]
        connection.query('SELECT * FROM Item INNER JOIN Review ON Item.ItemId = Review.ItemId WHERE Item.ItemId = ?', [id], function (error, results) {
            res.render('pages/detaileditem', {
                item: item,
                reviews: results,
                id: req.cookies.id
            });
        });
    });
});

app.post('/purchase', function (req, res) {
    const quantity = req.body.quantity;
    const itemId = req.cookies.itemId;

    if (!req.cookies.id) {
        return res.status(400).json({ error: 'You must be logged in to purchase an item!' });
    }
    
    connection.query('SELECT Quantity FROM Customer INNER JOIN Item ON Customer.CustomerId = Item.SellerId WHERE ItemId = ?', [itemId], function (error, results) {
        let amountLeft = results[0].Quantity;

        // The purchase quantity should be between 0 and the amount left in stock.
        if (quantity > amountLeft || quantity <= 0) {
            return res.status(400).json({ quantity: amountLeft });
        }
        amountLeft -= quantity;

        // If the item is out of stock, delete the item entry
        if (amountLeft == 0) {
            connection.query('DELETE FROM Item WHERE ItemId = ?', [itemId], function (error, results) {
                if (error) {
                    return res.status(400).json(error);
                }
            });
        }
        else {
            // Else update the item's quantity
            connection.query('UPDATE Item SET Quantity = ? WHERE ItemId = ?', [amountLeft, itemId], function (error, results) {
                if (error) {
                    return res.status(400).json(error);
                }
            });
        }

        res.render('pages/index', {
            id: req.cookies.id
        });
        
    });
});

app.listen(port, () => console.log('Starting DigitalMarket!'));

