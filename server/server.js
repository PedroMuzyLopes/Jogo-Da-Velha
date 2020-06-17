var express = require('express'); // Roda o servidor
var bodyParser = require('body-parser'); // Processa JSON (submit e requests)
var Pusher = require('pusher'); // Pusher

require('dotenv').config();

var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

var pusher = new Pusher({ // Conecta ao Pusher
  appId: process.env.APP_ID, // Carrega as informações do arquivo pusher.env
  key: process.env.APP_KEY, 
  secret:  process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER, 
});

app.get('/', function(req, res){ // Rota padrão /
  res.send('BIG JOGO DA VÉIA...');
});

app.post('/pusher/auth', function(req, res) { // autenticação dos usuários que tentam se conectar
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

var port = process.env.PORT || 5000;
app.listen(port);