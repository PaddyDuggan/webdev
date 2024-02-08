const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv').config({ path: './config.env'});
const basicRouter = require('./routes/basicroutes');
const snapshotRouter = require('./routes/snapshotroutes');
const userRouter = require('./routes/userroutes');
const bodyParser = require('body-parser');
const session = require("express-session");

const app = express();

app.set('view engine', 'ejs');

//app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/css'))); 
app.use(express.static(path.join(__dirname, '/navbar'))); 
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
      secret: "mysecretkey1234",
      resave: false,
      saveUninitialized: false,
      expires: new Date(Date.now() + 3600000), // Session will expire in one hour
    })
  );
  

app.use(basicRouter);
app.use(snapshotRouter);
app.use(userRouter);

app.listen(process.env.PORT, (err) => {
if(err) return console.log(err);

    console.log(`Express web server listening on port ${process.env.PORT}`);
});