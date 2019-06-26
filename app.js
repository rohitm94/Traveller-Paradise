var express=require('express');
var path =require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var helmet = require('helmet');

var app = express();
app.use(helmet())
app.disable('x-powered-by')
let ProfController = require('./routes/ProfileController');
let CatalogController = require('./routes/CatalogController');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'assets')));

app.use(cookieParser());

//Session initialisation
app.use(session({resave: false,secret: "rohitweb", saveUninitialized: true,cookie: { maxAge: 60000 }}));

//  routes defining
app.use('/', CatalogController);

app.use('/',ProfController);

module.exports = app;

app.listen(3000);
