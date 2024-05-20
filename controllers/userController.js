var express = require('express');
var router = express.Router();
var userService = require('../services/userService')
router.post('/registerUser' , registerUser);
router.post('/loginUser',loginUser)
router.post('/checkjwt',checkjwt)
module.exports=router;


function registerUser(req,res)
{
    userService.registerUser(req.body)
    .then((result) => {
        res.send(result);
        
    }).catch((err) => {
        
    });
}

function loginUser(req,res)
{
    userService.loginUser(req.body)
    .then((result) => {
        res.send(result);
        
    }).catch((err) => {
        
    });
}

function checkjwt(req,res)
{
    console.log("00000000000")
    userService.checkjwt(req.body)
    .then((result) => {
     console.log("RESult 333333333333888888888888 : " , result);
        res.send(result);
        
    }).catch((err) => {

        
    });
}