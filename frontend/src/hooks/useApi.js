import { useMemo } from 'react';
import { request } from '../services/apiClient';

export function useApi(token) {
  return useMemo(() => ({
    request: (path, options = {}) => request(path, options, token)
  }), [token]);
}
