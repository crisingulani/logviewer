// client.js
$(function () {

    // "use strict" eh uma nova funcionalidade do ECMAScript 5, que basicamente
    // permite-nos melhorar a qualidade do nosso code JavaScript.
    // Como por exemplo, utilizar uma variavel que nao foi declarada,
    // utilizar palavras reservadas no codigo ou utilizar recursos da linguagem
    // que ja foram declarados obsoletos.
    "use strict";
    var host = 'localhost';
    var content = $('#content');

    // se o user esta executando pelo Mozilla, o WebSocket ja vem embutido.
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // testa se o browser nao suporta WebSocket
    if (!window.WebSocket) {
        var msg = 'Sorry, but your browser doesn\' support WebSockets.';
        content.html($('<p>', { text: msg} ));
        return;
    }

    // abre conexao
    var connection = new WebSocket('ws://'+host+':1337');

    connection.onopen = function () {
        // ao se conectar...
        console.log('Connected!');
    };

    connection.onerror = function (error) {
        // em caso de problemas ao se conectar...
        var msg = 'Sorry, but there\'s some problem with your connection or '+
        'the server is down.';
        content.html($('<p>', { text: msg } ));
    };

    connection.onmessage = function (message) {
        // tentar analisar a mensagem JSON. Sabemos que o servidor sempre retorna
        //JSON, mas devemos ter certeza de que a mensagem nao esta fragmentada ou
        // sofreu outros danos.
        try {
            var json = JSON.parse(message.data);

            console.log(json);

            if (json.log){
              content.html(json.log);
            }
            connection.send('reload');
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

    };

});
