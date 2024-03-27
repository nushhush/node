import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
        mongoose.set('strict',false);
        const conn = await mongoose.connect('url');
        console.log(`database connected : ${conn.connection.host}`);
    }
    catch(error){
        console.log(error);

    }
}
export default connectDB
