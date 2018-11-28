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
    next();
});


// Connect to Mlab DB
MongoClient.connect('mongodb://ttoshev:banana24@ds149593.mlab.com:49593/mystore', (err, client)=> { 
    useNewUrlParser: true;
    if (err) return console.log(err);
    
    //MLab database
    db = client.db('mystore'); 
    
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
router.post('/add/:itemName', (req, res) => {
    
    //remove malicious html input
    var name        = req.params.itemName.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp");
   
    var itemDetails = {
        itemName: name,
    };
    
    //isert the new item information into the collection
    db.collection('items').insertOne(itemDetails, (err,result)=>{
        if (err) return console.log(err);
        
        //send the results(items) to angular
        res.json('success');
    });
});