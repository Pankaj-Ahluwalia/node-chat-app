// const {decodeQryString}= require('./lib-inhouse/query-params');



//request  SERVER to OPEN webSocket & keep connection Open
var socket = io();


// happens when we first connect
socket.on('connect',function(){
    console.log('Connected to server...');

    /*start process of joing a room
    */
    // capture query string params
    const urlString = window.location.search;
    const params =  decodeQryString(urlString); 

    socket.emit('join',params, function(err){
        if(err){
            alert(err);
            window.location.href='/';
        }else{
            console.log('No error.');
        }
    });

    console.log ('User: ', params.name, ', Room: ', params.room);
    
});

socket.on('disconnect',function(){
    console.log('Dis-Connected from server!');
});

// CUSTOM EVENTS ---- listen to server-custom-event
socket.on('updateUserList', function(users){
    //  update users list...........
    updateUserListCtl(users);
});

socket.on('newMessage', function(message){
    
    // addMessageToList(message)
    addMessageToList_mustache(message)

});


// newLocationMessage
socket.on('newLocationMessage', function(message){
    // modify link url
    message.text = `<a href="${message.url}" target="_blank" >My current location</a>`
    // addMessageToList(message)

    addLocationToList_mustache(message)
});




// //////////////////////////////////////////////////////////////////

/*
 *  Client-side code - to manage inteaction with brwoser

*/

function decodeQryString(qryString){
     
    /* decode qrystring into an object
    */
    const obj = {};  
  
    const p =qryString
    // const p ="?name=pankaj&room=%27Node-Course%27"

    var regex = /([^?=&]+)(=([^&#]*))?/gi;
    params = p.match(regex) ;

    // console.log(p.match(regex));


    params.forEach(el => {
        const arr = el.split("=");
        const key = arr[0];
        const myVal = arr[1];
        
         
        let p,regex, res='';
       
        if (myVal.indexOf('%')<0){
            res = myVal
        }else{
            // A. Handle spaces
            p = myVal;
            regex = /%20/gi;           
            res = p.replace(regex, ' ');      
            
            // B. Handle Sngle Quotes
            p = res;
            regex = /%27/gi;
            res = p.replace(regex, "'");
        }
       
        // Option-1:
        value= 
        obj[key] = res;

        // // Option-2: code is ok but a new object will be generated with each loop pass
        // Object.defineProperty(obj,key,{
        //     value: res,
        //     writable: true,
        //     configurable:true
        // });            
    });

    // console.log('decoded queryString: ', obj.name, obj.room);

    // return decoded object
    return obj;
}

function scrollToTop() {
    elmnt.scrollIntoView(true); // Top
}

function scrollToBottom() {
    elmnt.scrollIntoView(false); // Bottom
}

function addMessageToList(message){
    const list = document.getElementById('messages');
    const item = document.createElement('li');

    const formattedTime = moment(message.createdAt).format('h:mm a');

    item.innerHTML = `<strong>${message.from}</strong> ${formattedTime}: ${message.text}`;

     

    list.appendChild(item);
    
    // <li class="message">
    // <div class="message__title">
    //     <h4>Message-1</h4>                    
    // </div>
    // <span>This message was recd from Divya</span>
    // </li>

    // item.focus();
 

    item.scrollIntoView();
    // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_element_scrollintoview
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    // https://www.npmjs.com/package/scroll-into-view
       // https://stackoverflow.com/questions/31716529/how-can-i-scroll-down-to-the-last-li-item-in-a-dynamically-added-ul/31716758

    //  $('#mylist').animate({scrollTop: $('#mylist').prop("scrollHeight")}, 500);
}

function addMessageToList_mustache(message){
    const formattedTime = moment(message.createdAt).format('h:mm a')

    var template = document.getElementById('message-template').innerHTML;
    
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });     

    const list = document.getElementById('messages');
    const item = document.createElement('li');

    item.innerHTML = html;
   
    console.log (html);

    list.appendChild(item);  
    
    item.scrollIntoView();
}

function addLocationToList_mustache(message){
    const formattedTime = moment(message.createdAt).format('h:mm a')

    var template = document.getElementById('message-template-location').innerHTML;
    
    var html = Mustache.render(template,{
        url: message.text,
        from: message.from,
        createdAt: formattedTime
    });     

    const list = document.getElementById('messages');
    const item = document.createElement('li');

    item.innerHTML = html;
   
    console.log (html);

    list.appendChild(item);  
    
    item.scrollIntoView();
}


function enableSendLocationBtn(blnEn){
    if (blnEn){
        // Enable button:
        locationButton.removeAttribute('disabled');
        locationButton.innerText = 'Send location';
    }else{
        // disable button:
        locationButton.setAttribute('disabled','disabled');     
        locationButton.innerText = 'Sending location...';
    }

}

function updateUserListCtl (users){
    // console.log(users);

    const lstDiv = document.getElementById('users');   
    const lstUser = document.createElement('ol');
    
    // remove old children
    lstDiv.removeChild(lstDiv.childNodes[0]);

    users.forEach(function (el){
        let item = document.createElement('li');
        item.innerText =el;
        lstUser.appendChild(item);        
    })
    
    lstDiv.appendChild(lstUser);

    // document.appendChild(lstUser);
    
     

}


document.getElementById('message-form').addEventListener('submit',(e)=>{
    // make sure the form is not submitted
    e.preventDefault();

    // build message to be sent
    // const fromBox = document.getElementById('curUser');
    const textBox = document.getElementById('curMessage');

    // emit message
    socket.emit('createMessage', {
        // from: fromBox.value,
        from: 'User',
        text: textBox.value
    }, () => {
        // clear controls
        textBox.value='';
        textBox.focus();
    });
});




// LOCATION: send
 const locationButton = document.getElementById('send-location');

 locationButton.addEventListener('click', function(){
    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }

    // disable button:
    enableSendLocationBtn(false) ;
     
    // get geolocation
    navigator.geolocation.getCurrentPosition(function (position){
        // Enable button:
        enableSendLocationBtn(true) ; 

        socket.emit('createLocationMessage',{
            latitude : position.coords.latitude ,
            longitude: position.coords.longitude
        });
    }, function(){
        alert ('unable to fetch position');
        enableSendLocationBtn(true) ;
    });
 });