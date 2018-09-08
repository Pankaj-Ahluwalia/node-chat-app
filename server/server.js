const express = require('express'); //Behind scened express uses http module (built-in)
const socketIO = require('socket.io');
const http = require('http');
const path =require('path');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const PORT = process.env.PORT || 3000;


const app= express();
const server = http.createServer(app);    
// app.use((req,res,next)=>{
//     res.send("Hello World!");
// });



// WEBSOCKET-SERVER: capture reference to websocket server
const io= socketIO(server);


const publicPath = path.join(__dirname,'../public');
app.use (express.static(publicPath));


io.on('connection', (socket)=>{
    console.log('new user crated'); 

    //1. Prompt current socket: Welcome message .....
    socket.emit('newMessage', generateMessage( "Admin", "Welcome to the chat Rooom"));

    // 2. Promp Everyone: new user joined
    socket.broadcast.emit('newMessage',generateMessage("Admin","New user joined"));

    // Handle message sent by client
    socket.on('createMessage', (message)=>{
        socket.broadcast.emit('newMessage',generateMessage(message.from,message.text));  
    });    

    socket.on('createLocationMessage',(coords)=>{
        // broadcast to all
        io.emit('newLocationMessage',generateLocationMessage('Admin', coords));
        // io.emit('newMessage',generateLocationMessage('Admin',`${coords.latitude}, ${coords.longitude}`));
    });

    // User Disconnected
    socket.on('disconnect', ()=>{
        console.log('user was dis-connected.'); 
    });
    
});




server.listen(PORT,()=>{
    console.log("Server is running on Port: " + PORT);   
});


// app.listen(PORT,()=>{
//     console.log("Server is running on Port: " + PORT);   
// });


