// lib/models/Student.js

import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number, 
        required: true 
    },
    grade: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true  // Ensuring emails are unique
    }
});

// Export the model, let Mongoose manage the collection creation
export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
