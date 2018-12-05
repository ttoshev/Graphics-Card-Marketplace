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

        //send the results(managers)
        res.json(results);
    });
});

//Add an item
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

   var id = req.body._id;
   var status = req.body.hidden;
   
  db.collection('ratings').updateOne(
    { '_id': ObjectId(id)}, 
    { $set: {'hidden': status} }
  ), 
    
    (err,result)=>{
        if (err) return console.log(err);
        
        // notify successful add 
        console.log('changed!')
        res.json('success');
    };
});

//modify item details
router.post('/modifyItem', (req, res) => {
   db.collection('items').updateOne(
    { '_id': ObjectId(req.body.id)}, 
    { $set: {'itemName': req.body.name, 'itemPrice':req.body.price, 'itemQuantity':req.body.quantity} }
  ), 
    
    (err,result)=>{
        if (err) return console.log(err);
        
        // notify successful add 
        console.log('changed!')
        res.json('success');
    };
});

router.post('/removeItem', (req, res) => {
   
    console.log("removing..."+req.body.id);
    console.log(req.body.id);
    db.collection('items').deleteOne({ '_id': ObjectId(req.body.id)})//, 
    
    // (err,result)=>{
    //     if (err) return console.log(err);
        
    //     // notify successful add 
    //     console.log('changed!')
    //     res.json('success');
    // };
});

router.post('/addItem', (req, res) => {
    
    let myItem={
        'itemName': req.body.name,
        'itemPrice': req.body.price,
        'itemQuantity': req.body.quantity,
        'imageLink': req.body.link
    }
    console.log(myItem);
    //isert the new item information into the collection
    db.collection('items').insertOne(myItem, (err,result) =>{
        if (err) return console.log(err);
    });
});

