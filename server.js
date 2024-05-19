const express=require('express');
const app=express();
var database=require('./database');
app.listen(8080 , (err)=>
    {
        if(err)
        {
            console.log("Issue in the server !! Please check");
        }
        else 
        {
            console.log("Server started !!");
        }
    })