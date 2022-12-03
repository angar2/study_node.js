var http = require('http');
var fs = require('fs'); // file system
var url = require('url');

function templateHTML(title, list, body) {
  return`
    <!doctype html>
    <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          ${list}
        </ol>
        <a href="/create">Create</a>
        ${body}
      </body>
    </html>
    `;
}

function templateList(filelist) {
  var list = ''
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname)
    if (pathname === '/') {
      if (queryData.id === undefined) {
        fs.readdir(`./data`, function(err, filelist) {
          var title = 'Welcome'
          var desc = 'Hello Node'
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${desc}</p>`)
          response.writeHead(200);
          response.end(template);
        });
      } else {
        fs.readdir(`./data`, function(err, filelist) {
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, desc){
            var title = queryData.id
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${desc}</p>`)
            response.writeHead(200);
            response.end(template);
          })
        });
      }
    } else if (pathname === '/create') {
      fs.readdir(`./data`, function(err, filelist) {
        var title = 'Create'
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
          <form action="http://localhost3000/create" method="post">
            <p><input type="text" placeholder="title" /></p>
            <p><textarea type=text placeholder="description"></textarea></p>
            <p><input type="submit" /></p>
          </form>
        `)
        response.writeHead(200);
        response.end(template);
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);