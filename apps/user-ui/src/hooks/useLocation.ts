import { useEffect, useState } from 'react';

type LocationData = {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
};

export const useLocation = (): LocationData => {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        loading: false,
        error: 'Geolocation not supported',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          loading: false,
          error: error.message,
        });
      }
    );
  }, []);

  return location;
};