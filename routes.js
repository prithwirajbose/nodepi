const routes = require('express').Router();
var _ = require('lodash'),
    AppContext = require('./libs/app-context'),
    PageController = require('./controllers/page-controller');

routes.get('/api', function(req, res) {
    var ctx = new AppContext(req);
    return res.status(200).json({
        success: true,
        data: 'NodePi is running'
    });
});

routes.get('/pages', function(req, res) {
    var ctx = new AppContext(req);
    var pageData = null;
    var pageController = new PageController(req, res, ctx);
    if (_.has(pageController, 'index') && typeof(_.get(pageController, 'index')) == 'function') {
        pageData = pageController['index']();
    }
    res.render('index', { ctx, ctx, data: pageData });
});

routes.get('/pages/:pageName', function(req, res) {
    var ctx = new AppContext(req);
    var pageData = null;
    var pageController = new PageController(req, res, ctx);
    if (typeof(pageController[req.params.pageName]) == 'function') {
        pageData = pageController[req.params.pageName]();
    }
    res.render(req.params.pageName, { ctx, ctx, data: pageData });
});

routes.get('/', function(req, res) {
    var ctx = new AppContext(req);
    var pageData = null;
    var pageController = new PageController(req, res, ctx);
    if (_.has(pageController, 'index') && typeof(_.get(pageController, 'index')) == 'function') {
        pageData = pageController['index']();
    }
    res.render('index', { ctx, ctx, data: pageData });
});

module.exports = routes;