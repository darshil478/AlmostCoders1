import { API_BASE_URL } from "./config";

export async function getInventory() {
  const response = await fetch(`${API_BASE_URL}/api/inventory`);
  if (!response.ok) {
    throw new Error("Failed to fetch inventory");
  }
  return response.json();
}

export async function dispenseMedicine(id, quantity) {
  const response = await fetch(`${API_BASE_URL}/api/dispense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, quantity }),
  });
  if (!response.ok) {
    throw new Error("Failed to dispense medicine");
  }
  return response.json();
}

export async function restockMedicine(id, quantity) {
  const response = await fetch(`${API_BASE_URL}/api/restock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, quantity }),
  });
  if (!response.ok) {
    throw new Error("Failed to restock medicine");
  }
  return response.json();
}
