[
    {
        // id:'',
        // name: 'Andrew',
        // room: 'The Office Fans'
    }
]

class Users{
    constructor (){
        this.Users = [];
    }
    
    addUser(id,name,room){
        const user = {
            id,name,room
        }
        this.Users.push (user);     //add user to array

        // return new user
        return user;
    } 


    removeUser (id){
        let user;

        user = this.getUser(id);

        if (user){
            // array of usres excluding specified id
            this.Users= this.Users.filter (user => user.id !== id); 
        }
        
        return user;
    }

    getUser(id){
        return this.Users.filter (user => user.id === id)[0];
    }

    // returns list of users-name in a room
    getUserList (room) {
        
        const users = this.Users.filter ((user) => user.room === room);
        
        // const users = this.Users.filter ((user) => user.room === 'A');
        
       
        const namesArray = users.map((u) => u.name);
        // console.log("Room: ", room);
        // console.log ("Filtered: ", users, ' Names: ', namesArray);
 
          
        return namesArray;
    }


}


module.exports = {Users}