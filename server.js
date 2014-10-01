//server.js

"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'log-viewer';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var fs = require("fs");
var fileName = "foo.txt";

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // isto pode ser util em combinacao com algum outro servidor da web, ao
    // compartilhar cookies ou dados da sessao.
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    //
    httpServer: server
});

// Essa function callback eh chamada toda vez que alguem tentar se conectar ao
// servidor WebSocket
wsServer.on('request', function(request) {

    // o valor de 'request.origin' no caso do cliente ser um navegador web, sera
    // uma string contendo a URL da pagina que contem o script que abriu a conexao.
    // Se o cliente nao eh um navegador web, a origem pode ser nulo ou "*".
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // aceitar connection
    var connection = request.accept(null, request.origin);

    console.log((new Date()) + ' Connection accepted.');

    function prepWatch(){
      fs.watch(fileName, {
        persistent: true
      }, function(event, filename) {
        console.log(event + " event occurred on " + filename);

        if(event === 'change'){
          getFile();
        }
      });
    }

    function getFile(){
      fs.readFile("foo.txt", "utf8", function(error, data) {
        console.log(data);
        connection.sendUTF(JSON.stringify( { type: 'log', log: data } ));
      });
    }

    getFile();
    prepWatch();

    // user disconnected
    connection.on('close', function(connection) {
      console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
    });

    connection.on('message', function(message) {
      console.log((new Date()) + " Reload prepWatch().");
      prepWatch();
    });


});
