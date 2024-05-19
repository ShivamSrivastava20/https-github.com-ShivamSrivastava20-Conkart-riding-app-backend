require('dotenv/config');
const MongoClient=require('mongodb').MongoClient;
const url=process.env.DATABASE_CONNECTION_STRING;
// const config=require('./config').loadConfigurations()
const client=new MongoClient(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

client.connect()
let db=client.db(process.env.MONGO_DB)
console.log("Connected")