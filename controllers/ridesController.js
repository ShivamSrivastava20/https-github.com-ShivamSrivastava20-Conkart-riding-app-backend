var express = require('express');
var router = express.Router();
var rideService = require('../services/ridesService')
router.post('/createRides' , createRides);
router.post('/fetchRides',fetchRides)
router.post('/updateRides',updateRides)
module.exports=router;


function createRides(req,res)
{
    rideService.createRides(req.body)
    .then((result) => {
        res.send(result);
        
    }).catch((err) => {
        
    });
}

function fetchRides(req,res)
{
    console.log("999999999999999")
    rideService.fetchRides(req.body)
    .then((result) => {
        res.send(result);
        
    }).catch((err) => {
        
    });
}

function updateRides(req,res)
{
    rideService.updateRides(req.body)
    .then((result) => {
        res.send(result);
        
    }).catch((err) => {
        
    });
    
}


