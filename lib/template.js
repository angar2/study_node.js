module.exports = {
  HTML: function(title, list, body, control) {
    return `
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
          <p><a href="/author">Author</a></p>
          ${control}
          ${body}
        </body>
      </html>
      `
  },
  list: function(topics) {
    var list = '';
    var i = 0;
    while(i < topics.length) {
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    return list;
  },
  authorList: function(authors, author_id) {
    var list = '';
    var i = 0;
    while(i < authors.length) {
      var selected = '';
      if (authors[i].id == author_id){
        selected = 'selected';
      }
      list += `<option value=${authors[i].id} ${selected}>${authors[i].name}</option>`;
      i++;
    }
    return list;
  },
  authorTable: function(authors){
    var authorList = '';
    var i = 0;
    while(i < authors.length){
        authorList += `
            <tr>
                <td>${authors[i].name}</td>
                <td>${authors[i].profile}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                <td>
                  <form action="/author/delete_process" method="post">
                    <input type="hidden" name="id" value="${authors[i].id}" />
                    <input type="submit" value="Delete" />
                  </form>
                </td>
            </tr>`
        i++;
    };
    return `<style>
              table {
                  border-collapse: collapse;
              }
              td {
                  border: 1px solid black;
              }
          </style>
          <table>${authorList}</table>`
  },
  authorCreateForm: function(){
    var form = `
      <form action="/author/create_process" method="post">
          <p>
              <input type="text" name="name" placeholder="name" />
          </p>
          <p>
              <input type="text" name="profile" placeholder="profile" />
          </p>
          <p>
              <input type="submit" value="Create" />
          </p>
      </form>`
    return form
  },
  authorUpdateForm: function(author){
    var form = `
      <form action="/author/update_process" method="post">
          <input type="hidden" name="id" value="${author[0].id}" />
          <p>
              <input type="text" name="name" placeholder="name" value="${author[0].name}" />
          </p>
          <p>
              <input type="text" name="profile" placeholder="profile" value="${author[0].profile}" />
          </p>
          <p>
              <input type="submit" value="Update" />
          </p>
      </form>`
    return form
  },
};
