const express       = require('express');
const bodyParser    = require('body-parser');
const MongoClient   = require('mongodb').MongoClient;
const app           = express();

var _port           = 8081;
var db;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

var router = express.Router();
app.use('/api', router);

router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://se3316-ttoshev-lab5-ttoshev.c9users.io:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


// Connect to Mlab DB
MongoClient.connect('mongodb://ttoshev:banana24@ds117834.mlab.com:17834/cardshop', (err, client)=> { 
    useNewUrlParser: true;
    if (err) return console.log(err);
    
    //MLab database
    db = client.db('cardshop'); 
    
    //listen when connected to Db
    app.listen (_port, function(){ //Listen, if DB connected
        console.log('Now listening on port '+_port);
    });
});


router.get('/home', (req, res) => { 
    
    //The DB cursor
     db.collection('items').find().toArray((err,results)=>{
        if (err) return console.log(err);

        //send the results(items) to angular
        res.json(results);
    });
});

//Add an item
router.post('/add/:formData', (req, res) => {
    
    //remove malicious html input
    var name        = req.params.formData.itemName.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp");
    var price = req.params.formData.itemPrice;
    var link = req.params.formData.imageLink;
    var quantity = req.params.formData.itemQuantity;
   
    var itemDetails = {
        itemName: name,
        itemPrice: price,
        itemQuantity: quantity,
        imageLink: link
    };
    
    //isert the new item information into the collection
    db.collection('items').insertOne(itemDetails, (err,result)=>{
        if (err) return console.log(err);
        
        // notify successful add 
        res.json('success');
    });
});