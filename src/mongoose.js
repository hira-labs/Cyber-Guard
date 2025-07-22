import mongoose from 'mongoose';

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        return; // Already connected
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_URI, { // Connection URL
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1); // Stop the application if connection fails
    }
};

export default dbConnect;
