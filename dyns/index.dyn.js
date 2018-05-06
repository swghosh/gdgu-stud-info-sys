var fs = require('fs');
var htmldynmodule = require('../lib/htmldyn/htmldynmodule');
var bodyparsermodule = require('../lib/htmldyn/bodyparsermodule');
var url = require('url');

exports.servePage = (req, res, options) => {

    // custom set of default values used by all pages
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));
    // GET parameters passed in url
    var getParams = bodyparsermodule.parseHttpBody(url.parse(req.url).query);

    // custom message based on error parameter
    if(getParams['invalidUser'] !== undefined) {
        values.errorMsg = 'invalid username or password!';
    }
    else if(getParams['signedOut'] !== undefined) {
        values.errorMsg = 'you have been signed out!';
    }
    else if(getParams['signinFirst'] !== undefined) {
        values.errorMsg = 'please signin first!';
    }
    else {
        values.errorMsg = '';
    }

    res.writeHead(200, {
        'Content-Type': options.type
    });
    
    fs.readFile(options.filepath, options.encoding, (err, data) => {
        res.end(htmldynmodule.getHtmlStringWithIdValues(data, values), options.encoding);
    });
}
