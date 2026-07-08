import { useState } from "react";
import { addPatient } from "../api/patients";

export default function PatientForm({ fetchPatients }) {
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const handleAddPatient = async () => {
    if (!name || !symptoms) {
      alert("Please fill all fields");
      return;
    }

    const response = await addPatient({
      name,
      symptoms,
    });

    alert(response.message);

    setName("");
    setSymptoms("");
  };

  return (
    <div className="glass-panel p-6 mt-8">
      <h2 className="text-lg font-bold text-black mb-4">Patient Check-In</h2>

      <input
        type="text"
        placeholder="Patient Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 mb-4 transition-all"
      />

      <input
        type="text"
        placeholder="Symptoms"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="w-full bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 mb-4 transition-all"
      />

      <button
        type="button"
        onClick={handleAddPatient}
        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 cursor-pointer text-sm"
      >
        Add Patient
      </button>
    </div>
  );
}
