const express       = require('express');
const bodyParser    = require('body-parser');
const MongoClient   = require('mongodb').MongoClient;
const app           = express();

var _port           = 8081;
var admin = require('firebase-admin');
var serviceAccount = require('../static/my-store-9c70c-firebase-adminsdk-a5dt0-3a073655fb.json');
var db;
var ObjectId = require('mongodb').ObjectID;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

var router = express.Router();
app.use('/api', router);

admin.initializeApp({ //firebase
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://my-store.firebaseio.com'
});

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

//get all the items
router.get('/getItems', (req, res) => { 
    
     //The DB cursor
     db.collection('items').find().toArray((err,results)=>{
        if (err) return console.log(err);

        //send the results(items)
        res.json(results);
    });
});

// get all the managers
router.get('/Managers', (req, res) => { 
    
     //The DB cursor
     db.collection('managers').find().toArray((err,results)=>{
        if (err) return console.log(err);

        //send the results(managers)
        res.json(results);
    });
});

// Add an item
router.post('/Managers', (req, res) => {

     var details = {
        userEmail: req.body.userEmail,
    };
    
    //isert the new item information into the collection
    db.collection('managers').insertOne(details, (err,result)=>{
        if (err) return console.log(err);
        
        // notify successful add 
        res.json('success');
    });
});

// get all ratings
router.get('/Ratings', (req, res) => { 
    
     //The DB cursor
     db.collection('ratings').find().toArray((err,results)=>{
        if (err) return console.log(err);

        //send the results(item ratings/comments)
        res.json(results);
    });
});

// Add an item
router.post('/Ratings', (req, res) => {

     var ratingDetails = {
        userEmail: req.body.userEmail,
        itemID: req.body.itemID,
        rate: req.body.rate,
        comment: req.body.comment,
        hidden: req.body.hidden
    };
    
    //isert the new item information into the collection
    db.collection('ratings').insertOne(ratingDetails, (err,result)=>{
        if (err) return console.log(err);
        
        // notify successful add 
        res.json('success');
    });
});

// get all users
router.get('/Users', (req, res) => { 
    
     //The DB cursor
     db.collection('users').find().toArray((err,results)=>{
        if (err) return console.log(err);

        //send the results(item ratings/comments)
        console.log(results);
        res.json(results);
    });
});

//Get a single user from firebase
router.get('/User/:userEmail', (req, res) => { 
    
     admin.auth().getUserByEmail(req.params.userEmail)
      .then(function(userRecord) {

        res.json(userRecord)
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
      });
});

//Add an item
router.post('/Users', (req, res) => {

     var details = {
        userEmail: req.body.userEmail,
    };
    
    //isert the new item information into the collection
    db.collection('users').insertOne(details, (err,result)=>{
        if (err) return console.log(err);
        
        // notify successful add 
        res.json('success');
    });
});

//Disable a user
router.post('/changeDisabled', (req, res) => {

    // no need to worry about input sanitaion here
    var status = req.body.disabledStatus;
    var email = req.body.userEmail;
    
    admin.auth().getUserByEmail(email)
      .then(function(userRecord) {
        var theUserID=userRecord.uid;

        admin.auth().updateUser(theUserID, {
          disabled: status
        })
          .then(function(userR) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully updated user", userR.toJSON());
          })
          .catch(function(err) {
            console.log("Error updating user:", err);
          });
        
      })
      
      .catch(function(error) {
        console.log("Error fetching user data:", error);
      });
});

//Hide a comment from users
router.post('/changeHidden', (req, res) => {

    // no need to worry about input sanitation here
    var id = req.body._id;
    var status = req.body.hidden;
   
  db.collection('ratings').updateOne(
    { '_id': ObjectId(id)}, 
    { $set: {'hidden': status} }
  );
});

//modify an existing item's details
router.post('/modifyItem', (req, res) => {
    
    // create the item and sanitation 
    let theItem={
        'name': req.body.name.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp"),
        'price': req.body.price.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp"),
        'quantity': req.body.quantity.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp")
    };
    
    db.collection('items').updateOne(
        { '_id': ObjectId(req.body.id)}, 
        { $set: {'itemName': theItem.name, 'itemPrice':theItem.price, 'itemQuantity':theItem.quantity} }
    );
});

// remove an existing item
router.post('/removeItem', (req, res) => {
    
    // no need to worry about input sanitation
    db.collection('items').deleteOne({ '_id': ObjectId(req.body.id)});
});

// add a new item
router.post('/addItem', (req, res) => {
    
    // create the new item with input sanitation
    let myItem={
        'itemName': req.body.name.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp"),
        'itemPrice': req.body.price.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp"),
        'itemQuantity': req.body.quantity.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp"),
        'imageLink': req.body.link.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp")
    };

    // isert the new item information into the collection
    db.collection('items').insertOne(myItem, (err,result) =>{
        if (err) return console.log(err);
    });
});

