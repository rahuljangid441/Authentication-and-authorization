import "dotenv/config"
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";
import dns from 'node:dns'


const PORT = process.env.PORT || 3000 ; 

dns.setServers(['8.8.8.8','1.1.1.1']);
async function startServer(){
    await connectDB()
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer().catch((err)=>{
    console.log(`There is an error in starting the server ${err}`);
    process.exit(1);
})