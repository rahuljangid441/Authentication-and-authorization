import mongoose from "mongoose";
import "dotenv/config"

const DB_URL = process.env.DB_URL;


async function connectDB(){
    try{
        const conn = await mongoose.connect(DB_URL);
        console.log('Database has been connected');
        console.log(`Database is connected on ${conn.connection.host}`);
    }
    catch(err){
        console.log('There is been an error in connecting with DB', err);
    }
}

export default connectDB;