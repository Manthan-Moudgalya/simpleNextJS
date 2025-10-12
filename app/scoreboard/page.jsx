"use client";
import { useEffect, useState } from "react";

export default function Scoreboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRanks() {
      try {
        const res = await fetch("/api/students/scoreboard");
        const entryList = await res.json();
        setStudents(entryList);
        // console.log("Entry List: " + entryList);
        for(const entry of entryList){
            console.log(entry);
        }
        
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    getRanks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#2A0A45] via-[#3D0C61] to-[#1E003E]">
        <p className="text-purple-200 text-lg animate-pulse">Loading scores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1E003E] via-[#2B0B5E] to-[#120030] text-white p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-purple-300 mb-8 drop-shadow-lg">
        Student CGPA Rankings
      </h1>

      <div className="w-full max-w-4xl backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-purple-400/40 p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-purple-800/60 text-purple-100 uppercase tracking-wide">
                <th className="px-6 py-3 border border-purple-600/40 rounded-tl-xl border-none">
                  USN
                </th>
                <th className="px-6 py-3 border border-purple-600/40 rounded-tr-xl border-none">
                  CGPA
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((entry, index) => (
                <tr
                  key={index}
                  className={`transition-colors ${
                    index % 2 === 0
                      ? "bg-purple-900/40 hover:bg-purple-800/60"
                      : "bg-purple-950/40 hover:bg-purple-800/70"
                  }`}
                >
                  <td className="px-6 py-3 border border-purple-700/40 text-purple-100 font-medium">
                    {entry.usn}
                  </td>
                  <td className="px-6 py-3 border border-purple-700/40 text-purple-200">
                    {Number(entry.gpa).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
