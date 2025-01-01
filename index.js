var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    hbs = require('hbs'),
    routes = require('./routes'),
    utils = require('./libs/utils');
require('dotenv').config();
const APP_PORT = process.env.APP_PORT;
var app = express();

app.use(bodyParser.json({
    extended: true,
    type: 'application/json'
}));

app.use(cors());
app.use('/', routes);
app.use('/pages', express.static('pages'));
app.set('views', 'pages');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
hbs.registerPartials(__dirname + '/pages/fragments');
utils.registerHelpers(hbs);
app.use(function(err, req, res, next) {
    console.error(err);
    var responseData = {
        "error": null,
        "success": false
    };

    var httpStatus = 500;
    if (err instanceof SyntaxError) {
        responseData.error = {
            "errorCode": "RequestSyntaxError",
            "message": "The request body is not valid"
        };
        httpStatus = 400;
    } else {
        responseData.error = {
            "errorCode": "SystemError",
            "message": "An internal error has occured"
        };
    }
    res.status(httpStatus).send(responseData);
});

var server = app.listen(APP_PORT, function() {
    console.log('NodePi Running on port ' + APP_PORT);
});

module.exports = server;