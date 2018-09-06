const express = require('express');

const path =require('path');
const publicPath = path.join(__dirname,'../public');

// console.log(__dirname + './../public');
// console.log(publicPath);

const app= express();
const PORT = process.env.PORT || 3000;

app.use (express.static(publicPath));

app.use((req,res,next)=>{
    res.send("Hello World!");
});

app.listen(PORT,()=>{
    console.log("Server is running on Port: " + PORT);   
});


