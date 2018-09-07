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

    // Handle message sent by client
    socket.on('createMessage', (message)=>{
        console.log('createMessage: ', message); 

        io.emit('newMessage',{
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


