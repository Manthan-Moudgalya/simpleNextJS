import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    usn: { type: String, required: true, unique: true },
    results: [
        {
        subjectID: String,
        marks: Number,
        },
    ],
    gpa: { type: Number, required: true },
});

// Prevent model overwrite in dev hot-reload
export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);


//   mongodb+srv://manthanmoudgalya728_db_user:@students.hrkkav4.mongodb.net/?retryWrites=true&w=majority&appName=students