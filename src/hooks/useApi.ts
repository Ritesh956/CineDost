import { useState, useEffect } from 'react';
import api from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>(url: string, dependencies: any[] = []) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await api.get(url);
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        setState({
          data: null,
          loading: false,
          error: error.response?.data?.message || 'An error occurred',
        });
      }
    };

    fetchData();
  }, dependencies);

  return state;
};

export const useApiMutation = <T, P = any>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (url: string, data?: P, method: 'POST' | 'PUT' | 'DELETE' = 'POST') => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      let response;
      switch (method) {
        case 'POST':
          response = await api.post(url, data);
          break;
        case 'PUT':
          response = await api.put(url, data);
          break;
        case 'DELETE':
          response = await api.delete(url);
          break;
      }

      setState({
        data: response.data,
        loading: false,
        error: null,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  };

  return { ...state, mutate };
};
