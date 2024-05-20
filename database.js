require('dotenv/config');
const { MongoClient } = require('mongodb');

const url = process.env.DATABASE_CONNECTION_STRING;
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        db = client.db(process.env.MONGO_DB);
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
        throw error;
    }
}

module.exports = {
    connectToDatabase,
    getDb: () => db
};

// Connect to the database when this file is executed directly
connectToDatabase()
    .then(() => console.log("Database connection established"))
    .catch(error => console.error("Error establishing database connection:", error));
