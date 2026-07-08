import { API_BASE_URL } from "./config";

export async function getPatients() {
  const response = await fetch(`${API_BASE_URL}/api/patient`);
  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }
  return response.json();
}

export async function addPatient(patient) {
  const response = await fetch(`${API_BASE_URL}/api/patient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patient),
  });
  if (!response.ok) {
    throw new Error("Failed to add patient");
  }
  return response.json();
}
