// db connection

import mongoose from "mongoose";

// interface connectionObject  {
//     isConnected?:number
// } 


type connectionObject = {
    isConnected?:number;
    // isConnected?:boolean
} 

const connection: connectionObject = {}


export default async function dbConnect() : Promise<void> {
    // here condition if db already connected then exec if block
    if(connection.isConnected){
        console.log(`Already connected to database`);
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '' , {})
        
        console.log(db);
        console.log(db.connection);
        
        connection.isConnected = db.connections[0].readyState
        // connection.isConnected = true;
        
        console.log("DB Connected Successfully");
        
        
    } catch (error) {
        console.log("DB connection failed :",error);
        
        process.exit(1)
    }
} 


// export default dbConnect;