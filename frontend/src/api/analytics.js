import { API_BASE_URL } from "./config";

export async function getAnalytics() {
  const response = await fetch(`${API_BASE_URL}/api/analytics`);
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard analytics");
  }
  return response.json();
}

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch system events");
  }
  return response.json();
}

export async function getNotifications() {
  const response = await fetch(`${API_BASE_URL}/api/notifications`);
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }
  return response.json();
}

export async function clearNotifications() {
  const response = await fetch(`${API_BASE_URL}/api/notifications`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to clear notifications");
  }
  return response.json();
}
