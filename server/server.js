const express = require('express'); //Behind scened express uses http module (built-in)
const socketIO = require('socket.io');
const http = require('http');
const path =require('path');

const PORT = process.env.PORT || 3000;


const app= express();

const server = http.createServer(app);   //also ok

// WEBSOCKET-SERVER: capture reference to websocket server
const io= socketIO(server);


const publicPath = path.join(__dirname,'../public');
app.use (express.static(publicPath));


io.on('connection', (socket)=>{
    console.log('new user connected.'); 

    /*challenge:
        1. socket.emit from Admin text Welcome to chat appp
        2. socket.broadcast.emit from admin text new user joined
    */

    //1. Prompt current socket: Welcome message .....
    socket.emit('newMessage',{
        from: "Admin",
        text: "Welcome to the chat Rooom"
    })

    // 2. Promp Everyone: new user joined
    socket.broadcast.emit('newMessage',{
        from: "Admin",
        text: "New user joined"
    })  


    // Handle message sent by client
    socket.on('createMessage', (message)=>{
        // console.log('createMessage: ', message); 
        socket.broadcast.emit('newMessage',{
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });  
    });    

    // User Disconnected
    socket.on('disconnect', ()=>{
        console.log('user was dis-connected.'); 
    });
    
});


// app.use((req,res,next)=>{
//     res.send("Hello World!");
// });

server.listen(PORT,()=>{
    console.log("Server is running on Port: " + PORT);   
});


// app.listen(PORT,()=>{
//     console.log("Server is running on Port: " + PORT);   
// });


