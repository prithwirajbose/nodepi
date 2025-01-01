var hbs = require('hbs'),
    _ = require('lodash');

var handlebarsHelpers = {
    substr: function(val, start, length) {
        try {
            return new hbs.handlebars.SafeString(val.substr(start, length));
        } catch (e) {
            return val;
        }
    },
    substrAndConcat: function(val, start, length, concatStr) {
        try {
            var newval = val.substr(start, length);
            if (val.length != newval.length) {
                newval = newval + concatStr;
            }
            return new hbs.handlebars.SafeString(newval);
        } catch (e) {
            return val;
        }
    },
    eq: function(val1, val2) {
        return val1 == val2;
    },
    noteq: function(val1, val2) {
        return val1 != val2;
    }
};

module.exports.registerHelpers = function() {
    _.forEach(handlebarsHelpers, (helperFn, helperName) => {
        hbs.registerHelper(helperName, helperFn);
    });
};