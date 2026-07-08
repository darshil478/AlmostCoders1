import { API_BASE_URL } from "./config";

export async function getDoctor() {
  const response = await fetch(`${API_BASE_URL}/api/doctor`);
  if (!response.ok) {
    throw new Error("Failed to fetch doctor roster status");
  }
  return response.json();
}

export async function getDoctors() {
  return getDoctor();
}

export async function checkinDoctor(id = null) {
  const url = id ? `${API_BASE_URL}/api/doctor/${id}/checkin` : `${API_BASE_URL}/api/doctor/checkin`;
  const response = await fetch(url, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed doctor check-in");
  }
  return response.json();
}

export async function checkoutDoctor(id = null) {
  const url = id ? `${API_BASE_URL}/api/doctor/${id}/checkout` : `${API_BASE_URL}/api/doctor/checkout`;
  const response = await fetch(url, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed doctor check-out");
  }
  return response.json();
}
