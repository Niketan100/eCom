import { useMemo } from 'react';

export const useDeviceInfo = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        userAgent: '',
        platform: '',
        language: '',
      };
    }

    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };
  }, []);
};