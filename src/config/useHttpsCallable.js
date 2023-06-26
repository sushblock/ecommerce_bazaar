import { useState } from "react";
import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";

export const useHttpsCallable = (functionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeCallable = async (data) => {
    const callable = httpsCallable(functions, functionName);
    try {
      setLoading(true);
      const response = await callable(data);
      return response.data;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    call: executeCallable,
  };
};