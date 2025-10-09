import { connectToDB } from "@/lib/mongodb";
import Student from "@/models/Student";


export async function GET(req){
    try {

        await connectToDB();
        const students = await Student.find({})
        .sort({ gpa: -1 }) // ✅ Sort by CGPA descending
        .select("usn gpa -_id");
        console.log(students);
        
        return Response.json(students, { status: 200 });
    } 
    catch (error) {
        console.error("Error fetching students:", error);
        return Response.json({ message: "Server error" }, { status: 500 });
    }

}