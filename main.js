var http = require('http');
var fs = require('fs'); // file system
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHTML = require('sanitize-html');
var template = require('./lib/template.js');
var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : '111111',
  database : 'classMySQL'
});
 
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
      // 데이터 불러오기
      if(queryData.id === undefined) {
        // 모든 데이터 불러오기
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
      } else {
        // 특정 데이터 불러오기
        db.query(`SELECT * FROM topic`, function(error, topics){
          if(error){
            throw error;
          };
          db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
            if(error2){
              throw error2;
            };
            var title = topic[0].title;
            var desc = topic[0].description;
            var list = template.list(topics);
            var HTML = template.HTML(title, list,
              `<h2>${title}</h2><p>${desc}</p>`,
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
      }
    } else if(pathname === '/create') {
      // 데이터 생성
      db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        };
        var title = 'Create';
        var list = template.list(topics);
        var HTML = template.HTML(title, list,
          `<form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title" /></p>
            <p><textarea type=text name="description" placeholder="description"></textarea></p>
            <p><input type="submit" /></p>
          </form>`,
          `<h2>${title}</h2>`
        );
        response.writeHead(200);
        response.end(HTML);
      });
    } else if(pathname === '/create_process') {
      var body = '';
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body);
        db.query(
          `INSERT INTO topic(title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`,
          [post.title, post.description, 1],
          function(error, results){
            if(error){
              throw error;
            };
            response.writeHead(302, {location: `/?id=${results.insertId}`});
            response.end('Success');
        });
      });
    } else if(pathname === '/update') {
      // 데이터 수정
      db.query(`SELECT * FROM topic`, function(error, topics){
        if(error){
          throw error;
        };
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          };
          var title = topic[0].title;
          var desc = topic[0].description;
          var list = template.list(topics);
          var HTML = template.HTML(title, list,
            `<form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}" />
              <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
              <p><textarea type=text name="description" placeholder="description">${desc}</textarea></p>
              <p><input type="submit" /></p>
            </form>`, 
            `<a href="/create">Create</a> <a href="/update?id=${topic[0].id}">Update</a>`
          );
          response.writeHead(200);
          response.end(HTML);
        })
      });
    } else if(pathname === '/update_process') {
      var body = '';
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body)
        db.query(
          `UPDATE topic SET
            title=?, description=?
            WHERE id=?`,
          [post.title, post.description, post.id],
          function(error, results){
            if(error){
              throw error;
            };
            response.writeHead(302, {location: `/?id=${post.id}`});
            response.end("Success");
        });
      });
    } else if(pathname === '/delete_process') {
      // 데이터 삭제
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
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);