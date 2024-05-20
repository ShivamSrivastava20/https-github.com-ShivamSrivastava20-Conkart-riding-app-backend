var {getDb} =require('../database');
require('dotenv/config');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

var user = {};
user.registerUser=registerUser;
user.loginUser=loginUser;
user.checkjwt=checkjwt;
module.exports=user;

async function registerUser(params)
{
    const db = getDb();
    const collection = db.collection('users');
    const userExists=await collection.findOne(params);
    if(userExists) return {message : "User Already Exists", status : 'failed'}
    const result = await collection.insertOne(params);
    return {message : "User Registered", status : 'success' , result};
}

async function loginUser(params)
{
     const db = getDb();
    const collection = db.collection('users');
    const userExists=await collection.findOne(params);
 if(userExists)
        {
             var token = jwt.sign({_id:userExists._id} , process.env.SECRET,{ expiresIn: '15m' } );
            let token_data={
                user_id:userExists._id,
                token:token,
                email:userExists.email
            }
             if(token) db.collection('verifyjwt').insertOne(token_data)
            return {message : "User Logged IN", status : 'success' , token}
        } 
    return {message : "User Not Found", status : 'failed'};
}

async function checkjwt(params)
{
    if(params.token)
        {
            try{
                const decoded =  jwt.verify(params.token ,process.env.SECRET);
                console.log("opppppppppppppp" , decoded);
                const db = getDb();
                const collection = db.collection('users');
                try {
                    const userExists = await collection.findOne({_id: new ObjectId(decoded._id)});
                console.log("*******************" , userExists);
                console.log("Decoded : " , decoded)
               return {message : "User Logged IN", status : 'success' , loggedInUser_email: userExists.email}
            } catch (error) {
                console.error('Error executing findOne:', error);
              }
               } catch (error) {
                return{ message: 'Token verification failed', status: 'failed', error: error.message };
              }
                }
        }