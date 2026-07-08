import { useCallback, useEffect, useState } from "react";
import { getPatients } from "../api/patients";

export default function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    try {
      setError(null);
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, loading, error, fetchPatients };
}
