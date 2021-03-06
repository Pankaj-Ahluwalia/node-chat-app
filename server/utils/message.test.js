const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');


describe('generateMessage', ()=>{
    it('should generate correct message object',()=>{
        const from ='Jen';
        const text ='some text';
        const message = generateMessage(from,text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            text
        });
    });     
});



describe('generateLocationMessage', ()=>{
    it('shuld gnerate correct location object', ()=>{
        const from ='Deb';
        const latitude= 15;
        const longitude=19;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const message = generateLocationMessage(from , {
            latitude,
            longitude
        });

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});

    });
});