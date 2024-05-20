var {getDb} =require('../database');
require('dotenv/config');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {

        user: 'srivashivam20@gmail.com',
        pass: "oiffbyqtnntllgnv"
    }
})

var user = {};
user.createRides=createRides;
user.fetchRides=fetchRides;
user.updateRides=updateRides;
module.exports=user;

async function createRides(params)
{
    let distance=getPrice(params);
    let price=distance*100;
    params.price=price;
    params.distance=distance;
    params.creation_time=new Date();
    params.expiration_time = new Date(params.creation_time.getTime() + 5 * 60000); // Adding 2 minutes to the current time
 
     const db = getDb();
    const collection = db.collection('userrides');
    const result = await collection.insertOne(params);
     return {message : "Thanks for using our Service , we will shortly assign a driver for you !! Happy Journey ", status : 'success' , result};
}

async function fetchRides(params)
{
    const db = getDb();
    const collection = db.collection('userrides');
    const result = await collection.find().toArray();
    result.forEach((ele)=>
    {
        if(ele && ele.creation_time && ele.expiration_time)
            {
                const differenceMs = ele.expiration_time - ele.creation_time;
                const differenceMinutes = differenceMs / (1000 * 60);
                const isExactlyTwoMinutes = Math.abs(differenceMinutes - 5) < Number.EPSILON;
                console.log("oooooooooooooo" ,isExactlyTwoMinutes)
                if(differenceMinutes<=5)
                    {
                        ele.expired=true
                        sendOTPVerificationEmail(ele)
                    }

            }
            console.log("ELEMENT ++++++++++++ ",ele)
    })
    return {message : "Rides fetched successfully ", status : 'success' , result};
}

function getPrice(params)
{
    console.log("PARRRRRRRRRRR",params)
        const earthRadiusKm = 6371; // Radius of the Earth in kilometers
        const dLat = degreesToRadians(params.destination_latitude - params.source_latitude);
        console.log("LLLLLLLLLLL",dLat);
        const dLon = degreesToRadians(params.destination_longitude - params.source_longitude);
        console.log("DDDDDDDDDDDDDDDDDD",dLon)
      
        try {
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(degreesToRadians(params.source_latitude)) *
                    Math.cos(degreesToRadians(params.destination_latitude)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            console.log("AAAAAAAAA", a);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            console.log("CCCCCCCCCC", c);
            const distance = earthRadiusKm * c; // Distance in kilometers
            return distance;
            
        } catch (error) {
            console.error("An error occurred during calculation:", error);
        }
        // return distance;
    }
    
function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    
async function updateRides(params)
{

     const db = getDb();
    const collection = db.collection('userrides');
    const filter = {email:params.email }; // Example filter criteria
    const update = {
         $set: { status: params.status},
         $push: { driver_email_ids: { $each: [params.driver_email_id] } }
        };
    const result = await collection.findOneAndUpdate(
        filter,
        update,
        {
            returnDocument: 'after', // Return the updated document
            // Other options (optional)
        }
    );
    console.log("Result :  " ,result);
    sendOTPVerificationEmail(params,result)


}

const sendOTPVerificationEmail = async (params, res) => {
    try {
        if(params && params.expired)
            {
                const mailOptions = {
                    from: 'Conkart@Admin',
                    to: params.email,
                    subject: `Ride Expired !!`,
                    html: `<p>We regret to inform you that due to heavy traffic no rider is available !! Please Try Again</p>
                 `
                }
                await transporter.sendMail(mailOptions);

                const mailOptions_Admin = {
                    from: 'Conkart@Admin',
                    to: 'srivashivam1998@gmail.com',
                    subject: `Ride Expired of ${params.email} !!`,
                    html: `<p>Ride Got Expired for the user : <br> NAME :  ${params.name}<br> EMAIL :  ${params.email}<br> MOBILE : ${params.mobile} </p>
                 `
                }
                await transporter.sendMail(mailOptions_Admin);

            }
        else{
        
        const mailOptions = {
            from: 'Conkart@Admin',
            to: params.email,
            subject: `Ride ${params.status} !!`,
            html: `<p>We are eager to inform you that rider has ${params.status} your ride !! </p>
         `
        }
        const mailOptions_driver = {
            from: 'Conkart@Admin',
            to: params.driver_email_id,
            subject: `Ride ${params.status} !!`,
            html: `<p>Hello ${params.driver_email_id} ,<br> You ${params.status} this ride , It will reflect in your Dashboard !!</p>
         `
        }
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailOptions_driver);

        if(res.driver_email_ids.length>0)
        {
            res.driver_email_ids.forEach(async (driver_email_id,index) => {
                if(index!=0)
                    {
            const mailOptions_otherdriver = {
                from: 'Conkart@Admin',
                to: driver_email_id,
                subject: `Ride Not Available !!`,
                html: `<p>Hello ${driver_email_id} ,<br> This ride from ${res.source} to ${res.destination} is not Available, Please choose another ride  !!</p>
             `
            }
            console.log("MAIL SENT : " ,mailOptions_otherdriver)
            await transporter.sendMail(mailOptions_otherdriver);
                    }
        })
        }
    }
        
    }   catch (error) {
        console.log("Error !!", error);
    };}
// return {message : "Rides fetched successfully ", status : 'success' , result};
