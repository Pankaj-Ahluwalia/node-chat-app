//request  SERVER to OPEN webSocket & keep connection Open
var socket = io();

socket.on('connect',function(){
    console.log('Connected to server...');
});

socket.on('disconnect',function(){
    console.log('Dis-Connected from server!');
});

// CUSTOM EVENTS ---- listen to server-custom-event
socket.on('newMessage', function(msg){
    console.log('newMessage: ', msg);
});

