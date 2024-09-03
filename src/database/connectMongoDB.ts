import mongoose from "mongoose";
import getUri from ".";

const connectToDatabase = async () => {
    try {
        const uri = getUri();
        await mongoose.connect(uri);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1)
    }
}

export default connectToDatabase;