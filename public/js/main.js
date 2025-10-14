const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')

const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")

//Get username and room from url
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});
// console.log(username, room);

const socket = io();

//join chatroom
socket.emit('joinRoom', {username, room });



//Get Room and User
socket.on('roomUsers', ({ room, users })=>{
  outPutRoomName(room);
  outPutUsers(users);
});
//mess from server
socket.on('message', message =>{
  console.log( message)
  outPutMessage(message);


  //scroll down
chatMessage.scrollTop = chatMessage.scrollHeight;
});

//message submit 
chatForm.addEventListener('submit', (e)=>{
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);


  //clear message
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus(); 
});

//outPutMessage to DOM
function outPutMessage(message){
  const div = document.createElement('div')
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
            document.querySelector('.chat-messages').appendChild(div);
}


//Add room name to DOM
function outPutRoomName(room){
roomName.innerText= room; 
}

function outPutUsers(users){
  userList.innerHTML = `${users.map(user =>`<li>${user.username}</li>`).join('')}`
}