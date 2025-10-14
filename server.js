const path = require('path')

const http = require('http')
const express = require('express')
const socketio = require('socket.io');
const { Socket } = require('engine.io');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser , userLeave, userRoom} = require('./utils/users')

const app = express()

const server = http.createServer(app)
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Chatcord bot ';
       
//run when connect to client
io.on('connection', socket =>{
  socket.on('joinRoom', ({username, room })=>{

    const user = userJoin(socket.id, username, room)
    socket.join(user.room);
 
  socket.emit('message', formatMessage(botName, 'Well come to chatcord'));

  socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} conect the chat`));

  // user and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: userRoom(user.room)
    });
  })
 
  
  socket.on('chatMessage', msg =>{
    const user = getCurrentUser(socket.id)

    io.to(user.room).emit('message', formatMessage(user.username, msg))
  })

  //run when the client disconnect
  socket.on('disconnect', () =>{
    const user = userLeave(socket.id)
      if(user){
    io.to(user.room).emit('message', formatMessage(botName, ` ${user.username} leaves the chat`))
      
  
    // user and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: userRoom(user.room)
    });
  }
  })
})



const PORT = 3000 || process.env.PORT;
// app.get('/', (req, res) => res.send('Hello World!'))
server.listen(PORT, () => console.log(`Server is running on port ${PORT}!`))