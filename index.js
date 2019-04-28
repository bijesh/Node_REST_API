const express = require('express');
const bunyan = require('bunyan');
const debug = require('debug');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();

app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
mongoose.Promise = global.Promise;

const logger = bunyan.createLogger({name: "Server Log"});

var myLogger = (req,res,next)=>{
    logger.info(`new request on : ${ Date.now()}`);
    next();
};

app.use(myLogger);
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});



app.get('/',(req,res)=> res.send("Hello world "));

require('./routes/post.routes.js')(app);

process.on('uncaughtException',(err)=>{
    logger.error(' Caught exception: ${err}');
});
let port= process.env.port || 3005
app.listen(port,'localhost',()=> debug('listening ${ port }'));