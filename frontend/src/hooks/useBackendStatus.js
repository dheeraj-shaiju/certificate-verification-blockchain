/**
 * Checks whether the backend is running.
 *   const { status, check } = useBackendStatus();
 *   status: 'checking' | 'online' | 'offline'
 */
import { useCallback, useEffect, useState } from 'react';
import { isBackendOnline } from '../services/api';

export function useBackendStatus() {
  const [status, setStatus] = useState('checking');

  const check = useCallback(async () => {
    setStatus('checking');
    setStatus((await isBackendOnline()) ? 'online' : 'offline');
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { status, check };
}
