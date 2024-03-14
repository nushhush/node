import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
        mongoose.set('strict',false);
        const conn = await mongoose.connect('mongodb+srv://akshatsrivastav38:kMpCZtGFxGYbHZoE@cluster0.n4csv8n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log(`database connected : ${conn.connection.host}`);
    }
    catch(error){
        console.log(error);

    }
}
export default connectDB