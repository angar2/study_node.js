var qs = require('querystring');
var template = require('./template.js');
var db = require('./db.js');

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        };
        db.query(`SELECT * FROM author`, function(error, authors){
            if(error){
                throw error;
            };
            var title = 'Author';
            var list = template.list(topics);
            var HTML = template.HTML(title, list,
                `${template.authorTable(authors)}`,
                ``
            );
            response.writeHead(200);
            response.end(HTML);
        });
    });
};