function decodeQryString(qryString){
     
    /* decode qrystring into an object
    */
    const obj = {};
    let params=[];
    
    
    // let paramsBuilt=[];

    // // handle "?" mark in qry params
    // qryString = qryString.slice(1);
  

    // // quit if no query string exists
    // if (qryString.length=0){
    //     return {};
    // }
        

    

    // switch(qryString.indexOf('&')){
    //     case -1:
    //         params.push(qryString)
    //         break;

    //     default:
    //         params = qryString.split('&')
    // }

    
    const p =qryString
    // const p ="?name=pankaj&room=%27Node-Course%27"

    var regex = /([^?=&]+)(=([^&#]*))?/gi;
    params = p.match(regex) ;

    // console.log(p.match(regex));


    params.forEach(el => {
        const arr = el.split("=");
        const key = arr[0];
        const myVal = arr[1];
        
        // Remove spaces:   p ="Node%20Course%20with%20React";
        let q, p = myVal
        let res='';
       
        if (myVal.indexOf('%')<0){
            res = myVal
        }else{
            let regex = /%20/gi;    
            q = p.match(regex);
            res =  q[0].split('%20').join(' '); 
        }
        

         

        // console.log(p, q[0].split('%20').join(' ') ); 
        //> "Node%20Course%20with%20React%2028" "Node Course with React 28"


        // Option-1:
        // value= 
        // obj[key] = res;

        // Option-2:
        Object.defineProperty(obj,key,{
            value: res,
            writable: false,
            configurable:false
        });

        /*
        p ="Node%20Course%20with%20React";
        regex=/([^%20]+)/gi;
        q = p.match(regex);
        console.log( q.join(' '));  //"Node Course with React"

        // Example of an object property added with defineProperty with a data property descriptor
        Object.defineProperty(obj, "property3", {value : 'some value',
                           writable : true,
                           enumerable : true,
                           configurable : true});
        // 'property3' property exists on object obj and its value is 37

        */

        

        
    });

    // console.log('decoded queryString: ', {paramsBuilt});

    // return decoded object
    return obj;
}


module.exports = {
    decodeQryString
};