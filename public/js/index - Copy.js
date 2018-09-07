//request  SERVER to OPEN webSocket & keep connection Open
var socket = io();

socket.on('connect',function(){
    console.log('Connected to server...');

    socket.emit('createEmail', {
         to: "divya@yahoo.co.in",
         subject: "test",
         text: "client request to send this mail to divya..."
    });
});

socket.on('disconnect',function(){
    console.log('Dis-Connected from server!');
});

// CUSTOM EVENTS ---- listen to server-custom-event
socket.on('newEmail', function(email){
    console.log('New Email: ', email);
});

