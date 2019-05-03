const express = require('express');
const bunyan = require('bunyan');
const debug = require('debug');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
// var mongodb = require('mongodb');
// var MongoClient = require('mongodb').MongoClient;


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

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

// Connecting to the database
mongoose.connect(dbConfig.url, options).then(() => {
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