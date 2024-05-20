const express=require('express');
const app=express();
const cors = require("cors");
app.use(cors());
app.options("*", cors());
app.use(express.json());
var database=require('./database');
const userController=require('./controllers/userController');
const ridesController=require('./controllers/ridesController')
app.use('/user',userController);
app.use('/rides',ridesController);
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