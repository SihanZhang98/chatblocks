const express =require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//allow users to get static files in the 'public' subdirectory
//e.g. 104.248.127.181/self 
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!')
});

//when the server recieve a chat message, send it to every client
io.on('connection', (socket) => {
  console.log("New client connected! ID: "+socket.id)
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

//listen on port 80
http.listen(80);



