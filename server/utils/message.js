const moment = require('moment');

const generateMessage = (from, text)=>{
     
    return {
        from,
        text,
        createdAt: moment().valueOf() //new Date().getTime()
    };
     
}

const generateLocationMessage =(from,coords)=>{
    // note: there should be no speace after comman in url

    const url = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
    
    const newLoc = {
        from,
        url, 
        createdAt: moment().valueOf()  // new Date().getTime()
    }
    // console.log ('generateLocationMessage: ',  newLoc);
    return newLoc;
};

module.exports = {generateMessage, generateLocationMessage};