var http = require('http');
var url = require('url');
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/') {
      if(queryData.id === undefined) {
        // 홈 페이지
        topic.home(request, response);
      } else {
        // 상세 페이지
        topic.detail(request, response);
      }
    } else if(pathname === '/create') {
      // 생성 페이지
      topic.create(request, response);
    } else if(pathname === '/create_process') {
      // 게시물 생성
      topic.create_process(request, response);
    } else if(pathname === '/update') {
      // 수정 페이지
      topic.update(request, response);
    } else if(pathname === '/update_process') {
      // 게시물 수정
      topic.update_process(request, response);
    } else if(pathname === '/delete_process') {
      // 게시물 삭제
      topic.delete_process(request, response);
    } else if(pathname === '/author') {
      // 저자 관리 페이지
      author.home(request, response);
    } else if(pathname === '/author/create_process') {
      // 저자 생성
      author.create_process(request, response);
    } else if(pathname === '/author/update') {
      // 저자 수정 페이지
      author.update(request, response);
    } else if(pathname === '/author/update_process') {
      // 저자 수정
      author.update_process(request, response);
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);