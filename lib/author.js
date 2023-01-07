var url = require('url');
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
                `${template.authorTable(authors)}
                ${template.authorCreateForm()}`,
                ``
            );
            response.writeHead(200);
            response.end(HTML);
        });
    });
};
exports.create_process =  function(request, response){
    var body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
    var post = qs.parse(body);
    db.query(
        `INSERT INTO author(name, profile) 
        VALUES(?, ?)`,
        [post.name, post.profile],
        function(error, results){
            if(error){
                throw error;
            };
            response.writeHead(302, {location: `/author`});
            response.end('Success');
        });
    });
};
exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        };
        db.query(`SELECT * FROM author`, function(error, authors){
            db.query(`SELECT * FROM author WHERE id=?`,[queryData.id] , function(error, author){
                if(error){
                    throw error;
                };
                var title = 'Author-Update';
                var list = template.list(topics);
                var HTML = template.HTML(title, list,
                    `${template.authorTable(authors)}
                    ${template.authorUpdateForm(author)}`,
                    ``
                );
                response.writeHead(200);
                response.end(HTML);
            });
        });
    });
};
exports.update_process =  function(request, response){
    var body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
    var post = qs.parse(body);
    db.query(
        `UPDATE author SET
            name=?, profile=?
            WHERE id=?`,
        [post.name, post.profile, post.id],
        function(error, results){
            if(error){
                throw error;
            };
            response.writeHead(302, {location: `/author`});
            response.end('Success');
        });
    });
};
exports.delete_process = function(request, response){
    var body = '';
    request.on('data', function(data) {
        body = body + data;
    });
    request.on('end', function() {
        var post = qs.parse(body);
        db.query(
            `DELETE FROM topic
                WHERE author_id=?`,
            [post.id],
            function(error, results){
                if(error){
                    throw error;
                };
        });
        db.query(
            `DELETE FROM author
                WHERE id=?`,
            [post.id],
            function(error2, results2){
                if(error2){
                    throw error2;
                };
                response.writeHead(302, {location: `/author`});
                response.end("Success");
        });
    });
};