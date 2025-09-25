import { connectToDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function POST(req) {
    try {
        const body = await req.json();
        const { usn, results, gpa } = body;

        if (!usn || !results || gpa === undefined) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // connect to db
        await connectToDB();

        // save to MongoDB
        const student = new Student({ usn, results, gpa });
        await student.save();

        return new Response(
            JSON.stringify({ message: "Results saved successfully!", student }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
        
    } catch (error) {
        console.error("❌ Error saving student:", error);
        return new Response(
            JSON.stringify({ message: "Error saving results", error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
