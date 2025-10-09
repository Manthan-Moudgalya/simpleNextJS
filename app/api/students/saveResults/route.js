import { connectToDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function POST(req) {
  try {
    const body = await req.json();
    const { usn, results, gpa } = body;

    // 🧩 Validate fields
    if (!usn || !results || gpa === undefined) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔗 Connect to MongoDB
    await connectToDB();

    // 🔍 Check if student with same USN already exists
    const existingStudent = await Student.findOne({ usn });
    // console.log(body);
    // console.log("Existing Student: " + existingStudent);
    

    if (existingStudent) {
      // If student already exists, don’t modify data
      return new Response(
        JSON.stringify({
          message: `Student with USN ${usn} already exists. No changes made.`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 💾 Save new student to MongoDB
    const newStudent = new Student({ usn, results, gpa });
    await newStudent.save();

    return new Response(
      JSON.stringify({
        message: "Results saved successfully!",
        student: newStudent,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error saving student:", error);
    return new Response(
      JSON.stringify({
        message: "Error saving results",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
