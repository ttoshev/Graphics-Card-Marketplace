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


router.get('/getItems', (req, res) => { 
    
     //The DB cursor
     db.collection('items').find().toArray((err,results)=>{
        if (err) return console.log(err);

        //send the results(items)
        res.json(results);
    });
});

router.get('/Managers', (req, res) => { 
    
     //The DB cursor
     db.collection('managers').find().toArray((err,results)=>{
        if (err) return console.log(err);

        //send the results(item ratings/comments)
        res.json(results);
    });
});

router.get('/Ratings', (req, res) => { 
    
     //The DB cursor
     db.collection('ratings').find().toArray((err,results)=>{
        if (err) return console.log(err);

        //send the results(item ratings/comments)
        res.json(results);
    });
});

//Add an item
router.post('/Ratings', (req, res) => {
    
    console.log('POST REQUEST');
    console.log(req.body.userEmail);
    
    //remove malicious html input
    // var name        = req.params.formData.itemName.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp");
    // var price = req.params.formData.itemPrice;
    // var link = req.params.formData.imageLink;
    // var quantity = req.params.formData.itemQuantity;
   
     var ratingDetails = {
        userEmail: req.body.userEmail,
        itemID: req.body.itemID,
        rate: req.body.rate,
        comment: req.body.comment
    };
    
    //isert the new item information into the collection
    db.collection('ratings').insertOne(ratingDetails, (err,result)=>{
        if (err) return console.log(err);
        
        // notify successful add 
        res.json('success');
    });
});