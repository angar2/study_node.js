var http = require('http');
var fs = require('fs'); // file system
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id

    if (pathname === '/') {
      if (title === undefined) {
        fs.readdir(`./data`, function(err, filelist) {
          var title = 'Welcome'
          var desc = 'Hello Node'
          var list = ''
          var i = 0;
          while (i < filelist.length) {
            var list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
            i = i + 1;
          }
          var template = `
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
                <h2>${title}</h2>
                <p>${desc}</p>
              </body>
            </html>
            `
            response.writeHead(200);
            response.end(template);
        });
      } else {
        fs.readdir(`./data`, function(err, filelist) {
          var list = ''
          var i = 0;
          while (i < filelist.length) {
            var list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
            i = i + 1;
          }
          fs.readFile(`data/${title}`, 'utf8', function(err, desc){
            var template = `
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
                  <h2>${title}</h2>
                  <p>${desc}</p>
                </body>
              </html>
            `
            response.writeHead(200);
            response.end(template);
          })
        });
      }
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);