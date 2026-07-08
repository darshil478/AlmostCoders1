import { API_BASE_URL } from "./config";

export async function getSurveillance() {
  const response = await fetch(`${API_BASE_URL}/api/surveillance`);
  if (!response.ok) {
    throw new Error("Failed to fetch disease surveillance data");
  }
  return response.json();
}

export async function reportCase(disease, district) {
  const response = await fetch(`${API_BASE_URL}/api/surveillance/case`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ disease, district }),
  });
  if (!response.ok) {
    throw new Error("Failed to report outbreak case");
  }
  return response.json();
}

export async function getMitigationPlans() {
  const response = await fetch(`${API_BASE_URL}/api/surveillance/mitigation`);
  if (!response.ok) {
    throw new Error("Failed to fetch mitigation plans");
  }
  return response.json();
}
