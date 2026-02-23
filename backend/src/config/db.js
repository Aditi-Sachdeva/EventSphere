const mongoose = require('mongoose');

async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb Atlas Connected Successfully");
    }
    catch(error){
        console.log("MongoDb Connection Failed: "+error.message);
    }
}

module.exports = {connectDb};