export async function GET() {
  const students = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Kim" },
  ];

  return Response.json({ students });
}
