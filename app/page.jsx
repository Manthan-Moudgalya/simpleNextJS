"use client";
import { useRef } from "react";

function Home() {
    const usnRef = useRef();

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
        if (usn === null || usn.trim() === "") {
        return [false, ""];
        }

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
        // build a lookup map once → O(n)
        const creditMap = subjects.reduce((map, subj) => {
            map[subj.id] = subj.cred;
            return map;
        }, {});

        let totalCredits = 0;
        let weighted = 0;

        // now results loop is O(n)
        results.forEach(({ subjectID, marks }) => {
            const cred = creditMap[subjectID];
            weighted += grad(marks) * cred;
            totalCredits += cred;
        });

        return (weighted / totalCredits).toFixed(2);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const usn = usnRef.current.value.trim();
        const [validUSN, formattedUSN] = isUSNValid(usn);
        if (!validUSN) {
        alert("Invalid USN format.");
        return;
        }

        const results = [];
        for (let subject of subjects) {
            const value = document.getElementById(subject.id).value.trim();

            if (!/^\d+$/.test(value)) {
                alert(`${subject.placeholder}: must be digits only (0-100).`);
                return;
            }

            const num = parseInt(value, 10);
            if (num < 0 || num > 100) {
                alert(`${subject.placeholder}: must be between 0 and 100.`);
                return;
            }

            results.push({ subjectID: subject.id, marks: num });
        }

        const gpa = calculateSGPA(results);
        alert(`USN: ${formattedUSN}\nSGPA: ${gpa}`);
    };

  return (
    // <main className="flex flex-col w-full h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white overflow-x-hidden">
    //   <form
    //     onSubmit={handleSubmit}
    //     className="flex flex-col items-center justify-center h-auto w-[40%] border border-violet-400 rounded-2xl p-8 gap-7 shadow-lg shadow-indigo-800/40"
    //   >
    //     <input
    //       type="text"
    //       id="usn"
    //       ref={usnRef}
    //       placeholder="USN"
    //       className="w-3/5 h-12 text-center rounded-2xl border-2 border-white/30 bg-transparent focus:outline-none focus:border-violet-400 placeholder-white/60 transition-all duration-300"
    //     />
    //     {subjects.map((subject) => (
    //       <input
    //         key={subject.id}
    //         type="text"
    //         id={subject.id}
    //         maxLength={3}
    //         placeholder={subject.placeholder}
    //         className="w-4/5 h-12 text-center rounded-2xl border-2 border-white/30 bg-transparent focus:outline-none focus:border-violet-400 placeholder-white/60 transition-all duration-300"
    //       />
    //     ))}
    //     <button
    //       type="submit"
    //       className="px-6 py-2 w-[200px] rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-900/50 transition-all duration-300"
    //     >
    //       Submit
    //     </button>
    //   </form>
    // </main>
    <main className="flex flex-col w-full min-h-screen items-center justify-center bg-gradient-to-tr from-[#0a0f1f] via-[#1e1b4b] to-[#3b2f85] text-white px-4">
  <form
    onSubmit={handleSubmit}
    className="
      flex flex-col items-center justify-center 
      w-full max-w-lg sm:max-w-xl md:max-w-2xl 
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
</main>

  );
}

export default Home;
