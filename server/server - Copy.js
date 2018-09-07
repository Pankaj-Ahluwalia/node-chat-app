const express = require('express'); //Behind scened express uses http module (built-in)
const socketIO = require('socket.io');
const http = require('http');
const path =require('path');

const PORT = process.env.PORT || 3000;


const app= express();

 
// SERVER: create using http
// const server = http.createServer((req,res)=>{

// });;

const server = http.createServer(app);   //also ok

// WEBSOCKET-SERVER: capture reference to websocket server
const io= socketIO(server);

io.on('connect', (socket)=>{
    console.log('new user connected.'); 

    socket.emit('newEmail',{
        from: 'pankaj@example.com',
        text: "Hello how are you doing?"
    });

    // 
    socket.on('createEmail', (newEmail)=>{
        console.log('createEmail: ', newEmail); 
    });    

    // User Disconnected
    socket.on('disconnect', ()=>{
        console.log('user was dis-connected.'); 
    });
    
});



 


const publicPath = path.join(__dirname,'../public');
app.use (express.static(publicPath));

app.use((req,res,next)=>{
    res.send("Hello World!");
});

server.listen(PORT,()=>{
    console.log("Server is running on Port: " + PORT);   
});


// app.listen(PORT,()=>{
//     console.log("Server is running on Port: " + PORT);   
// });


