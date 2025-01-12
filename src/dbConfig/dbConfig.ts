import mongoose from "mongoose";


export async function connect() {
    try{

        mongoose.connect(process.env.MG_URL!);
        const connection = mongoose.connection;
        connection.on("connected",()=>{
            console.log("MongoDB connected successfully!");
        })
        connection.on("error",(err)=>{
            console.log("MongoDB connection error" + err);
            process.exit();
        })
    }catch(err){
        console.log(err)
    }
}
