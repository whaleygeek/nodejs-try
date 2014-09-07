var http = require("http");
var server = http.createServer(
  function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("Hello web world");
  }
);

server.listen(9090, 'localhost');
console.log("Server running");
