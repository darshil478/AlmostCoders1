import { API_BASE_URL } from "./config";

export async function chatWithAI(question) {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    throw new Error("AI Chat failed");
  }
  return response.json();
}

export async function getAISummary() {
  const response = await fetch(`${API_BASE_URL}/api/ai/summary`);
  if (!response.ok) {
    throw new Error("Failed to fetch daily AI summary");
  }
  return response.json();
}

export async function getQueuePrediction() {
  const response = await fetch(`${API_BASE_URL}/api/ai/queue`);
  if (!response.ok) {
    throw new Error("Failed to fetch queue predictions");
  }
  return response.json();
}

export async function getHealthScorePrediction() {
  const response = await fetch(`${API_BASE_URL}/api/ai/health`);
  if (!response.ok) {
    throw new Error("Failed to fetch health score predictions");
  }
  return response.json();
}

export async function getOutbreakPrediction() {
  const response = await fetch(`${API_BASE_URL}/api/ai/outbreak`);
  if (!response.ok) {
    throw new Error("Failed to fetch outbreak predictions");
  }
  return response.json();
}

export async function getMedicineRecommendation(symptoms) {
  const response = await fetch(`${API_BASE_URL}/api/ai/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ symptoms }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch medicine recommendations");
  }
  return response.json();
}

export async function getInventoryForecast() {
  const response = await fetch(`${API_BASE_URL}/api/ai/forecast`);
  if (!response.ok) {
    throw new Error("Failed to fetch inventory forecast");
  }
  return response.json();
}
