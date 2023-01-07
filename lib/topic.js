var url = require('url');
var qs = require('querystring');
var template = require('./template.js');
var db = require('./db.js');

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        };
        var title = 'Welcome';
        var desc = 'Hello Node';
        var list = template.list(topics);
        var HTML = template.HTML(title, list, `<h2>${title}</h2><p>${desc}</p>`, `<a href="/create">Create</a>`);
        response.writeHead(200);
        response.end(HTML);
    });
};
exports.detail = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        };
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          };
          var title = topic[0].title;
          var desc = topic[0].description;
          var author = topic[0].name
          var list = template.list(topics);
          var HTML = template.HTML(title, list,
            `<h2>${title}</h2><p>by ${author}</p><p>${desc}</p>`,
            `<a href="/create">Create</a>
            <a href="/update?id=${queryData.id}">Update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}" />
              <input type="submit" value="Delete" />
            </form>`
          );
          response.writeHead(200);
          response.end(HTML);
        });
      });
};
exports.create = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        };
        db.query(`SELECT * FROM author`, function(error2, authors){
          if(error2){
            throw error2;
          };
          var title = 'Create';
          var list = template.list(topics);
          var authorList = template.authorList(authors);
          var HTML = template.HTML(title, list,
            `<form action="/create_process" method="post">
              <p><select name="author">${authorList}</select></p>
              <p><input type="text" name="title" placeholder="title" /></p>
              <p><textarea type=text name="description" placeholder="description"></textarea></p>
              <p><input type="submit" /></p>
            </form>`,
            `<h2>${title}</h2>`
          );
          response.writeHead(200);
          response.end(HTML);
        });
      });
};
exports.create_process = function(request, response){
    var body = '';
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body);
        db.query(
          `INSERT INTO topic(title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`,
          [post.title, post.description, post.author],
          function(error, results){
            if(error){
              throw error;
            };
            response.writeHead(302, {location: `/?id=${results.insertId}`});
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
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          };
          db.query(`SELECT * FROM author`, function(error3, authors){
            if(error3){
              throw error3;
            };
            var title = topic[0].title;
            var desc = topic[0].description;
            var list = template.list(topics);
            var authorList = template.authorList(authors, topic[0].author_id);
            var HTML = template.HTML(title, list,
              `<form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}" />
                <p><select name="author">${authorList}</select></p>
                <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
                <p><textarea type=text name="description" placeholder="description">${desc}</textarea></p>
                <p><input type="submit" /></p>
              </form>`, 
              `<a href="/create">Create</a> <a href="/update?id=${topic[0].id}">Update</a>`
            );
            response.writeHead(200);
            response.end(HTML);
          });
        });
      });
};
exports.update_process = function(request, response){
    var body = '';
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body)
        db.query(
          `UPDATE topic SET
            title=?, description=?, author_id=?
            WHERE id=?`,
          [post.title, post.description, post.author, post.id],
          function(error, results){
            if(error){
              throw error;
            };
            response.writeHead(302, {location: `/?id=${post.id}`});
            response.end("Success");
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
            WHERE id=?`,
          [post.id],
          function(error, results){
            if(error){
              throw error;
            };
            response.writeHead(302, {location: `/`});
            response.end("Success");
        });
      });
}