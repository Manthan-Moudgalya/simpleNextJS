"use client";
import { useRef, useState } from "react";

function Home() {
  const usnRef = useRef();
  const [showResult, setShowResult] = useState(false);
  const [gpa, setGpa] = useState(0);

  const subjects = [
    { id: "iot", placeholder: "Internet of Things (4 Credits)", cred: 4 },
    { id: "pc", placeholder: "Parallel Computing (4 Credits)", cred: 4 },
    { id: "cns", placeholder: "Cryptography & Network Security (4 Credits)", cred: 4 },
    { id: "pe", placeholder: "Professional Elective Course (3 Credits)", cred: 3 },
    { id: "oe", placeholder: "Open Elective Course (3 Credits)", cred: 3 },
    { id: "mpp2", placeholder: "Major Project Phase-II (6 Credits)", cred: 6 },
  ];

  function formatUSN(usn) {
    let formatted = usn.split("");
    formatted[1] = formatted[1].toUpperCase();
    formatted[5] = formatted[5].toUpperCase();
    formatted[6] = formatted[6].toUpperCase();
    return formatted.join("");
  }

  const isUSNValid = (usn) => {
    if (!usn || usn.trim() === "") return [false, ""];
    if (
      isNaN(parseInt(usn.charAt(0))) ||
      isNaN(parseInt(usn.charAt(3))) ||
      isNaN(parseInt(usn.charAt(4))) ||
      isNaN(parseInt(usn.charAt(usn.length - 1))) ||
      isNaN(parseInt(usn.charAt(usn.length - 2))) ||
      isNaN(parseInt(usn.charAt(usn.length - 3))) ||
      /^[0-9]$/.test(usn.charAt(1)) ||
      /^[0-9]$/.test(usn.charAt(5)) ||
      /^[0-9]$/.test(usn.charAt(6))
    ) {
      return [false, ""];
    }
    return [true, formatUSN(usn)];
  };

  const grad = (x) => {
    if (x >= 90) return 10;
    if (x >= 80) return 9;
    if (x >= 70) return 8;
    if (x >= 60) return 7;
    if (x >= 50) return 6;
    if (x >= 40) return 5;
    if (x >= 30) return 4;
    if (x >= 20) return 3;
    if (x >= 10) return 2;
    return 1;
  };

  const calculateSGPA = (results) => {
    const creditMap = subjects.reduce((map, subj) => {
      map[subj.id] = subj.cred;
      return map;
    }, {});

    let totalCredits = 0;
    let weighted = 0;

    results.forEach(({ subjectID, marks }) => {
      const cred = creditMap[subjectID];
      weighted += grad(marks) * cred;
      totalCredits += cred;
    });

    return weighted / totalCredits;
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usn = usnRef.current.value;
        const [validUSN] = isUSNValid(usn);
        if (!validUSN) {
        alert("Invalid USN format.");
        return;
        }

        const results = [];
        for (let subject of subjects) {
        const value = document.getElementById(subject.id).value;

        if (!/^\d+$/.test(value)) {
            alert(`${subject.placeholder}: must be digits only (0-100).`);
            return;
        }

        const num = parseInt(value, 10);
        if (num <= 0) {
            alert(`${subject.placeholder}: must be valid USN.`);
            return;
        }
        
        if ((num >= 200 && num < 400) || (num > 420)) {
            alert(`${subject.placeholder}: must be valid USN.`);
            return;
        }


        results.push({ subjectID: subject.id, marks: num });
        }

        const gpa = calculateSGPA(results);
        setGpa(gpa);
        setShowResult(true);

        try {
            const res = await fetch("/api/students/saveResults", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usn, results, gpa }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Saved successfully!");
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong while saving.");
        }   
    
    }

  return (
    <main className="flex flex-col w-full min-h-screen items-center justify-center bg-gradient-to-tr from-[#0a0f1f] via-[#1e1b4b] to-[#3b2f85] text-white xl:py-10 lg:py-10">
      <form
        onSubmit={handleSubmit}
        className="
          flex flex-col items-center justify-center w-[90%]
          sm:w-[80%] md:w-[60%] lg:w-[45%] max-w-2xl
          border border-violet-500/40 rounded-2xl p-6 sm:p-10 gap-6 sm:gap-8
          shadow-2xl shadow-indigo-900/40 bg-black/20 backdrop-blur-md
        "
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-violet-300 mb-2">
          SGPA Calculator
        </h1>

        <input
          type="text"
          placeholder="Enter USN"
          ref={usnRef}
          className="
            w-full sm:w-4/5 h-12 sm:h-14 px-3 sm:px-4 text-center
            rounded-xl border-2 border-white/20 bg-white/5
            focus:bg-white/10 focus:border-violet-400
            placeholder-white/50 text-base sm:text-lg tracking-wide
            transition-all duration-300 outline-none
          "
        />

        {subjects.map((subject) => (
          <input
            key={subject.id}
            type="text"
            id={subject.id}
            placeholder={subject.placeholder}
            maxLength={3}
            className="
              w-full sm:w-4/5 h-12 sm:h-14 px-3 sm:px-4 text-center
              rounded-xl border-2 border-white/20 bg-white/5
              focus:bg-white/10 focus:border-indigo-400
              placeholder-white/50 text-base sm:text-lg tracking-wide
              transition-all duration-300 outline-none
            "
          />
        ))}

        <button
          type="submit"
          className="
            mt-4 px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-56 text-base sm:text-lg
            font-semibold rounded-xl sm:rounded-2xl
            bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-700
            hover:from-indigo-600 hover:via-violet-700 hover:to-purple-800
            shadow-lg shadow-violet-900/50 hover:shadow-xl hover:shadow-violet-900/70
            transition-all duration-300
          "
        >
          Submit
        </button>
      </form>

      {/* Result Dialog */}
      {showResult && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#3b2f85] text-white 
                          rounded-2xl shadow-2xl p-6 sm:p-8 w-[90%] sm:w-[400px] text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-violet-300">
              SGPA Result
            </h2>
            <p className="text-lg sm:text-xl font-semibold mb-6">
              Your GPA is: <span className="text-indigo-400">{gpa.toFixed(2)}</span>
            </p>
            <button
              onClick={() => setShowResult(false)}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 
                         hover:from-indigo-600 hover:to-violet-700 transition-all duration-300 
                         shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
