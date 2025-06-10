import { Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";

type UseAppwriteReturn<T> = {
  data: T[];
  isLoading: boolean;
  refetch: () => Promise<void>;
};

const useAppwrite = <T,>(fn: () => Promise<T[]>): UseAppwriteReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [fn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData();
  
  return { data, isLoading, refetch };
};

export default useAppwrite;