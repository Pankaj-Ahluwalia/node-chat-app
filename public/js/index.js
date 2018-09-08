//request  SERVER to OPEN webSocket & keep connection Open
var socket = io();

socket.on('connect',function(){
    console.log('Connected to server...');
});

socket.on('disconnect',function(){
    console.log('Dis-Connected from server!');
});

// CUSTOM EVENTS ---- listen to server-custom-event
socket.on('newMessage', function(message){
    // console.log('newMessage: ', message);
    addMessageToList(message)
});


// newLocationMessage
socket.on('newLocationMessage', function(message){
    // console.log('newMessage: ', message);

    // modify link url
    message.text = `<a href="${message.url}" target="_blank" >see my location on a map</a>`


    addMessageToList(message)
});




// //////////////////////////////////////////////////////////////////


function addMessageToList(message){
    const list = document.getElementById('messageList');
    const item = document.createElement('li');

    item.innerHTML = `<strong>${message.from}</strong> : ${message.text}`;

    list.appendChild(item);

    // item.focus();
    // https://stackoverflow.com/questions/31716529/how-can-i-scroll-down-to-the-last-li-item-in-a-dynamically-added-ul/31716758

    //  $('#mylist').animate({scrollTop: $('#mylist').prop("scrollHeight")}, 500);

    // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_element_scrollintoview

    item.scrollIntoView();
}

document.getElementById('frmMessage').addEventListener('submit',(e)=>{
    // make sure the form is not submitted
    e.preventDefault();

    // build message to be sent
    const fromBox = document.getElementById('curUser');
    const textBox = document.getElementById('curMessage');

    // emit message
    socket.emit('createMessage', {
        from: fromBox.value,
        text: textBox.value
    }, () => {
        // .......................????
    });

    // clear controls
    textBox.value='';
    
    textBox.focus();
});

 const locationButton = document.getElementById('send-location');
 locationButton.addEventListener('click', function(){
    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }
    // get geolocation
    navigator.geolocation.getCurrentPosition(function (position){
        // handle position found: 
        console.log(position);

        socket.emit('createLocationMessage',{
            latitude : position.coords.latitude ,
            longitude: position.coords.longitude
        });

    }, function(){
        alert ('unable to fetch position');
    });
 });